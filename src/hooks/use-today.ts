import { useSyncExternalStore } from "react";
import { toDayKey } from "@/lib/date-rows";

const getSnapshot = (): string => toDayKey(new Date());

const getServerSnapshot = (): null => null;

const subscribe = (onChange: () => void): (() => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  const scheduleNextMidnight = () => {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
    const delay = nextMidnight.getTime() - now.getTime() + 1000;
    timeoutId = setTimeout(() => {
      onChange();
      scheduleNextMidnight();
    }, delay);
  };

  scheduleNextMidnight();

  const handleVisibilityChange = () => {
    onChange();
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    clearTimeout(timeoutId);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
};

export function useToday(): string | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
