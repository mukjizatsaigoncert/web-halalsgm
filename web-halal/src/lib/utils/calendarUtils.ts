/**
 * Vietnamese Calendar Utility Functions
 * Chuyển đổi giữa Lịch Dương (Solar), Lịch Âm (Lunar), và Lịch Văn Lang
 */

// ==================== CONSTANTS ====================

// Can (Thiên Can / Heavenly Stems)
export const CAN = [
  "Giáp",
  "Ất",
  "Bính",
  "Đinh",
  "Mậu",
  "Kỷ",
  "Canh",
  "Tân",
  "Nhâm",
  "Quý",
];

// Chi (Địa Chi / Earthly Branches)
export const CHI = [
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tỵ",
  "Ngọ",
  "Mùi",
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
];

// Con giáp (Zodiac animals)
export const CON_GIAP = [
  "Chuột",
  "Trâu",
  "Hổ",
  "Mèo",
  "Rồng",
  "Rắn",
  "Ngựa",
  "Dê",
  "Khỉ",
  "Gà",
  "Chó",
  "Lợn",
];

// Tên tháng âm lịch
export const THANG_AM = [
  "Giêng",
  "Hai",
  "Ba",
  "Tư",
  "Năm",
  "Sáu",
  "Bảy",
  "Tám",
  "Chín",
  "Mười",
  "Một",
  "Chạp",
];

// Thứ trong tuần
export const THU_TRONG_TUAN = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

// 24 Tiết khí (Solar Terms)
export const TIET_KHI = [
  { name: "Tiểu Hàn", solar: [1, 6] },
  { name: "Đại Hàn", solar: [1, 20] },
  { name: "Lập Xuân", solar: [2, 4] },
  { name: "Vũ Thủy", solar: [2, 19] },
  { name: "Kinh Trập", solar: [3, 6] },
  { name: "Xuân Phân", solar: [3, 21] },
  { name: "Thanh Minh", solar: [4, 5] },
  { name: "Cốc Vũ", solar: [4, 20] },
  { name: "Lập Hạ", solar: [5, 6] },
  { name: "Tiểu Mãn", solar: [5, 21] },
  { name: "Mang Chủng", solar: [6, 6] },
  { name: "Hạ Chí", solar: [6, 21] },
  { name: "Tiểu Thử", solar: [7, 7] },
  { name: "Đại Thử", solar: [7, 23] },
  { name: "Lập Thu", solar: [8, 7] },
  { name: "Xử Thử", solar: [8, 23] },
  { name: "Bạch Lộ", solar: [9, 8] },
  { name: "Thu Phân", solar: [9, 23] },
  { name: "Hàn Lộ", solar: [10, 8] },
  { name: "Sương Giáng", solar: [10, 23] },
  { name: "Lập Đông", solar: [11, 7] },
  { name: "Tiểu Tuyết", solar: [11, 22] },
  { name: "Đại Tuyết", solar: [12, 7] },
  { name: "Đông Chí", solar: [12, 22] },
];

// Giờ Hoàng Đạo theo ngày (Chi của ngày)
export const GIO_HOANG_DAO: Record<string, string[]> = {
  Tý: ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"],
  Ngọ: ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"],
  Sửu: ["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"],
  Mùi: ["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"],
  Dần: ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"],
  Thân: ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"],
  Mão: ["Tý", "Dần", "Mão", "Ngọ", "Mùi", "Dậu"],
  Dậu: ["Tý", "Dần", "Mão", "Ngọ", "Mùi", "Dậu"],
  Thìn: ["Dần", "Thìn", "Tỵ", "Thân", "Dậu", "Hợi"],
  Tuất: ["Dần", "Thìn", "Tỵ", "Thân", "Dậu", "Hợi"],
  Tỵ: ["Sửu", "Thìn", "Ngọ", "Mùi", "Tuất", "Hợi"],
  Hợi: ["Sửu", "Thìn", "Ngọ", "Mùi", "Tuất", "Hợi"],
};

// Giờ và khoảng thời gian
export const GIO_CHI = [
  { chi: "Tý", start: "23:00", end: "01:00" },
  { chi: "Sửu", start: "01:00", end: "03:00" },
  { chi: "Dần", start: "03:00", end: "05:00" },
  { chi: "Mão", start: "05:00", end: "07:00" },
  { chi: "Thìn", start: "07:00", end: "09:00" },
  { chi: "Tỵ", start: "09:00", end: "11:00" },
  { chi: "Ngọ", start: "11:00", end: "13:00" },
  { chi: "Mùi", start: "13:00", end: "15:00" },
  { chi: "Thân", start: "15:00", end: "17:00" },
  { chi: "Dậu", start: "17:00", end: "19:00" },
  { chi: "Tuất", start: "19:00", end: "21:00" },
  { chi: "Hợi", start: "21:00", end: "23:00" },
];

// Con Nước (Tidal cycles) - chu kỳ 14 ngày theo Lịch Văn Lang
export const CON_NUOC = [
  { day: 1, name: "Nước rong", phase: "cường", desc: "Triều lên cao nhất" },
  { day: 2, name: "Nước rong", phase: "cường", desc: "Triều vẫn cao" },
  { day: 3, name: "Nước kém", phase: "sinh", desc: "Triều bắt đầu xuống" },
  { day: 4, name: "Nước kém", phase: "sinh", desc: "Triều xuống" },
  { day: 5, name: "Nước nghén", phase: "hồi", desc: "Triều thấp" },
  { day: 6, name: "Nước nghén", phase: "hồi", desc: "Triều rất thấp" },
  { day: 7, name: "Nước nghén", phase: "hồi", desc: "Triều thấp nhất" },
  { day: 8, name: "Nước con", phase: "sinh", desc: "Triều bắt đầu lên" },
  { day: 9, name: "Nước con", phase: "sinh", desc: "Triều lên" },
  { day: 10, name: "Nước con", phase: "cường", desc: "Triều cao" },
  { day: 11, name: "Nước con", phase: "cường", desc: "Triều cao nhất kỳ con" },
  { day: 12, name: "Nước kém", phase: "hồi", desc: "Triều xuống" },
  { day: 13, name: "Nước kém", phase: "hồi", desc: "Triều thấp" },
  { day: 14, name: "Nước nghén", phase: "hồi", desc: "Triều rất thấp" },
  { day: 15, name: "Nước rong", phase: "cường", desc: "Triều bắt đầu lên cao" },
];

