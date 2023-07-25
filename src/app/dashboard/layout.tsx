import { Toaster } from "react-hot-toast";
import "../globals.css";
import { Inter } from "next/font/google";
import { cn } from "../../components/utils/cn";
import SideBar from "../../components/dashboard/side-bar-nav/side-bar";
import { cookies } from "next/headers";
import verifyAuth from "../../lib/auth";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Healthy Haven",
  description: "Let's help you achieve your health goals",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = cookies();

  const access_token = cookie.get("access_token");

  const { user, error } = await verifyAuth(access_token?.value);

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <html
      lang="en"
      className={cn("bg-white text-slate-900 antialiased", inter.className)}
    >
      <body className="min-h-screen bg-white dark:bg-slate-900 antialiased flex items-start">
        <SideBar />
        <div className="flex-1">{children}</div>
        <Toaster position="top-right" />
        <div className="h-40 md:hidden" />
      </body>
    </html>
  );
}
