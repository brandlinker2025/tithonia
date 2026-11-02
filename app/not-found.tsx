import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="wrap shop">
      <h1>Page not found</h1>
      <p>This look has moved, or the link is incomplete.</p>
      <Link className="primary" href="/shop">Back to shop</Link>
    </main>
  );
}
