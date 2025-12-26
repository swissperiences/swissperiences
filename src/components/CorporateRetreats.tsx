import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Heart, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const valueProps = [
  {
    icon: Building2,
    title: "Curated Venues",
    description: "Hand-selected locations that inspire creativity",
  },
  {
    icon: Users,
    title: "Full Support",
    description: "We handle every detail from start to finish",
  },
  {
    icon: Heart,
    title: "Team Building",
    description: "Experiences that strengthen bonds and trust",
  },
  {
    icon: Target,
    title: "Swiss Precision",
    description: "Meticulous planning and flawless execution",
  },
];

const teamSizes = ["10-15", "16-30", "31-50", "51-100", "100+"];

export default function CorporateRetreats() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    teamSize: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        });

      if (error) throw error;

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
      });
    } catch (error) {
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
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80')",
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        
        {/* Content */}
        <motion.div 
          className="relative z-10 text-center px-6 py-24 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs uppercase tracking-[0.2em] text-white/80 bg-white/10 rounded-full border border-white/20">
            For Teams
          </span>
          <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">
            Corporate Retreats
          </h2>
          <p className="text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto">
            Unforgettable team experiences in Switzerland—from 10 to 120 participants, fully curated for connection and clarity.
          </p>
        </motion.div>
      </div>

      {/* Value Propositions */}
      <div className="bg-background py-20 px-6">
        <div className="max-w-6xl mx-auto">
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
      <div className="bg-black py-24 px-6">
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-white/40 mb-4">
              Start Planning
            </p>
            <h3 className="text-3xl md:text-4xl font-light text-white mb-3">
              Tell Us About Your Team
            </h3>
            <p className="text-white/50">
              Share a few details and we'll explore options together.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm text-white/60">Company Name *</label>
                  <Input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-2 focus:ring-white/20 h-12"
                    placeholder="Your company"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contactName" className="text-sm text-white/60">Contact Name *</label>
                  <Input
                    id="contactName"
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-2 focus:ring-white/20 h-12"
                    placeholder="Your name"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-white/60">Email *</label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-2 focus:ring-white/20 h-12"
                    placeholder="email@company.com"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="teamSize" className="text-sm text-white/60">Team Size</label>
                  <Select
                    value={formData.teamSize}
                    onValueChange={(value) => setFormData({ ...formData, teamSize: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 [&>span]:text-white/60">
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
                <label htmlFor="message" className="text-sm text-white/60">Message</label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-2 focus:ring-white/20 min-h-[120px] resize-none"
                  placeholder="Tell us about your retreat goals..."
                  aria-describedby="message-hint"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-base font-medium bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all duration-300 focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Submit corporate retreat inquiry"
              >
                {isSubmitting ? "Sending..." : "Tell Us About Your Team"}
              </Button>
              <p className="text-center text-sm text-white/40">
                No obligation—share a few details and we'll explore options together.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
