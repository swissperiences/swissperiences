import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Heart, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const valueProps = [
  {
    icon: Target,
    title: "Swiss Precision",
    description: "Meticulous planning and flawless execution",
  },
  {
    icon: Building2,
    title: "Curated Venues",
    description: "Hand-selected locations that inspire creativity",
  },
  {
    icon: Heart,
    title: "Team Building",
    description: "Experiences that strengthen bonds and trust",
  },
  {
    icon: Users,
    title: "Full Support",
    description: "We handle every detail from start to finish",
  },
];

const teamSizes = ["10-15", "16-30", "31-50", "51-100", "100+"];

export default function CorporateRetreats() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    teamSize: "",
    message: "",
    newsletter: true, // Default to opt-in
    honeypot: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    // Honeypot check - if filled, it's a bot
    if (formData.honeypot) {
      console.warn('[Security] Honeypot triggered on corporate form - potential bot detected');
      return;
    }

    if (!formData.companyName || !formData.contactName || !formData.email) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('corporate_inquiries')
        .insert({
          company_name: formData.companyName,
          contact_name: formData.contactName,
          email: formData.email,
          team_size: formData.teamSize || null,
          message: formData.message || null,
          newsletter_opt_in: formData.newsletter,
        });

      if (error) throw error;

      // Send Email Notification (Vercel Function)
      const emailResponse = await fetch('/api/send-inquiry-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName,
          contactName: formData.contactName,
          email: formData.email,
          teamSize: formData.teamSize,
          message: formData.message,
          newsletter_opt_in: formData.newsletter
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error('[Corporate Form] Email API error:', errorData);
        throw new Error(`Email sending failed: ${errorData.error || 'Unknown error'}`);
      }

      toast({
        title: "Request received",
        description: "We'll be in touch within 24 hours.",
      });
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        teamSize: "",
        message: "",
        newsletter: true,
        honeypot: "",
      });
      setHasSubmitted(false);
    } catch (error) {
      console.error('[Corporate Inquiry] Database error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="corporate-retreats" className="relative scroll-mt-20">
      {/* Hero Introduction */}
      <div className="relative min-h-[70vh] lg:min-h-[60vh] flex items-center lg:items-start justify-center lg:justify-start overflow-hidden">
        {/* Content - centered on mobile, left on desktop */}
        <motion.div
          className="relative z-10 text-center lg:text-left px-6 lg:px-12 pt-20 lg:pt-32 pb-24 max-w-2xl mx-auto lg:mx-0"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs uppercase tracking-[0.2em] text-white/80 bg-white/10 rounded-full border border-white/20">
            For Teams
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-tight">
            Curated Team Experiences
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/80 font-light max-w-xl mx-auto lg:mx-0">
            From focused offsites to immersive retreats, we design curated team experiences in Switzerland — tailored for clarity, trust, and human connection.
          </p>
        </motion.div>
      </div>

      {/* Value Propositions */}
      <div className="relative py-20 px-6">
        {/* Overlay for value props section */}
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            {valueProps.map((prop, index) => (
              <motion.div
                key={prop.title}
                className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <prop.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">{prop.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {prop.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="relative py-24 px-6 overflow-hidden">
        {/* Darker overlay for form section */}
        <div className="absolute inset-0 bg-black/60" />

        <motion.div
          className="relative z-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-12">
            <span className="text-xs font-medium tracking-[0.2em] text-[#D8B58A] uppercase mb-4 block">
              Start the Conversation
            </span>
            <h3 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Request Access
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Share a few details and we'll explore options together.
            </p>
          </div>

          <Card className="border-white/10 bg-card/50 backdrop-blur-sm hover:border-white/20 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />

            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-serif text-white">
                Corporate Inquiry
              </CardTitle>
              <CardDescription className="text-white/60 font-light">
                Tell us about your team's vision
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Honeypot field - hidden from humans, visible to bots */}
                <input
                  type="text"
                  name="website"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    opacity: 0,
                  }}
                  aria-hidden="true"
                />

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="companyName" className="text-sm font-medium text-white/70">
                        Company Name *
                      </label>
                      <Input
                        id="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className={cn(
                          "bg-white/5 border-white/10 text-white placeholder:text-white/30",
                          "focus:border-[#D8B58A]/50 focus:ring-2 focus:ring-[#D8B58A]/20",
                          "h-12 transition-all duration-300",
                          hasSubmitted && !formData.companyName && "border-red-500 focus:ring-red-500/20"
                        )}
                        placeholder="Your company"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contactName" className="text-sm font-medium text-white/70">
                        Contact Name *
                      </label>
                      <Input
                        id="contactName"
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className={cn(
                          "bg-white/5 border-white/10 text-white placeholder:text-white/30",
                          "focus:border-[#D8B58A]/50 focus:ring-2 focus:ring-[#D8B58A]/20",
                          "h-12 transition-all duration-300",
                          hasSubmitted && !formData.contactName && "border-red-500 focus:ring-red-500/20"
                        )}
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-white/70">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={cn(
                          "bg-white/5 border-white/10 text-white placeholder:text-white/30",
                          "focus:border-[#D8B58A]/50 focus:ring-2 focus:ring-[#D8B58A]/20",
                          "h-12 transition-all duration-300",
                          hasSubmitted && !formData.email && "border-red-500 focus:ring-red-500/20"
                        )}
                        placeholder="email@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="teamSize" className="text-sm font-medium text-white/70">
                        Team Size
                      </label>
                      <Select
                        value={formData.teamSize}
                        onValueChange={(value) => setFormData({ ...formData, teamSize: value })}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 [&>span]:text-white/60 focus:ring-2 focus:ring-[#D8B58A]/20 focus:border-[#D8B58A]/50 transition-all duration-300">
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10">
                          {teamSizes.map((size) => (
                            <SelectItem
                              key={size}
                              value={size}
                              className="text-white focus:bg-white/10 focus:text-white"
                            >
                              {size} participants
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-white/70">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#D8B58A]/50 focus:ring-2 focus:ring-[#D8B58A]/20 min-h-[120px] resize-none transition-all duration-300"
                      placeholder="Tell us about your retreat goals..."
                      aria-describedby="message-hint"
                    />
                  </div>
                </div>

                {/* Newsletter Opt-in Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#D8B58A] focus:ring-2 focus:ring-[#D8B58A]/20 focus:ring-offset-0 cursor-pointer transition-all"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-white/60 font-light leading-relaxed group-hover:text-white/80 transition-colors">
                    Send me curated stories, seasonal experiences, and exclusive invitations for teams. (You can unsubscribe anytime.)
                  </span>
                </label>

                <div className="space-y-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="hero"
                    className="w-full h-14 text-base font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    aria-label="Submit corporate retreat inquiry"
                  >
                    {isSubmitting ? "Sending..." : "Request Access"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    No obligation—share a few details and we'll explore options together.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

