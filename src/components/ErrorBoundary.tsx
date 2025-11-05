import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    console.error('Component stack:', errorInfo.componentStack);
    
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-2xl w-full">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-destructive flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-destructive mb-2">
                    Something went wrong
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    The application encountered an error. Please try refreshing the page.
                  </p>
                  
                  {this.state.error && (
                    <details className="mb-4">
                      <summary className="cursor-pointer text-sm font-medium mb-2">
                        Error Details (for debugging)
                      </summary>
                      <div className="bg-muted p-4 rounded-md text-xs font-mono overflow-auto">
                        <p className="text-destructive font-semibold mb-2">
                          {this.state.error.toString()}
                        </p>
                        {this.state.errorInfo && (
                          <pre className="whitespace-pre-wrap text-muted-foreground">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        )}
                      </div>
                    </details>
                  )}
                  
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
