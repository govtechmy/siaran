import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <div className="flex flex-col text-fd-muted-foreground">
        <Link
          href="/ms-MY/docs/auth/login"
          className="text-fd-foreground font-semibold underline"
        >
          B. Malaysia
        </Link>
        <Link
          href="/en-MY/docs/auth/login"
          className="text-fd-foreground font-semibold underline"
        >
          English
        </Link>
      </div>
    </main>
  );
}
