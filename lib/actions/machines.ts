"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { MachineFormSchema } from "@/lib/schemas/machine";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMachine(formData: FormData) {
  const raw = parseFormData(formData);
  const parsed = MachineFormSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createAdminClient();
  const { error } = await supabase.from("coffee_machines").insert(parsed.data);

  if (error) return { error: { _root: [error.message] } };

  revalidatePath("/admin/machines");
  redirect("/admin/machines");
}

export async function updateMachine(id: string, formData: FormData) {
  const raw = parseFormData(formData);
  const parsed = MachineFormSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("coffee_machines")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: { _root: [error.message] } };

  revalidatePath("/admin/machines");
  redirect("/admin/machines");
}

export async function deleteMachine(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("coffee_machines")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/machines");
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseFormData(formData: FormData) {
  return {
    brand: formData.get("brand"),
    model: formData.get("model"),
    category: formData.get("category"),
    parameters: {
      pression_max_bars: formData.get("pression_max_bars") || undefined,
      temperature_min_c: formData.get("temperature_min_c") || undefined,
      temperature_max_c: formData.get("temperature_max_c") || undefined,
      dose_min_g: formData.get("dose_min_g") || undefined,
      dose_max_g: formData.get("dose_max_g") || undefined,
      granulometrie_reglable: formData.get("granulometrie_reglable") === "on",
      buse_vapeur: formData.get("buse_vapeur") === "on",
      reservoir_ml: formData.get("reservoir_ml") || undefined,
      notes: formData.get("notes") || undefined,
    },
  };
}
