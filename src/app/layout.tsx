import type {Metadata} from "next";

import {Button} from "@heroui/button";

import {ThemeToggle} from "@/components/theme-toggle";
import {env} from "@/lib/env";

import {Providers} from "./providers";
import "./globals.css";

import {HeroUILogo} from "@/components/heroui-logo";
import {GitHubIcon} from "@/components/github";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  title: "NPM Downloads Video",
  description: "Show off your npm package downloads with a vibrant animated video.",
  openGraph: {
    title: "NPM Downloads Video",
    description: "Show off your npm package downloads with a vibrant animated video.",
    images: `/banner.png`,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@hero_ui",
    site: "@hero_ui",
    images: `/banner.png`,
    title: "NPM Downloads Video",
    description: "Show off your npm package downloads with a vibrant animated video.",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers themeProps={{attribute: "class", defaultTheme: "dark"}}>
          <header className="w-full">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <h1 className="text-lg font-semibold">NPM Downloads Video</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="light"
                  as="a"
                  href="https://github.com/heroui-inc/npm-video?ref=npmvideo.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  startContent={<GitHubIcon className="w-4 h-4" />}
                >
                  GitHub
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="py-8 md:py-16 lg:py-20 flex-1 flex flex-col gap-8 justify-center items-center w-full px-4">
            {children}
          </main>
        </Providers>
        <footer className="w-full mt-auto">
          <div className="container mx-auto px-4 py-6 flex justify-center items-center gap-2 flex-col text-center text-sm">
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <a
                href="https://heroui.com?ref=npmvideo.com"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:opacity-80 transition-opacity"
              >
                <HeroUILogo />
                <span className="sr-only">HeroUI</span>
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
