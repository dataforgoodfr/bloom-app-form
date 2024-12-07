import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/providers/i18n-provider";
import NavbarWrapper from "@/components/NavbarWrapper";
import { UserProvider } from "@/contexts/UserContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <I18nProvider>
            <NavbarWrapper />
            {children}
          </I18nProvider>
        </UserProvider>
      </body>
    </html>
  );
}
