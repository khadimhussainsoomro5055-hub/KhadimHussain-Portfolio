import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khadim Hussain | Software Engineer & Developer",
  description: "Portfolio of Khadim Hussain, Software Engineering student at Sukkur IBA University.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
