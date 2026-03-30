export interface PackagePromoProps {
  packageName: string;
  tagline: string;
  price: string;
  duration: string;
  includes: string[];
  availability: string;
  droneClipSrc: string;
  /** Trim start in seconds */
  clipStartFrom?: number;
}
