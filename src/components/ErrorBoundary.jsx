import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center h-screen flex items-center justify-center dark:bg-gray-900 dark:text-gray-200">
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-4xl text-red-500 dark:text-red-400">
              Something went wrong.
            </h1>
            <p className="text-lg">
              Please try refreshing the page or contact support if the issue
              persists.
            </p>
            {this.state.error && (
              <details className="text-left">
                <summary className="cursor-pointer">Technical Details</summary>
                <pre className="bg-gray-100 p-2 rounded-md">
                  {this.state.error.toString()}
                </pre>
                <pre className="bg-gray-100 p-2 rounded-md">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
