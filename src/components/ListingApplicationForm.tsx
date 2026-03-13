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
    phone: z.string().optional(),
    businessName: z.string().min(2, "Business or property name is required"),
    listingType: z.string({ required_error: "Please select what you offer" }),
    location: z.string().min(2, "Location is required"),
    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    description: z.string().min(20, "Please describe what you offer (at least 20 characters)"),
    referralSource: z.string().optional(),
});

export function ListingApplicationForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contactName: "",
            email: "",
            phone: "",
            businessName: "",
            location: "",
            website: "",
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/send-partner-inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "listing", ...values }),
            });

            if (!response.ok) throw new Error("Failed to send application");

            toast.success("Application Received", {
                description: "We'll review your listing and get back to you soon."
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
                <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.3em] block mb-3">
                    Apply Now
                </span>
                <h3 className="text-3xl font-serif text-white italic">
                    List Your Experience
                </h3>
                <p className="text-white/60 font-light mt-4 text-sm max-w-md">
                    Tell us about what you offer. We review every application personally.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">Business / Property Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Chalet Alpenrose" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-switz-red/50 transition-colors h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="listingType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">What do you offer?</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-12">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="property">Property (hotel, chalet, B&B, apartment)</SelectItem>
                                            <SelectItem value="activity">Activity (guide, instructor, tour operator)</SelectItem>
                                            <SelectItem value="experience">Experience (package, retreat, workshop)</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@business.com" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-switz-red/50 transition-colors h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest text-white/50">Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Villars-sur-Ollon, Vaud" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-switz-red/50 transition-colors h-12" />
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
                        name="website"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-white/50">Website (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-switz-red/50 transition-colors h-12" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-white/50">Describe what you offer</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us about your property, activity, or experience. What makes it special?"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-switz-red/50 transition-colors min-h-[120px] resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="referralSource"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-white/50">How did you hear about us? (Optional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-12">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="search">Search Engine</SelectItem>
                                        <SelectItem value="social">Social Media</SelectItem>
                                        <SelectItem value="referral">Word of Mouth</SelectItem>
                                        <SelectItem value="event">Event or Conference</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
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
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                        ) : (
                            "Submit Application"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
