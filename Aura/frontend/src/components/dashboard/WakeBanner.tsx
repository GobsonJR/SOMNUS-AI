import { Bell, X } from "lucide-react";

type Props = {
  reason: string;
  onDismiss: () => void;
};

export default function WakeBanner({ reason, onDismiss }: Props) {
  return (
    <div
      role="alert"
      className="bg-brand text-white px-6 py-4 flex items-center justify-between shadow-xl"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
          <Bell className="w-4 h-4 text-white" />
        </div>
        <div>
          <strong className="font-ciberus text-base tracking-wide block">
            Optimal Awakening Triggered
          </strong>
          <span className="font-stenz text-xs text-white/90">
            {reason || "N2 Light Sleep phase confirmed by 3-epoch cardiac stability verification."}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
        aria-label="Dismiss banner"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
