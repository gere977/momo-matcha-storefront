"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Ports the original Shopify theme's GSAP animations (layout/theme.liquid) 1:1:
// hero entrance stagger + parallax, feature-column reveal, product-card reveal,
// story-section parallax + text reveal. Mounted once in the root layout; re-runs
// on pathname change since the root layout itself never unmounts across
// client-side navigations, so a plain one-time effect would miss later pages.
//
// The reveal elements ([data-hero-el], [data-reveal-col], [data-product-card],
// [data-story-content] > *) start hidden via a static `opacity-0 translate-y-*`
// className baked into their JSX, not via gsap.from() - that way server and
// client agree on the initial markup at hydration time, and gsap only ever
// mutates inline styles well after mount (animating .to() the visible state),
// which previously caused an occasional hydration mismatch for content that
// streams in through a Suspense boundary (e.g. the product grid).
export default function GsapScrollEffects() {
  const pathname = usePathname()

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const revealSelector =
      "[data-hero-el], [data-reveal-col], [data-product-card], [data-story-content] > *"

    if (prefersReduced) {
      // No animation, but the elements still start hidden via className - reveal
      // them instantly instead of leaving reduced-motion users looking at nothing.
      gsap.set(revealSelector, { opacity: 1, y: 0, clearProps: "opacity,transform" })
      return
    }

    const ctx = gsap.context(() => {
      const heroEls = document.querySelectorAll("[data-hero-el]")
      if (heroEls.length) {
        gsap.to(heroEls, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.18,
          ease: "power3.out",
          delay: 0.2,
        })
      }

      const heroSection = document.querySelector("[data-hero-section]")
      if (heroSection) {
        gsap.to(heroSection, {
          backgroundPositionY: "30%",
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
      }

      const revealCols = document.querySelectorAll("[data-reveal-col]")
      if (revealCols.length) {
        gsap.to(revealCols, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: revealCols[0].parentElement,
            start: "top 80%",
          },
        })
      }

      const productCards = document.querySelectorAll("[data-product-card]")
      if (productCards.length) {
        gsap.to(productCards, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: productCards[0].closest("ul") ?? productCards[0].parentElement,
            start: "top 85%",
          },
        })
      }

      const storySection = document.querySelector("[data-story-section]")
      if (storySection) {
        gsap.to(storySection, {
          backgroundPositionY: "60%",
          ease: "none",
          scrollTrigger: {
            trigger: storySection,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })

        const storyContent = storySection.querySelector("[data-story-content]")
        if (storyContent) {
          gsap.to(storyContent.children, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: storyContent,
              start: "top 75%",
            },
          })
        }
      }
    })

    // Let the DOM paint the new route before ScrollTrigger measures positions.
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(refreshId)
      ctx.revert()
    }
  }, [pathname])

  return null
}
