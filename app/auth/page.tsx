"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Loader2, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AuthPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      setLoading(true)
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (err) {
      setError("We couldn't start Google sign in. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937,_#0f172a)] px-4 py-16 text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-12 md:flex-row">
        <section className="text-center md:text-left">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 px-4 py-1 text-sm uppercase tracking-wide text-indigo-200">
            <ShieldCheck className="h-4 w-4" />
            Secure Access
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
            Sign in to unlock your personalized SkillMapper roadmap.
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-200">
            Connect with Google to sync your progress, save curated resources, and pick up right where you left off.
          </p>
        </section>

        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <h2 className="text-center text-lg font-medium text-slate-100">Continue with</h2>
          <Button
            className="mt-6 w-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
            disabled={loading}
            onClick={handleGoogleSignIn}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting to Google...
              </>
            ) : (
              "Google"
            )}
          </Button>
          {error ? <p className="mt-4 text-center text-sm text-red-300">{error}</p> : null}
          <p className="mt-6 text-center text-xs text-slate-300">
            We only use your Google profile to personalize your roadmap experience.
          </p>
        </section>
      </div>
    </main>
  )
}

