import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    href?: string; // If omitted, rendered as plain text (current page)
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

/**
 * Reusable Breadcrumbs component for Swissperiences.
 *
 * Usage:
 * ```tsx
 * <Breadcrumbs items={[
 *   { label: "Home", href: "/" },
 *   { label: "Destinations", href: "/destinations" },
 *   { label: "Geneva" }  // no href = current page
 * ]} />
 * ```
 *
 * To generate JSON-LD BreadcrumbList structured data for SEO,
 * use the companion helper `buildBreadcrumbJsonLd()`.
 */
export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={`flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-light ${className}`}
        >
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                return (
                    <span key={i} className="flex items-center gap-2">
                        {i > 0 && <ChevronRight size={10} className="text-white/30 shrink-0" />}
                        {item.href && !isLast ? (
                            <Link
                                to={item.href}
                                className="text-white/40 hover:text-white transition-colors duration-300"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? "text-white/70" : "text-white/40"}>
                                {item.label}
                            </span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}

/**
 * Generates a JSON-LD BreadcrumbList object for SEO.
 *
 * @param items - Array of { label, href } where href must be a full URL
 *                (e.g. "https://www.swissperiences.ch/destinations/geneva")
 *
 * Usage:
 * ```ts
 * const breadcrumbJsonLd = buildBreadcrumbJsonLd([
 *   { label: "Home", href: "https://www.swissperiences.ch/" },
 *   { label: "Destinations", href: "https://www.swissperiences.ch/destinations" },
 *   { label: "Geneva", href: "https://www.swissperiences.ch/destinations/geneva" }
 * ]);
 * ```
 */
export function buildBreadcrumbJsonLd(
    items: { label: string; href: string }[]
): object {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": item.label,
            "item": item.href,
        })),
    };
}
