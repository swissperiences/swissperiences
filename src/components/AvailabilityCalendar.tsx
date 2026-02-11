import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, parseISO, isSameDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { CalendarIcon, Loader2 } from "lucide-react";

// ──────────────────────────────────────────────────
// AvailabilityCalendar
//
// A reusable calendar that shows booked/blocked dates visually
// and lets the user select either a single date or a date range.
//
// Props:
//   disabledDates  — ISO strings (YYYY-MM-DD) that are blocked
//   mode           — "single" for experiences, "range" for sanctuaries
//   onSelectDate   — callback for single-date mode
//   onSelectRange  — callback for range mode (check-in, check-out)
//   isLoading      — shows loading overlay while fetching dates
//   minNights      — minimum nights for range mode (default 2)
//
// FUTURE: Pass additional manuallyBlockedDates here:
//   const allDisabledDates = [...bookedDates, ...manuallyBlockedDates];
//   <AvailabilityCalendar disabledDates={allDisabledDates} ... />
// ──────────────────────────────────────────────────

interface AvailabilityCalendarProps {
  disabledDates?: string[];
  mode?: "single" | "range";
  onSelectDate?: (date: string) => void;
  onSelectRange?: (checkIn: string, checkOut: string, nights: number) => void;
  isLoading?: boolean;
  minNights?: number;
}

export default function AvailabilityCalendar({
  disabledDates = [],
  mode = "range",
  onSelectDate,
  onSelectRange,
  isLoading = false,
  minNights = 2,
}: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

  const tomorrow = addDays(new Date(), 1);

  // Convert ISO strings to Date objects for react-day-picker's disabled matcher
  const disabledDateObjects = useMemo(() => {
    return disabledDates
      .map((d) => {
        try {
          return parseISO(d);
        } catch {
          return null;
        }
      })
      .filter((d): d is Date => d !== null);
  }, [disabledDates]);

  // Disabled matcher: past dates + booked dates
  const disabledMatcher = useMemo(() => {
    return [
      { before: tomorrow },
      ...disabledDateObjects.map((d) => d),
    ];
  }, [disabledDateObjects, tomorrow]);

  // Check if a date is in the disabled list (for visual badge)
  const isDateBooked = (date: Date) => {
    return disabledDateObjects.some((d) => isSameDay(d, date));
  };

  // Handle single date selection
  const handleSingleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onSelectDate) {
      onSelectDate(format(date, "yyyy-MM-dd"));
    }
  };

  // Handle range selection
  const handleRangeSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    if (range?.from && range?.to && onSelectRange) {
      const nights = Math.ceil(
        (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
      );
      onSelectRange(
        format(range.from, "yyyy-MM-dd"),
        format(range.to, "yyyy-MM-dd"),
        nights
      );
    }
  };

  // Night count for display
  const nightCount =
    selectedRange?.from && selectedRange?.to
      ? Math.ceil(
          (selectedRange.to.getTime() - selectedRange.from.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <div className="relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center rounded-sm">
          <Loader2 className="text-white/60 animate-spin" size={20} />
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-white/10 border border-white/20" />
          <span className="text-[10px] text-white/40 uppercase tracking-wider">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500/40" />
          <span className="text-[10px] text-white/40 uppercase tracking-wider">Booked</span>
        </div>
        {mode === "range" && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-switz-red" />
            <span className="text-[10px] text-white/40 uppercase tracking-wider">Selected</span>
          </div>
        )}
      </div>

      {/* Calendar */}
      <div className="border border-white/10 rounded-sm bg-white/[0.02] p-1">
        {mode === "single" ? (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSingleSelect}
            disabled={disabledMatcher}
            defaultMonth={tomorrow}
            numberOfMonths={1}
            showOutsideDays={false}
            className="mx-auto"
            classNames={{
              day_selected: "bg-switz-red text-white hover:bg-switz-red/80 focus:bg-switz-red",
              day_today: "bg-white/10 text-white font-bold",
              day_disabled: "text-white/15 opacity-100 cursor-not-allowed line-through",
              caption_label: "text-white text-sm font-medium",
              nav_button: "text-white/40 hover:text-white hover:bg-white/10 border-white/10",
              head_cell: "text-white/30 font-normal text-[11px] w-9",
              cell: "h-9 w-9 text-center text-sm p-0 relative",
              day: "h-9 w-9 p-0 font-normal text-white/70 hover:bg-white/10 hover:text-white rounded-sm transition-colors aria-selected:opacity-100",
            }}
            modifiers={{
              booked: disabledDateObjects,
            }}
            modifiersClassNames={{
              booked: "!bg-red-500/15 !text-red-400/60 !line-through !cursor-not-allowed",
            }}
          />
        ) : (
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={handleRangeSelect}
            disabled={disabledMatcher}
            defaultMonth={tomorrow}
            numberOfMonths={1}
            showOutsideDays={false}
            className="mx-auto"
            classNames={{
              day_selected: "bg-switz-red text-white hover:bg-switz-red/80 focus:bg-switz-red",
              day_range_middle: "bg-switz-red/20 text-white rounded-none",
              day_range_end: "bg-switz-red text-white rounded-r-sm",
              day_today: "bg-white/10 text-white font-bold",
              day_disabled: "text-white/15 opacity-100 cursor-not-allowed line-through",
              caption_label: "text-white text-sm font-medium",
              nav_button: "text-white/40 hover:text-white hover:bg-white/10 border-white/10",
              head_cell: "text-white/30 font-normal text-[11px] w-9",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-sm [&:has([aria-selected])]:bg-switz-red/10 first:[&:has([aria-selected])]:rounded-l-sm last:[&:has([aria-selected])]:rounded-r-sm",
              day: "h-9 w-9 p-0 font-normal text-white/70 hover:bg-white/10 hover:text-white rounded-sm transition-colors aria-selected:opacity-100",
            }}
            modifiers={{
              booked: disabledDateObjects,
            }}
            modifiersClassNames={{
              booked: "!bg-red-500/15 !text-red-400/60 !line-through !cursor-not-allowed",
            }}
          />
        )}
      </div>

      {/* Selection info */}
      {mode === "range" && selectedRange?.from && (
        <div className="mt-3 px-1">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <CalendarIcon size={14} className="text-switz-red" />
            <span>
              {format(selectedRange.from, "MMM d, yyyy")}
              {selectedRange.to && (
                <>
                  {" — "}
                  {format(selectedRange.to, "MMM d, yyyy")}
                </>
              )}
            </span>
            {nightCount > 0 && (
              <span
                className={`ml-auto text-xs px-2 py-0.5 rounded-sm ${
                  nightCount >= minNights
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {nightCount} {nightCount === 1 ? "night" : "nights"}
                {nightCount < minNights && ` (min ${minNights})`}
              </span>
            )}
          </div>
        </div>
      )}

      {mode === "single" && selectedDate && (
        <div className="mt-3 px-1">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <CalendarIcon size={14} className="text-switz-red" />
            <span>{format(selectedDate, "EEEE, MMM d, yyyy")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
