"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="text-5xl">⚠️</div>
      <h1 className="text-xl font-semibold">Une erreur est survenue</h1>
      <p className="text-sm text-muted-foreground max-w-xs">
        Quelque chose s&apos;est mal passé. Réessayez ou revenez plus tard.
      </p>
      <Button variant="outline" onClick={reset}>
        Réessayer
      </Button>
    </div>
  );
}
