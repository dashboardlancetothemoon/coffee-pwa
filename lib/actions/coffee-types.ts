"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { CoffeeTypeFormSchema } from "@/lib/schemas/coffee-type";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCoffeeType(formData: FormData) {
  const raw = parseFormData(formData);
  const parsed = CoffeeTypeFormSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createAdminClient();
  const { error } = await supabase.from("coffee_types").insert(parsed.data);

  if (error) return { error: { _root: [error.message] } };

  revalidatePath("/admin/coffee-types");
  redirect("/admin/coffee-types");
}

export async function updateCoffeeType(id: string, formData: FormData) {
  const raw = parseFormData(formData);
  const parsed = CoffeeTypeFormSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("coffee_types")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: { _root: [error.message] } };

  revalidatePath("/admin/coffee-types");
  redirect("/admin/coffee-types");
}

export async function deleteCoffeeType(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("coffee_types").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/coffee-types");
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description") || "",
    ideal_parameters: {
      dose_g: formData.get("dose_g"),
      ratio: formData.get("ratio"),
      mouture: formData.get("mouture"),
      temperature_c: formData.get("temperature_c"),
      pression_bars: formData.get("pression_bars") || undefined,
      temps_extraction_s: formData.get("temps_extraction_s") || undefined,
      lait_ml: formData.get("lait_ml") || undefined,
    },
  };
}
