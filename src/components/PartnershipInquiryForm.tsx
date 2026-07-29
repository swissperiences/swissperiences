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
    contactName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    companyName: z.string().min(2, "Company or brand name is required"),
    phone: z.string().optional(),
    partnershipType: z.string({ required_error: "Please select a partnership type" }),
    message: z.string().min(10, "Please describe the partnership opportunity"),
});

export function PartnershipInquiryForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contactName: "",
            email: "",
            companyName: "",
            phone: "",
            message: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/send-partner-inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "partnership", ...values }),
            });

            if (!response.ok) throw new Error("Failed to send inquiry");

            toast.success("Inquiry Sent", {
                description: "We'll be in touch within a few days."
            });
            form.reset();
        } catch (error) {
            console.error(error);
            toast.error("Submission Failed", {
                description: "Please try again or email hello@swissperiences.ch"
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-black/40 backdrop-blur-md p-8 md:p-12 border border-white/10 rounded-sm">
            <div className="mb-10">
                <span className="text-switz-red text-xs font-bold uppercase tracking-[0.3em] block mb-3">
                    Partnership Inquiry
                </span>
                <h3 className="text-3xl font-serif text-white italic">
                    Start a Conversation
                </h3>
                <p className="text-white/60 font-light mt-4 text-sm max-w-md">
                    Tell us about your brand and how you'd like to collaborate. We'll get back to you with ideas.
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
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">Company / Brand</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your company" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-switz-red/50 transition-colors h-12" />
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
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">Your Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Full name" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-switz-red/50 transition-colors h-12" />
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
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@company.com" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-switz-red/50 transition-colors h-12" />
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
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">Phone (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+41 ..." {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-switz-red/50 transition-colors h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="partnershipType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-white/50">Partnership Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-12">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="banking">Private Banking & Family Offices</SelectItem>
                                        <SelectItem value="luxury">Luxury Brands & Maisons</SelectItem>
                                        <SelectItem value="realestate">Premium Real Estate</SelectItem>
                                        <SelectItem value="corporate">Corporate & Events</SelectItem>
                                        <SelectItem value="concierge">Lifestyle & Concierge</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-white/50">How would you like to collaborate?</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us about your brand and what you have in mind..."
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-switz-red/50 transition-colors min-h-[120px] resize-none"
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
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                        ) : (
                            "Send Inquiry"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
