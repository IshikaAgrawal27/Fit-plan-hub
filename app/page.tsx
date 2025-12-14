import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              FitPlanHub
            </Link>
            <nav className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className="text-sm font-normal">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="text-sm font-normal rounded-full px-5">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-semibold tracking-tight lg:text-7xl mb-6 text-balance leading-[1.1]">
              Elite fitness programming.
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground font-light mb-12 text-balance max-w-2xl mx-auto">
              Precision-designed training from certified professionals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 text-base h-12">
                <Link href="/auth/sign-up">Start Training</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="rounded-full px-8 text-base h-12">
                <Link href="/feed">Browse Programs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid gap-16 lg:gap-20 max-w-5xl mx-auto">
            <div className="space-y-3">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">Certified expertise.</h2>
              <p className="text-lg text-muted-foreground font-light max-w-2xl">
                Every program designed by certified professionals. No amateurs. No guesswork.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">Precision programming.</h2>
              <p className="text-lg text-muted-foreground font-light max-w-2xl">
                Tailored plans with clear progression. Track your gains, optimize your results.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">Immediate access.</h2>
              <p className="text-lg text-muted-foreground font-light max-w-2xl">
                Subscribe and start immediately. No waiting, no complexity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
              Transform through discipline.
            </h2>
            <Button asChild size="lg" className="rounded-full px-8 text-base h-12">
              <Link href="/auth/sign-up">Begin Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground font-light">
            &copy; 2025 FitPlanHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
