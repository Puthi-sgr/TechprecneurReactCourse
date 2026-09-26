import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  section: string
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`The ${this.props.section} section failed.`, error, info.componentStack)
  }

  private retry = () => this.setState({ hasError: false })

  render() {
    if (this.state.hasError) {
      return (
        <section role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <h2 className="font-semibold">{this.props.section} is temporarily unavailable</h2>
          <p className="mt-1 text-sm text-amber-800">This section hit an unexpected error. The rest of the app is still available.</p>
          <button type="button" onClick={this.retry} className="mt-4 rounded-lg bg-amber-900 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800">
            Try again
          </button>
        </section>
      )
    }
    return this.props.children
  }
}
