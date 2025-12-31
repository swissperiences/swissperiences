import ReactGA from 'react-ga4';

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (MEASUREMENT_ID) {
    ReactGA.initialize(MEASUREMENT_ID, {
      gaOptions: {
        anonymizeIp: true, // GDPR compliance
      },
    });
    console.log('[Analytics] Google Analytics initialized');
  } else {
    console.warn('[Analytics] GA Measurement ID not found');
  }
};

// Track page views
export const trackPageView = (path: string) => {
  if (MEASUREMENT_ID) {
    ReactGA.send({ hitType: 'pageview', page: path });
  }
};

// Track events
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (MEASUREMENT_ID) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  }
};

// Track waitlist signup
export const trackWaitlistSignup = (email: string) => {
  trackEvent('Waitlist', 'signup', email);
};

// Track corporate inquiry
export const trackCorporateInquiry = (companyName: string) => {
  trackEvent('Corporate', 'inquiry', companyName);
};

// Track button clicks
export const trackButtonClick = (buttonName: string) => {
  trackEvent('Button', 'click', buttonName);
};
