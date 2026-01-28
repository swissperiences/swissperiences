import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsletterForm() {
    const { t, i18n } = useTranslation('common');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/send-waitlist-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    tier: 'Newsletter',
                    language: i18n.language,
                    newsletter_opt_in: true,
                    intent: 'newsletter_signup'
                }),
            });

            if (!response.ok) throw new Error('Failed to subscribe');

            setIsSuccess(true);
            toast.success(t('newsletter.success', { defaultValue: 'Welcome to the inner circle.' }));
            setEmail('');

        } catch (error) {
            console.error('Newsletter error:', error);
            toast.error(t('newsletter.error', { defaultValue: 'Something went wrong. Please try again.' }));
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex items-center gap-2 text-switz-red text-sm tracking-widest uppercase animate-fade-in">
                <Check size={16} />
                <span>{t('newsletter.subscribed', { defaultValue: 'Subscribed' })}</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="relative max-w-sm w-full">
            <div className="relative group">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder', { defaultValue: 'Enter your email' })}
                    required
                    disabled={isLoading}
                    className="w-full bg-transparent border-b border-white/20 py-3 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-switz-red transition-colors rounded-none disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-switz-red transition-colors disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <ArrowRight size={16} />
                    )}
                </button>
            </div>
        </form>
    );
}
