import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Container(props: Props) {
  return (
    <section className={cn("container", "p-[1.125rem]", props.className)}>
      {props.children}
    </section>
  );
}
