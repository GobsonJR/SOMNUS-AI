type Props = {
  label: string;
  value: string | number | null;
  unit?: string;
};

export default function MetricCard({ label, value, unit }: Props) {
  return (
    <div className="card hover:shadow-md transition-all duration-300">
      <p className="font-stenz text-xs uppercase tracking-widest text-muted-ink font-medium">{label}</p>
      <p className="mt-2 font-ciberus text-2xl sm:text-3xl font-normal text-ink">
        {value ?? "—"}
        {unit && value != null ? <span className="ml-1.5 font-stenz text-sm text-muted-ink font-normal">{unit}</span> : null}
      </p>
    </div>
  );
}
