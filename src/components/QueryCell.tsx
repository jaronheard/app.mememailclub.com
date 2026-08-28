import type { JSX } from "react";

/**
 * Minimal replacement for the old tRPC/react-query `DefaultQueryCell`.
 *
 * Convex's `useQuery` returns `undefined` while loading and throws when the
 * query fails, so a cell only has to pick between loading / empty / success.
 * Errors are caught by `QueryErrorBoundary` (mounted in `_app`), which renders
 * the same `next/error` page the old cell rendered inline.
 */
type JSXElementOrNull = JSX.Element | null;

type QueryCellProps<TData> = {
  /** `undefined` means "still loading" (Convex's loading sentinel). */
  data: TData | undefined;
  loading?: () => JSXElementOrNull;
  /** Rendered when the data is `null`-ish or an empty array. */
  empty?: () => JSXElementOrNull;
  success: (data: NonNullable<TData>) => JSXElementOrNull;
};

export default function QueryCell<TData>({
  data,
  loading,
  empty,
  success,
}: QueryCellProps<TData>): JSXElementOrNull {
  if (data === undefined) {
    return loading ? loading() : <div />;
  }

  if (
    empty &&
    (data === null || (Array.isArray(data) && data.length === 0))
  ) {
    return empty();
  }

  return success(data as NonNullable<TData>);
}
