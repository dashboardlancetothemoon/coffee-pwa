"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosBanner, setShowIosBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Already installed — don't show
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if ((navigator as { standalone?: boolean }).standalone) return;

    const dismissed = sessionStorage.getItem("install-dismissed");
    if (dismissed) return;

    // Android / Chrome — beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS Safari detection
    const isIos =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(navigator as { standalone?: boolean }).standalone;
    if (isIos) setShowIosBanner(true);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    sessionStorage.setItem("install-dismissed", "1");
    setDeferredPrompt(null);
    setShowIosBanner(false);
    setDismissed(true);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") dismiss();
  }

  if (dismissed) return null;

  if (deferredPrompt) {
    return (
      <Banner onDismiss={dismiss}>
        <p className="text-sm font-medium">Installer Café Guide</p>
        <p className="text-xs text-muted-foreground">
          Accès rapide depuis votre écran d&apos;accueil, même hors ligne.
        </p>
        <button
          onClick={install}
          className="mt-2 rounded-lg bg-primary text-primary-foreground text-sm px-4 py-1.5 font-medium"
        >
          Installer
        </button>
      </Banner>
    );
  }

  if (showIosBanner) {
    return (
      <Banner onDismiss={dismiss}>
        <p className="text-sm font-medium">Installer Café Guide</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Appuyez sur{" "}
          <span className="font-semibold">
            Partager <ShareIcon />
          </span>{" "}
          puis{" "}
          <span className="font-semibold">« Sur l&apos;écran d&apos;accueil »</span>.
        </p>
      </Banner>
    );
  }

  return null;
}

function Banner({
  children,
  onDismiss,
}: {
  children: React.ReactNode;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed bottom-20 inset-x-4 z-50 rounded-2xl border bg-background shadow-lg px-4 py-3 flex gap-3">
      <div className="text-2xl">☕</div>
      <div className="flex-1 flex flex-col gap-0.5">{children}</div>
      <button
        onClick={onDismiss}
        className="self-start text-muted-foreground hover:text-foreground text-lg leading-none"
        aria-label="Fermer"
      >
        ×
      </button>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      className="inline-block w-3.5 h-3.5 align-middle mx-0.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
