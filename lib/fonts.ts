import { Inter, Lato } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900", "100", "300"],
});
