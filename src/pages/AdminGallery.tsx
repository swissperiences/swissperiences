import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Lightbulb, Rocket, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateGuestPrice, formatCurrency } from "@/lib/revenue-engine";
import { MembershipApplications } from "@/components/admin/MembershipApplications";

// Debounced input: updates local state immediately, syncs to DB after 600ms idle
function DebouncedInput({ value, onChange, delay = 600, ...props }: {
    value: string | number;
    onChange: (val: string) => void;
    delay?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
    const [local, setLocal] = useState(String(value));
    const timer = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => { setLocal(String(value)); }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocal(val);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => onChange(val), delay);
    };

    useEffect(() => () => clearTimeout(timer.current), []);

    return <input {...props} value={local} onChange={handleChange} />;
}

const images = [
    "/images/loft/IMG_6006.jpg",
    "/images/loft/IMG_8736.jpg",
    "/images/loft/IMG_8759.jpg",
    "/images/loft/IMG_5973.jpg",
    "/images/loft/IMG_4277.jpg",
    "/images/villars-hero.jpg",
    "/images/villars-feature.jpg",
    "/images/apartment-fireplace.jpg",
    "/images/villars-gallery-1.jpg",
    "/images/villars-gallery-2.jpg",
    "/images/villars-gallery-3.jpg",
    "/images/apt-balcony-day.jpg",
    "/images/apt-balcony-sunset.jpg",
    "/images/apt-bathroom.jpg",
    "/images/apt-living-room-1.jpg",
    "/images/apt-living-room-2.jpg",
    "/images/alpine-road-villars.jpg",
    "/images/host-road-winter.jpg",
    "/images/villars-drone.jpg",
    "/images/caueh-vidal-spring.jpg",
    "/images/host-hiking.jpg",
    "/images/host-contemplating.jpg",
    "/images/mountain-sunset.jpg",
    "/images/oeschinen-lake.jpg",
    "/images/snowy-view.jpg",
    "/images/geneva-jet.jpg",
    "/images/caueh-vidal.jpg",
    "/images/drone/villars-autumn-sunset.jpg",
    "/images/drone/villars-winter-sunset.jpg",
    "/images/drone/blausee-autumn-aerial.jpg",
    "/images/drone/geneva-jet-deau-aerial.jpg"
];

interface CorporateLead {
    id: string;
    company_name: string;
    contact_name: string;
    email: string;
    team_size: string;
    status: string;
    created_at: string;
    message?: string;
}

interface InventoryItem {
    id: string;
    name: string;
    location: string;
    pillar_score: number;
    management_fee_rate: number;
    status: string;
    nightly_rate_base?: number;
}

interface PartnerItem {
    id: string;
    name: string;
    service_type: string;
    commission_rate: number;
    region: string;
    ethos_verified: boolean;
    base_cost_estimate?: string;
}

