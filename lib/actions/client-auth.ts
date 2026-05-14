"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function clientSignup(
  formData: FormData
): Promise<{ error: string } | never> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const machineId = formData.get("machine_id") as string;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Supabase will redirect here after email confirmation
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Inscription échouée" };

  // Set machine on profile — works whether session exists now or after email confirm
  if (machineId && data.user.id) {
    const admin = await createAdminClient();
    await admin
      .from("profiles")
      .update({ machine_id: machineId })
      .eq("id", data.user.id);
  }

  // If email confirmation is required, Supabase returns a user but no session.
  // Show a "check your email" message instead of redirecting to a protected page.
  if (!data.session) {
    redirect("/auth/confirm-email");
  }

  redirect("/catalogue");
}

export async function clientLogin(
  formData: FormData
): Promise<{ error: string } | never> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect("/catalogue");
}

export async function clientLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
