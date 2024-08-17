import { DatabaseIcon } from "lucide-react";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-6 py-12">
      <div className="flex flex-col gap-4 self-start min-w-52">
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-lg -mb-1">About</span>
          <Link
            href="/game-data"
            className="flex items-center gap-1 text-sm font-medium p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800"
          >
            <DatabaseIcon className="w-4 h-4" />
            Game Data
          </Link>
          <Link
            href="/terms-of-service"
            className="flex items-center gap-1 text-sm font-medium p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy-policy"
            className="flex items-center gap-1 text-sm font-medium p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800"
          >
            Privacy Policy
          </Link>
          <Link
            href="/review-policy"
            className="flex items-center gap-1 text-sm font-medium p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800"
          >
            Review Policy
          </Link>
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
