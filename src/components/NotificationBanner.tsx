import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

const STORAGE_KEY = "alpineAerialsBannerDismissed";
const EXPIRY_DAYS = 7;
const ENTRANCE_DELAY = 1.5; // seconds

interface NotificationBannerProps {
  onJoinNow: () => void;
}

export const NotificationBanner = ({ onJoinNow }: NotificationBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissedData = localStorage.getItem(STORAGE_KEY);
    
    if (dismissedData) {
      const { timestamp } = JSON.parse(dismissedData);
      const expiryTime = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      
      if (Date.now() - timestamp > expiryTime) {
        localStorage.removeItem(STORAGE_KEY);
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: Date.now() }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ 
            duration: 0.5, 
            ease: "easeOut",
            delay: ENTRANCE_DELAY 
          }}
          className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 flex justify-center px-4"
        >
          {/* Mobile: rounded-2xl stacked layout, Desktop: pill horizontal */}
          <div className="w-full sm:w-auto sm:max-w-5xl rounded-2xl sm:rounded-full bg-[hsl(var(--surface-banner)/0.95)] backdrop-blur-md shadow-2xl px-5 py-4 sm:px-8 sm:py-4">
            {/* Mobile layout */}
            <div className="flex flex-col gap-3 sm:hidden">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-primary/90 text-sm font-normal flex-1 pr-6">
                  Early access to Swissperiences: Join the waitlist and save 20% on your first Swiss Alps wellness retreat.
                </p>
                <button
                  onClick={handleDismiss}
                  className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all"
                  aria-label="Dismiss banner"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={onJoinNow}
                className="w-full rounded-full bg-primary px-6 py-2.5 text-primary-foreground font-semibold transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                Get Early Access
              </button>
            </div>

            {/* Desktop layout */}
            <div className="hidden sm:flex items-center gap-4">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-primary/90 text-sm md:text-base font-normal flex-1">
                Early access to Swissperiences: Join the waitlist and save 20% on your first Swiss Alps wellness retreat.
              </p>
              <button
                onClick={onJoinNow}
                className="flex-shrink-0 rounded-full bg-primary px-6 py-2.5 text-primary-foreground font-semibold transition-all hover:bg-primary/90 hover:scale-105"
              >
                Get Early Access
              </button>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
