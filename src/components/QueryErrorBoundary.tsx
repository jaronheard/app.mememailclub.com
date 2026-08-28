import { Component, type ErrorInfo, type ReactNode } from "react";
import NextError from "next/error";

/**
 * Convex queries throw on failure instead of handing back an error object, so
 * the error branch that used to live inside `DefaultQueryCell` lives here.
 * The rendered UI is unchanged: `next/error` with the error message as title.
 */
type Props = {
  children: ReactNode;
  /** Changing this remounts the boundary (used to reset on navigation). */
  resetKey?: string;
};

type State = { message: string | null };

export default class QueryErrorBoundary extends Component<Props, State> {
  state: State = { message: null };

  static getDerivedStateFromError(error: unknown): State {
    return {
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.message) {
      this.setState({ message: null });
    }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("query error", error, info);
  }

  render() {
    if (this.state.message !== null) {
      return <NextError title={this.state.message} statusCode={500} />;
    }
    return this.props.children;
  }
}
