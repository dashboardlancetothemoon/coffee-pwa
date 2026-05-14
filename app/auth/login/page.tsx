"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { clientLogin } from "@/lib/actions/client-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

  const [actionError, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      const result = await clientLogin(formData);
      return result?.error ?? null;
    },
    null
  );

  const error = actionError ?? (callbackError === "confirmation_failed"
    ? "Le lien de confirmation a expiré. Essayez de vous reconnecter."
    : null);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="text-4xl mb-2">☕</div>
        <CardTitle>Connexion</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          {error && (
            <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          <Button type="submit" disabled={pending} className="mt-1">
            {pending ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Pas encore de compte ?{" "}
          <Link href="/auth/signup" className="underline">
            Créer un compte
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
