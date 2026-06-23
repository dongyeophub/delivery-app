import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/components/CartContext";
import BackgroundDecor from "@/components/BackgroundDecor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "한입배달",
  description: "컴퓨터과학개론 기말 프로젝트 - 배달앱",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundDecor />
        <CartProvider>
          <Header />
          <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