// Ngày lễ đặc biệt theo Âm Lịch
export const NGAY_LE_AM_LICH = [
  { lunarMonth: 1, lunarDay: 1, name: "Tết Nguyên Đán", type: "major" },
  { lunarMonth: 1, lunarDay: 15, name: "Tết Nguyên Tiêu", type: "major" },
  { lunarMonth: 3, lunarDay: 3, name: "Tết Hàn Thực", type: "minor" },
  { lunarMonth: 3, lunarDay: 10, name: "Giỗ Tổ Hùng Vương", type: "major" },
  { lunarMonth: 4, lunarDay: 15, name: "Lễ Phật Đản", type: "minor" },
  { lunarMonth: 5, lunarDay: 5, name: "Tết Đoan Ngọ", type: "major" },
  { lunarMonth: 7, lunarDay: 15, name: "Lễ Vu Lan", type: "major" },
  { lunarMonth: 8, lunarDay: 15, name: "Tết Trung Thu", type: "major" },
  { lunarMonth: 9, lunarDay: 9, name: "Tết Trùng Cửu", type: "minor" },
  { lunarMonth: 12, lunarDay: 23, name: "Ông Táo về trời", type: "minor" },
  { lunarMonth: 12, lunarDay: 30, name: "Giao Thừa", type: "major" },
];

// ==================== INTERFACES ====================

export interface SolarDate {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
  dayOfWeekName: string;
  weekOfYear: number;
  dayOfYear: number;
}

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
  yearCanChi: string;
  monthCanChi: string;
  dayCanChi: string;
  hourCanChi: string;
  zodiac: string;
  tietKhi: string;
  gioHoangDao: string[];
  monthName: string;
  specialDay: string | null; // Ngày lễ đặc biệt theo âm lịch
}

export interface VanLangDate {
  year: number;
  yearCanChi: string;
  month: number;
  monthName: string; // Tên tháng theo Chi (Tý, Sửu, Dần...)
  monthCanChi: string;
  day: number;
  dayCanChi: string;
  dayOfYear: number; // Ngày thứ mấy trong năm Văn Lang
  weekOfYear: number; // Tuần 10 ngày trong năm
  weekOfMonth: number; // Tuần 14 ngày trong tháng (tuần con nước)
  conNuoc: {
    name: string;
    phase: string;
    desc: string;
  };
}

export interface CalendarInfo {
  solar: SolarDate;
  lunar: LunarDate;
  vanLang: VanLangDate;
}

// ==================== CORE FUNCTIONS ====================

/**
 * Tính số ngày Julius từ ngày Dương lịch
 */
function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd =
    dd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  if (jd < 2299161) {
    jd =
      dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

/**
 * Chuyển số ngày Julius sang ngày Dương lịch
 */
function jdToDate(jd: number): [number, number, number] {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);
  return [day, month, year];
}

/**
 * Tính ngày Sóc (New Moon) - sử dụng công thức Astronomical Algorithms
 */
function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 =
    C1 -
    0.0074 * Math.sin(dr * (M - Mpr)) +
    0.0004 * Math.sin(dr * (2 * F + M));
  C1 =
    C1 -
    0.0004 * Math.sin(dr * (2 * F - M)) -
    0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 =
    C1 +
    0.001 * Math.sin(dr * (2 * F - Mpr)) +
    0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat;
  if (T < -11) {
    deltat =
      0.001 +
      0.000839 * T +
      0.0002261 * T2 -
      0.00000845 * T3 -
      0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  const JdNew = Jd1 + C1 - deltat;
  return Math.floor(JdNew + 0.5 + timeZone / 24);
}

/**
 * Tính tọa độ Mặt Trời
 */
function getSunLongitude(jdn: number, timeZone: number): number {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL =
    DL +
    (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
    0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
  return Math.floor((L / Math.PI) * 6);
}

/**
 * Lấy ngày bắt đầu tháng Âm lịch thứ k
 */
function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

/**
 * Xác định tháng nhuận
 */
function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Chuyển ngày Dương lịch sang Âm lịch
 */
export function solarToLunar(
  dd: number,
  mm: number,
  yy: number,
  timeZone: number = 7
): [number, number, number, boolean] {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return [lunarDay, lunarMonth, lunarYear, lunarLeap];
}

/**
 * Chuyển ngày Âm lịch sang Dương lịch
 */
export function lunarToSolar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  lunarLeap: boolean,
  timeZone: number = 7
): [number, number, number] {
  let a11, b11;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
    if (lunarLeap && lunarMonth !== leapMonth) {
      return [0, 0, 0];
    } else if (lunarLeap || off >= leapOff) {
      off += 1;
    }
  }
  const monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

// ==================== CAN CHI FUNCTIONS ====================

/**
 * Tính Can Chi của năm
 */
export function getYearCanChi(year: number): string {
  const can = CAN[(year + 6) % 10];
  const chi = CHI[(year + 8) % 12];
  return `${can} ${chi}`;
}

/**
 * Tính Can Chi của tháng Âm lịch
 */
export function getMonthCanChi(lunarMonth: number, lunarYear: number): string {
  const yearStem = (lunarYear + 6) % 10;
  let monthStem;
  if (yearStem % 5 === 0) {
    monthStem = (lunarMonth + 1) % 10;
  } else if (yearStem % 5 === 1) {
    monthStem = (lunarMonth + 3) % 10;
  } else if (yearStem % 5 === 2) {
    monthStem = (lunarMonth + 5) % 10;
  } else if (yearStem % 5 === 3) {
    monthStem = (lunarMonth + 7) % 10;
  } else {
    monthStem = (lunarMonth + 9) % 10;
  }
  const monthBranch = (lunarMonth + 1) % 12;
  return `${CAN[monthStem]} ${CHI[monthBranch]}`;
}

