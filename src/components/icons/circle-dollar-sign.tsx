"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect } from "react";

const dollarMainVariants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      duration: 0.6,
      opacity: { duration: 0.1 },
    },
  },
};

const dollarSecondaryVariants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    pathOffset: 0,
    transition: {
      delay: 0.3,
      duration: 0.3,
      opacity: { duration: 0.1, delay: 0.3 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: {
      delay: 0.5,
      duration: 0.4,
      opacity: { duration: 0.1, delay: 0.5 },
    },
  },
};

const CircleDollarSignIcon = () => {
  const controls = useAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      controls.start("animate").then(() => controls.start("normal"));
    }, 2000);

    return () => clearInterval(interval);
  }, [controls]);

  return (
    <div className="select-none p-2 rounded-md transition-colors duration-200 flex items-center justify-center">
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
        <circle cx="12" cy="12" r="10" />
        <motion.path
          d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"
          initial="normal"
          animate={controls}
          variants={dollarMainVariants}
        />
        <motion.path
          d="M12 18V6"
          initial="normal"
          animate={controls}
          variants={dollarSecondaryVariants}
        />
      </svg>
    </div>
  );
};

export { CircleDollarSignIcon };
