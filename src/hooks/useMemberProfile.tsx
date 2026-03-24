/**
 * useMemberProfile — shared member profile context
 *
 * Loads get_member_profile RPC once, provides data to all member pages.
 * Eliminates 5 duplicate RPC calls across MembersLayout, Dashboard, Profile, Book.
 *
 *   MemberProfileProvider (in MembersLayout)
 *     └─ useMemberProfile() → { member, isLoading, refresh }
 */
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export interface MemberProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  city: string;
  country: string;
  phone: string;
  bio: string;
  preferences: string;
  membership_tier: string;
  membership_status: string;
  joined_at: string;
}

interface MemberProfileContextValue {
  member: MemberProfile | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const MemberProfileContext = createContext<MemberProfileContextValue>({
  member: null,
  isLoading: true,
  refresh: async () => {},
});

export function MemberProfileProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: memberData, error } = await supabase.rpc("get_member_profile");

      if (error) {
        console.error("[MemberProfile] RPC error:", error.message);
      }

      if (!memberData) {
        navigate("/login");
        return;
      }

      const m = memberData as Record<string, any>;
      setMember({
        id: m.id || "",
        full_name: m.full_name || "",
        email: m.email || user?.email || "",
        avatar_url: m.avatar_url || user?.user_metadata?.avatar_url || null,
        city: m.city || "",
        country: m.country || "",
        phone: m.phone || "",
        bio: m.bio || "",
        preferences: m.preferences || "",
        membership_tier: m.membership_tier || "founding",
        membership_status: m.membership_status || "active",
        joined_at: m.joined_at || new Date().toISOString(),
      });
    } catch (err) {
      console.error("[MemberProfile] Failed to load profile:", err);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <MemberProfileContext.Provider value={{ member, isLoading, refresh: loadProfile }}>
      {children}
    </MemberProfileContext.Provider>
  );
}

export function useMemberProfile() {
  return useContext(MemberProfileContext);
}
