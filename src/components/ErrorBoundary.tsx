import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-8" style={{ direction: 'rtl' }}>
          <div className="bg-card border border-default rounded-2xl p-8 max-w-2xl w-full">
            <h1 className="text-xl font-bold text-primary mb-4">خطا در اجرا</h1>
            <pre className="bg-surface border border-default rounded-xl p-4 text-sm text-secondary font-mono overflow-auto max-h-60">
              {this.state.error.message}
            </pre>
            <p className="text-muted text-sm mt-4">
              برای رفع مشکل، صفحه را دوباره بارگذاری کنید.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all"
            >
              بارگذاری مجدد
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
