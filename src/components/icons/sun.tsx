"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect } from "react";

const pathVariants: Variants = {
  normal: { opacity: 1 },
  animate: (i: number) => ({
    opacity: [0, 1],
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

const SunIcon = () => {
  const controls = useAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      controls.start("animate").then(() => controls.start("normal"));
    }, 2000); // Adjust the interval duration as needed (e.g., 2000ms)

    return () => clearInterval(interval); // Cleanup on unmount
  }, [controls]);

  return (
    <div
      className="select-none p-2 rounded-md transition-colors duration-200 flex items-center justify-center"
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        {[
          "M12 2v2",
          "m19.07 4.93-1.41 1.41",
          "M20 12h2",
          "m17.66 17.66 1.41 1.41",
          "M12 20v2",
          "m6.34 17.66-1.41 1.41",
          "M2 12h2",
          "m4.93 4.93 1.41 1.41",
        ].map((d, index) => (
          <motion.path
            key={d}
            d={d}
            animate={controls}
            variants={pathVariants}
            custom={index + 1}
          />
        ))}
      </svg>
    </div>
  );
};

export { SunIcon };
