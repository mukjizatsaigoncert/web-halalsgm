"use client";

import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/partials/PageHeader";
import {
  getFullCalendarInfo,
  getCalendarInfoFromLunar,
  CalendarInfo,
  GIO_CHI,
  THANG_AM,
  THANG_VAN_LANG_CHI,
  THANG_VAN_LANG_TEN,
} from "@/lib/utils/calendarUtils";
import { useRouter } from "next/navigation";

export default function LichVanNienPage() {
  const [calendarInfo, setCalendarInfo] = useState<CalendarInfo | null>(null);
  const [inputMode, setInputMode] = useState<"solar" | "lunar">("solar");
  const [currentTime, setCurrentTime] = useState<string>("");
  const router = useRouter();

  // Solar date inputs
  const [solarDay, setSolarDay] = useState<number>(new Date().getDate());
  const [solarMonth, setSolarMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [solarYear, setSolarYear] = useState<number>(new Date().getFullYear());

  // Lunar date inputs
  const [lunarDay, setLunarDay] = useState<number>(1);
  const [lunarMonth, setLunarMonth] = useState<number>(1);
  const [lunarYear, setLunarYear] = useState<number>(new Date().getFullYear());
  const [isLeapMonth, setIsLeapMonth] = useState<boolean>(false);

  // Initialize with current date
  useEffect(() => {
    const now = new Date();
    const info = getFullCalendarInfo(now);
    setCalendarInfo(info);
    setLunarDay(info.lunar.day);
    setLunarMonth(info.lunar.month);
    setLunarYear(info.lunar.year);
  }, []);

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert from Solar
  const convertFromSolar = useCallback(() => {
    const date = new Date(solarYear, solarMonth - 1, solarDay);
    const info = getFullCalendarInfo(date);
    setCalendarInfo(info);
    setLunarDay(info.lunar.day);
    setLunarMonth(info.lunar.month);
    setLunarYear(info.lunar.year);
    setIsLeapMonth(info.lunar.isLeapMonth);
  }, [solarDay, solarMonth, solarYear]);

  // Convert from Lunar
  const convertFromLunar = useCallback(() => {
    const info = getCalendarInfoFromLunar(
      lunarDay,
      lunarMonth,
      lunarYear,
      isLeapMonth
    );
    if (info) {
      setCalendarInfo(info);
      setSolarDay(info.solar.day);
      setSolarMonth(info.solar.month);
      setSolarYear(info.solar.year);
    }
  }, [lunarDay, lunarMonth, lunarYear, isLeapMonth]);

  // Handle conversion
  const handleConvert = () => {
    if (inputMode === "solar") {
      convertFromSolar();
    } else {
      convertFromLunar();
    }
  };

  // Set to today
  const setToday = () => {
    const now = new Date();
    setSolarDay(now.getDate());
    setSolarMonth(now.getMonth() + 1);
    setSolarYear(now.getFullYear());
    const info = getFullCalendarInfo(now);
    setCalendarInfo(info);
    setLunarDay(info.lunar.day);
    setLunarMonth(info.lunar.month);
    setLunarYear(info.lunar.year);
    setIsLeapMonth(info.lunar.isLeapMonth);
  };

  const goToDetails = () => {
    router.push("/");
  };

  return (
    <>
      <PageHeader title="Lịch Vạn Niên" />

      <section className="section">
        <div className="container">
          {/* Input Section */}
          <div className="row justify-center mb-8 lg:mb-12">
            <div className="col-12 lg:col-10">
              <div
                data-aos="fade-up-sm"
                data-aos-delay="100"
                className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-8 border border-border"
              >
                {/* Mode Toggle */}
                <div className="flex justify-center mb-4 lg:mb-6">
                  <div className="inline-flex rounded-full bg-light p-1">
                    <button
                      onClick={() => setInputMode("solar")}
                      className={`px-4 lg:px-6 py-2 rounded-full text-xs lg:text-sm font-medium transition-all ${
                        inputMode === "solar"
                          ? "bg-primary text-white shadow"
                          : "text-body-color hover:text-primary"
                      }`}
                    >
                      Nhập Lịch Dương
                    </button>
                    <button
                      onClick={() => setInputMode("lunar")}
                      className={`px-4 lg:px-6 py-2 rounded-full text-xs lg:text-sm font-medium transition-all ${
                        inputMode === "lunar"
                          ? "bg-primary text-white shadow"
                          : "text-body-color hover:text-primary"
                      }`}
                    >
                      Nhập Lịch Âm
                    </button>
                  </div>
                </div>

                {/* Solar Input */}
                {inputMode === "solar" && (
                  <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-4 lg:mb-6">
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-body-color mb-1 lg:mb-2">
                        Ngày
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={solarDay}
                        onChange={(e) =>
                          setSolarDay(parseInt(e.target.value) || 1)
                        }
                        className="w-full px-2 lg:px-4 py-2 lg:py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm lg:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-body-color mb-1 lg:mb-2">
                        Tháng
                      </label>
                      <select
                        value={solarMonth}
                        onChange={(e) =>
                          setSolarMonth(parseInt(e.target.value))
                        }
                        className="w-full px-2 lg:px-4 py-2 lg:py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm lg:text-base"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Tháng {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-body-color mb-1 lg:mb-2">
                        Năm
                      </label>
                      <input
                        type="number"
                        min="1900"
                        max="2100"
                        value={solarYear}
                        onChange={(e) =>
                          setSolarYear(parseInt(e.target.value) || 2024)
                        }
                        className="w-full px-2 lg:px-4 py-2 lg:py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm lg:text-base"
                      />
                    </div>
                  </div>
                )}

                {/* Lunar Input */}
                {inputMode === "lunar" && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 mb-4 lg:mb-6">
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-body-color mb-1 lg:mb-2">
                        Ngày Âm
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={lunarDay}
                        onChange={(e) =>
                          setLunarDay(parseInt(e.target.value) || 1)
                        }
                        className="w-full px-2 lg:px-4 py-2 lg:py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm lg:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-body-color mb-1 lg:mb-2">
                        Tháng Âm
                      </label>
                      <select
                        value={lunarMonth}
                        onChange={(e) =>
                          setLunarMonth(parseInt(e.target.value))
                        }
                        className="w-full px-2 lg:px-4 py-2 lg:py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm lg:text-base"
                      >
                        {THANG_AM.map((name, i) => (
                          <option key={i + 1} value={i + 1}>
                            Tháng {name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-body-color mb-1 lg:mb-2">
                        Năm Âm
                      </label>
                      <input
                        type="number"
                        min="1900"
                        max="2100"
                        value={lunarYear}
                        onChange={(e) =>
                          setLunarYear(parseInt(e.target.value) || 2024)
                        }
                        className="w-full px-2 lg:px-4 py-2 lg:py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm lg:text-base"
                      />
                    </div>
                    <div className="flex items-end col-span-2 lg:col-span-1">
                      <label className="flex items-center gap-2 cursor-pointer py-2 lg:py-3">
                        <input
                          type="checkbox"
                          checked={isLeapMonth}
                          onChange={(e) => setIsLeapMonth(e.target.checked)}
                          className="w-4 h-4 lg:w-5 lg:h-5 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-xs lg:text-sm font-medium text-body-color">
                          Tháng Nhuận
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-2 lg:gap-4">
                  <button
                    onClick={handleConvert}
                    className="px-6 lg:px-8 py-2.5 lg:py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 text-sm lg:text-base"
                  >
                    Chuyển Đổi
                  </button>
                  <button
                    onClick={setToday}
                    className="px-6 lg:px-8 py-2.5 lg:py-3 bg-light text-primary rounded-lg font-medium hover:bg-primary/10 transition-all border border-primary text-sm lg:text-base"
                  >
                    Hôm Nay
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Results */}
          {calendarInfo && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
              {/* Lịch Dương */}
              <div className="lg:col-span-4">
                <div
                  data-aos="fade-up-sm"
                  data-aos-delay="150"
                  className="h-full bg-linear-to-br from-amber-500 to-orange-600 rounded-xl lg:rounded-2xl p-4 lg:p-5 text-white shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-3 lg:mb-4">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 lg:w-5 lg:h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base lg:text-lg font-bold">
                        Lịch Dương
                      </h3>
                      <p className="text-white/80 text-[10px] lg:text-xs">
                        Solar Calendar
                      </p>
                    </div>
                  </div>

                  <div className="text-center mb-3 lg:mb-4">
                    <div className="text-4xl lg:text-5xl font-bold mb-1">
                      {calendarInfo.solar.day}
                    </div>
                    <div className="text-sm lg:text-base">
                      Tháng {calendarInfo.solar.month},{" "}
                      {calendarInfo.solar.year}
                    </div>
                    <div className="text-white/90 mt-1 text-xs lg:text-sm">
                      {calendarInfo.solar.dayOfWeekName}
                    </div>
                  </div>

                  <div className="space-y-1.5 lg:space-y-2 text-[10px] lg:text-xs">
                    <div className="flex justify-between py-1.5 border-t border-white/20">
                      <span className="text-white/80">Tuần thứ</span>
                      <span className="font-medium">
                        {calendarInfo.solar.weekOfYear}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-t border-white/20">
                      <span className="text-white/80">Ngày trong năm</span>
                      <span className="font-medium">
                        {calendarInfo.solar.dayOfYear}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-t border-white/20">
                      <span className="text-white/80">Giờ hiện tại</span>
                      <span className="font-medium">{currentTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lịch Âm + Giờ Hoàng Đạo */}
              <div className="lg:col-span-4">
                <div
                  data-aos="fade-up-sm"
                  data-aos-delay="200"
                  className="h-full bg-linear-to-br from-indigo-600 to-purple-700 rounded-xl lg:rounded-2xl p-4 lg:p-5 text-white shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-3 lg:mb-4">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 lg:w-5 lg:h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base lg:text-lg font-bold">
                        Lịch Âm
                      </h3>
                      <p className="text-white/80 text-[10px] lg:text-xs">
                        Lunar Calendar
                      </p>
                    </div>
                  </div>

                  <div className="text-center mb-3 lg:mb-4">
                    <div className="text-4xl lg:text-5xl font-bold mb-1">
                      {calendarInfo.lunar.day}
                    </div>
                    <div className="text-sm lg:text-base">
                      Tháng {calendarInfo.lunar.monthName}
                      {calendarInfo.lunar.isLeapMonth && " (Nhuận)"}
                    </div>
                    <div className="text-white/90 mt-1 text-xs lg:text-sm">
                      Năm {calendarInfo.lunar.yearCanChi} (
                      {calendarInfo.lunar.zodiac})
                    </div>
                  </div>

                  <div className="space-y-1.5 lg:space-y-2 text-[10px] lg:text-xs">
                    <div className="flex justify-between py-1.5 border-t border-white/20">
                      <span className="text-white/80">Can Chi Tháng</span>
                      <span className="font-medium">
                        {calendarInfo.lunar.monthCanChi}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-t border-white/20">
                      <span className="text-white/80">Can Chi Ngày</span>
                      <span className="font-medium">
                        {calendarInfo.lunar.dayCanChi}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-t border-white/20">
                      <span className="text-white/80">Giờ bắt đầu</span>
                      <span className="font-medium">
                        {calendarInfo.lunar.hourCanChi}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-t border-white/20">
                      <span className="text-white/80">Tiết Khí</span>
                      <span className="font-medium">
                        {calendarInfo.lunar.tietKhi}
                      </span>
                    </div>
                    {calendarInfo.lunar.specialDay && (
                      <div className="py-1.5 border-t border-white/20">
                        <div className="bg-white/20 rounded-md px-2 py-1.5 text-center">
                          <span className="font-bold text-[10px] lg:text-xs">
                            🎉 {calendarInfo.lunar.specialDay}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Giờ Hoàng Đạo - Nested inside Lunar Calendar */}
                  <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-white/20">
                    <h4 className="text-xs lg:text-sm font-bold mb-2 text-center">
                      ⏰ Giờ Hoàng Đạo
                    </h4>
                    <div className="grid grid-cols-3 gap-1.5">
                      {calendarInfo.lunar.gioHoangDao.map((chi, index) => {
                        const gioInfo = GIO_CHI.find((g) => g.chi === chi);
                        return (
                          <div
                            key={index}
                            className="bg-white/20 rounded-md p-1.5 text-center"
                          >
                            <div className="text-[10px] lg:text-xs font-bold">
                              {chi}
                            </div>
                            {gioInfo && (
                              <div className="text-[8px] lg:text-[10px] text-white/80">
                                {gioInfo.start}-{gioInfo.end}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lịch Văn Lang + Con Nước - Combined Section */}
              <div className="lg:col-span-4">
                <div
                  data-aos="fade-up-sm"
                  data-aos-delay="250"
                  className="h-full bg-linear-to-br from-secondary to-[#0a3018] rounded-xl lg:rounded-2xl p-4 lg:p-5 text-white shadow-xl"
                >
                  {/* Lịch Văn Lang */}
                  <div className="flex items-center gap-2 mb-3 lg:mb-4">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 lg:w-5 lg:h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base lg:text-lg font-bold">
                        Lịch Văn Lang & Con Nước
                      </h3>
                      <p className="text-white/80 text-[10px] lg:text-xs">
                        Lịch Trái Đất - Việt Cổ
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Van Lang Info */}
                    <div>
                      <div className="text-center mb-3">
                        {calendarInfo.vanLang.month === 0 ? (
                          <>
                            <div className="text-2xl lg:text-3xl font-bold mb-1 text-yellow-300">
                              {calendarInfo.vanLang.monthName}
                            </div>
                            <div className="text-white/90 text-xs lg:text-sm">
                              Năm {calendarInfo.vanLang.yearCanChi}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-4xl lg:text-5xl font-bold mb-1">
                              {calendarInfo.vanLang.day
                                .toString()
                                .padStart(2, "0")}
                            </div>
                            <div className="text-sm lg:text-base">
                              Tháng{" "}
                              {
                                THANG_VAN_LANG_TEN[
                                  calendarInfo.vanLang.month - 1
                                ]
                              }{" "}
                              (
                              {
                                THANG_VAN_LANG_CHI[
                                  calendarInfo.vanLang.month - 1
                                ]
                              }
                              )
                            </div>
                            <div className="text-white/90 text-xs lg:text-sm">
                              Năm {calendarInfo.vanLang.yearCanChi}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="space-y-1.5 text-[10px] lg:text-xs">
                        <div className="flex justify-between py-1.5 border-t border-white/20">
                          <span className="text-white/80">Can Chi Ngày</span>
                          <span className="font-medium">
                            {calendarInfo.vanLang.dayCanChi}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-t border-white/20">
                          <span className="text-white/80">Ngày trong năm</span>
                          <span className="font-medium">
                            {calendarInfo.vanLang.dayOfYear
                              .toString()
                              .padStart(3, "0")}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-t border-white/20">
                          <span className="text-white/80">Tuần trong năm</span>
                          <span className="font-medium">
                            Tuần{" "}
                            {calendarInfo.vanLang.weekOfYear
                              .toString()
                              .padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Con Nuoc Info */}
                    <div className="border-t border-white/20 pt-4">
                      <div className="text-center mb-3">
                        <div className="text-xl lg:text-2xl font-bold mb-1 text-gold">
                          🌊 {calendarInfo.vanLang.conNuoc.name}
                        </div>
                        <div className="text-white/90 text-[10px] lg:text-xs">
                          {calendarInfo.vanLang.conNuoc.desc}
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-full bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 text-sm lg:text-base py-2"
                      onClick={() => goToDetails()}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="row mt-8 lg:mt-12">
            <div className="col-12">
              <div
                data-aos="fade-up-sm"
                data-aos-delay="400"
                className="bg-light rounded-xl lg:rounded-2xl p-4 lg:p-8"
              >
                <h3 className="text-lg lg:text-xl font-bold text-primary mb-4 lg:mb-6">
                  📚 Giải Thích Các Loại Lịch
                </h3>
                <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
                  <div>
                    <h4 className="font-bold text-amber-600 mb-2 text-sm lg:text-base">
                      ☀️ Lịch Dương (Solar)
                    </h4>
                    <p className="text-body-color text-xs lg:text-sm">
                      Dựa trên lịch Gregorian tiêu chuẩn, theo chu kỳ Mặt Trời.
                      Bao gồm năm, tháng, ngày, thứ trong tuần, tuần thứ bao
                      nhiêu và ngày thứ bao nhiêu trong năm.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-600 mb-2 text-sm lg:text-base">
                      🌙 Lịch Âm (Lunar)
                    </h4>
                    <p className="text-body-color text-xs lg:text-sm">
                      Dựa trên lịch Việt Nam theo chu kỳ Mặt Trăng. Sử dụng
                      Can-Chi cho năm, tháng, ngày. Bao gồm tiết khí và giờ
                      hoàng đạo (giờ tốt) trong ngày.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary mb-2 text-sm lg:text-base">
                      🌍 Lịch Văn Lang & Con Nước
                    </h4>
                    <p className="text-body-color text-xs lg:text-sm">
                      Lịch cổ Việt Nam với 12 tháng × 30 ngày + 4 ngày giao mùa.
                      Tuần Văn Lang gồm 10 ngày. Lịch Con Nước theo lịch Văn
                      Lang, tuần 14 ngày với các mốc: nghén, chày, cường.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