/**
 * Tính Can Chi của ngày
 * Chuẩn hóa theo: 04/02/2025 = Giáp Thìn
 * JD(04/02/2025) = 2460710
 * Giáp = index 0, Thìn = index 4
 */
export function getDayCanChi(dd: number, mm: number, yy: number): string {
  const jd = jdFromDate(dd, mm, yy);
  // Chuẩn hóa offset để 04/02/2025 (JD=2460710) = Giáp Thìn
  // (2460710 + can_offset) % 10 = 0 → can_offset = 0
  // (2460710 + chi_offset) % 12 = 4 → chi_offset = 2
  const can = CAN[(jd + 0) % 10];
  const chi = CHI[(jd + 2) % 12];
  return `${can} ${chi}`;
}

/**
 * Lấy Chi của ngày
 * Chuẩn hóa theo: 04/02/2025 = Thìn (index 4)
 */
export function getDayChi(dd: number, mm: number, yy: number): string {
  const jd = jdFromDate(dd, mm, yy);
  return CHI[(jd + 2) % 12];
}

/**
 * Tính Can Chi của giờ
 * Chuẩn hóa theo: 04/02/2025 giờ Tý = Giáp Tý
 */
export function getHourCanChi(
  hour: number,
  dd: number,
  mm: number,
  yy: number
): string {
  const jd = jdFromDate(dd, mm, yy);
  const dayStem = (jd + 0) % 10; // Cùng offset với getDayCanChi

  // Xác định chi của giờ
  let hourBranch;
  if (hour >= 23 || hour < 1)
    hourBranch = 0; // Tý
  else if (hour < 3)
    hourBranch = 1; // Sửu
  else if (hour < 5)
    hourBranch = 2; // Dần
  else if (hour < 7)
    hourBranch = 3; // Mão
  else if (hour < 9)
    hourBranch = 4; // Thìn
  else if (hour < 11)
    hourBranch = 5; // Tỵ
  else if (hour < 13)
    hourBranch = 6; // Ngọ
  else if (hour < 15)
    hourBranch = 7; // Mùi
  else if (hour < 17)
    hourBranch = 8; // Thân
  else if (hour < 19)
    hourBranch = 9; // Dậu
  else if (hour < 21)
    hourBranch = 10; // Tuất
  else hourBranch = 11; // Hợi

  // Tính Can của giờ dựa trên Can của ngày
  const hourStem = (dayStem * 2 + hourBranch) % 10;

  return `${CAN[hourStem]} ${CHI[hourBranch]}`;
}

/**
 * Lấy con giáp của năm
 */
export function getZodiac(year: number): string {
  return CON_GIAP[(year + 8) % 12];
}

// ==================== SOLAR CALENDAR FUNCTIONS ====================

/**
 * Tính tuần thứ mấy trong năm theo chuẩn ISO 8601
 * Tuần 1 là tuần đầu tiên có ít nhất 4 ngày trong năm mới
 */
export function getWeekOfYear(date: Date): number {
  const target = new Date(date.valueOf());
  // Đặt về ngày Thứ Năm của tuần hiện tại (ISO week is defined by its Thursday)
  const dayNr = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  target.setDate(target.getDate() - dayNr + 3);
  // Lấy ngày đầu năm
  const firstThursday = new Date(target.getFullYear(), 0, 1);
  // Tìm Thứ Năm đầu tiên của năm
  if (firstThursday.getDay() !== 4) {
    firstThursday.setMonth(0, 1 + ((4 - firstThursday.getDay() + 7) % 7));
  }
  // Tính số tuần
  const weekNumber =
    1 +
    Math.round(
      (target.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
  return weekNumber;
}

/**
 * Tính ngày thứ mấy trong năm
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Lấy thông tin Lịch Dương
 */
export function getSolarDateInfo(date: Date): SolarDate {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    dayOfWeek: date.getDay(),
    dayOfWeekName: THU_TRONG_TUAN[date.getDay()],
    weekOfYear: getWeekOfYear(date),
    dayOfYear: getDayOfYear(date),
  };
}

// ==================== LUNAR CALENDAR FUNCTIONS ====================

/**
 * Lấy tiết khí gần nhất
 */
export function getTietKhi(month: number, day: number): string {
  for (let i = TIET_KHI.length - 1; i >= 0; i--) {
    const tk = TIET_KHI[i];
    if (month > tk.solar[0] || (month === tk.solar[0] && day >= tk.solar[1])) {
      return tk.name;
    }
  }
  return TIET_KHI[TIET_KHI.length - 1].name;
}

/**
 * Lấy giờ hoàng đạo trong ngày
 */
export function getGioHoangDao(dd: number, mm: number, yy: number): string[] {
  const dayChi = getDayChi(dd, mm, yy);
  return GIO_HOANG_DAO[dayChi] || [];
}

/**
 * Lấy thông tin Lịch Âm
 */
export function getLunarDateInfo(date: Date): LunarDate {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yy = date.getFullYear();
  const hour = date.getHours();

  const [lunarDay, lunarMonth, lunarYear, isLeapMonth] = solarToLunar(
    dd,
    mm,
    yy
  );

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeapMonth,
    yearCanChi: getYearCanChi(lunarYear),
    monthCanChi: getMonthCanChi(lunarMonth, lunarYear),
    dayCanChi: getDayCanChi(dd, mm, yy),
    hourCanChi: getHourCanChi(hour, dd, mm, yy),
    zodiac: getZodiac(lunarYear),
    tietKhi: getTietKhi(mm, dd),
    gioHoangDao: getGioHoangDao(dd, mm, yy),
    monthName: THANG_AM[lunarMonth - 1],
    specialDay: getSpecialDay(lunarMonth, lunarDay),
  };
}

// ==================== VAN LANG CALENDAR FUNCTIONS ====================

// 12 Tháng Văn Lang theo Chi
// Tên tháng: Số thứ tự + Địa Chi
export const THANG_VAN_LANG_CHI = [
  "Dần", // Tháng 01 - Tháng Giêng
  "Mão", // Tháng 02 - Tháng Hai
  "Thìn", // Tháng 03 - Tháng Ba
  "Tỵ", // Tháng 04 - Tháng Tư
  "Ngọ", // Tháng 05 - Tháng Năm
  "Mùi", // Tháng 06 - Tháng Sáu
  "Thân", // Tháng 07 - Tháng Bảy
  "Dậu", // Tháng 08 - Tháng Tám
  "Tuất", // Tháng 09 - Tháng Chín
  "Hợi", // Tháng 10 - Tháng Mười
  "Tý", // Tháng 11 - Tháng Một (không phải Mười Một)
  "Sửu", // Tháng 12 - Tháng Chạp
];

