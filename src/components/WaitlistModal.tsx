import { useState } from 'react';
import { z } from 'zod';
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
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

const emailSchema = z.string().trim().email({ message: 'Please enter a valid email address' }).max(255);

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTier?: string; // Optional tier context
}

export function WaitlistModal({ open, onOpenChange, selectedTier = 'General Waitlist' }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<string>('');
  const [honeypot, setHoneypot] = useState('');
  const [newsletter, setNewsletter] = useState(true); // Default to opt-in
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('common');

  // Dynamic title based on tier
  const getModalTitle = () => {
    if (isSuccess) return t('forms.success');
    if (selectedTier === 'Private Escape') {
      return 'Inquire for your Private Escape';
    }
    if (selectedTier && selectedTier !== 'General Waitlist') {
      return `Join the ${selectedTier} Waitlist`;
    }
    return 'Request Access';
  };

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
      // Validate email format
      const result = emailSchema.safeParse(email);
      if (!result.success) {
        toast({
          title: 'Invalid email',
          description: result.error.errors[0].message,
        });
        setIsLoading(false);
        return;
      }

      // Call API directly - it handles both database insert AND email sending
      const response = await fetch('/api/send-waitlist-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: result.data,
          first_name: firstName.trim() || null,
          newsletter_opt_in: newsletter,
          tier: selectedTier, // Pass tier to API
          start_date: date?.from ? format(date.from, 'yyyy-MM-dd') : null,
          end_date: date?.to ? format(date.to, 'yyyy-MM-dd') : null,
          num_guests: guests || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setIsSuccess(true);
      toast({
        title: t('forms.success'),
        description: t('forms.successMessage'),
      });

    } catch (error) {
      console.error('[Waitlist] Submission error:', error);
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
      setFirstName('');
      setNewsletter(true);
      setIsSuccess(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-border animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground font-light tracking-wide">
            {getModalTitle()}
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

            <Input
              type="text"
              placeholder="First name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/40 transition-colors"
              disabled={isLoading}
            />

            {selectedTier === 'Private Escape' && (
              <div className="flex gap-4">
                <div className="grid gap-2 flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-secondary border-border hover:bg-secondary/80",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[200] max-w-[95vw]" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from || new Date(2026, 4)}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={1}
                        fromDate={new Date()}
                        toDate={new Date(2027, 11)}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border bg-black/90"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="w-32">
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

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
