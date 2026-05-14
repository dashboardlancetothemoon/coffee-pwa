import Link from "next/link";

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div className="max-w-sm flex flex-col items-center gap-4">
        <div className="text-5xl">📧</div>
        <h1 className="text-xl font-semibold">Vérifiez votre email</h1>
        <p className="text-sm text-muted-foreground">
          Un lien de confirmation a été envoyé à votre adresse. Cliquez dessus
          pour activer votre compte et accéder à vos recettes.
        </p>
        <p className="text-xs text-muted-foreground">
          Déjà confirmé ?{" "}
          <Link href="/auth/login" className="underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