// Tên tháng Văn Lang (chữ)
export const THANG_VAN_LANG_TEN = [
  "Giêng",
  "Hai",
  "Ba",
  "Tư",
  "Năm",
  "Sáu",
  "Bảy",
  "Tám",
  "Chín",
  "Mười",
  "Một",
  "Chạp",
];

// Ngày khởi đầu năm Văn Lang 2025 (Ất Tỵ)
// 04/02/2025 = Ngày 1 = Hàn Xuân (ngày đặc biệt)
const VAN_LANG_START_DATE = new Date(2025, 1, 4); // Feb 4, 2025

// Cấu trúc năm Văn Lang:
// - 5 ngày đặc biệt: Day 1 (Hàn Xuân), 92 (Vương Hầu), 183 (Nhiệt Thu), 274 (Thu Đông), 358 (Táo Quân)
// - 12 tháng × 30 ngày = 360 ngày (M12 bị chia làm 2 phần: 335-357 và 359-364)
// - Tổng: 5 ngày đặc biệt + 360 ngày = 365 ngày (năm thường)
// - Năm nhuận có thể có thêm 1 ngày (Giao Thừa)
interface VanLangPeriod {
  start: number;
  end: number;
  month: number; // 0 = ngày đặc biệt
  specialName?: string;
}

const VAN_LANG_YEAR_STRUCTURE: VanLangPeriod[] = [
  // Quý 1: Xuân (Lập Xuân)
  { start: 1, end: 1, month: 0, specialName: "Hàn Xuân" }, // 04/02/2025
  { start: 2, end: 31, month: 1 }, // M1 Dần: 30 days (05/02 - 06/03)
  { start: 32, end: 61, month: 2 }, // M2 Mão: 30 days (07/03 - 05/04)
  { start: 62, end: 91, month: 3 }, // M3 Thìn: 30 days (06/04 - 05/05)

  // Quý 2: Hạ (Lập Hạ)
  { start: 92, end: 92, month: 0, specialName: "Vương Hầu" }, // 06/05/2025
  { start: 93, end: 122, month: 4 }, // M4 Tỵ: 30 days (07/05 - 05/06)
  { start: 123, end: 152, month: 5 }, // M5 Ngọ: 30 days (06/06 - 05/07)
  { start: 153, end: 182, month: 6 }, // M6 Mùi: 30 days (06/07 - 04/08)

  // Quý 3: Thu (Lập Thu)
  { start: 183, end: 183, month: 0, specialName: "Nhiệt Thu" }, // 05/08/2025
  { start: 184, end: 213, month: 7 }, // M7 Thân: 30 days (06/08 - 04/09)
  { start: 214, end: 243, month: 8 }, // M8 Dậu: 30 days (05/09 - 04/10)
  { start: 244, end: 273, month: 9 }, // M9 Tuất: 30 days (05/10 - 03/11)

  // Quý 4: Đông (Lập Đông)
  { start: 274, end: 274, month: 0, specialName: "Thu Đông" }, // 04/11/2025
  { start: 275, end: 304, month: 10 }, // M10 Hợi: 30 days (05/11 - 04/12)
  { start: 305, end: 334, month: 11 }, // M11 Tý: 30 days (05/12 - 03/01/2026)
  { start: 335, end: 357, month: 12 }, // M12 Sửu phần 1: 23 days (04/01 - 26/01/2026)

  // Ngày 358 (Táo Quân) - ngày đặc biệt
  { start: 358, end: 358, month: 0, specialName: "Táo Quân" }, // 27/01/2026

  { start: 359, end: 364, month: 12 }, // M12 Sửu phần 2: 6 days (28/01 - 02/02/2026)

  // Ngày 365 (năm nhuận) hoặc kết thúc năm
  { start: 365, end: 365, month: 0, specialName: "Giao Thừa" }, // 03/02/2026
];

/**
 * Lấy ngày Mùng 1 Tết Âm lịch (dương lịch) cho một năm
 */
export function getLunarNewYearSolar(lunarYear: number): Date {
  // Mùng 1 tháng 1 âm lịch
  const [dd, mm, yy] = lunarToSolar(1, 1, lunarYear, false);
  return new Date(yy, mm - 1, dd);
}

/**
 * Tính số ngày từ Mùng 1 Tết đến ngày hiện tại
 */
export function getDaysSinceTet(date: Date): {
  daysSinceTet: number;
  vanLangYear: number;
} {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yy = date.getFullYear();

  // Lấy thông tin âm lịch để xác định năm
  const [, , lunarYear] = solarToLunar(dd, mm, yy);

  // Lấy ngày Mùng 1 Tết của năm âm lịch hiện tại
  const tetDate = getLunarNewYearSolar(lunarYear);

  // Tính số ngày từ Mùng 1 Tết đến ngày hiện tại
  const diffTime = date.getTime() - tetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Nếu diffDays < 0, thuộc năm Văn Lang trước
  if (diffDays < 0) {
    const prevTetDate = getLunarNewYearSolar(lunarYear - 1);
    const prevDiffTime = date.getTime() - prevTetDate.getTime();
    const prevDiffDays = Math.floor(prevDiffTime / (1000 * 60 * 60 * 24));

    return {
      daysSinceTet: prevDiffDays,
      vanLangYear: lunarYear - 1,
    };
  }

  return {
    daysSinceTet: diffDays,
    vanLangYear: lunarYear,
  };
}

/**
 * Tìm period trong cấu trúc năm Văn Lang
 */
function findVanLangPeriod(dayOfYear: number): VanLangPeriod | null {
  for (const period of VAN_LANG_YEAR_STRUCTURE) {
    if (dayOfYear >= period.start && dayOfYear <= period.end) {
      return period;
    }
  }
  return null;
}

