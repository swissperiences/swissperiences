import { UPCOMING_RETREATS } from '@/data/retreats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface UpcomingRetreatsProps {
    onJoinWaitlist: (tier: string) => void;
}

export function UpcomingRetreats({ onJoinWaitlist }: UpcomingRetreatsProps) {
    const nextRetreat = UPCOMING_RETREATS[0];

    if (!nextRetreat) return null;

    const { signature, basecamp } = nextRetreat.tiers;

    return (
        <section id="calendar" className="min-h-[100svh] py-24 md:py-32 bg-background relative overflow-hidden flex items-center">
            <div className="container mx-auto px-6 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-medium tracking-[0.2em] text-[#D8B58A] uppercase mb-4 block">
                        The Calendar
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                        Upcoming Intake
                    </h2>
                    <div className="w-12 h-0.5 bg-white/20 mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                        {nextRetreat.title} • {nextRetreat.location} • {nextRetreat.date}
                    </p>
                </motion.div>

                {/* Two-tier card layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {/* Signature Tier Card */}
                    {signature && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                            className="h-full"
                        >
                            <Card className="h-full border-white/10 bg-card/50 backdrop-blur-sm hover:border-[#D8B58A]/30 transition-all duration-500 hover:scale-[1.02] group flex flex-col">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#D8B58A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />

                                <CardHeader className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <Badge className="bg-[#D8B58A] text-black hover:bg-[#D8B58A]/90 font-medium tracking-wide">
                                            Signature
                                        </Badge>
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                            {nextRetreat.status === 'open' ? 'Open' : 'Waitlist'}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl font-serif text-white">
                                        {signature.label}
                                    </CardTitle>
                                    <CardDescription className="text-white/60 font-light leading-relaxed">
                                        {signature.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6 flex-grow">
                                    <div className="space-y-2">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-light text-white">
                                                {signature.amount.toLocaleString()}
                                            </span>
                                            <span className="text-lg text-muted-foreground">
                                                {signature.currency}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            All-inclusive luxury experience
                                        </p>
                                    </div>

                                    <div className="space-y-2 text-sm text-white/70">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#D8B58A]" />
                                            <span>Private accommodations</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#D8B58A]" />
                                            <span>Curated experiences</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#D8B58A]" />
                                            <span>Expert mentorship</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        onClick={() => onJoinWaitlist('Signature')}
                                        variant="hero"
                                        className="w-full"
                                    >
                                        Request Invitation
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}

                    {/* Basecamp Tier Card */}
                    {basecamp && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
                            className="h-full"
                        >
                            <Card className="h-full border-white/10 bg-card/50 backdrop-blur-sm hover:border-white/20 transition-all duration-500 hover:scale-[1.02] group flex flex-col">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />

                                <CardHeader className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <Badge variant="outline" className="border-white/30 text-white hover:bg-white/10 font-medium tracking-wide">
                                            Basecamp
                                        </Badge>
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                            {nextRetreat.status === 'open' ? 'Open' : 'Waitlist'}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl font-serif text-white">
                                        {basecamp.label}
                                    </CardTitle>
                                    <CardDescription className="text-white/60 font-light leading-relaxed">
                                        {basecamp.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6 flex-grow">
                                    <div className="space-y-2">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-light text-white">
                                                {basecamp.amount.toLocaleString()}
                                            </span>
                                            <span className="text-lg text-muted-foreground">
                                                {basecamp.currency}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Shared accommodations, full access
                                        </p>
                                    </div>

                                    <div className="space-y-2 text-sm text-white/70">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-white/50" />
                                            <span>Shared accommodations</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-white/50" />
                                            <span>Core experiences</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-white/50" />
                                            <span>Group mentorship</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        onClick={() => onJoinWaitlist('Basecamp')}
                                        variant="outline"
                                        className="w-full border-white/20 hover:bg-white/5 hover:text-white bg-transparent text-white/70"
                                    >
                                        Request Invitation
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}
                </div>

                {/* Bespoke Private Escape Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-16"
                >
                    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D8B58A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />

                        <div className="space-y-3 text-center md:text-left relative z-10 max-w-2xl">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <span className="text-xs font-medium tracking-[0.2em] text-[#D8B58A] uppercase">
                                    The Private Escape
                                </span>
                                <Badge className="bg-[#D8B58A]/10 text-[#D8B58A] border border-[#D8B58A]/20 hover:bg-[#D8B58A]/20 font-medium tracking-wide text-[10px] px-2 py-0.5 h-auto">
                                    Tailor-made
                                </Badge>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-serif text-white leading-tight">
                                Can’t make it to our scheduled intakes?
                            </h3>
                            <p className="text-white/60 font-light leading-relaxed">
                                We offer bespoke 2-3 day alpine escapes designed around your calendar.
                                <span className="block mt-1 text-white/40 text-sm">Ideally suited for London, Lisbon & Paris residents.</span>
                            </p>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-4 relative z-10 flex-shrink-0">
                            <div className="text-right">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Starting from</span>
                                <div className="flex items-baseline justify-end gap-1.5">
                                    <span className="text-3xl font-light text-white">1,200</span>
                                    <span className="text-sm text-muted-foreground">CHF / night</span>
                                </div>
                            </div>
                            <Button
                                onClick={() => onJoinWaitlist('Private Escape')}
                                variant="outline"
                                className="border-white/20 hover:bg-white/10 text-white min-w-[180px]"
                            >
                                Inquire for Dates
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-xl mx-auto">
                        Applications are reviewed on a rolling basis.
                        <br />Priority given to early requests for the Spring 2026 cohort.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
