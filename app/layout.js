import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/components/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MLM Mobile App",
  description: "A premium MLM platform with multi-level commissions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <main id="app-container">
              {children}
              <BottomNav />
            </main>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}


