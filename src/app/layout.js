import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Countries & Chat",
  description: "Manage countries and chat with other users.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors closeButton position="top-right" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
