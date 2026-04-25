"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getFullCalendarInfo, CalendarInfo } from "@/lib/utils/calendarUtils";

export default function CalendarSidebar() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [calendarInfo, setCalendarInfo] = useState<CalendarInfo | null>(null);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setCurrentTime(now);
    setCalendarInfo(getFullCalendarInfo(now));

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setCalendarInfo(getFullCalendarInfo(now));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Hiển thị placeholder khi chưa mount (SSR)
  const time = currentTime
    ? {
        h: currentTime.getHours().toString().padStart(2, "0"),
        m: currentTime.getMinutes().toString().padStart(2, "0"),
        s: currentTime.getSeconds().toString().padStart(2, "0"),
      }
    : { h: "--", m: "--", s: "--" };

  const weekday = currentTime
    ? currentTime.toLocaleDateString("vi-VN", { weekday: "long" })
    : "---";

  // Không render gì khi chưa mount để tránh hydration mismatch
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 mt-2 pb-4">
        <div className="bg-slate-800/95 backdrop-blur-md text-white rounded-full shadow-xl px-4 md:px-6 py-2.5 h-[52px]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-2 pb-4">
      <div className="bg-slate-800/95 backdrop-blur-md text-white rounded-full shadow-xl px-4 md:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Left: Clock & Âm Dương (phụ) */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Clock */}
            <div className="flex items-center gap-2">
              <div className="font-mono font-bold">
                <span className="text-emerald-400 text-lg">{time.h}</span>
                <span className="text-emerald-400 text-lg animate-pulse">
                  :
                </span>
                <span className="text-emerald-400 text-lg">{time.m}</span>
                <span className="text-slate-500 text-sm">:{time.s}</span>
              </div>
              <div className="hidden md:block text-[10px] leading-tight text-slate-400">
                <div>{weekday}</div>
              </div>
            </div>

            {/* Âm Dương - compact, phụ */}
            {calendarInfo && (
              <div className="hidden lg:flex items-center gap-3 text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                  <span>☀️</span>
                  <span>
                    {calendarInfo.solar.day.toString().padStart(2, "0")}/
                    {calendarInfo.solar.month.toString().padStart(2, "0")} T
                    {calendarInfo.solar.weekOfYear}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🌙</span>
                  <span>
                    {calendarInfo.lunar.day.toString().padStart(2, "0")}/
                    {calendarInfo.lunar.month.toString().padStart(2, "0")}{" "}
                    {calendarInfo.lunar.dayCanChi}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Center: Văn Lang & Con Nước (chính) */}
          {calendarInfo && (
            <div className="flex items-center gap-3 md:gap-6">
              {/* Văn Lang - Thông tin chính */}
              <div className="flex items-center gap-2 md:gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 md:px-4 py-1">
                <div className="text-center">
                  <div className="text-[8px] md:text-[10px] text-emerald-400/80 uppercase font-semibold tracking-wide">
                    Văn Lang
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-emerald-400 leading-none">
                    {calendarInfo.vanLang.month === 0
                      ? calendarInfo.vanLang.dayOfYear
                      : calendarInfo.vanLang.day.toString().padStart(2, "0")}
                  </div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-emerald-500/30" />
                <div className="hidden sm:block text-xs leading-tight">
                  <div className="text-emerald-300 font-bold">
                    {calendarInfo.vanLang.month === 0
                      ? calendarInfo.vanLang.monthName
                      : `Tháng ${calendarInfo.vanLang.monthName} (${
                          calendarInfo.vanLang.month
                        })`}
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Năm {calendarInfo.vanLang.yearCanChi}
                  </div>
                  <div className="text-emerald-400/70 text-[10px]">
                    {calendarInfo.vanLang.month === 0 ? (
                      <>Ngày {calendarInfo.vanLang.dayOfYear}</>
                    ) : (
                      <>
                        Ngày {calendarInfo.vanLang.dayOfYear} • Tuần{" "}
                        {calendarInfo.vanLang.weekOfYear
                          .toString()
                          .padStart(2, "0")}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Con Nước - Thông tin chính */}
              <div className="flex items-center gap-2 md:gap-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-3 md:px-4 py-1">
                <div className="text-center">
                  <div className="text-[8px] md:text-[10px] text-cyan-400/80 uppercase font-semibold tracking-wide">
                    Con Nước
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-cyan-400 leading-none">
                    {(() => {
                      const dayMatch =
                        calendarInfo.vanLang.conNuoc.name.match(/\d+/);
                      return dayMatch ? dayMatch[0].padStart(2, "0") : "—";
                    })()}
                  </div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-cyan-500/30" />
                <div className="hidden sm:block text-xs leading-tight">
                  <div className="text-cyan-300 font-bold">
                    {calendarInfo.vanLang.conNuoc.phase}
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    {calendarInfo.vanLang.month > 0
                      ? `Tuần ${calendarInfo.vanLang.weekOfMonth
                          .toString()
                          .padStart(2, "0")}/Th.${calendarInfo.vanLang.month}`
                      : calendarInfo.vanLang.monthName}
                  </div>
                  <div className="text-cyan-400/70 text-[10px]">
                    {calendarInfo.vanLang.conNuoc.desc.split(" - ")[1] || ""}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right: Link */}
          <Link
            href="/lich-van-nien"
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 md:px-4 py-1.5 rounded-full font-semibold text-xs transition-all whitespace-nowrap"
          >
            <span className="hidden md:inline">Xem chi tiết</span>
            <span className="md:hidden">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
