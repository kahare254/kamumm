import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  onClose: () => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class VRErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('VR Component Error:', error);
    console.error('Error Info:', errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-w-2xl mx-auto p-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Card className="p-8 bg-card/90 backdrop-blur-md border border-red-500/20">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                    <h2 className="text-2xl font-bold text-red-500">VR Experience Error</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={this.props.onClose}
                    className="hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <h3 className="font-semibold text-red-400 mb-2">What happened?</h3>
                    <p className="text-sm text-muted-foreground">
                      The 3D VR Memorial Garden encountered a technical error and couldn't load properly.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h3 className="font-semibold text-blue-400 mb-2">Possible causes:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• WebGL not supported by your browser</li>
                      <li>• Graphics drivers need updating</li>
                      <li>• Browser hardware acceleration disabled</li>
                      <li>• Insufficient GPU memory</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h3 className="font-semibold text-green-400 mb-2">Try these solutions:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Refresh the page and try again</li>
                      <li>• Enable hardware acceleration in browser settings</li>
                      <li>• Update your browser to the latest version</li>
                      <li>• Try a different browser (Chrome, Firefox, Edge)</li>
                    </ul>
                  </div>
                  
                  {this.state.error && (
                    <details className="p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
                      <summary className="font-semibold text-gray-400 cursor-pointer mb-2">
                        Technical Details (for developers)
                      </summary>
                      <pre className="text-xs text-gray-300 overflow-auto max-h-32">
                        {this.state.error.toString()}
                        {this.state.errorInfo?.componentStack}
                      </pre>
                    </details>
                  )}
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => window.location.reload()} 
                      className="flex-1"
                    >
                      Refresh Page
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={this.props.onClose}
                      className="flex-1"
                    >
                      Close VR Experience
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      );
    }

    return this.props.children;
  }
}
