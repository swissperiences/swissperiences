import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
    MapPin, Wifi, Clock, Home, Phone, Copy, Check, ChevronDown,
    ArrowRight, Mail, Compass, ConciergeBell, BedDouble,
} from "lucide-react";
import { MAISON_ANTHELIE, type DemoProperty, type EssentialGroup, type Recommendation } from "@/data/demo/maisonAnthelie";

/**
 * The Swissperiences guest portal — demonstration build.
 *
 * Three layers, one journey: what the guest needs on arrival, what is worth
 * their time nearby, and what the house can arrange. Everything is static.
 * There is no booking, no payment, no form, no account and no network call —
 * the only browser API used is the clipboard, for the Wi-Fi password.
 *
 * The property is fictional. See src/data/demo/maisonAnthelie.ts.
 */

const ESSENTIAL_ICONS = {
    arrival: MapPin,
    wifi: Wifi,
    hours: Clock,
    house: Home,
    reception: Phone,
} as const;

type TabId = "stay" | "around" | "services";

const TABS: { id: TabId; label: string; icon: typeof BedDouble }[] = [
    { id: "stay", label: "Your stay", icon: BedDouble },
    { id: "around", label: "Around you", icon: Compass },
    { id: "services", label: "Services", icon: ConciergeBell },
];

/* ── shared bits ─────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <span className="block text-[0.625rem] uppercase tracking-[0.35em] text-white/40">
            {children}
        </span>
    );
}

function CopyValue({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            // Clipboard unavailable (insecure context, denied permission).
            // The value is on screen either way — nothing to recover from.
        }
    };

    return (
        <button
            onClick={copy}
            className="group inline-flex min-h-[44px] items-center gap-2 text-left"
            aria-label={copied ? "Copied" : `Copy ${value}`}
        >
            <span className="font-mono text-base text-white">{value}</span>
            {copied
                ? <Check size={15} className="text-glacier-300" aria-hidden />
                : <Copy size={15} className="text-white/30 transition-colors group-hover:text-white/70" aria-hidden />}
        </button>
    );
}

/* ── layer 1 — stay essentials ───────────────────────────────── */

