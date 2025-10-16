import { useEffect, useMemo, useState } from 'react';

interface CarouselItem {
  src: string;
  alt: string;
  caption: string;
}

interface CompanyCarouselProps {
  images?: CarouselItem[];
  autoPlayInterval?: number;
}

const DEFAULT_INTERVAL = 5000;

export default function CompanyCarousel({ images, autoPlayInterval = DEFAULT_INTERVAL }: CompanyCarouselProps) {
  const slides = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [slides.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    if (slides.length === 0) return;
    const nextIndex = (index + slides.length) % slides.length;
    setActiveIndex(nextIndex);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto" aria-roledescription="carousel">
      <div className="relative h-[26rem] sm:h-[34rem] lg:h-[38rem] overflow-hidden rounded-3xl shadow-2xl">
        {slides.map((slide, index) => (
          <figure
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-hidden={index !== activeIndex}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </figure>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="btn btn-circle btn-sm sm:btn-md absolute left-3 top-1/2 -translate-y-1/2 bg-base-100/80 backdrop-blur border-0 shadow-lg hover:bg-base-100"
            onClick={() => goToSlide(activeIndex - 1)}
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M15 18l-6-6 6-6"></path>
            </svg>
          </button>

          <button
            type="button"
            className="btn btn-circle btn-sm sm:btn-md absolute right-3 top-1/2 -translate-y-1/2 bg-base-100/80 backdrop-blur border-0 shadow-lg hover:bg-base-100"
            onClick={() => goToSlide(activeIndex + 1)}
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 6l6 6-6 6"></path>
            </svg>
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${index === activeIndex ? 'bg-primary' : 'bg-base-300 hover:bg-primary/60'}`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
