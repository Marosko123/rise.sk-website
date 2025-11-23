import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PortfolioControlsProps {
  prevSlide: () => void;
  nextSlide: () => void;
  currentIndex: number;
  maxIndex: number;
  goToSlide: (index: number) => void;
}

export default function PortfolioControls({
  prevSlide,
  nextSlide,
  currentIndex,
  maxIndex,
  goToSlide,
}: PortfolioControlsProps) {
  return (
    <>
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[var(--primary)]/20 backdrop-blur-sm hover:bg-[var(--primary)]/40 p-3 rounded-full transition-all duration-300 hover:scale-110 select-none"
      >
        <ChevronLeft className="h-6 w-6 text-[var(--primary)]" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[var(--primary)]/20 backdrop-blur-sm hover:bg-[var(--primary)]/40 p-3 rounded-full transition-all duration-300 hover:scale-110 select-none"
      >
        <ChevronRight className="h-6 w-6 text-[var(--primary)]" />
      </button>

      <div className="flex justify-center mt-8 gap-3">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 relative ${
              index === currentIndex
                ? 'bg-[var(--primary)] scale-125'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            style={{ minWidth: 'auto', minHeight: 'auto' }}
          >
            {/* Increase touch area for mobile */}
            <span className="absolute -inset-2" />
          </button>
        ))}
      </div>
    </>
  );
}
