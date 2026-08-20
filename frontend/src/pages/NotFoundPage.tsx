import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-brand">404</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted-ink">The page you requested does not exist.</p>
      <Link to="/" className="button-primary mt-8">Back home</Link>
    </div>
  );
}
