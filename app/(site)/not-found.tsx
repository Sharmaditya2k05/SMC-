import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid-paper">
      <div className="wrap flex min-h-[70vh] flex-col items-start justify-center pb-20 pt-36">
        <p className="font-serif text-7xl text-blue">404</p>
        <h1 className="h2 mt-4">This page has no solution.</h1>
        <p className="lede mt-4">The page you were looking for does not exist or has moved.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">Go to Home</Link>
          <Link href="/study-material" className="btn btn-outline">Get Study Material</Link>
        </div>
      </div>
    </section>
  );
}
