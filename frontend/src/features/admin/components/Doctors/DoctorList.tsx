import React, { useEffect, useState } from "react";
import userService from "../../../users/services/userService";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import { UserProfile, CreateUser } from "../../../users/types";
import { useToast } from "../../../../contexts/ToastContext";

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateUser>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.fetchAllDoctors();
      setDoctors(data);
    } catch (err: any) {
      setError("Không thể tải danh sách bác sĩ");
      showToast({ type: "error", message: "Không thể tải danh sách bác sĩ" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (doctor: UserProfile) => {
    setFormData({
      name: doctor.name || "",
      email: doctor.email,
      age: doctor.age,
      gender: doctor.gender,
      address: doctor.address,
      district: doctor.district,
      city: doctor.city,
      underlying_disease: doctor.underlying_disease,
      specialization: doctor.specialization,
    });
    setEditingId(doctor.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await userService.deleteUser(id);
      showToast({ type: "success", message: "Xóa bác sĩ thành công" });
      await fetchDoctors();
    } catch {
      showToast({ type: "error", message: "Xóa bác sĩ thất bại" });
    } finally {
      setLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        await userService.updateUserInfo({ id: editingId, ...formData });
        showToast({ type: "success", message: "Cập nhật bác sĩ thành công" });
      } else {
        if (!formData.password) {
          setError("Vui lòng nhập mật khẩu cho bác sĩ mới");
          showToast({
            type: "error",
            message: "Vui lòng nhập mật khẩu cho bác sĩ mới",
          });
          setLoading(false);
          return;
        }
        await userService.createDoctor(formData);
        showToast({ type: "success", message: "Thêm bác sĩ thành công" });
      }
      setShowForm(false);
      await fetchDoctors();
    } catch {
      setError("Lưu thất bại");
      showToast({ type: "error", message: "Lưu bác sĩ thất bại" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card cardTitle="Danh sách bác sĩ" className="mt-6">
      <div className="mb-4 flex justify-end">
        <Button onClick={handleAdd} color="primary">
          Thêm bác sĩ
        </Button>
      </div>
      {loading && <div>Đang tải...</div>}
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Họ tên</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id} className="border-b">
              <td className="p-2">{doctor.name}</td>
              <td className="p-2">{doctor.email}</td>
              <td className="p-2 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleEdit(doctor)}
                  color="secondary"
                >
                  Sửa
                </Button>
                <Button
                  size="sm"
                  onClick={() => setConfirmDeleteId(doctor.id)}
                  color="danger"
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal xác nhận xóa */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-center text-red-600">
              Xác nhận xóa bác sĩ
            </h3>
            <p className="mb-6 text-center">
              Bạn có chắc chắn muốn xóa bác sĩ này không?
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                color="danger"
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={loading}
              >
                Xóa
              </Button>
              <Button
                color="secondary"
                onClick={() => setConfirmDeleteId(null)}
                disabled={loading}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative"
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              {editingId ? "Chỉnh sửa bác sĩ" : "Thêm bác sĩ"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Họ tên"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                required
                type="email"
              />
              {!editingId && (
                <Input
                  label="Mật khẩu"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleInputChange}
                  required
                  type="password"
                />
              )}
              <Input
                label="Tuổi"
                name="age"
                value={formData.age || ""}
                onChange={handleInputChange}
                type="number"
                min={18}
              />
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Giới tính</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleInputChange}
                    />
                    Nam
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleInputChange}
                    />
                    Nữ
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.gender === "Other"}
                      onChange={handleInputChange}
                    />
                    Khác
                  </label>
                </div>
              </div>
              <Input
                label="Địa chỉ"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
              />
              <Input
                label="Quận/Huyện"
                name="district"
                value={formData.district || ""}
                onChange={handleInputChange}
              />
              <Input
                label="Thành phố"
                name="city"
                value={formData.city || ""}
                onChange={handleInputChange}
              />
              <Input
                label="Chuyên khoa"
                name="specialization"
                value={formData.specialization || ""}
                onChange={handleInputChange}
              />
              {/* <Input
                label="Bệnh nền"
                name="underlying_disease"
                value={formData.underlying_disease || ""}
                onChange={handleInputChange}
              /> */}
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <Button type="submit" color="primary">
                Lưu
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                color="secondary"
              >
                Hủy
              </Button>
            </div>
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowForm(false)}
              aria-label="Đóng"
            >
              ×
            </button>
          </form>
        </div>
      )}
    </Card>
  );
};

export default DoctorList;
