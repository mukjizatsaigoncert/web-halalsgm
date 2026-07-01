"use client";

import { useState, useEffect, useRef } from "react";

interface Stat {
  number: string;
  label: string;
}

interface AnimatedStatsProps {
  stats: Stat[];
  className?: string;
}

function AnimatedNumber({
  targetValue,
  suffix = "",
  duration = 2000,
  isVisible,
}: {
  targetValue: number;
  suffix?: string;
  duration?: number;
  isVisible: boolean;
}) {
  const [currentValue, setCurrentValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
    <span>
      {currentValue}
      {suffix}
    </span>
  );
}

export default function AnimatedStats({
  stats,
  className = "",
}: AnimatedStatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

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

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const parseNumber = (value: string): { number: number; suffix: string } => {
    const match = value.match(/^(\d+)(.*)$/);
    if (match) {
      return {
        number: parseInt(match[1], 10),
        suffix: match[2] || "",
      };
    }
    return { number: 0, suffix: value };
  };

  return (
    <div
      ref={statsRef}
      className={className}
      data-aos="fade-up-sm"
      data-aos-delay="300"
    >
      {stats.map((stat, i) => {
        const { number, suffix } = parseNumber(stat.number);
        return (
          <div key={i} className="text-white">
            <div className="text-2xl md:text-4xl font-bold text-secondary">
              <AnimatedNumber
                targetValue={number}
                suffix={suffix}
                duration={2000}
                isVisible={isVisible}
              />
            </div>
            <div className="text-xs md:text-sm text-white/70">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
