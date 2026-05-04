"use client";

export default function BookingCTA() {
  const handleClick = () => {
    window.dispatchEvent(new Event('open-booking-modal'));
  };

  return (
    <>
      {/* Sticky Bottom CTA (Mobile) */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-xl border-t border-border z-40 sm:hidden">
        <button 
          onClick={handleClick}
          className="btn-primary w-full !py-4 text-[16px] shadow-xl"
        >
          Commander une course
        </button>
      </div>
      
      {/* Desktop Floating CTA */}
      <div className="hidden sm:block fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={handleClick}
          className="btn-primary !py-4 !px-12 text-[16px] shadow-2xl rounded-full"
        >
          Commander une course
        </button>
      </div>
    </>
  );
}
