import { Geist, Geist_Mono } from "next/font/google";
import NavMenu from "@/app/components/NavMenu";
import ChatWidget from "./components/ChatWidget";
import AudioPlayer from "./components/AudioPlayer";
import { AudioPlayerProvider } from "@/lib/AudioPlayerContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AudioPlayerProvider>
          <NavMenu />
          <ChatWidget />
          <AudioPlayer />
          <div className="pr-80">
            <div className="flex justify-center mt-8">
              <img
                src="/hc-news-anchors.png"
                alt="However Comma"
                className="w-1/2 object-contain"
              />
            </div>
            {children}
          </div>
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
