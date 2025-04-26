import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center h-screen flex items-center justify-center">
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-4xl text-red-500">Something went wrong.</h1>
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
