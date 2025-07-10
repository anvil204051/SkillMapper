import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Aurora from "@/components/Aurora";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SkillMapper - Your Path to Any Career",
  description:
    "Get personalized learning roadmaps for any career path. From chef to teacher, designer to entrepreneur - we'll show you exactly what to learn.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Aurora
            colorStops={["#3366FF", "#33FFDD", "#7733FF"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
          <div style={{ position: 'relative', zIndex: 10 }}>
            {children}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
