import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AgendaCard from "./AgendaCard";

const agendaList = [
  { id: 1, title: "Uji Kompetensi Junior Web Developer", date: "20 Maret 2026", location: "TUK UMY", scheme: "Junior Web Developer", status: "Dibuka" },
  { id: 2, title: "Uji Kompetensi Digital Marketing", date: "25 Maret 2026", location: "TUK AMIKOM", scheme: "Digital Marketing", status: "Dibuka" },
  { id: 3, title: "Uji Kompetensi Data Analyst", date: "30 Maret 2026", location: "TUK Online (Daring)", scheme: "Data Analyst", status: "Ditutup" },
];

export default function AgendaCarousel() {
  const sliderRef = useRef(null);
  const CARD_WIDTH = 360;
  const GAP = 48; 
  const TOTAL_WIDTH = CARD_WIDTH + GAP;
  const extendedList = [...agendaList, ...agendaList, ...agendaList, ...agendaList, ...agendaList];
  const [activeIndex, setActiveIndex] = useState(agendaList.length * 2);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.scrollBehavior = 'auto';
      sliderRef.current.scrollLeft = (agendaList.length * 2) * TOTAL_WIDTH;
    }
  }, []);

  const handleInfiniteScroll = () => {
    if (!sliderRef.current) return;

    const scrollLeft = sliderRef.current.scrollLeft;
    const index = Math.round(scrollLeft / TOTAL_WIDTH);
    setActiveIndex(index);

    if (scrollLeft >= (agendaList.length * 3) * TOTAL_WIDTH) {
      sliderRef.current.style.scrollBehavior = 'auto';
      sliderRef.current.scrollLeft = (agendaList.length * 2) * TOTAL_WIDTH;
      sliderRef.current.offsetHeight; 
    } 

    else if (scrollLeft <= (agendaList.length * 1) * TOTAL_WIDTH) {
      sliderRef.current.style.scrollBehavior = 'auto';
      sliderRef.current.scrollLeft = (agendaList.length * 2) * TOTAL_WIDTH;
      sliderRef.current.offsetHeight;
    }
  };

  const scrollByStep = (direction) => {
    if (!sliderRef.current) return;
    
    sliderRef.current.style.scrollBehavior = 'smooth';
    
    const targetIndex = direction === "next" ? activeIndex + 1 : activeIndex - 1;
    sliderRef.current.scrollLeft = targetIndex * TOTAL_WIDTH;
  };

  return (
    <div className="relative group/carousel">
      <button
        onClick={() => scrollByStep("prev")}
        className="absolute -left-16 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 backdrop-blur-2xl text-white hover:bg-orange-500 hover:scale-110 transition-all flex items-center justify-center shadow-2xl border-none"
      >
        <ArrowLeft size={28} />
      </button>

      <button
        onClick={() => scrollByStep("next")}
        className="absolute -right-16 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 backdrop-blur-2xl text-white hover:bg-orange-500 hover:scale-110 transition-all flex items-center justify-center shadow-2xl border-none"
      >
        <ArrowRight size={28} />
      </button>

      <div
        ref={sliderRef}
        onScroll={handleInfiniteScroll}
        className="flex gap-12 overflow-x-auto pb-10 px-[20%] md:px-[35%] scroll-smooth"
        style={{ 
          scrollSnapType: 'x mandatory',
          msOverflowStyle: 'none', 
          scrollbarWidth: 'none',
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          div::-webkit-scrollbar {
            display: none;
          }
        `}} />

        {extendedList.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={`${item.id}-${index}`}
              className={`snap-center transition-all duration-1000 ease-in-out
                ${isActive ? "scale-100 opacity-100 blur-0 z-10" : "scale-90 opacity-30 blur-[2px]"}
              `}
              style={{ minWidth: CARD_WIDTH }}
            >
              <AgendaCard {...item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}