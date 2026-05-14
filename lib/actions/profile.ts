"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateMachinePreference(formData: FormData) {
  const machineId = formData.get("machine_id") as string;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase
    .from("profiles")
    .update({ machine_id: machineId || null })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/catalogue");
  revalidatePath("/profil");
  return { success: true };
}
