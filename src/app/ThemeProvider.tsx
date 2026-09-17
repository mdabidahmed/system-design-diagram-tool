import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemePreference = "light" | "dark" | "system";

interface ThemeContextValue {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  cyclePreference: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "sda:theme-preference";

function readStoredPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage can throw in private mode / blocked storage — fall back silently.
  }
  return "system";
}

function applyPreferenceToDocument(pref: ThemePreference) {
  const root = document.documentElement;
  if (pref === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", pref);
  }
}

const ORDER: ThemePreference[] = ["system", "light", "dark"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readStoredPreference(),
  );

  useEffect(() => {
    applyPreferenceToDocument(preference);
    try {
      window.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // ignore — per-viewer convenience only
    }
  }, [preference]);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
  }, []);

  const cyclePreference = useCallback(() => {
    setPreferenceState((current) => {
      const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, setPreference, cyclePreference }),
    [preference, setPreference, cyclePreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
