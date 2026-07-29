import { Component, type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("[ErrorBoundary]", error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex items-center justify-center px-6">
                    <div className="text-center max-w-md space-y-6">
                        <p className="text-switz-red text-xs font-bold uppercase tracking-[0.4em]">
                            Something went wrong
                        </p>
                        <h1 className="text-3xl font-serif text-white">
                            We hit an unexpected error.
                        </h1>
                        <p className="text-white/50 text-sm font-light">
                            Please refresh the page or go back to the homepage.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-white text-black px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                            >
                                Refresh
                            </button>
                            <a
                                href="/"
                                className="border border-white/20 text-white px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-white/10 transition-all duration-500 text-center"
                            >
                                Homepage
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
