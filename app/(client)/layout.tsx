export const runtime = 'edge';
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BottomNav } from "./bottom-nav";
import { InstallPrompt } from "@/components/install-prompt";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
      <InstallPrompt />
    </div>
  );
}
