"use client";

import { useActionState, useEffect, useState } from "react";
import { clientSignup } from "@/lib/actions/client-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { CoffeeMachine } from "@/types/database";

export default function SignupPage() {
  const [machines, setMachines] = useState<CoffeeMachine[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    fetch("/api/machines")
      .then((r) => r.json())
      .then(setMachines)
      .catch(() => {});
  }, []);

  const filtered = machines.filter((m) =>
    `${m.brand} ${m.model}`.toLowerCase().includes(search.toLowerCase())
  );

  const [error, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      const result = await clientSignup(formData);
      return result?.error ?? null;
    },
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">☕</div>
          <CardTitle>Créer un compte</CardTitle>
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
              <Input id="password" name="password" type="password" autoComplete="new-password" minLength={6} required />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Votre machine</Label>
              <Input
                placeholder="Rechercher une machine…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && filtered.length > 0 && (
                <div className="border rounded-md max-h-48 overflow-y-auto divide-y">
                  {filtered.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(m.id);
                        setSearch(`${m.brand} ${m.model}`);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                        selectedId === m.id ? "bg-muted font-medium" : ""
                      }`}
                    >
                      {m.brand} {m.model}
                    </button>
                  ))}
                </div>
              )}
              {search && filtered.length === 0 && (
                <p className="text-xs text-muted-foreground px-1">Aucune machine trouvée.</p>
              )}
              <input type="hidden" name="machine_id" value={selectedId} />
              {selectedId && (
                <p className="text-xs text-muted-foreground">
                  Machine sélectionnée — vous pourrez la modifier plus tard.
                </p>
              )}
            </div>

            <Button type="submit" disabled={pending} className="mt-1">
              {pending ? "Création…" : "Créer mon compte"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="underline">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
