import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

const STORAGE_KEY = "postpostcard:anonymousUserId";

const newId = () => `anonymous-${nanoid()}`;

/**
 * Replaces the old `users.getUniqueUserId` tRPC query. The id identifies a
 * signed-out visitor so their own private postcards keep showing up; it is
 * generated once and then kept in localStorage.
 *
 * Returns `undefined` on the server and on the first client render, so callers
 * can skip queries until it is known (the tRPC query behaved the same way).
 */
export function readAnonymousUserId(): string {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }
    const generated = newId();
    window.localStorage.setItem(STORAGE_KEY, generated);
    return generated;
  } catch {
    // private mode / storage disabled: use a fresh id for this page view
    return newId();
  }
}

export function useAnonymousUserId(): string | undefined {
  const [anonymousUserId, setAnonymousUserId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    setAnonymousUserId(readAnonymousUserId());
  }, []);

  return anonymousUserId;
}
