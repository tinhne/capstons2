import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

type Theme = "dark" | "light" | "system";

interface UseDarkModeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

/**
 * Hook để quản lý chế độ tối trong ứng dụng
 * @param defaultTheme Chế độ mặc định ('dark', 'light', 'system')
 * @returns {UseDarkModeReturn} Đối tượng chứa theme, hàm setTheme và resolvedTheme
 */
function useDarkMode(defaultTheme: Theme = "system"): UseDarkModeReturn {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useLocalStorage<"dark" | "light">(
    "resolved-theme",
    "light"
  );

  // Xác định theme từ cài đặt hệ thống khi theme là 'system'
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Cập nhật resolved theme dựa trên theme hiện tại và cài đặt hệ thống
    const updateResolvedTheme = () => {
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      const newResolvedTheme = theme === "system" ? systemTheme : theme;
      setResolvedTheme(newResolvedTheme);

      // Cập nhật class trong document
      if (newResolvedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    updateResolvedTheme();

    // Lắng nghe thay đổi từ cài đặt hệ thống
    const handleChange = () => {
      if (theme === "system") {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme, setResolvedTheme]);

  return {
    theme,
    setTheme,
    resolvedTheme,
  };
}

export default useDarkMode;
