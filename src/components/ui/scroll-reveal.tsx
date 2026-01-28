import { motion, useInView, Variant } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    variant?: "fade" | "slideUp" | "scale" | "blur";
    delay?: number;
    duration?: number;
    threshold?: number;
}

const variants: Record<string, { hidden: Variant; visible: Variant }> = {
    fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    },
    slideUp: {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
    },
    scale: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    },
    blur: {
        hidden: { opacity: 0, filter: "blur(10px)" },
        visible: { opacity: 1, filter: "blur(0px)" }
    }
};

export const ScrollReveal = ({
    children,
    className,
    variant = "slideUp",
    delay = 0,
    duration = 0.8,
    threshold = 0.2
}: ScrollRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px", amount: threshold });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants[variant]}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.23, 1, 0.32, 1] // Swiss-luxury ease
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
};
