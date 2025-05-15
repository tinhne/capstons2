/**
 * Cấu trúc phản hồi API tiêu chuẩn
 */
export interface ApiResponse<T = any> {
  /**
   * Mã trạng thái API
   */
  status: number;

  /**
   * Thông báo từ API
   */
  message: string;

  /**
   * Dữ liệu phản hồi
   */
  data: T;

  /**
   * Thông tin meta (phân trang, lọc...)
   */
  meta?: {
    /**
     * Tổng số bản ghi
     */
    total?: number;

    /**
     * Trang hiện tại
     */
    currentPage?: number;

    /**
     * Số bản ghi trên mỗi trang
     */
    perPage?: number;

    /**
     * Số trang
     */
    totalPages?: number;

    /**
     * Thông tin bổ sung khác
     */
    [key: string]: any;
  };

  /**
   * Chi tiết lỗi (nếu có)
   */
  errors?: Record<string, string[]>;
}

/**
 * Các tham số phân trang
 */
export interface PaginationParams {
  /**
   * Trang hiện tại
   */
  page: number;

  /**
   * Số lượng mục trên mỗi trang
   */
  limit: number;
}

/**
 * Các tham số sắp xếp
 */
export interface SortParams {
  /**
   * Trường sắp xếp
   */
  sortBy: string;

  /**
   * Hướng sắp xếp
   */
  sortOrder: "asc" | "desc";
}

/**
 * Các tham số lọc
 */
export interface FilterParams {
  [key: string]: string | number | boolean | string[] | null | undefined;
}

/**
 * Các tham số tìm kiếm
 */
export type SearchParams = PaginationParams &
  Partial<SortParams> &
  FilterParams;

/**
 * Định nghĩa quyền trong hệ thống
 */
export interface Permission {
  name: string;
  description: string;
}

/**
 * Định nghĩa vai trò trong hệ thống
 */
export interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}
