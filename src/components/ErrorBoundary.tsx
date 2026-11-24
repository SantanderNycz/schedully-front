import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Catches render-time errors anywhere below it and shows a branded fallback
// instead of a blank screen.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Unhandled UI error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md animate-fade-up">
            <p className="font-mono text-sm text-amber-500 mb-4">Something broke</p>
            <h1 className="font-display text-3xl text-ink-100 mb-3">This page hit a snag</h1>
            <p className="text-ink-400 text-sm mb-8">
              An unexpected error occurred. Reloading usually fixes it.
            </p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
