import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("somnus-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = (choice: string) => {
    localStorage.setItem("somnus-cookie-consent", choice);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-medium border border-line bg-surface p-4 shadow-sm md:left-auto">
      <p className="text-sm text-muted-ink">
        We use essential cookies to keep the site working. Optional analytics help us understand how people use it.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="button-primary" onClick={() => accept("all")}>Accept optional cookies</button>
        <button type="button" className="button-secondary" onClick={() => accept("essential")}>Use essential only</button>
      </div>
    </div>
  );
}
