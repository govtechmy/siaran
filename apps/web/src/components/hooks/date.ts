import { useAppLocale } from "@/i18n/routing";
import { enGB, ms } from "date-fns/locale";

export function useDateLocale() {
  return useAppLocale() === "en-MY" ? enGB : ms;
}