export default function AdminGallery() {
    const [leads, setLeads] = useState<CorporateLead[]>([]);
    const [waitlist, setWaitlist] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [concepts, setConcepts] = useState<any[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [partners, setPartners] = useState<PartnerItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch Corporate Leads
                const { data: leadData } = await supabase
                    .from('corporate_inquiries')
                    .select('*')
                    .order('created_at', { ascending: false });
                setLeads(leadData || []);

                // Fetch Waitlist Leads
                const { data: waitData } = await supabase
                    .from('waitlist')
                    .select('*')
                    .order('created_at', { ascending: false });
                setWaitlist(waitData || []);

                // Fetch Dynamic Tasks
                const { data: taskData } = await supabase
                    .from('admin_tasks')
                    .select('*')
                    .order('category', { ascending: false });
                setTasks(taskData || []);

                // Fetch Dynamic Concepts
                const { data: conceptData } = await supabase
                    .from('admin_concepts')
                    .select('*')
                    .order('created_at', { ascending: true });
                setConcepts(conceptData || []);

                // Fetch Supply Chain: Inventory
                const { data: invData } = await supabase
                    .from('admin_inventory')
                    .select('*')
                    .order('pillar_score', { ascending: false });
                setInventory(invData || []);

                // Fetch Supply Chain: Partners
                const { data: partData } = await supabase
                    .from('admin_partners')
                    .select('*')
                    .order('name', { ascending: true });
                setPartners(partData || []);

            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const toggleTask = async (taskId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'done' ? 'pending' : 'done';

        // Optimistic UI update
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

        try {
            const { error } = await supabase
                .from('admin_tasks')
                .update({ status: newStatus })
                .eq('id', taskId);

            if (error) throw error;

            toast({
                title: "Task Updated",
                description: `Status changed to ${newStatus}`,
            });
        } catch (err) {
            console.error("Failed to update task:", err);
            toast({
                title: "Update Failed",
                description: "Could not sync with Supabase.",
                variant: "destructive"
            });
            // Revert on error
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: currentStatus } : t));
        }
    };

    const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
        setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
        try {
            const { error } = await supabase.from('admin_inventory').update(updates).eq('id', id);
            if (error) throw error;
            toast({ title: "Inventory Updated", description: "Changes synced to Supabase." });
        } catch (err) {
            console.error("Failed to update inventory:", err);
            toast({ title: "Update Failed", variant: "destructive" });
        }
    };

    const updatePartnerItem = async (id: string, updates: Partial<PartnerItem>) => {
        setPartners(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
        try {
            const { error } = await supabase.from('admin_partners').update(updates).eq('id', id);
            if (error) throw error;
            toast({ title: "Partner Updated", description: "Changes synced to Supabase." });
        } catch (err) {
            console.error("Failed to update partner:", err);
            toast({ title: "Update Failed", variant: "destructive" });
        }
    };

    const copyToClipboard = (path: string) => {
        navigator.clipboard.writeText(path);
        toast({
            title: "Copied to Clipboard",
            description: path,
        });
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white p-8">
            <header className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
                <div>
                    <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest mb-4">
                        <ArrowLeft size={14} /> Back to Sanctuary
                    </Link>
                    <h1 className="text-4xl font-serif">Mission Control</h1>
                    <p className="text-white/40 text-sm mt-2 font-mono">Swissperiences Command Center</p>
                </div>
                <div className="text-right">
                    <span className="text-switz-red text-xs font-bold tracking-widest uppercase border border-switz-red/30 px-3 py-1 bg-switz-red/5 rounded-full">Authorized Personnel Only</span>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {/* === STATS SUMMARY === */}
                {!isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-white/5 border-white/5 text-white">
                            <CardContent className="pt-6">
                                <span className="text-[10px] uppercase tracking-widest text-white/40 mb-2 block">Total Signals</span>
                                <span className="text-3xl font-serif italic">{leads.length + waitlist.length}</span>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/5 text-white">
                            <CardContent className="pt-6">
                                <span className="text-[10px] uppercase tracking-widest text-white/40 mb-2 block">New Inquiries (B2B)</span>
                                <span className="text-3xl font-serif italic text-switz-red">{leads.filter(l => l.status === 'new').length}</span>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/5 text-white">
                            <CardContent className="pt-6">
                                <span className="text-[10px] uppercase tracking-widest text-white/40 mb-2 block">Waitlist (B2C)</span>
                                <span className="text-3xl font-serif italic text-indigo-400">
                                    {waitlist.length}
                                </span>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/5 text-white group hover:border-switz-red/30 transition-colors">
                            <a href="https://plausible.io/swissperiences.ch" target="_blank" rel="noopener noreferrer" className="block">
                                <CardContent className="pt-6 relative">
                                    <span className="text-[10px] uppercase tracking-widest text-white/40 mb-2 block">Network Performance</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-serif italic text-emerald-400">Active</span>
                                        <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-switz-red transition-colors" />
                                    </div>
                                </CardContent>
                            </a>
                        </Card>
                    </div>
                )}

                <Tabs defaultValue="membership" className="space-y-8">
                    <TabsList className="bg-white/5 border border-white/10 p-1">
                        <TabsTrigger value="membership" className="data-[state=active]:bg-white data-[state=active]:text-black uppercase tracking-widest text-xs font-bold">Membership</TabsTrigger>
                        <TabsTrigger value="leads" className="data-[state=active]:bg-switz-red data-[state=active]:text-white uppercase tracking-widest text-xs font-bold">B2B Signals</TabsTrigger>
                        <TabsTrigger value="waitlist" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white uppercase tracking-widest text-xs font-bold">B2C Waitlist</TabsTrigger>
                        <TabsTrigger value="supply" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white uppercase tracking-widest text-xs font-bold">Supply Hub</TabsTrigger>
                        <TabsTrigger value="assets" className="data-[state=active]:bg-white data-[state=active]:text-black uppercase tracking-widest text-xs font-bold">Asset Vault</TabsTrigger>
                        <TabsTrigger value="concepts" className="data-[state=active]:bg-white data-[state=active]:text-black uppercase tracking-widest text-xs font-bold">R&D Lab</TabsTrigger>
                        <TabsTrigger value="strategy" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white uppercase tracking-widest text-xs font-bold">Strategy & Tasks</TabsTrigger>
                    </TabsList>

                    {/* === MEMBERSHIP TAB === */}
                    <TabsContent value="membership">
                        <MembershipApplications />
                    </TabsContent>

                    {/* === LEADS TAB === */}
                    <TabsContent value="leads">
                        <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="font-serif text-2xl italic">Corporate Inquiries</h2>
                                <span className="text-xs uppercase tracking-widest text-white/40">{leads.length} Signals Detected</span>
                            </div>
                            {isLoading ? (
                                <div className="p-12 text-center text-white/30 animate-pulse">Scanning frequencies...</div>
                            ) : leads.length === 0 ? (
                                <div className="p-12 text-center text-white/30">No signals detected yet. Silence on the spectrum.</div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-white/5">
                                        <TableRow className="border-white/10 hover:bg-transparent">
                                            <TableHead className="text-white/40 uppercase text-[10px] tracking-widest font-bold">Status</TableHead>
                                            <TableHead className="text-white/40 uppercase text-[10px] tracking-widest font-bold">Company</TableHead>
                                            <TableHead className="text-white/40 uppercase text-[10px] tracking-widest font-bold">Contact</TableHead>
                                            <TableHead className="text-white/40 uppercase text-[10px] tracking-widest font-bold">Cohort Size</TableHead>
                                            <TableHead className="text-white/40 uppercase text-[10px] tracking-widest font-bold">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leads.map((lead) => (
                                            <TableRow key={lead.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                                <TableCell>
                                                    <select
                                                        value={lead.status}
                                                        onChange={async (e) => {
                                                            const newStatus = e.target.value;
                                                            // Optimistic update
                                                            setLeads(leads.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));

                                                            // DB update
                                                            const { error } = await supabase
                                                                .from('corporate_inquiries')
                                                                .update({ status: newStatus })
                                                                .eq('id', lead.id);

                                                            if (error) {
                                                                console.error("Failed to update status:", error);
                                                                toast({ title: "Update Failed", description: "Could not update lead status.", variant: "destructive" });
                                                            }
                                                        }}
                                                        className="bg-black/40 border border-white/10 text-[9px] uppercase tracking-widest rounded-full px-2 py-1 text-switz-red cursor-pointer focus:outline-none focus:border-switz-red"
                                                    >
                                                        <option value="new">NEW</option>
                                                        <option value="contacted">CONTACTED</option>
                                                        <option value="qualified">QUALIFIED</option>
                                                        <option value="lost">LOST</option>
                                                        <option value="won">WON</option>
                                                    </select>
                                                </TableCell>
                                                <TableCell className="font-medium text-white group-hover:text-switz-red transition-colors">{lead.company_name}</TableCell>
                                                <TableCell>
                                                    <a href={`mailto:${lead.email}`} className="flex flex-col hover:opacity-70 transition-opacity">
                                                        <span className="text-xs text-white/90">{lead.contact_name}</span>
                                                        <span className="text-[10px] text-white/40 underline decoration-white/10">{lead.email}</span>
                                                    </a>
                                                </TableCell>
                                                <TableCell className="text-white/60 text-xs">{lead.team_size}</TableCell>
                                                <TableCell className="text-white/40 text-[10px] font-mono">
                                                    {new Date(lead.created_at).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </TabsContent>

                    {/* === B2C WAITLIST TAB === */}
                    <TabsContent value="waitlist">
                        <Card className="bg-white/5 border-white/5 text-white overflow-hidden">
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="font-serif italic text-xl">Consumer Waitlist</CardTitle>
                                <CardDescription className="text-white/40 text-xs">Direct signups from the main landing page.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-white/5">
                                        <TableRow className="border-white/10 hover:bg-transparent">
                                            <TableHead className="text-[10px] uppercase tracking-widest text-white/40">Name</TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-widest text-white/40">Email</TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-widest text-white/40">Joined</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {waitlist.map((item) => (
                                            <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                                <TableCell className="font-medium text-white">{item.first_name || "Anonymous"}</TableCell>
                                                <TableCell>
                                                    <a href={`mailto:${item.email}`} className="text-switz-red underline decoration-switz-red/20 underline-offset-4 text-xs">
                                                        {item.email}
                                                    </a>
                                                </TableCell>
                                                <TableCell className="text-white/40 text-[10px] font-mono">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {waitlist.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-12 text-white/20 italic">No waitlist signals received yet.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* === SUPPLY HUB TAB === */}
                    <TabsContent value="supply">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* --- Inventory / Sanctuaries --- */}
                            <Card className="bg-white/5 border-white/5 text-white overflow-hidden">
                                <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="font-serif italic text-xl">Sanctuaries (Inventory)</CardTitle>
                                        <CardDescription className="text-white/40 text-xs">Property portfolio & yield management.</CardDescription>
                                    </div>
                                    <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-sm">
                                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Asset-Light Model</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-white/5">
                                            <TableRow className="border-white/10 hover:bg-transparent">
                                                <TableHead className="text-[10px] uppercase tracking-widest text-white/40">Property</TableHead>
                                                <TableHead className="text-[10px] uppercase tracking-widest text-white/40">Base (CHF)</TableHead>
                                                <TableHead className="text-[10px] uppercase tracking-widest text-white/40 text-right">Fee %</TableHead>
                                                <TableHead className="text-[10px] uppercase tracking-widest text-white/40 text-right">Guest CHF</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {inventory.map((item) => (
                                                <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                                    <TableCell className="font-medium text-white max-w-[150px]">
                                                        <div className="flex flex-col">
                                                            <span className="truncate">{item.name}</span>
                                                            <span className="text-[9px] text-white/20 uppercase tracking-widest truncate">{item.location}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <DebouncedInput
                                                            type="number"
                                                            min="0"
                                                            max="99999"
                                                            step="10"
                                                            value={item.nightly_rate_base || 0}
                                                            onChange={(val) => updateInventoryItem(item.id, { nightly_rate_base: Number(val) })}
                                                            className="bg-black/40 border border-white/10 text-xs font-mono text-white/80 w-20 px-2 py-1 rounded focus:border-switz-red outline-none"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DebouncedInput
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="1"
                                                            value={item.management_fee_rate}
                                                            onChange={(val) => updateInventoryItem(item.id, { management_fee_rate: Number(val) })}
                                                            className="bg-black/40 border border-white/10 text-xs font-mono text-white/80 w-16 px-2 py-1 rounded focus:border-switz-red outline-none text-right"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right text-emerald-400 font-mono text-sm">
                                                        {formatCurrency(calculateGuestPrice(item.nightly_rate_base || 0, (item.management_fee_rate || 0) / 100))}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {inventory.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-12 text-white/20 italic">No sanctuaries onboarded yet.</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            {/* --- Partners / Swiss Collective --- */}
                            <Card className="bg-white/5 border-white/5 text-white overflow-hidden">
                                <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="font-serif italic text-xl">The Swiss Collective</CardTitle>
                                        <CardDescription className="text-white/40 text-xs">Financial hub for local partners.</CardDescription>
                                    </div>
                                    <div className="bg-switz-red/10 border border-switz-red/20 px-3 py-1 rounded-sm">
                                        <span className="text-[10px] text-switz-red font-bold uppercase tracking-widest">Ethos-Verified</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-white/5">
                                            <TableRow className="border-white/10 hover:bg-transparent">
                                                <TableHead className="text-[10px] uppercase tracking-widest text-white/40">Partner</TableHead>
                                                <TableHead className="text-[10px] uppercase tracking-widest text-white/40">Cost Est (CHF)</TableHead>
                                                <TableHead className="text-[10px] uppercase tracking-widest text-white/40 text-right">Markup %</TableHead>
                                                <TableHead className="text-[10px] uppercase tracking-widest text-white/40 text-right">Guest CHF</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {partners.map((partner) => (
                                                <TableRow key={partner.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                                    <TableCell className="font-medium text-white max-w-[120px]">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="truncate">{partner.name}</span>
                                                                {partner.ethos_verified && <span className="text-switz-red text-[8px]">★</span>}
                                                            </div>
                                                            <span className="text-[9px] text-white/40 truncate">{partner.service_type}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <DebouncedInput
                                                            type="text"
                                                            value={partner.base_cost_estimate || ""}
                                                            onChange={(val) => updatePartnerItem(partner.id, { base_cost_estimate: val })}
                                                            className="bg-black/40 border border-white/10 text-xs font-mono text-white/80 w-20 px-2 py-1 rounded focus:border-switz-red outline-none"
                                                            placeholder="Base cost..."
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DebouncedInput
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="1"
                                                            value={partner.commission_rate}
                                                            onChange={(val) => updatePartnerItem(partner.id, { commission_rate: Number(val) })}
                                                            className="bg-black/40 border border-white/10 text-xs font-mono text-white/80 w-16 px-2 py-1 rounded focus:border-switz-red outline-none text-right"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right text-indigo-400 font-mono text-sm">
                                                        {formatCurrency(calculateGuestPrice(Number(partner.base_cost_estimate) || 0, (partner.commission_rate || 0) / 100))}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {partners.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-12 text-white/20 italic">No partners in the vault.</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* === ASSETS TAB === */}
                    <TabsContent value="assets">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {images.map((img) => (
                                <motion.div
                                    key={img}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="group bg-white/[0.02] border border-white/10 rounded-sm overflow-hidden hover:border-white/30 transition-colors"
                                >
                                    <div className="aspect-square overflow-hidden bg-neutral-900 relative">
                                        <img
                                            src={img}
                                            alt={img}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => copyToClipboard(img)}
                                                className="p-3 bg-white text-black hover:bg-switz-red hover:text-white rounded-full transition-colors font-bold text-xs uppercase tracking-widest px-6"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-3 border-t border-white/5 bg-white/[0.01]">
                                        <p className="text-[9px] font-mono text-white/30 truncate">{img}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* === CONCEPTS TAB === */}
                    <TabsContent value="concepts">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {concepts.map((concept) => (
                                <Card key={concept.id} className="bg-white/5 border-white/10 text-white hover:border-switz-red/50 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="font-serif italic text-2xl flex items-center gap-3">
                                            {concept.title === 'Spring Awakening' && <Lightbulb className="text-switz-red w-5 h-5" />}
                                            {concept.title === 'Autumn Creative Retreat' && <Target className="text-indigo-500 w-5 h-5" />}
                                            {concept.title === 'Deep Winter Silence' && <Rocket className="text-emerald-500 w-5 h-5" />}
                                            {!['Spring Awakening', 'Autumn Creative Retreat', 'Deep Winter Silence'].includes(concept.title) && <Lightbulb className="text-white/40 w-5 h-5" />}
                                            {concept.title}
                                        </CardTitle>
                                        <CardDescription className="text-white/40 text-xs uppercase tracking-widest">{concept.date_target}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-white/70 leading-relaxed mb-4">
                                            "{concept.description}"
                                        </p>
                                        <div className="bg-black/40 p-3 rounded text-[10px] font-mono text-switz-red border border-switz-red/20">
                                            REQ: {concept.assets_req}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {concepts.length === 0 && (
                                <div className="col-span-3 py-24 text-center text-white/10 uppercase tracking-[0.2em] italic">No active concepts in the lab.</div>
                            )}
                        </div>
                    </TabsContent>

                    {/* === STRATEGY & TASKS TAB === */}
                    <TabsContent value="strategy">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="bg-white/5 border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle className="font-serif italic text-2xl">Foundational Roadmap</CardTitle>
                                    <CardDescription className="text-white/40 text-xs tracking-widest uppercase">Immediate Action Items</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {['Operations', 'Growth'].map(cat => (
                                        <div key={cat} className="space-y-4">
                                            <h3 className={`${cat === 'Operations' ? 'text-switz-red' : 'text-emerald-400'} text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/5 pb-2`}>
                                                {cat}
                                            </h3>
                                            {tasks.filter(t => t.category === cat).map(task => (
                                                <AdminTask
                                                    key={task.id}
                                                    status={task.status}
                                                    text={task.title}
                                                    onClick={() => toggleTask(task.id, task.status)}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="bg-white/5 border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle className="font-serif italic text-2xl">Asset Requirements</CardTitle>
                                    <CardDescription className="text-white/40 text-xs tracking-widest uppercase">Content Gaps for 'Summer Crossing'</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {tasks.filter(t => t.category === 'Assets').map(task => (
                                        <AdminTask
                                            key={task.id}
                                            status={task.status}
                                            text={task.title}
                                            onClick={() => toggleTask(task.id, task.status)}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

const AdminTask = ({ status, text, onClick }: { status: 'pending' | 'done', text: string, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className="flex items-center gap-3 group px-3 py-2 border border-white/5 hover:bg-white/[0.02] transition-colors rounded-sm cursor-pointer"
    >
        <div className={`w-4 h-4 border rounded-full flex items-center justify-center transition-all ${status === 'done' ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 group-hover:border-switz-red'}`}>
            {status === 'done' && <span className="text-[10px] text-white">✓</span>}
        </div>
        <span className={`text-xs font-light tracking-wide ${status === 'done' ? 'text-white/20 line-through' : 'text-white/70'}`}>{text}</span>
    </div>
);
