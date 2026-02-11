import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches manually blocked dates for a given item (sanctuary or experience).
 *
 * Uses the get_blocked_dates RPC (SECURITY DEFINER) so any authenticated
 * member can see which dates are blocked — needed for the booking calendar.
 *
 * Usage:
 *   const { blockedDates, isLoading } = useBlockedDates("sanctuary", "villars");
 */
export function useBlockedDates(
  type: "sanctuary" | "experience",
  itemId: string | null
) {
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!itemId) {
      setBlockedDates([]);
      return;
    }

    const fetchBlockedDates = async () => {
      setIsLoading(true);
      try {
        const dates = await getBlockedDates(type, itemId);
        setBlockedDates(dates);
      } catch (error) {
        console.error("Failed to fetch blocked dates:", error);
        setBlockedDates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlockedDates();
  }, [type, itemId]);

  return { blockedDates, isLoading };
}

/**
 * Pure function: queries blocked_dates via RPC and returns ISO date strings.
 */
export async function getBlockedDates(
  type: "sanctuary" | "experience",
  itemId: string
): Promise<string[]> {
  const { data, error } = await supabase.rpc("get_blocked_dates", {
    p_type: type,
    p_item_id: itemId,
  });

  if (error) {
    console.error("Error fetching blocked dates:", error);
    return [];
  }

  // RPC returns jsonb array of strings
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return [];
}
