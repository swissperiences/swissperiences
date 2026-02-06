import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

interface BookingCalendarProps {
    sanctuaryName: string;
    isOpen: boolean;
    onClose: () => void;
}

export function BookingCalendar({ sanctuaryName, isOpen, onClose }: BookingCalendarProps) {
    const [date, setDate] = useState<DateRange | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRequest = async () => {
        if (!date?.from || !date?.to) {
            toast.error("Please select a date range.");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        toast.success("Booking inquiry sent! The Host will contact you shortly.");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-neutral-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl flex items-center gap-2">
                        <CalendarIcon className="text-switz-red" size={20} />
                        Request Dates
                    </DialogTitle>
                    <DialogDescription className="text-white/40">
                        Select your preferred journey dates for {sanctuaryName}.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={1}
                        className="rounded-md border border-white/5 bg-white/5 mx-auto"
                        classNames={{
                            day_selected: "bg-switz-red text-white hover:bg-switz-red/80",
                            day_today: "bg-white/10 text-white",
                        }}
                    />
                </div>

                <div className="space-y-4">
                    {date?.from && (
                        <div className="text-sm border-t border-white/5 pt-4">
                            <span className="text-white/40 block mb-1 uppercase tracking-widest text-[10px]">Your Selection</span>
                            <p className="text-white font-medium">
                                {format(date.from, "LLL dd, y")}
                                {date.to && <> &mdash; {format(date.to, "LLL dd, y")}</>}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-white/40 hover:text-white hover:bg-white/5"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRequest}
                        disabled={isSubmitting || !date?.to}
                        className="bg-white text-black hover:bg-white/90 font-medium uppercase tracking-widest text-[11px] h-12 px-8"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Request Availability"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
