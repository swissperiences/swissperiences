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
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTier?: string;
}

export function WaitlistModal({ open, onOpenChange, selectedTier = 'General Waitlist' }: WaitlistModalProps) {
  const [intent, setIntent] = useState<string>('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<string>('');
  const [honeypot, setHoneypot] = useState('');
  const [newsletter] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('common');

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
      if (!response.ok) throw new Error(data.error || 'Failed to submit');

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
      setIsSuccess(false);
    }, 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as any } }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-black/80 backdrop-blur-2xl border-white/5 p-0 overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
        {/* Subtle Noise/Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="relative p-8 sm:p-10">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <DialogHeader className="space-y-3">
                  <motion.div variants={itemVariants}>
                    <DialogTitle className="text-3xl sm:text-4xl text-white font-serif font-light tracking-tight italic">
                      {getModalTitle()}
                    </DialogTitle>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <DialogDescription className="text-white/40 font-light leading-relaxed text-sm">
                      {t('forms.description')}
                    </DialogDescription>
                  </motion.div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Experience Selector */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-[10px] text-white/30 font-bold uppercase tracking-[0.25em]">Select Experience</label>
                    <Select value={intent} onValueChange={setIntent}>
                      <SelectTrigger className="bg-white/[0.03] border-white/5 h-12 text-sm focus:ring-white/10 hover:bg-white/[0.05] transition-all">
                        <SelectValue placeholder="Begin your journey..." />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-900 border-white/10 z-[200]">
                        <SelectItem value="Villars Alpine Retreat">Villars Alpine Retreat</SelectItem>
                        <SelectItem value="Swiss Alps Road Journey">Swiss Alps Road Journey</SelectItem>
                        <SelectItem value="Bespoke Journey">Bespoke Custom Journey</SelectItem>
                        <SelectItem value="Other">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Dates & Guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants} className="space-y-2">
                      <label className="text-[10px] text-white/30 font-bold uppercase tracking-[0.25em]">Preferred Dates</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-light bg-white/[0.03] border-white/5 h-12 text-sm hover:bg-white/[0.05]",
                              !date && "text-white/30"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                            {date?.from ? (
                              date.to ? (
                                <>{format(date.from, "MMM dd")} — {format(date.to, "MMM dd")}</>
                              ) : (
                                format(date.from, "MMM dd")
                              )
                            ) : (
                              <span>Pick dates</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[210] bg-black border-white/10 shadow-2xl" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={1}
                            fromDate={new Date()}
                            className="bg-neutral-950 text-white"
                          />
                        </PopoverContent>
                      </Popover>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <label className="text-[10px] text-white/30 font-bold uppercase tracking-[0.25em]">Guests</label>
                      <Select value={guests} onValueChange={setGuests}>
                        <SelectTrigger className="bg-white/[0.03] border-white/5 h-12 text-sm hover:bg-white/[0.05]">
                          <SelectValue placeholder="Count" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-white/10 z-[200]">
                          {[1, 2, 3, 4, 5, "6+"].map((n) => (
                            <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? 'Guest' : 'Guests'}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 gap-6">
                    <motion.div variants={itemVariants} className="space-y-2">
                      <label className="text-[10px] text-white/30 font-bold uppercase tracking-[0.25em]">Your Full Name</label>
                      <Input
                        type="text"
                        placeholder="e.g. Andreia Wager"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-white/[0.03] border-white/5 h-12 text-sm placeholder:text-white/10 focus-visible:ring-white/10 focus-visible:border-white/20 transition-all"
                        required
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <label className="text-[10px] text-white/30 font-bold uppercase tracking-[0.25em]">Email Address</label>
                      <Input
                        type="email"
                        placeholder="hello@world.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/[0.03] border-white/5 h-12 text-sm placeholder:text-white/10 focus-visible:ring-white/10 focus-visible:border-white/20 transition-all"
                        required
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants} className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-white text-black hover:bg-switz-red hover:text-white h-14 uppercase tracking-[0.3em] text-[10px] font-bold transition-all duration-500 rounded-none group"
                      disabled={isLoading}
                    >
                      {isLoading ? "Consulting Archives..." : (
                        <span className="flex items-center gap-2">
                          Request Availability
                          <div className="w-0 group-hover:w-4 h-px bg-white transition-all duration-500" />
                        </span>
                      )}
                    </Button>
                    <p className="text-[9px] text-center text-white/20 mt-4 tracking-widest uppercase font-light">
                      Response within 48h // No upfront deposit
                    </p>
                  </motion.div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8 py-10"
              >
                <div className="space-y-4">
                  <h3 className="text-4xl font-serif italic text-white">{t('forms.success')}</h3>
                  <p className="text-white/50 font-light leading-relaxed max-w-xs mx-auto">
                    {t('forms.successMessage')}
                  </p>
                </div>
                <Button
                  onClick={handleClose}
                  className="bg-transparent border border-white/10 text-white/40 hover:text-white hover:border-white px-10 py-6 uppercase tracking-[0.3em] text-[10px] rounded-none transition-all"
                >
                  {t('buttons.close')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
