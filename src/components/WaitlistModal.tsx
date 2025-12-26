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
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Mock successful submission for UI testing
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast({
        title: 'Welcome to the waitlist',
        description: "We'll be in touch soon.",
      });
    }, 1500);

    /* 
    // Supabase integration deferred
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({ email: result.data });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Already registered',
            description: 'This email is already on the waitlist.',
          });
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        toast({
          title: 'Welcome to the waitlist',
          description: "We'll be in touch soon.",
        });
      }
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
    */
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
          <DialogTitle className="text-2xl font-semibold text-foreground">
            {isSuccess ? "You're in" : 'Join the Waitlist'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isSuccess
              ? "Thank you for your interest. We'll reach out when it's your turn to experience the pause."
              : 'Be among the first to experience analog wellness from Switzerland.'}
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
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
              {isLoading ? 'Joining...' : 'Join Waitlist'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              No spam. Just presence.
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