function EssentialCard({ group }: { group: EssentialGroup }) {
    const Icon = ESSENTIAL_ICONS[group.icon];

    return (
        <section className="border-b border-white/[0.07] py-8 first:pt-0">
            <div className="mb-6 flex items-center gap-3">
                <Icon size={16} className="text-glacier-400" aria-hidden />
                <h3 className="font-serif text-xl text-white/90">{group.title}</h3>
            </div>

            <dl className="space-y-5">
                {group.items.map((item) => (
                    <div key={item.id}>
                        <dt className="mb-1 text-[0.6875rem] uppercase tracking-[0.2em] text-white/35">
                            {item.label}
                        </dt>
                        <dd>
                            {item.copyable
                                ? <CopyValue value={item.value} />
                                : <p className="text-base leading-snug text-white">{item.value}</p>}
                            {item.detail && (
                                <p className="mt-1.5 text-sm leading-relaxed text-white/45">{item.detail}</p>
                            )}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

/* ── layer 2 — curated around you ────────────────────────────── */

function RecommendationCard({ item, index }: { item: Recommendation; index: number }) {
    const [open, setOpen] = useState(index === 0);

    return (
        <article className="overflow-hidden border border-white/[0.08] bg-white/[0.02]">
            {item.image && (
                <div className="relative h-40 overflow-hidden sm:h-48">
                    <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                    />
                    {/* Heavier than it looks like it needs to be: these photographs
                        run bright at the horizon, and the eyebrow sits exactly there. */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/10" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                        <span className="block text-[0.625rem] uppercase tracking-[0.35em] text-white/75">
                            {item.kind} · {item.distance}
                        </span>
                        <h3 className="mt-1.5 font-serif text-2xl leading-tight text-white">{item.name}</h3>
                    </div>
                </div>
            )}

            <div className="p-4">
                <p className="text-sm leading-relaxed text-white/70">{item.why}</p>

                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    className="mt-3 flex min-h-[44px] w-full items-center justify-between gap-2 text-left"
                >
                    <span className="text-[0.6875rem] uppercase tracking-[0.25em] text-white/45">
                        {open ? "Less" : "When to go"}
                    </span>
                    <ChevronDown
                        size={16}
                        aria-hidden
                        className={`text-white/40 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                    />
                </button>

                {open && (
                    <dl className="space-y-3 border-t border-white/[0.07] pt-3">
                        <div>
                            <dt className="text-[0.625rem] uppercase tracking-[0.25em] text-white/35">When</dt>
                            <dd className="mt-1 text-sm leading-relaxed text-white/70">{item.when}</dd>
                        </div>
                        <div>
                            <dt className="text-[0.625rem] uppercase tracking-[0.25em] text-white/35">Expect</dt>
                            <dd className="mt-1 text-sm leading-relaxed text-white/70">{item.expect}</dd>
                        </div>
                    </dl>
                )}
            </div>
        </article>
    );
}

/* ── layer 3 — services & experiences ────────────────────────── */

function ServicePanel({ property }: { property: DemoProperty }) {
    const [showReception, setShowReception] = useState(false);

    const groups = useMemo(
        () => [
            { key: "in-house" as const, title: "In the house", items: property.services.filter((s) => s.group === "in-house") },
            { key: "arranged" as const, title: "Arranged for you", items: property.services.filter((s) => s.group === "arranged") },
        ],
        [property.services]
    );

    return (
        <div className="space-y-10">
            {groups.map((group) => (
                <section key={group.key}>
                    <Eyebrow>{group.title}</Eyebrow>
                    <ul className="mt-4 space-y-px">
                        {group.items.map((service) => (
                            <li key={service.id} className="bg-white/[0.02] p-4">
                                <h3 className="font-serif text-lg leading-tight text-white/90">{service.name}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-white/55">{service.description}</p>
                                <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.2em] text-glacier-400/80">
                                    {service.note}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}

            {/* Static call to action. No form, no request, no network — the
                portal hands the guest back to the house, which is the whole
                promise of the product. */}
            <section className="border border-glacier-500/25 bg-glacier-900/20 p-5">
                <h3 className="font-serif text-xl text-white">Anything here is a conversation</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                    Nothing is booked through this page. Tell reception what you would like and
                    they will arrange it — or tell you honestly if the weather says otherwise.
                </p>

                <button
                    onClick={() => setShowReception((v) => !v)}
                    aria-expanded={showReception}
                    className="mt-4 flex min-h-[44px] w-full items-center justify-between gap-3 border border-white/15 px-4 text-left transition-colors hover:border-glacier-400/50 motion-reduce:transition-none"
                >
                    <span className="text-[0.6875rem] uppercase tracking-[0.3em] text-white/80">
                        Contact reception
                    </span>
                    <ArrowRight size={15} className="text-glacier-300" aria-hidden />
                </button>

                {showReception && (
                    <dl className="mt-4 space-y-3 border-t border-white/10 pt-4">
                        <div className="flex items-start gap-3">
                            <Phone size={15} className="mt-0.5 shrink-0 text-white/35" aria-hidden />
                            <div>
                                <dt className="sr-only">Telephone</dt>
                                <dd className="text-sm text-white">{property.reception.line}</dd>
                                <dd className="text-xs text-white/40">Or dial 9 from your room</dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail size={15} className="mt-0.5 shrink-0 text-white/35" aria-hidden />
                            <div>
                                <dt className="sr-only">E-mail</dt>
                                <dd className="break-all text-sm text-white">{property.reception.email}</dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock size={15} className="mt-0.5 shrink-0 text-white/35" aria-hidden />
                            <div>
                                <dt className="sr-only">Hours</dt>
                                <dd className="text-sm text-white/70">{property.reception.hours}</dd>
                            </div>
                        </div>
                    </dl>
                )}
            </section>
        </div>
    );
}

/* ── page ────────────────────────────────────────────────────── */

export default function StayPortal() {
    const { propertySlug } = useParams<{ propertySlug: string }>();
    const [tab, setTab] = useState<TabId>("stay");

    // Only one property exists in the demonstration set. An unknown slug shows
    // it anyway rather than a 404 — this build has nothing to protect.
    const property = MAISON_ANTHELIE;

    // Restored on unmount: without this the portal's title survives a
    // client-side navigation back into the marketing site, which sets its
    // title through Helmet only on the routes that declare one.
    useEffect(() => {
        const previous = document.title;
        document.title = `${property.name} · Your stay`;
        return () => { document.title = previous; };
    }, [property.name]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [tab]);

    return (
        <div className="min-h-screen bg-[#060606] text-white">
            {/* ── arrival: what the guest sees after the link or the QR ── */}
            <header className="relative h-[78svh] min-h-[520px] overflow-hidden">
                <img
                    src={property.heroImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#060606]" />

                <div className="relative flex h-full flex-col justify-between px-6 pb-10 pt-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-serif text-lg tracking-wide text-white/90">{property.name}</p>
                            <p className="mt-0.5 text-[0.625rem] uppercase tracking-[0.25em] text-white/50">
                                {property.region} · {property.altitude}
                            </p>
                        </div>
                        <span className="shrink-0 border border-white/20 px-2 py-1 text-[0.5625rem] uppercase tracking-[0.2em] text-white/50">
                            Demo
                        </span>
                    </div>

                    <div>
                        <Eyebrow>Welcome</Eyebrow>
                        <h1 className="mt-3 font-serif text-[clamp(2.25rem,10vw,3.5rem)] leading-[0.95] text-white">
                            {property.guest.greeting}
                        </h1>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
                            {property.tagline}
                        </p>

                        <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-5">
                            <div>
                                <dt className="text-[0.5625rem] uppercase tracking-[0.25em] text-white/35">Arrive</dt>
                                <dd className="mt-1 text-sm text-white/85">{property.guest.arrival}</dd>
                            </div>
                            <div>
                                <dt className="text-[0.5625rem] uppercase tracking-[0.25em] text-white/35">Depart</dt>
                                <dd className="mt-1 text-sm text-white/85">{property.guest.departure}</dd>
                            </div>
                            <div>
                                <dt className="text-[0.5625rem] uppercase tracking-[0.25em] text-white/35">Room</dt>
                                <dd className="mt-1 text-sm text-white/85">{property.guest.room}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </header>

            {/* ── the three layers ── */}
            <nav
                aria-label="Sections"
                className="sticky top-0 z-20 border-y border-white/[0.08] bg-[#060606]/95 backdrop-blur"
            >
                <ul className="mx-auto flex max-w-2xl">
                    {TABS.map(({ id, label, icon: Icon }) => {
                        const active = tab === id;
                        return (
                            <li key={id} className="flex-1">
                                <button
                                    onClick={() => setTab(id)}
                                    aria-current={active ? "page" : undefined}
                                    className={`flex min-h-[52px] w-full flex-col items-center justify-center gap-1 border-b-2 transition-colors duration-300 motion-reduce:transition-none ${
                                        active
                                            ? "border-glacier-400 text-white"
                                            : "border-transparent text-white/40 hover:text-white/70"
                                    }`}
                                >
                                    <Icon size={15} aria-hidden />
                                    <span className="text-[0.625rem] uppercase tracking-[0.15em]">{label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <main className="mx-auto max-w-2xl px-6 py-10">
                {tab === "stay" && (
                    <>
                        <Eyebrow>Everything you need first</Eyebrow>
                        <div className="mt-6">
                            {property.essentials.map((group) => (
                                <EssentialCard key={group.id} group={group} />
                            ))}
                        </div>
                        <button
                            onClick={() => setTab("around")}
                            className="mt-8 flex min-h-[44px] w-full items-center justify-between gap-3 border border-white/15 px-4 text-left transition-colors hover:border-glacier-400/50 motion-reduce:transition-none"
                        >
                            <span className="text-[0.6875rem] uppercase tracking-[0.3em] text-white/80">
                                Now — what is worth your time
                            </span>
                            <ArrowRight size={15} className="text-glacier-300" aria-hidden />
                        </button>
                    </>
                )}

                {tab === "around" && (
                    <>
                        <Eyebrow>Chosen for these three days</Eyebrow>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
                            Eight things, not eighty. Each one is here because someone from the
                            house would go, in August, and has.
                        </p>
                        <div className="mt-7 space-y-4">
                            {property.recommendations.map((item, i) => (
                                <RecommendationCard key={item.id} item={item} index={i} />
                            ))}
                        </div>
                        <button
                            onClick={() => setTab("services")}
                            className="mt-8 flex min-h-[44px] w-full items-center justify-between gap-3 border border-white/15 px-4 text-left transition-colors hover:border-glacier-400/50 motion-reduce:transition-none"
                        >
                            <span className="text-[0.6875rem] uppercase tracking-[0.3em] text-white/80">
                                What the house can arrange
                            </span>
                            <ArrowRight size={15} className="text-glacier-300" aria-hidden />
                        </button>
                    </>
                )}

                {tab === "services" && (
                    <>
                        <Eyebrow>Ask, and it happens</Eyebrow>
                        <div className="mt-7">
                            <ServicePanel property={property} />
                        </div>
                    </>
                )}
            </main>

            <footer className="border-t border-white/[0.07] px-6 py-10 text-center">
                <p className="text-[0.625rem] uppercase tracking-[0.3em] text-white/30">
                    Curated by Swissperiences
                </p>
                <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-white/25">
                    Demonstration only. {property.name} is a fictional property; the guest,
                    the stay and the contact details are invented.
                </p>
                {propertySlug && propertySlug !== property.slug && (
                    <p className="mt-3 text-[0.625rem] text-white/20">Requested: {propertySlug}</p>
                )}
            </footer>
        </div>
    );
}
