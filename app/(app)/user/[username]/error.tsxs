"use client";
import Image from "next/image"

export default function Error({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="grid place-items-center mb-16">
      <div className="flex items-center gap-1">
        <Image
          src="/logo_mini.svg"
          alt="Logo"
          width={64}
          height={64}
          className="rotate-12"
        />
        <Image
          src="/logo_name.svg"
          alt="Logo"
          width={128}
          height={64}
          quality={100}
          className="-rotate-12"
        />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-semibold">Oops!</h1>
        <p className="text-xl font-medium">This profile doesn{"'"}t exist.</p>
      </div>
    </div>
  )
}
