import { useState } from 'react';
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


interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTier?: string; // Optional tier context
}

export function WaitlistModal({ open, onOpenChange, selectedTier = 'General Waitlist' }: WaitlistModalProps) {
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<string>('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<string>('');
  const [honeypot, setHoneypot] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('common');

  // Dynamic title based on step and tier
  const getModalTitle = () => {
    if (isSuccess) return t('forms.success');
    return 'Check Availability';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/send-waitlist-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          first_name: firstName.trim() || null,
          newsletter_opt_in: newsletter,
          tier: selectedTier,
          intent,
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
    setTimeout(() => {
      setEmail('');
      setFirstName('');
      setIntent('');
      setStep(1);
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
          <div className="space-y-6 mt-4">
            {step === 1 && (
              <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Honey pot */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="sr-only"
                  aria-hidden="true"
                />

                <div className="space-y-4">
                  {/* Experience Selector */}
                  <div className="space-y-2">
                    <label className="text-xs text-white/60 font-medium uppercase tracking-wide">Select Experience</label>
                    <Select value={intent} onValueChange={setIntent}>
                      <SelectTrigger className="bg-secondary border-border h-12">
                        <SelectValue placeholder="What are you interested in?" />
                      </SelectTrigger>
                      <SelectContent className="z-[200]">
                        <SelectItem value="Villars Alpine Retreat">Villars Alpine Retreat (Apartment)</SelectItem>
                        <SelectItem value="Swiss Alps Road Journey">Swiss Alps Road Journey (Range Rover)</SelectItem>
                        <SelectItem value="Bespoke Journey">Bespoke Custom Journey</SelectItem>
                        <SelectItem value="Other">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dates & Guests */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-white/60 font-medium uppercase tracking-wide">Preferred Dates</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal bg-secondary border-border h-12",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                              date.to ? (
                                <>{format(date.from, "MMM dd")} - {format(date.to, "MMM dd")}</>
                              ) : (
                                format(date.from, "MMM dd")
                              )
                            ) : (
                              <span>Pick dates</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[200]" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={1}
                            fromDate={new Date()}
                            className="rounded-md border bg-neutral-900 border-neutral-800"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-white/60 font-medium uppercase tracking-wide">Guests</label>
                      <Select value={guests} onValueChange={setGuests}>
                        <SelectTrigger className="bg-secondary border-border h-12">
                          <SelectValue placeholder="Count" />
                        </SelectTrigger>
                        <SelectContent className="z-[200]">
                          {[1, 2, 3, 4, 5, "6+"].map((n) => (
                            <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? 'Guest' : 'Guests'}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-white/60 font-medium uppercase tracking-wide">Your Name</label>
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-secondary border-border h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-white/60 font-medium uppercase tracking-wide">Email Address</label>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-secondary border-border h-12"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  variant="hero"
                  size="xl"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Request Availability"}
                </Button>

                <p className="text-[10px] text-center text-white/30 pt-2">
                  No immediate payment required. We will confirm availability within 24h.
                </p>
              </form>
            )}


            <p className="text-[10px] text-center text-white/20 font-light tracking-widest uppercase">
              Curated Individually // Response within 48h
            </p>
          </div>
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
