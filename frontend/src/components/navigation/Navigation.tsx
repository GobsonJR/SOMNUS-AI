import { useState } from "react";
import { useCloudNavigate } from "../experience/CloudTunnelTransition";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const { navigateWithClouds } = useCloudNavigate();

  return (
    <header className="border-b border-line bg-canvas">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4" aria-label="Main">
        <button
          onClick={() => navigateWithClouds("/")}
          className="font-ciberus text-2xl font-bold tracking-wider text-ink cursor-pointer"
        >
          Somnus AI
        </button>

        <div className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => navigateWithClouds("#sticky-notes-section", false)}
            className="text-sm font-nineties uppercase tracking-wider text-muted-ink transition hover:text-brand cursor-pointer"
          >
            Architecture
          </button>
          <button
            onClick={() => navigateWithClouds("#landing-page-section", false)}
            className="text-sm font-nineties uppercase tracking-wider text-muted-ink transition hover:text-brand cursor-pointer"
          >
            How it works
          </button>
          <button
            onClick={() => navigateWithClouds("/dashboard")}
            className="text-sm font-nineties uppercase tracking-wider text-muted-ink transition hover:text-brand cursor-pointer"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigateWithClouds("/dashboard")}
            className="button-primary"
          >
            Set alarm
          </button>
        </div>

        <button
          type="button"
          className="rounded-small border border-line px-3 py-2 text-sm md:hidden font-nineties"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
      </nav>

      {open && (
        <div className="border-t border-line px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3 font-nineties text-sm uppercase">
            <button
              onClick={() => {
                setOpen(false);
                navigateWithClouds("#sticky-notes-section", false);
              }}
              className="text-left py-1 text-muted-ink hover:text-brand"
            >
              Architecture
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigateWithClouds("#landing-page-section", false);
              }}
              className="text-left py-1 text-muted-ink hover:text-brand"
            >
              How it works
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigateWithClouds("/dashboard");
              }}
              className="text-left py-1 text-muted-ink hover:text-brand"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