/**
 * Kiểm tra ngày có phải ngày đặc biệt không (Giao mùa, Táo Quân, hoặc Giao Thừa)
 * 5-6 ngày đặc biệt: Day 1 (Hàn Xuân), 92 (Vương Hầu), 183 (Nhiệt Thu), 274 (Thu Đông), 358 (Táo Quân), 365 (Giao Thừa - năm nhuận)
 */
export function isSpecialDay(dayOfYear: number): {
  isSpecial: boolean;
  specialName: string | null;
} {
  const period = findVanLangPeriod(dayOfYear);
  if (period && period.month === 0) {
    return {
      isSpecial: true,
      specialName: period.specialName || "Ngày đặc biệt",
    };
  }
  return { isSpecial: false, specialName: null };
}

/**
 * Tính tháng và ngày Văn Lang từ dayOfYear
 * Cấu trúc năm:
 * - 5 ngày đặc biệt: Day 1 (Hàn Xuân), 92 (Vương Hầu), 183 (Nhiệt Thu), 274 (Thu Đông), 358 (Táo Quân)
 * - 12 tháng × 30 ngày = 360 ngày (M12 bị chia làm 2 phần: 335-357 và 359-364)
 * - Tổng: 5 ngày đặc biệt + 360 ngày = 365 ngày
 */
export function getVanLangMonthDay(dayOfYear: number): {
  month: number;
  day: number;
  isTetDay: boolean;
  isSpecialDay: boolean;
  specialName: string | null;
} {
  const period = findVanLangPeriod(dayOfYear);

  if (!period) {
    // Ngày vượt quá cấu trúc (> 365)
    return {
      month: 12,
      day: dayOfYear - 334,
      isTetDay: false,
      isSpecialDay: false,
      specialName: null,
    };
  }

  if (period.month === 0) {
    // Ngày đặc biệt (Giao mùa hoặc Táo Quân) - không thuộc tháng nào
    return {
      month: 0,
      day: 0,
      isTetDay: dayOfYear === 1,
      isSpecialDay: true,
      specialName: period.specialName || "Ngày đặc biệt",
    };
  }

  // Tháng thường
  let dayInMonth = dayOfYear - period.start + 1;

  // Điều chỉnh cho M12 phần 2 (sau Táo Quân)
  // M12 phần 1: Days 335-357 (D01-D23), Táo Quân: Day 358, M12 phần 2: Days 359-364 (D24-D30)
  if (period.start === 359) {
    dayInMonth = dayOfYear - 359 + 24; // Day 359 = M12D24
  }

  return {
    month: period.month,
    day: dayInMonth,
    isTetDay: false,
    isSpecialDay: false,
    specialName: null,
  };
}

/**
 * Lấy ngày lễ đặc lịch âm
 */
export function getSpecialDay(
  lunarMonth: number,
  lunarDay: number
): string | null {
  const specialDay = NGAY_LE_AM_LICH.find(
    (d) => d.lunarMonth === lunarMonth && d.lunarDay === lunarDay
  );
  return specialDay ? specialDay.name : null;
}

// ==================== CON NƯỚC CALENDAR FUNCTIONS ====================

/**
 * Sinh - Hồi theo Can ngày (10 Can chia 5 nhóm)
 */
export function getSinhHoi(dayCan: string): { sinh: string; hoi: string } {
  // Giáp, Ất, Mậu, Kỷ → Sinh: Thìn. Hồi: Tỵ.
  // Bính, Đinh → Sinh: Tỵ. Hồi: Thân.
  // Canh, Tân → Sinh: Ngọ. Hồi: Mùi.
  // Nhâm, Quý → Sinh: Thân. Hồi: Dậu.
  if (["Giáp", "Ất", "Mậu", "Kỷ"].includes(dayCan)) {
    return { sinh: "Thìn", hoi: "Tỵ" };
  } else if (["Bính", "Đinh"].includes(dayCan)) {
    return { sinh: "Tỵ", hoi: "Thân" };
  } else if (["Canh", "Tân"].includes(dayCan)) {
    return { sinh: "Ngọ", hoi: "Mùi" };
  } else {
    // Nhâm, Quý
    return { sinh: "Thân", hoi: "Dậu" };
  }
}

/**
 * Tính Can Chi ngày theo Lịch Văn Lang
 * Quy luật:
 * - Bắt đầu từ Giáp Dần vào ngày 01 Tháng Giêng (N=1)
 * - Chỉ đếm 360 ngày thường, BỎ QUA các ngày Biên (giao mùa)
 * - Chu kỳ 60 ngày: Giáp Dần → Ất Mão → ... → Quý Sửu → Giáp Dần
 * - Công thức: Can = (N-1) mod 10, Chi = (N+1) mod 12
 *
 * @param dayOfYear - Ngày thứ mấy trong năm Văn Lang (1-365)
 * @returns Can Chi string hoặc null nếu là ngày Biên
 */
export function getVanLangDayCanChi(dayOfYear: number): string | null {
  // Các ngày Biên (giao mùa và Táo Quân) không có Can Chi trong chu kỳ 360 ngày
  const bienDays = [1, 92, 183, 274, 358, 365];
  if (bienDays.includes(dayOfYear)) {
    return null; // Ngày Biên - không thuộc chu kỳ 360 ngày
  }

  // Tính N - vị trí trong chuỗi 360 ngày thường (bỏ qua ngày Biên)
  // Day 2-31: N = dayOfYear - 1 (đã trừ 1 ngày Biên: day 1)
  // Day 32-91: N = dayOfYear - 1
  // Day 93-182: N = dayOfYear - 2 (đã trừ 2 ngày Biên: day 1, 92)
  // Day 184-273: N = dayOfYear - 3 (đã trừ 3 ngày Biên: day 1, 92, 183)
  // Day 275-357: N = dayOfYear - 4 (đã trừ 4 ngày Biên: day 1, 92, 183, 274)
  // Day 359-364: N = dayOfYear - 5 (đã trừ 5 ngày Biên: day 1, 92, 183, 274, 358)
  let N: number;
  if (dayOfYear < 92) {
    N = dayOfYear - 1;
  } else if (dayOfYear < 183) {
    N = dayOfYear - 2;
  } else if (dayOfYear < 274) {
    N = dayOfYear - 3;
  } else if (dayOfYear < 358) {
    N = dayOfYear - 4;
  } else {
    // dayOfYear >= 359
    N = dayOfYear - 5;
  }

  // Tính Can Chi từ N (1-360)
  // Bắt đầu từ Giáp Dần (Can index 0, Chi index 2)
  // Can: (N-1) mod 10
  // Chi: (N+1) mod 12
  const canIndex = (N - 1) % 10;
  const chiIndex = (N + 1) % 12;

  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}

