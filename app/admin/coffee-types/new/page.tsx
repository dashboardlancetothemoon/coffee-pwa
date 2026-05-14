import { CoffeeTypeForm } from "../coffee-type-form";
import Link from "next/link";

export default function NewCoffeeTypePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/coffee-types"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Types de café
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Nouveau café</h1>
      </div>
      <CoffeeTypeForm mode="create" />
    </div>
  );
}
