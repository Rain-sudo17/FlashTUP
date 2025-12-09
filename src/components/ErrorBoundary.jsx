import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-lg w-full text-center text-white">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
            <p className="text-white text-opacity-80 mb-6">
              The application encountered an unexpected error.
            </p>
            
            <div className="bg-black bg-opacity-30 p-4 rounded-lg text-left mb-6 overflow-auto max-h-40 text-xs font-mono">
              {this.state.error && this.state.error.toString()}
            </div>

            <button 
              onClick={this.handleReload} 
              className="btn btn-gradient w-full"
            >
              🔄 Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;