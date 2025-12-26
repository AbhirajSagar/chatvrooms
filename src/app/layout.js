import { Outfit } from "next/font/google";
import ClientLoader from '@/components/ClientLoader'
import AnimatedModal from "@/components/AnimatedModal";
import "./globals.css";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400"],
})

export const metadata = {
  title: "Chatvroom",
  description: "Realtime Collaborative Coding Platform",
};

export default function RootLayout({ children }) 
{
  return (
    <html lang="en">
      <body className={`${outfit.variable} bg-background-alt dark:bg-background-dark antialiased`}>
        {/* For Handing Loading Animation */}
        <ClientLoader>
          {children}
        </ClientLoader>
      </body>
    </html>
  );
}
