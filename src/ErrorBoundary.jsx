import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught runtime error in AI Knowledge Base:", error, errorInfo);
    // #region agent log
    fetch('http://127.0.0.1:7939/ingest/11e91471-d03c-4845-97c7-dda683ded1d4',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'262cb1'},body:JSON.stringify({sessionId:'262cb1',runId:'post-fix',hypothesisId:'A',location:'ErrorBoundary.jsx:componentDidCatch',message:'Caught render error',data:{errorMessage:String(error?.message||error),errorName:error?.name,componentStack:(errorInfo?.componentStack||'').slice(0,500),mentionsSectionLabel:String(error?.message||'').includes('sectionLabel')},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0b0c10',
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: '#161922',
            border: '1px solid rgba(224, 108, 117, 0.3)',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚨</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#e06c75', marginBottom: '0.75rem' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              An unexpected rendering exception occurred in the AI Systems Knowledge Base application.
            </p>
            {this.state.error && (
              <pre style={{
                backgroundColor: '#0a0a0f',
                color: '#e06c75',
                padding: '1rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                border: '1px solid #2a2d3d'
              }}>
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              style={{
                backgroundColor: '#c9a84c',
                color: '#0b0c10',
                border: 'none',
                padding: '0.75rem 1.75rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
