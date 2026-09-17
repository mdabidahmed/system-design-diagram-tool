import { useTheme } from "@/app/ThemeProvider";
import { IconButton } from "@/components/atoms/IconButton";
import { SunIcon, MoonIcon, SystemIcon } from "./icons";

const LABELS = {
  system: "Theme: matching system — click for light",
  light: "Theme: light — click for dark",
  dark: "Theme: dark — click for system",
} as const;

export function ThemeToggle() {
  const { preference, cyclePreference } = useTheme();

  const Icon =
    preference === "light" ? SunIcon : preference === "dark" ? MoonIcon : SystemIcon;

  return (
    <IconButton label={LABELS[preference]} onClick={cyclePreference}>
      <Icon />
    </IconButton>
  );
}
