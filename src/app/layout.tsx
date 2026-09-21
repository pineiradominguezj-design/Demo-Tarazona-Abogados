import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { APP } from "@/config/identity";

/*
 * La tipografía es la única pieza del tema que NO puede vivir en
 * `config/theme.css`: `next/font/google` necesita un import estático, así que
 * no se puede elegir la fuente desde un dato. Cambiarla son dos ediciones que
 * van juntas: el import de aquí y `--font-sans` en `config/theme.css`.
 */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: APP.metaTitle,
  description: APP.metaDescription,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