// Ngày nghén đầu tiên của năm 2025 (04/02/2025)
// Các ngày nghén cách nhau 14 ngày: 4/2, 18/2, 4/3, 18/3, 1/4, 15/4, ...
const CON_NUOC_START_DATE = new Date(2025, 1, 4); // Feb 4, 2025

/**
 * Tính thông tin Con Nước theo Lịch Văn Lang
 * Quy luật chu kỳ 14 ngày (tính từ ngày nghén cố định):
 * - Ngày 1: Nghén (neap tide, thủy triều nhỏ)
 * - Ngày 2: 01 con
 * - Ngày 3: 02 con
 * - Ngày 4: 03 con
 * - Ngày 5: 04 con
 * - Ngày 6: 05 con chày (chảy - thủy triều chuyển tiếp)
 * - Ngày 7: 06 con
 * - Ngày 8: 07 con cường (spring tide, thủy triều lớn nhất)
 * - Ngày 9: 08 con
 * - Ngày 10: 09 con
 * - Ngày 11: 10 con
 * - Ngày 12: 11 con
 * - Ngày 13: 12 con
 * - Ngày 14: 13 con
 * - Ngày 15: Nghén mới (chu kỳ tiếp)
 *
 * Tuần con nước: 14 ngày/tuần (không phải 7 ngày)
 * Tháng: theo Lịch Văn Lang (30 ngày/tháng, mỗi tháng có ~2 tuần con nước)
 * Nghén cách nhau 14 ngày, khoảng 26 chu kỳ/năm
 * Ngày nghén đầu tiên 2025: 04/02/2025
 */
