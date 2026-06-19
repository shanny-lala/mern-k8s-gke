import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error.message);
    console.error('[ErrorBoundary] Stack:', info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '40px',
            color: '#ef4444',
            fontFamily: 'monospace',
            background: '#0f172a',
            minHeight: '100vh',
          }}
        >
          <h2 style={{ marginBottom: '16px' }}>Erreur de rendu React</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: '#fca5a5' }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem', color: '#94a3b8', marginTop: '16px' }}>
            {this.state.error?.stack}
          </pre>
          <button
            style={{ marginTop: '24px', padding: '8px 16px', cursor: 'pointer' }}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Reessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
