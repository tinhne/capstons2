import React, { useEffect, useState } from "react";
import {
  fetchDiseasesPaging,
  createDisease,
  updateDisease,
  deleteDisease,
  searchDiseases,
  searchDiseasesPaging,
} from "../../services/diseaseService";
import { Disease } from "../../types";
import Modal from "../../../../components/ui/Modal";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const PAGE_SIZE = 10;

const DiseaseCRUD: React.FC = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<Disease>>({});
  const [selected, setSelected] = useState<Disease | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Load danh sách bệnh (có thể là search hoặc paging)
  const loadDiseases = async (pageNum = page, keyword = search) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (keyword && keyword.trim()) {
        res = await searchDiseasesPaging(keyword.trim(), pageNum, PAGE_SIZE);
        setIsSearching(true);
      } else {
        res = await fetchDiseasesPaging(pageNum, PAGE_SIZE);
        setIsSearching(false);
      }
      const data =
        res.data?.content || res.data?.data?.content || res.content || [];
      setDiseases(data);
      setTotalPages(res.data?.totalPages || res.totalPages || 1);
      setTotalElements(
        res.data?.totalElements || res.totalElements || data.length
      );
      setPage(res.data?.number || res.number || pageNum);
    } catch (e) {
      setError("Không thể tải danh sách bệnh");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiseases(0, "");
    // eslint-disable-next-line
  }, []);

  // Xử lý thay đổi form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Mở modal khi nhấn Thêm mới
  const handleAdd = () => {
    setSelected(null);
    setForm({});
    setShowModal(true);
  };

  // Mở modal khi nhấn Sửa
  const handleEdit = (disease: Disease) => {
    setSelected(disease);
    setForm(disease);
    setShowModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setForm({});
    setSelected(null);
    setError(null);
  };

  // Thêm mới hoặc cập nhật bệnh
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (selected) {
        const updated = await updateDisease(selected.diseaseId, form);
        setDiseases((prev) =>
          prev.map((d) =>
            d.diseaseId === updated.diseaseId ? { ...d, ...updated } : d
          )
        );
      } else {
        const created = await createDisease(form);
        // Nếu đang ở trang đầu, thêm vào đầu danh sách, nếu không thì không cần cập nhật
        if (page === 0) {
          setDiseases((prev) => [created, ...prev.slice(0, PAGE_SIZE - 1)]);
        }
        setTotalElements((prev) => prev + 1);
      }
      handleCloseModal();
    } catch {
      setError(selected ? "Cập nhật thất bại" : "Thêm mới thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Xóa bệnh
  const handleDelete = async (diseaseId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa bệnh này?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteDisease(diseaseId);
      setDiseases((prev) => prev.filter((d) => d.diseaseId !== diseaseId));
      setTotalElements((prev) => prev - 1);
      // Nếu xóa hết bản ghi ở trang hiện tại, tự động chuyển về trang trước nếu có
      if (diseases.length === 1 && page > 0) {
        handlePageChange(page - 1);
      }
    } catch {
      setError("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm bệnh (phân trang)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    loadDiseases(0, search);
  };

  // Quay lại danh sách phân trang
  const handleBackToPaging = () => {
    setSearch("");
    loadDiseases(0, "");
  };

  // Chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    loadDiseases(newPage, search);
  };

  // Helper tạo mảng số trang hiển thị dạng [1, 2, '...', 9, 10]
  const getPagination = (current: number, total: number) => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l: number | undefined = undefined;
    for (let i = 0; i < total; i++) {
      if (
        i === 0 ||
        i === total - 1 ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    for (let i = 0; i < range.length; i++) {
      if (typeof l === "number") {
        if (range[i] - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (range[i] - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(range[i]);
      l = range[i];
    }
    return rangeWithDots;
  };

  return (
    <div className=" mx-auto p-6 ">
      {/* Search box redesigned */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between"
      >
        <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 shadow-sm">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="bg-transparent outline-none flex-1 px-2 py-1 text-gray-700"
            placeholder="Tìm kiếm tên, mô tả bệnh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-blue-700 transition text-sm"
            disabled={loading || !search.trim()}
          >
            Tìm kiếm
          </button>
          {isSearching && (
            <button
              type="button"
              className="ml-2 bg-gray-400 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-gray-500 transition text-sm"
              onClick={handleBackToPaging}
              disabled={loading}
            >
              Quay lại
            </button>
          )}
        </div>
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition"
          onClick={handleAdd}
          type="button"
        >
          + Thêm mới bệnh
        </button>
      </form>
      <div className="overflow-x-auto rounded-lg border border-gray-200 h-[60vh] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-blue-600 font-semibold">
            Đang tải...
          </div>
        ) : (
          <table className="w-full text-sm bg-white">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Tên tiếng Anh</th>
                <th className="p-3 border-b">Mô tả tiếng Anh</th>
                <th className="p-3 border-b">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {diseases.map((d) => (
                <tr
                  key={d.diseaseId}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="p-3 text-gray-700">{d.diseaseId}</td>
                  <td className="p-3">{d.nameEn}</td>
                  <td className="p-3 max-w-xs truncate" title={d.descriptionEn}>
                    {d.descriptionEn}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(d)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(d.diseaseId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {diseases.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* Pagination controls */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
        <button
          className="px-4 py-1 border rounded disabled:opacity-50"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0 || loading}
        >
          &#60;
        </button>
        {getPagination(page, totalPages).map((item, idx) =>
          item === "..." ? (
            <span
              key={"dots-" + idx}
              className="px-3 py-1 text-gray-400 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              className={`px-4 py-1 border rounded font-semibold ${
                item === page
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-800"
              }`}
              onClick={() => handlePageChange(Number(item))}
              disabled={loading || item === page}
            >
              {Number(item) + 1}
            </button>
          )
        )}
        <button
          className="px-4 py-1 border rounded disabled:opacity-50"
          onClick={() => handlePageChange(page + 1)}
          disabled={page + 1 >= totalPages || loading}
        >
          &#62;
        </button>
      </div>
      {/* Modal for add/edit */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <div className="w-full max-w-lg p-4">
          <h3 className="text-xl font-bold mb-4 text-blue-700 text-center">
            {selected ? "Cập nhật thông tin bệnh" : "Thêm mới bệnh"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 mb-1">Tên tiếng Anh</label>
              <input
                name="nameEn"
                value={form.nameEn || ""}
                onChange={handleChange}
                placeholder="Tên tiếng Anh"
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 mb-1">Tên tiếng Việt</label>
              <input
                name="nameVn"
                value={form.nameVn || ""}
                onChange={handleChange}
                placeholder="Tên tiếng Việt"
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">
                Mô tả tiếng Anh
              </label>
              <textarea
                name="descriptionEn"
                value={form.descriptionEn || ""}
                onChange={handleChange}
                placeholder="Mô tả tiếng Anh"
                className="border p-2 rounded w-full min-h-[60px]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">
                Mô tả tiếng Việt
              </label>
              <textarea
                name="descriptionVn"
                value={form.descriptionVn || ""}
                onChange={handleChange}
                placeholder="Mô tả tiếng Việt"
                className="border p-2 rounded w-full min-h-[60px]"
              />
            </div>
            <div className="col-span-2 flex gap-2 justify-center mt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
                disabled={loading}
              >
                {selected ? "Cập nhật" : "Thêm mới"}
              </button>
              <button
                type="button"
                className="bg-gray-400 text-white px-6 py-2 rounded font-semibold hover:bg-gray-500 transition"
                onClick={handleCloseModal}
                disabled={loading}
              >
                Hủy
              </button>
            </div>
            {error && (
              <div className="col-span-2 text-center text-red-500 mt-2">
                {error}
              </div>
            )}
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default DiseaseCRUD;
