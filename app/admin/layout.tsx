export const runtime = 'edge';
import Link from "next/link";
import { adminLogout } from "@/lib/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/admin" className="font-semibold">
            ☕ Admin
          </Link>
          <Link
            href="/admin/machines"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Machines
          </Link>
          <Link
            href="/admin/coffee-types"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Cafés
          </Link>
        </nav>
        <form action={adminLogout}>
          <Button variant="ghost" size="sm" type="submit">
            Déconnexion
          </Button>
        </form>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
