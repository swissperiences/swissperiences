import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    companyName: z.string().min(2, "Company name is required"),
    contactName: z.string().min(2, "Contact name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    teamSize: z.string({ required_error: "Please select a team size" }),
    dates: z.string().optional(),
    objective: z.string().min(10, "Please describe the retreat goals shortly"),
});

export function CorporateInquiryForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            contactName: "",
            email: "",
            phone: "",
            objective: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            // Simulate API call for now, targeting the existing inquiry endpoint logic
            const response = await fetch("/api/send-inquiry-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "corporate",
                    ...values
                }),
            });

            if (!response.ok) throw new Error("Failed to send inquiry");

            toast.success("Inquiry Sent", {
                description: "We will contact you within 24 hours with a preliminary proposal."
            });
            form.reset();
        } catch (error) {
            console.error(error);
            toast.error("Submission Failed", {
                description: "Please try again or contact us via WhatsApp."
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-black/40 backdrop-blur-md p-8 md:p-12 border border-white/10 rounded-sm">
            <div className="mb-10">
                <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.3em] block mb-3">
                    Corporate Access
                </span>
                <h3 className="text-3xl font-serif text-white italic">
                    Design Your Retreat
                </h3>
                <p className="text-white/60 font-light mt-4 text-sm max-w-md">
                    Tell us about your team. We will architect the logistics, the experience, and the outcome.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">Company Organization</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Acme Inc." {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-glacier-500/50 transition-colors h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">Lead Contact</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Full Name" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-glacier-500/50 transition-colors h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">Work Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@company.com" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-glacier-500/50 transition-colors h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">Phone / WhatsApp</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+41 ..." {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-glacier-500/50 transition-colors h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="teamSize"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">Team Size</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-12">
                                                <SelectValue placeholder="Select size" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="micro">Micro Team (4-10)</SelectItem>
                                            <SelectItem value="small">Small Group (11-25)</SelectItem>
                                            <SelectItem value="medium">Mid-Size (26-50)</SelectItem>
                                            <SelectItem value="large">Department (50+)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dates"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">Target Dates</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Sept 2025" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-glacier-500/50 transition-colors h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="objective"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-white/50">Core Objective</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g. Strategic planning, Team bonding, deep work..."
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-glacier-500/50 transition-colors min-h-[120px] resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-switz-red hover:bg-white hover:text-switz-red text-white uppercase tracking-[0.2em] font-bold h-14 text-xs transition-all duration-500"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Request...</>
                        ) : (
                            "Request Proposal"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
