"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import SplitText from "./SplitText";
import Link from "next/link";

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 max-w-screen-2xl mx-auto">
        <div className="mr-4 flex">
          <Link className="mr-6 ml-2 flex items-center" href="/">
            <SplitText
              text="GenQuery"
              className="text-xl font-bold text-center translate-y-[2px]"
              delay={50}
              duration={1.25}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={handleAnimationComplete}
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <nav className="flex items-center">
            {mounted ? (
              <AnimatedThemeToggler
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                variant="circle"
                theme={theme as "light" | "dark" | undefined}
                onThemeChange={(newTheme) => setTheme(newTheme)}
              />
            ) : (
              <div className="h-9 w-9" />
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
