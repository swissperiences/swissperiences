import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const emailSchema = z.string().trim().email({ message: 'Please enter a valid email address' }).max(255);

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [newsletter, setNewsletter] = useState(true); // Default to opt-in
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('common');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      console.warn('[Security] Honeypot triggered - potential bot detected');
      return;
    }

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: 'Invalid email',
        description: result.error.errors[0].message,
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Database Insert
      const { error } = await supabase
        .from('waitlist')
        .insert({
          email: result.data,
          newsletter_opt_in: newsletter
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: t('forms.success'),
            description: 'Your application is already under review.',
          });
          return;
        } else {
          throw error;
        }
      }

      // 2. Email Notification (Vercel Function)
      // Non-blocking call - we don't want to fail the UI if email fails
      fetch('/api/send-waitlist-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: result.data,
          newsletter_opt_in: newsletter
        }),
      }).catch((error) => {
        console.error('[Waitlist] Failed to send email notification:', error);
        // TODO: Add error monitoring service (e.g., Sentry) here
      });

      setIsSuccess(true);

      toast({
        title: t('forms.success'),
        description: t('forms.successMessage'),
      });

    } catch (error) {
      console.error('[Waitlist] Database error:', error);
      toast({
        title: t('forms.error'),
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after modal closes
    setTimeout(() => {
      setEmail('');
      setNewsletter(true);
      setIsSuccess(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-border animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground font-light tracking-wide">
            {isSuccess ? t('forms.success') : 'Request Access'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground leading-relaxed">
            {isSuccess
              ? t('forms.successMessage')
              : t('forms.description')}
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Honeypot field - hidden from humans, visible to bots */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                opacity: 0,
              }}
              aria-hidden="true"
            />
            <Input
              type="email"
              placeholder={t('forms.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/40 transition-colors"
              disabled={isLoading}
              required
            />

            {/* Newsletter Opt-in Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border bg-secondary text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                disabled={isLoading}
              />
              <span className="text-sm text-white/60 font-light leading-relaxed group-hover:text-white/80 transition-colors">
                Send me curated stories, seasonal experiences, and exclusive invitations. (You can unsubscribe anytime.)
              </span>
            </label>

            <Button
              type="submit"
              className="w-full"
              variant="hero"
              size="xl"
              disabled={isLoading}
            >
              {isLoading ? t('forms.loading') : t('buttons.submit')}
            </Button>
            <p className="text-xs text-center text-white/30 font-light tracking-wide">
              Applications reviewed within 48 hours
            </p>
          </form>
        ) : (
          <div className="mt-4">
            <Button
              onClick={handleClose}
              className="w-full"
              variant="heroOutline"
              size="xl"
            >
              {t('buttons.close')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
