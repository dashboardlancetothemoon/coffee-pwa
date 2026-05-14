export const runtime = 'edge';
import { createAdminClient } from "@/lib/supabase/server";
import { MachineForm } from "../machine-form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toMachine } from "@/types/database";

export default async function EditMachinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("coffee_machines")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  const machine = toMachine(data);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/machines"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Machines
        </Link>
        <h1 className="text-2xl font-semibold mt-2">
          {machine.brand} {machine.model}
        </h1>
      </div>
      <MachineForm mode="edit" machineId={id} machine={machine} />
    </div>
  );
}
