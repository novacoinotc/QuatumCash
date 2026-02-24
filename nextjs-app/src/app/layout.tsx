import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QuantumCash | La operadora P2P #1 de Mexico",
  description:
    "QuantumCash - Exchange de criptomonedas profesional. La cuenta P2P mas grande de Mexico. Compra y vende crypto con los mejores precios, rapidez y seguridad. Operadora oficial de NovaCoin.",
  keywords:
    "QuantumCash, crypto, P2P, Mexico, Bitcoin, USDT, exchange, NovaCoin, criptomonedas, comprar bitcoin mexico, vender usdt mexico, exchange p2p mexico",
  metadataBase: new URL("https://quantumcash.mx"),
  openGraph: {
    type: "website",
    url: "https://quantumcash.mx/",
    title: "QuantumCash | La operadora P2P #1 de Mexico",
    description:
      "Compra y vende crypto en pesos mexicanos con los mejores precios. Mas de 83,000 operaciones exitosas. Operadora oficial de NovaCoin.",
    siteName: "QuantumCash",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuantumCash | La operadora P2P #1 de Mexico",
    description:
      "Compra y vende crypto en pesos mexicanos con los mejores precios. Mas de 83,000 operaciones exitosas. Operadora oficial de NovaCoin.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://quantumcash.mx/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "QuantumCash",
  description:
    "Exchange de criptomonedas P2P. La cuenta P2P mas grande de Mexico. Compra y vende crypto con los mejores precios, rapidez y seguridad.",
  url: "https://quantumcash.mx",
  email: "contacto@quantumcash.mx",
  areaServed: {
    "@type": "Country",
    name: "Mexico",
  },
  serviceType: ["Cryptocurrency Exchange", "P2P Trading", "Crypto to MXN"],
  currenciesAccepted: "MXN",
  knowsAbout: ["Bitcoin", "USDT", "Ethereum", "Solana", "USDC"],
  parentOrganization: {
    "@type": "Organization",
    name: "NovaCoin",
    url: "https://www.novacoin.mx",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "2900",
    bestRating: "5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#0B0D17" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
