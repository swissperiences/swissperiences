import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Lightweight hook to check if a user has an active Supabase session.
 * Uses getSession() (local cache) for speed — this is just for UI adaptation,
 * not for security decisions (AuthGuard uses getUser() for that).
 */
export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session);
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { isLoggedIn };
}
