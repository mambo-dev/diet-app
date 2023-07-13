import { Toaster } from "react-hot-toast";
import { cn } from "./components/utils/cn";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Healthy Haven",
  description: "Let's help you achieve your health goals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("bg-white text-slate-900 antialiased", inter.className)}
    >
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 antialiased">
        {children}
        <Toaster position="top-right" />
        <div className="h-40 md:hidden" />
      </body>
    </html>
  );
}
