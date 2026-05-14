import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="text-5xl">☕</div>
      <h1 className="text-xl font-semibold">Page introuvable</h1>
      <p className="text-sm text-muted-foreground max-w-xs">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/" className="text-sm underline">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
