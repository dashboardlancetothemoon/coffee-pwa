export const runtime = 'edge';
import { createClient } from "@/lib/supabase/server";
import { toMachine } from "@/types/database";
import { MachineSelector } from "./machine-selector";
import { clientLogout } from "@/lib/actions/client-auth";
import { Button } from "@/components/ui/button";

export default async function ProfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: machinesRaw }, { data: profile }] = await Promise.all([
    supabase.from("coffee_machines").select("*").order("brand"),
    supabase
      .from("profiles")
      .select("machine_id")
      .eq("id", user!.id)
      .single(),
  ]);

  const machines = (machinesRaw ?? []).map(toMachine);
  const currentMachineId = profile?.machine_id ?? null;
  const currentMachine = machines.find((m) => m.id === currentMachineId);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Profil</h1>
      <p className="text-sm text-muted-foreground mb-6">{user!.email}</p>

      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Ma machine
        </h2>

        {currentMachine && (
          <div className="rounded-xl border bg-card px-4 py-3 mb-4">
            <p className="font-medium">
              {currentMachine.brand} {currentMachine.model}
            </p>
            <p className="text-sm text-muted-foreground capitalize">
              {currentMachine.category.replace("_", " ")}
            </p>
          </div>
        )}

        <MachineSelector machines={machines} currentMachineId={currentMachineId} />
      </section>

      <section>
        <form action={clientLogout}>
          <Button variant="outline" type="submit" className="w-full">
            Se déconnecter
          </Button>
        </form>
      </section>
    </div>
  );
}
