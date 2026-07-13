"use client"

import { HttpTypes } from "@medusajs/types"
import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import { useRef, useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

// Mobile: horizontal swipe carousel with scroll-snap and dot indicators, so
// the price and the add-to-cart button sit one flick below the first photo
// instead of underneath the whole image stack. Desktop (small:) keeps the
// original vertical stack.
const ImageGallery = ({ images }: ImageGalleryProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Distance between slide starts (slide width + gap), measured from the DOM
  // so the index math never drifts from the CSS.
  const getStride = (track: HTMLDivElement) => {
    const slides = track.children
    return slides.length > 1
      ? (slides[1] as HTMLElement).offsetLeft -
          (slides[0] as HTMLElement).offsetLeft
      : track.clientWidth
  }

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    setActiveIndex(Math.round(track.scrollLeft / getStride(track)))
  }

  const scrollToIndex = (index: number) => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: index * getStride(track), behavior: "smooth" })
  }

  return (
    <div className="relative w-full">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex w-full gap-x-4 overflow-x-auto snap-x snap-mandatory no-scrollbar small:flex-col small:gap-x-0 small:gap-y-4 small:overflow-visible small:snap-none small:px-16"
      >
        {images.map((image, index) => {
          return (
            <Container
              key={image.id}
              className="relative aspect-[29/34] w-full shrink-0 snap-center overflow-hidden bg-ui-bg-subtle small:shrink"
              id={image.id}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0 rounded-rounded"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </Container>
          )
        })}
      </div>
      {images.length > 1 && (
        <div className="flex w-full justify-center gap-2 mt-3 small:hidden">
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              aria-label={`${i + 1}. kép megjelenítése`}
              aria-current={i === activeIndex ? "true" : undefined}
              onClick={() => scrollToIndex(i)}
              className={clx(
                "h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out-quart",
                i === activeIndex ? "w-5 bg-matcha" : "w-1.5 bg-matcha-kraft"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
