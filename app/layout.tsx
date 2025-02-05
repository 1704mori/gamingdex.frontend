export const metadata = {
  title: "GamingDex",
  description: "Join us and start your journey",
};

import "./globals.css";

import { TwitterIcon, InstagramIcon } from "lucide-react";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import Link from "next/link";
import Header from "@/components/header";
import { _QueryClientProvider } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-neutral-900 text-neutral-50 dark:bg-neutral-950 dark:text-neutral-50">
        <Toaster richColors theme="dark" expand position="bottom-left" />
        <NextTopLoader showSpinner={false} />

        <_QueryClientProvider>
          <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex-grow container mx-auto px-4 md:px-6 lg:px-8">
              {children}
            </div>

            <footer className="bg-neutral-900 text-neutral-50 dark:bg-neutral-950 dark:text-neutral-50 py-8">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4">GamingDex</h3>
                    <p className="text-sm">The ultimate gaming destination.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">Company</h3>
                    <ul className="text-sm">
                      <li className="mb-2">
                        <Link className="hover:text-neutral-300" href="#">
                          About
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">Resources</h3>
                    <ul className="text-sm">
                      <li className="mb-2">
                        <Link className="hover:text-neutral-300" href="#">
                          Changelog
                        </Link>
                      </li>
                      <li className="mb-2">
                        <Link className="hover:text-neutral-300" href="#">
                          Community
                        </Link>
                      </li>
                      <li className="mb-2">
                        <Link className="hover:text-neutral-300" href="#">
                          Support
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                      <Link className="hover:text-neutral-300" href="#">
                        <TwitterIcon className="h-6 w-6" />
                      </Link>
                      <Link className="hover:text-neutral-300" href="#">
                        <InstagramIcon className="h-6 w-6" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t border-neutral-800 pt-8 text-center text-sm">
                  <p>© 2024 GamingDex. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </_QueryClientProvider>
      </body>
    </html>
  );
}
