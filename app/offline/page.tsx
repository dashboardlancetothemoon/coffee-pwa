export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="text-6xl">☕</div>
      <h1 className="text-xl font-semibold">Vous êtes hors ligne</h1>
      <p className="text-muted-foreground max-w-xs text-sm">
        Vérifiez votre connexion. Les recettes déjà consultées restent
        accessibles via le cache.
      </p>
    </div>
  );
}
