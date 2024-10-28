import type { PressRelease } from "@repo/api/cms/types";
import { cn } from "@/lib/ui/utils";
import PressReleaseCard from "./PressReleaseCard";

type Props = {
  data: PressRelease[];
};

export default function PressReleaseCardView({ data }: Props) {
  return (
    <div
      className={cn(
        "gap-[1.5rem]",
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        "lg:col-span-[1/3] col-span-full",
      )}
    >
      {data.map((item, i) => (
        <PressReleaseCard key={i} data={item} />
      ))}
    </div>
  );
}
