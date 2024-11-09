"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect } from "react";

const pathVariants: Variants = {
  normal: {
    translateX: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 13,
    },
  },
  animate: {
    translateX: [-6, 0],
    transition: {
      delay: 0.1,
      type: "spring",
      stiffness: 200,
      damping: 13,
    },
  },
};

const UsersIcon = () => {
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
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <motion.path
          d="M22 21v-2a4 4 0 0 0-3-3.87"
          variants={pathVariants}
          animate={controls}
        />
        <motion.path
          d="M16 3.13a4 4 0 0 1 0 7.75"
          variants={pathVariants}
          animate={controls}
        />
      </svg>
    </div>
  );
};

export { UsersIcon };
