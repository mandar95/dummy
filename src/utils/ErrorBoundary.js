import React, { Component } from 'react'
import swal from 'sweetalert';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    console.info({
      error: error,
      errorInfo: errorInfo
    })

    if (error?.message && /Loading chunk [\d]+ failed/.test(error.message)) {
      window.location.reload();
    } else {
      !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') &&
        swal('Alert!', 'An error has occured.', 'error').then((() => window.location.reload()))
    }
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? (
        <div>
          <h2>Error Occured.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      ) : null;
    }
    // Normally, just render children
    return this.props.children;
  }
}
