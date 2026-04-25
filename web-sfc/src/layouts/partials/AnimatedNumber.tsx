"use client";

import { useState, useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: string; // e.g., "15+", "500+"
  duration?: number;
  className?: string;
}

export default function AnimatedNumber({
  value,
  duration = 2000,
  className = "",
}: AnimatedNumberProps) {
  const [currentValue, setCurrentValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  // Parse number and suffix
  const parseValue = (val: string): { number: number; suffix: string } => {
    const match = val.match(/^(\d+)(.*)$/);
    if (match) {
      return {
        number: parseInt(match[1], 10),
        suffix: match[2] || "",
      };
    }
    return { number: 0, suffix: val };
  };

  const { number: targetValue, suffix } = parseValue(value);

  // Intersection Observer to trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (numberRef.current) {
      observer.observe(numberRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Animation logic
  useEffect(() => {
    if (!isVisible) {
      setCurrentValue(0);
      startTimeRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(easeOut * targetValue);

      setCurrentValue(value);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetValue);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, duration, isVisible]);

  return (
    <div ref={numberRef} className={className}>
      {currentValue}
      {suffix}
    </div>
  );
}
