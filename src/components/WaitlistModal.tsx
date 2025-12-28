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

const emailSchema = z.string().trim().email({ message: 'Please enter a valid email address' }).max(255);

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        .insert({ email: result.data });

      if (error) {
        if (error.code === '23505') {
          // Duplicate email - treat as info/success but don't show "request received" screen to avoid confusion
          // OR show a specific message. User prompt said: show calm message like "You're already on the list."
          toast({
            title: 'Already on the list',
            description: "You're already registered for the waitlist.",
          });
          return; // Do not set isSuccess(true)
        } else {
          throw error;
        }
      }

      // 2. Email Notification (Vercel Function)
      // Non-blocking call - we don't want to fail the UI if email fails
      fetch('/api/send-waitlist-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: result.data }),
      }).catch((error) => {
        console.error('[Waitlist] Failed to send email notification:', error);
        // TODO: Add error monitoring service (e.g., Sentry) here
      });

      // ONLY set success state if DB insert worked
      setIsSuccess(true);
      toast({
        title: 'Welcome to the waitlist',
        description: "We'll be in touch soon.",
      });

    } catch (error) {
      console.error('[Waitlist] Database error:', error);
      toast({
        title: 'Something went wrong',
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
      setIsSuccess(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-border animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">
            {isSuccess ? 'Request Received' : 'Request Access'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isSuccess
              ? "We'll review your request and respond personally within 48 hours."
              : 'Each request is reviewed personally. This is not a mailing list.'}
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/40 transition-colors"
              disabled={isLoading}
              required
            />
            <Button
              type="submit"
              className="w-full"
              variant="hero"
              size="xl"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
            <p className="text-xs text-center text-white/40 font-light">
              No automation. A human reply within 48 hours.
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
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
