import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { eachDayOfInterval, parseISO, format } from "date-fns";

/**
 * Fetches booked (occupied) dates for a given sanctuary.
 *
 * Returns an array of ISO date strings (YYYY-MM-DD) that are already booked.
 * Only considers bookings with status 'inquiry' or 'confirmed' (not cancelled/completed).
 *
 * Usage:
 *   const { bookedDates, isLoading } = useBookedDates("villars");
 *
 * FUTURE: Combine with manually blocked dates from a `blocked_dates` table:
 *   const allDisabledDates = [...bookedDates, ...manuallyBlockedDates];
 */
export function useBookedDates(sanctuaryId: string | null) {
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sanctuaryId) {
      setBookedDates([]);
      return;
    }

    const fetchBookedDates = async () => {
      setIsLoading(true);
      try {
        const dates = await getBookedDatesForSanctuary(sanctuaryId);
        setBookedDates(dates);
      } catch (error) {
        console.error("Failed to fetch booked dates:", error);
        setBookedDates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedDates();
  }, [sanctuaryId]);

  return { bookedDates, isLoading };
}

/**
 * Queries the bookings table and returns all occupied dates for a sanctuary.
 * Expands check_in → check_out ranges into individual date strings.
 *
 * Only active bookings (inquiry / confirmed) block availability.
 */
export async function getBookedDatesForSanctuary(
  sanctuaryId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("check_in, check_out")
    .eq("sanctuary_id", sanctuaryId)
    .in("status", ["inquiry", "confirmed"])
    .not("check_in", "is", null)
    .not("check_out", "is", null);

  if (error) {
    console.error("Error fetching booked dates:", error);
    return [];
  }

  if (!data || data.length === 0) return [];

  // Expand each booking range into individual dates
  const allDates = new Set<string>();

  for (const booking of data) {
    try {
      const start = parseISO(booking.check_in);
      const end = parseISO(booking.check_out);
      const days = eachDayOfInterval({ start, end });
      days.forEach((day) => allDates.add(format(day, "yyyy-MM-dd")));
    } catch {
      // Skip malformed dates
    }
  }

  return Array.from(allDates);
}

// ──────────────────────────────────────────────────
// FUTURE: Add a similar function for manually blocked dates
//
// export async function getManuallyBlockedDates(
//   sanctuaryId: string
// ): Promise<string[]> {
//   const { data } = await supabase
//     .from("blocked_dates")
//     .select("date")
//     .eq("sanctuary_id", sanctuaryId);
//   return data?.map((d) => d.date) ?? [];
// }
//
// Then combine in the component:
//   const allDisabledDates = [...bookedDates, ...manuallyBlockedDates];
// ──────────────────────────────────────────────────
