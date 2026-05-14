import { MachineForm } from "../machine-form";
import Link from "next/link";

export default function NewMachinePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/machines"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Machines
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Nouvelle machine</h1>
      </div>
      <MachineForm mode="create" />
    </div>
  );
}
