import { cn } from "@/lib/ui/utils";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo } from "react";

type Props = {
  shortcut: string;
  disabled?: boolean;
  className?: string;
  onShortcutPressed?: () => void;
};

export default function PressToSearch({
  shortcut,
  disabled,
  className,
  onShortcutPressed,
}: Props) {
  const t = useTranslations();

  const onKeyDown = useCallback(
    function onKeyDown(e: KeyboardEvent) {
      if (disabled) {
        return;
      }

      if (e.key === shortcut && onShortcutPressed) {
        e.preventDefault();
        onShortcutPressed();
      }
    },
    [onShortcutPressed],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <span
      className={cn(
        "text-sm text-gray-500",
        "font-normal",
        "pointer-events-none",
        "select-none",
        className,
      )}
    >
      {t.rich("components.PressToSearch.label", {
        shortcut: () => (
          <span
            className={cn(
              "rounded-[0.375rem] border",
              "px-[0.375rem] py-[0.125rem]",
              "text-focus_white-100 text-xs",
              "font-medium",
              "shadow-[0_1px_3px_0_rgba(0,0,0,0.07)]",
            )}
          >
            {shortcut}
          </span>
        ),
      })}
    </span>
  );
}
