"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Use useLayoutEffect to prevent visual flicker when checking sessionStorage
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function SplashScreen() {
  // Default to true so the server sends the splash screen HTML right away,
  // preventing the underlying page from flashing before React hydrates.
  const [showSplash, setShowSplash] = useState(true);

  useIsomorphicLayoutEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("splashSeen");
    
    if (hasSeenSplash) {
      // If already seen in this session, hide it immediately before browser paint
      setShowSplash(false);
    } else {
      // If first time, keep it visible and set a timer to hide it
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("splashSeen", "true");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash"
          // We don't animate the initial opacity of the background so it is solid black immediately.
          // This ensures no transparency lets the page peek through during the first split second.
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-black flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-[22rem] h-40 md:w-[40rem] md:h-[18rem] flex justify-center items-center">
              <Image 
                src="/logoblanc.png" 
                alt="Logo Vroom" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "50%", opacity: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: "circOut" }}
              className="h-[2px] bg-white mt-1 rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
