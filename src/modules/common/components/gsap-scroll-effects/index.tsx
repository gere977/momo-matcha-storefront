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
export default function GsapScrollEffects() {
  const pathname = usePathname()

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      return
    }

    const ctx = gsap.context(() => {
      const heroEls = document.querySelectorAll("[data-hero-el]")
      if (heroEls.length) {
        gsap.from(heroEls, {
          opacity: 0,
          y: 30,
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
        gsap.from(revealCols, {
          opacity: 0,
          y: 40,
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
        gsap.from(productCards, {
          opacity: 0,
          y: 50,
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
          gsap.from(storyContent.children, {
            opacity: 0,
            y: 30,
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
