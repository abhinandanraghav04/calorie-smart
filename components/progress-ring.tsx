'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProgressRingProps {
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({ current, target, size = 200, strokeWidth = 12 }: ProgressRingProps) {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((current / target) * 100, 100);

  useEffect(() => {
    setProgress(percentage);
  }, [percentage]);

  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const remaining = Math.max(target - current, 0);
  const isOverTarget = current > target;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-zinc-200 dark:text-zinc-800"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className={isOverTarget ? "text-red-500" : "text-green-500"}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={current}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="text-3xl font-bold">{current}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">of {target}</div>
          </motion.div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          {isOverTarget ? (
            <span className="text-red-500 font-medium">{current - target} over target</span>
          ) : (
            <span>{remaining} calories remaining</span>
          )}
        </div>
      </div>
    </div>
  );
}
