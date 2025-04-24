/**
 * Định dạng ngày tháng thành chuỗi dd/MM/yyyy
 * @param date Đối tượng ngày hoặc chuỗi ISO
 * @returns Chuỗi ngày định dạng dd/MM/yyyy
 */
export function formatToLocalDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Ngày không hợp lệ";
  }

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Định dạng ngày tháng thành chuỗi dd/MM/yyyy HH:mm
 * @param date Đối tượng ngày hoặc chuỗi ISO
 * @returns Chuỗi ngày giờ định dạng dd/MM/yyyy HH:mm
 */
export function formatToLocalDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Thời gian không hợp lệ";
  }

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Định dạng thành chuỗi thời gian tương đối (vd: "5 phút trước")
 * @param date Đối tượng ngày hoặc chuỗi ISO
 * @returns Chuỗi thời gian tương đối
 */
export function formatToRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Thời gian không hợp lệ";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  // Ít hơn 1 phút
  if (diffInSeconds < 60) {
    return "Vừa xong";
  }

  // Ít hơn 1 giờ
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  }

  // Ít hơn 1 ngày
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  }

  // Ít hơn 1 tuần
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ngày trước`;
  }

  // Ít hơn 1 tháng
  if (diffInSeconds < 2592000) {
    // xấp xỉ 30 ngày
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} tuần trước`;
  }

  // Ít hơn 1 năm
  if (diffInSeconds < 31536000) {
    // xấp xỉ 365 ngày
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} tháng trước`;
  }

  // Lâu hơn 1 năm
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} năm trước`;
}

/**
 * Chuyển đổi chuỗi ngày tháng thành đối tượng Date
 * @param dateString Chuỗi ngày tháng định dạng dd/MM/yyyy
 * @returns Đối tượng Date
 */
export function parseLocalDate(dateString: string): Date {
  const parts = dateString.split("/");

  if (parts.length !== 3) {
    throw new Error("Định dạng ngày không hợp lệ. Yêu cầu dd/MM/yyyy");
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Tháng trong JS bắt đầu từ 0
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);

  if (isNaN(date.getTime())) {
    throw new Error("Ngày không hợp lệ");
  }

  return date;
}

/**
 * Định dạng chỉ thời gian HH:MM
 * @param date Đối tượng ngày hoặc chuỗi ISO
 * @returns Chuỗi thời gian định dạng HH:MM
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Thời gian không hợp lệ";
  }

  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

/**
 * Format a Date object to a readable string
 * If date is today, return time (e.g. "14:30")
 * If date is within last week, return day and time (e.g. "Mon, 14:30")
 * Otherwise return full date (e.g. "2023-04-12")
 *
 * @param date The date to format
 * @param format Optional format type (if not provided, uses smart formatting)
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format?: "date" | "datetime" | "relative" | "time"
): string {
  // If format is specified, use the existing functions
  if (format !== undefined) {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "Thời gian không hợp lệ";
    }

    switch (format) {
      case "date":
        return formatToLocalDate(dateObj);
      case "datetime":
        return formatToLocalDateTime(dateObj);
      case "relative":
        return formatToRelativeTime(dateObj);
      case "time":
        return formatTime(dateObj);
      default:
        return formatToLocalDate(dateObj);
    }
  }

  // Smart formatting based on date proximity
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateDay = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate()
  );

  // Format time (HH:MM)
  const timeString = formatTime(dateObj);

  // If date is today
  if (dateDay.getTime() === today.getTime()) {
    return timeString;
  }

  // If date is yesterday
  if (dateDay.getTime() === yesterday.getTime()) {
    return `Yesterday, ${timeString}`;
  }

  // If date is within the last week
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);

  if (dateDay >= oneWeekAgo) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = dayNames[dateObj.getDay()];
    return `${dayName}, ${timeString}`;
  }

  // Otherwise return date in YYYY-MM-DD format
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
