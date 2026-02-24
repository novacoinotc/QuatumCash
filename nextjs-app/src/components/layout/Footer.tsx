import { FOOTER_NAV, FOOTER_SERVICES, FOOTER_ECOSYSTEM } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--dark-border)] bg-[var(--dark)] py-16">
      {/* Top line with gradient */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--purple)]/30 to-transparent" />

      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="#" className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--blue)] via-[var(--purple)] to-[var(--pink)] font-bold text-white">
                Q
              </span>
              <span className="font-[var(--font-primary)] text-lg font-bold text-white">
                Quantum<span className="gradient-text">Cash</span>
              </span>
            </a>
            <p className="text-sm text-[var(--gray-500)]">
              La cuenta P2P mas grande de Mexico. Operadora oficial de
              NovaCoin.mx
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 font-[var(--font-primary)] text-sm font-semibold text-white">
              Navegacion
            </h4>
            <div className="flex flex-col gap-2">
              {FOOTER_NAV.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[var(--gray-500)] transition-colors hover:text-[var(--purple-light)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-[var(--font-primary)] text-sm font-semibold text-white">
              Servicios
            </h4>
            <div className="flex flex-col gap-2">
              {FOOTER_SERVICES.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[var(--gray-500)] transition-colors hover:text-[var(--purple-light)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="mb-4 font-[var(--font-primary)] text-sm font-semibold text-white">
              Ecosistema
            </h4>
            <div className="flex flex-col gap-2">
              {FOOTER_ECOSYSTEM.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener" : undefined}
                  className="text-sm text-[var(--gray-500)] transition-colors hover:text-[var(--purple-light)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--dark-border)] pt-8 sm:flex-row">
          <p className="text-xs text-[var(--gray-600)]">
            &copy; 2025 QuantumCash. Todos los derechos reservados.
          </p>
          <p className="text-xs text-[var(--gray-600)]">
            Powered by{" "}
            <a
              href="https://www.novacoin.mx"
              target="_blank"
              rel="noopener"
              className="text-[var(--purple-light)] hover:underline"
            >
              NovaCoin.mx
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
