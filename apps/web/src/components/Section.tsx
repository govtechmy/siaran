import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Section(props: Props) {
  return (
    <section className={cn("container", props.className)}>
      {props.children}
    </section>
  );
}
