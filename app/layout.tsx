import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Letterboxd x Last.fm Mood Match",
  description: "Correlacao semanal entre filmes vistos e artistas ouvidos.",
};

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/timeline", label: "Timeline" },
  { href: "/insights", label: "Insights" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="shell">
          <header className="topbar">
            <Link className="brand" href="/">
              <span className="brand-mark">M</span>
              <span>
                <strong>Mood Match</strong>
                <small>Letterboxd x Last.fm</small>
              </span>
            </Link>
            <nav aria-label="Principal">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
