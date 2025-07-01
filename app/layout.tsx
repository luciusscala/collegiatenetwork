import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["900"], // Black weight
  display: "swap",
});

export const metadata = {
  title: "network",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#02503B] min-h-screen min-w-full flex items-center justify-center">
          {children}
      </body>
    </html>
  );
}
