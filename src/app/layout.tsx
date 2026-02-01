/* eslint-disable import/order */
import type {Metadata} from "next";

import {Link} from "@heroui/react";

import {GitHubIcon} from "@/components/github";
import {Logo as HeroLogo} from "@/components/hero-logo";
import {ThemeToggle} from "@/components/theme-toggle";
import {env} from "@/lib/env";

import {Providers} from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  title: "NPM Video",
  description: "Show off your npm package downloads with a vibrant animated video.",
  openGraph: {
    title: "NPM Video",
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
    title: "NPM Video",
    description: "Show off your npm package downloads with a vibrant animated video.",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Providers themeProps={{attribute: "class", defaultTheme: "dark"}}>
          <header className="w-full">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <a rel="noopener" target="_blank" href="https://heroui.com?ref=npmvideo.com">
                  <HeroLogo isCompact isotipoHeight={26} />
                </a>
                <svg
                  data-testid="geist-icon"
                  height="16"
                  strokeLinejoin="round"
                  className="text-muted"
                  style={{width: "16px", height: "16px"}}
                  viewBox="0 0 16 16"
                  width="16"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.01526 15.3939L4.3107 14.7046L10.3107 0.704556L10.6061 0.0151978L11.9849 0.606077L11.6894 1.29544L5.68942 15.2954L5.39398 15.9848L4.01526 15.3939Z"
                    fill="currentColor"
                  ></path>
                </svg>

                <h1 className="text-md font-semibold uppercase">NPM Video</h1>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="https://github.com/heroui-inc/npm-video?ref=npmvideo.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-default transition-colors"
                >
                  <GitHubIcon className="w-4 h-4" />
                  GitHub
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="py-8 md:py-16 lg:py-20 flex-1 flex flex-col gap-8 justify-start items-center w-full px-4">
            {children}
          </main>
        </Providers>
        <footer className="w-full mt-auto">
          <div className="container mx-auto px-4 py-6 flex justify-center items-center gap-2 flex-col text-center text-sm">
            <div className="flex items-center gap-2 opacity-50">
              <span>Powered by</span>
              <a
                href="https://heroui.com?ref=npmvideo.com"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:opacity-80 transition-opacity"
              >
                <HeroLogo height={24} autoResize={false} />
                <span className="sr-only">HeroUI</span>
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