export function getConNuoc(
  vanLangDay: number,
  vanLangMonth: number,
  dd: number,
  mm: number,
  yy: number,
  dayOfYear?: number,
  vanLangYearStart?: Date
): {
  name: string;
  dayNumber: number;
  cycleName: string;
  weekOfMonth: number;
  weekOfYear: number;
} {
  // Tính số ngày từ đầu năm Văn Lang (reset mỗi năm)
  let daysSinceYearStart = 0;
  if (dayOfYear && vanLangYearStart) {
    const currentDate = new Date(yy, mm - 1, dd);
    const diffTime = currentDate.getTime() - vanLangYearStart.getTime();
    daysSinceYearStart = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  } else {
    // Fallback: tính từ ngày nghén đầu tiên nếu không có thông tin năm
    const currentDate = new Date(yy, mm - 1, dd);
    const diffTime = currentDate.getTime() - CON_NUOC_START_DATE.getTime();
    daysSinceYearStart = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  // Xử lý ngày đặc biệt: Táo Quân (358) và ngày sau Táo Quân (359)
  if (dayOfYear === 358) {
    // Ngày Táo Quân = ngày 7 nước cường (không tính trong chu kỳ)
    // Tính tuần dựa trên ngày 357 (ngày trước Táo Quân)
    const adjustedDays = daysSinceYearStart - 1;
    return {
      name: "Ngày 07 nước cường",
      dayNumber: 7,
      cycleName: "nước cường",
      weekOfMonth: 0, // Ngày đặc biệt không thuộc tháng
      weekOfYear: Math.ceil((adjustedDays - 1) / 14),
    };
  }

  if (dayOfYear === 359) {
    // Ngày sau Táo Quân = ngày 7 nước dồn (không tính trong chu kỳ)
    // Tính tuần dựa trên ngày 357 (bỏ qua cả ngày 358 và 359)
    const adjustedDays = daysSinceYearStart - 2;
    return {
      name: "Ngày 07 nước dồn",
      dayNumber: 7,
      cycleName: "nước dồn",
      weekOfMonth: Math.ceil(vanLangDay / 14), // Thuộc M12 phần 2
      weekOfYear: Math.ceil((adjustedDays - 1) / 14),
    };
  }

  // Bỏ qua ngày 358 (Táo Quân) và 359 (ngày sau Táo Quân) khi tính chu kỳ
  // Điều chỉnh daysSinceYearStart để bỏ qua 2 ngày đặc biệt này
  // Logic: Ngày 357 = ngày 07 con cường (dayInCycle = 8)
  //        Ngày 360 phải là ngày 08 con (dayInCycle = 9)
  // Vì bỏ qua 2 ngày (358 và 359), nên ngày 360 sẽ được tính như ngày 358 trong chu kỳ
  // Nhưng để có dayInCycle = 9, cần adjustedDays sao cho (adjustedDays - 1) % 14 + 1 = 9
  // Giải: (adjustedDays - 1) % 14 = 8, adjustedDays - 1 = 8 + 14*k
  // Với k = 25: adjustedDays = 8 + 350 + 1 = 359
  // Vậy ngày 360 cần adjustedDays = 359 (tức là trừ 1, không phải trừ 2)
  // Nhưng điều này có nghĩa là chỉ bỏ qua ngày 358, không bỏ qua ngày 359?
  // Thực ra: Ngày 357 có dayInCycle = 8, ngày tiếp theo (358) bị bỏ qua
  //          Ngày 359 cũng bị bỏ qua, ngày 360 phải là ngày tiếp theo của 357
  //          Vậy ngày 360 = ngày 357 + 3 = ngày thứ 360 trong chu kỳ
  //          Nhưng trong chu kỳ, ngày sau ngày 8 (07 con cường) là ngày 9 (08 con)
  //          Vậy adjustedDays phải cho dayInCycle = 9
  //          (adjustedDays - 1) % 14 + 1 = 9 => adjustedDays - 1 = 8 + 14*k
  //          Với k = 25: adjustedDays = 359
  let adjustedDays = daysSinceYearStart;
  if (dayOfYear && dayOfYear > 359) {
    // Ngày 360: adjustedDays = 360 - 1 = 359 để có dayInCycle = 9
    // Điều này có nghĩa là chỉ bỏ qua ngày 358 trong tính toán chu kỳ
    // Ngày 359 cũng bị bỏ qua nhưng không ảnh hưởng đến tính toán vì đã xử lý riêng
    adjustedDays = daysSinceYearStart - 1;
  }

  // Tính vị trí trong chu kỳ 14 ngày (đã bỏ qua ngày 358 và 359)
  // adjustedDays = 1 → nghén (ngày 1 trong chu kỳ, dayInCycle = 1)
  // adjustedDays = 2 → 01 con (ngày 2 trong chu kỳ, dayInCycle = 2)
  // adjustedDays = 8 → 07 con cường (ngày 8 trong chu kỳ, dayInCycle = 8)
  // adjustedDays = 9 → 08 con (ngày 9 trong chu kỳ, dayInCycle = 9)
  // adjustedDays = 14 → 13 con (ngày 14 trong chu kỳ, dayInCycle = 14)
  // adjustedDays = 15 → nghén mới (ngày 1 trong chu kỳ mới, dayInCycle = 1)
  let dayInCycle = ((adjustedDays - 1) % 14) + 1; // 1-14
  if (dayInCycle <= 0) dayInCycle += 14; // Xử lý ngày trước ngày bắt đầu

  // Tính dayNumber (số thứ tự con nước)
  // dayInCycle = 1 → nghén (dayNumber = 0)
  // dayInCycle = 2 → 01 con (dayNumber = 1)
  // dayInCycle = 8 → 07 con cường (dayNumber = 7)
  // dayInCycle = 9 → 08 con (dayNumber = 8)
  // dayInCycle = 14 → 13 con (dayNumber = 13)
  const dayNumber = dayInCycle === 1 ? 0 : dayInCycle - 1;

  // Tên ngày con nước với các mốc đặc biệt
  // dayInCycle = 8 → dayNumber = 7 → "con cường"
  // dayInCycle = 9 → dayNumber = 8 → "con"
  // Vì đã bỏ qua ngày 358 và 359, nên:
  // - Ngày 360: adjustedDays = 359, dayInCycle = 9, dayNumber = 8 → "08 con" ✓
  let cycleName: string;
  if (dayNumber === 0) {
    cycleName = "nghén";
  } else if (dayNumber === 5) {
    cycleName = "con chày"; // 05 con chày - thủy triều chảy/chuyển tiếp
  } else if (dayNumber === 7) {
    // Ngày 7 con cường chỉ khi dayInCycle = 8 (ngày 8 trong chu kỳ)
    // Sau khi bỏ qua ngày 358 và 359, ngày 360 sẽ có dayInCycle = 9, dayNumber = 8
    cycleName = dayInCycle === 8 ? "con cường" : "con"; // 07 con cường - thủy triều lớn nhất
  } else {
    cycleName = "con";
  }

  // Tuần trong tháng Văn Lang (14 ngày/tuần, 30 ngày/tháng)
  // Tuần 1: ngày 1-14, Tuần 2: ngày 15-28, Tuần 3: ngày 29-30
  // Nếu là ngày đặc biệt (vanLangMonth = 0), tuần = 0
  let weekOfMonth = 0;
  if (vanLangMonth > 0 && vanLangDay > 0) {
    weekOfMonth = Math.ceil(vanLangDay / 14);
  }

  // Tuần trong năm (tính theo số chu kỳ con nước từ đầu năm, đã bỏ qua ngày 358 và 359)
  const weekOfYear = Math.ceil((adjustedDays - 1) / 14);

  return {
    name:
      dayNumber === 0
        ? "Ngày con nước nghén"
        : `Ngày ${dayNumber.toString().padStart(2, "0")} ${cycleName}`,
    dayNumber,
    cycleName,
    weekOfMonth,
    weekOfYear,
  };
}

/**
 * Lấy ngày khởi đầu năm Văn Lang
 * Năm Văn Lang bắt đầu từ ngày Lập Xuân (khoảng 4/2 hàng năm)
 * 2025: 04/02/2025
 */
function getVanLangYearStart(year: number): Date {
  // Năm Văn Lang bắt đầu từ khoảng 4/2 (có thể điều chỉnh theo tiết Lập Xuân)
  // Đây là giá trị cố định cho năm 2025, các năm khác cần tính toán
  if (year === 2025) {
    return new Date(2025, 1, 4); // 04/02/2025
  }
  // Các năm khác: ước tính dựa trên chu kỳ 365/366 ngày
  const baseYear = 2025;
  const baseDateMs = new Date(2025, 1, 4).getTime();
  const yearDiff = year - baseYear;
  // Tính số ngày giữa các năm (trung bình 365.25 ngày/năm)
  const daysDiff = Math.round(yearDiff * 365.25);
  return new Date(baseDateMs + daysDiff * 24 * 60 * 60 * 1000);
}

/**
 * Lấy thông tin Lịch Văn Lang
 * Quy luật:
 * - Năm bắt đầu: Ngày Lập Xuân (04/02/2025 = Ngày 1 = Hàn Xuân)
 * - 4 ngày đặc biệt (giao mùa): Day 1, 92, 183, 274
 * - 12 tháng × 30 ngày = 360 ngày (bắt đầu từ Day 2)
 * - Tuần: 10 ngày/tuần (không phải 7 ngày)
 * - Can Chi ngày: DÙNG CHUNG với Âm lịch
 */
export function getVanLangDateInfo(date: Date): VanLangDate {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yy = date.getFullYear();

  // Tính năm Văn Lang và ngày trong năm
  // Năm Văn Lang 2025 bắt đầu từ 04/02/2025
  let vanLangYear = yy;
  let vanLangYearStart = getVanLangYearStart(vanLangYear);

  // Nếu ngày hiện tại trước ngày bắt đầu năm Văn Lang, thuộc năm trước
  if (date < vanLangYearStart) {
    vanLangYear -= 1;
    vanLangYearStart = getVanLangYearStart(vanLangYear);
  }

  // Tính số ngày từ đầu năm Văn Lang
  const diffTime = date.getTime() - vanLangYearStart.getTime();
  let dayOfYear = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Xử lý năm nhuận (năm Văn Lang có thể > 365 ngày)
  if (dayOfYear > 365) {
    vanLangYear += 1;
    vanLangYearStart = getVanLangYearStart(vanLangYear);
    const newDiffTime = date.getTime() - vanLangYearStart.getTime();
    dayOfYear = Math.floor(newDiffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  // Tính tháng và ngày Văn Lang
  const vanLangData = getVanLangMonthDay(dayOfYear);
  const { month, day, isTetDay, isSpecialDay, specialName } = vanLangData;

  // Tên tháng theo Chi
  let monthName: string;
  let displayMonth: number;

  if (isTetDay) {
    monthName = "Tết";
    displayMonth = 0;
  } else if (isSpecialDay) {
    monthName = specialName || "Ngày đặc biệt";
    displayMonth = 0;
  } else {
    monthName = THANG_VAN_LANG_CHI[month - 1] || "Dần";
    displayMonth = month;
  }

  // Tuần trong năm Văn Lang (10 ngày/tuần - không phải 7 ngày như lịch Dương)
  // Tuần 01: Ngày 2-11, Tuần 02: Ngày 12-21, Tuần 03: Ngày 22-31, ...
  // Các ngày đặc biệt (1, 92, 183, 274, 358, 365) không thuộc tuần nào
  // Tính số ngày thường (bỏ qua ngày đặc biệt) để tính tuần
  let dayInRegularSequence: number;
  if (isSpecialDay || isTetDay) {
    // Ngày đặc biệt không thuộc tuần nào
    dayInRegularSequence = 0;
  } else {
    // Tính số ngày thường (bỏ qua các ngày đặc biệt: 1, 92, 183, 274, 358)
    if (dayOfYear < 92) {
      dayInRegularSequence = dayOfYear - 1; // Bỏ qua ngày 1
    } else if (dayOfYear < 183) {
      dayInRegularSequence = dayOfYear - 2; // Bỏ qua ngày 1, 92
    } else if (dayOfYear < 274) {
      dayInRegularSequence = dayOfYear - 3; // Bỏ qua ngày 1, 92, 183
    } else if (dayOfYear < 358) {
      dayInRegularSequence = dayOfYear - 4; // Bỏ qua ngày 1, 92, 183, 274
    } else {
      // dayOfYear >= 359 (đã bỏ qua ngày 358)
      dayInRegularSequence = dayOfYear - 5; // Bỏ qua ngày 1, 92, 183, 274, 358
    }
  }
  // Tuần 10 ngày/tuần: Tuần 1 = ngày 1-10, Tuần 2 = ngày 11-20, ...
  const weekOfYear =
    dayInRegularSequence <= 0 ? 0 : Math.ceil(dayInRegularSequence / 10);

  // Can Chi ngày theo Lịch Văn Lang (RIÊNG, không dùng chung với Âm lịch)
  // Bắt đầu từ Giáp Dần vào ngày 01 Tháng Giêng, chu kỳ 60 ngày trên 360 ngày thường
  const vanLangCanChi = getVanLangDayCanChi(dayOfYear);
  const dayCanChi = vanLangCanChi || "Ngày Biên"; // Ngày Biên không có Can Chi chu kỳ

  // Can Chi tháng (nếu không phải Tết/Giao mùa)
  const monthCanChi =
    displayMonth > 0 ? getMonthCanChi(displayMonth, vanLangYear) : "";

  // Thông tin Con Nước (dùng ngày/tháng Văn Lang, không dùng âm lịch)
  const conNuoc = getConNuoc(
    day,
    displayMonth,
    dd,
    mm,
    yy,
    dayOfYear,
    vanLangYearStart
  );

  // Lấy tên tháng Văn Lang cho Con Nước
  const vanLangMonthName =
    displayMonth > 0
      ? THANG_VAN_LANG_TEN[displayMonth - 1] || ""
      : specialName || "Ngày đặc biệt";

  // Lấy thông tin âm lịch cho ngày lễ đặc biệt
  const [lunarDay, lunarMonth] = solarToLunar(dd, mm, yy);

  return {
    year: vanLangYear,
    yearCanChi: getYearCanChi(vanLangYear),
    month: displayMonth,
    monthName: isTetDay
      ? "Ngày Tết"
      : isSpecialDay
        ? specialName || "Ngày đặc biệt"
        : `Tháng ${monthName}`,
    monthCanChi,
    day,
    dayCanChi,
    dayOfYear,
    weekOfYear,
    weekOfMonth: displayMonth > 0 ? Math.ceil(day / 14) : 0, // 14 ngày/tuần (tuần con nước)
    conNuoc: {
      name: conNuoc.name,
      phase: conNuoc.cycleName,
      desc:
        displayMonth > 0
          ? `Tuần ${conNuoc.weekOfMonth.toString().padStart(2, "0")} tháng ${vanLangMonthName} - Tuần ${conNuoc.weekOfYear.toString().padStart(2, "0")} của năm`
          : `${vanLangMonthName} - Tuần ${conNuoc.weekOfYear.toString().padStart(2, "0")} của năm`,
    },
  };
}

// ==================== MAIN FUNCTION ====================

/**
 * Lấy đầy đủ thông tin cả 3 loại lịch
 */
export function getFullCalendarInfo(date: Date): CalendarInfo {
  return {
    solar: getSolarDateInfo(date),
    lunar: getLunarDateInfo(date),
    vanLang: getVanLangDateInfo(date),
  };
}

/**
 * Chuyển đổi từ Âm lịch sang Dương lịch và lấy thông tin đầy đủ
 */
export function getCalendarInfoFromLunar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  isLeapMonth: boolean = false
): CalendarInfo | null {
  const [dd, mm, yy] = lunarToSolar(
    lunarDay,
    lunarMonth,
    lunarYear,
    isLeapMonth
  );
  if (dd === 0) return null;

  const date = new Date(yy, mm - 1, dd);
  return getFullCalendarInfo(date);
}
