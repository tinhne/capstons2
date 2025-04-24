import { useState, useEffect } from "react";

/**
 * Hook để sử dụng localStorage với React
 * @param key Khóa lưu trữ trong localStorage
 * @param initialValue Giá trị mặc định nếu không tìm thấy khóa trong localStorage
 * @returns [storedValue, setValue] - giá trị hiện tại và hàm cập nhật giá trị
 */
function useLocalStorage<T>(key: string, initialValue: T) {
  // Khởi tạo state với giá trị từ localStorage hoặc initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Đồng bộ giữa các tab/window
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
          console.error(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  // Hàm để cập nhật giá trị trong localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Cho phép value là một function giống như useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Lưu state
      setStoredValue(valueToStore);

      // Lưu vào localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
