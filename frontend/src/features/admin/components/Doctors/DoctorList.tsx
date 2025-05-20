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
      setError("Failed to load doctor list");
      showToast({ type: "error", message: "Failed to load doctor list" });
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
      showToast({ type: "success", message: "Doctor deleted successfully" });
      await fetchDoctors();
    } catch {
      showToast({ type: "error", message: "Failed to delete doctor" });
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
        showToast({ type: "success", message: "Doctor updated successfully" });
      } else {
        if (!formData.password) {
          setError("Please enter a password for the new doctor");
          showToast({
            type: "error",
            message: "Please enter a password for the new doctor",
          });
          setLoading(false);
          return;
        }
        await userService.createDoctor(formData);
        showToast({ type: "success", message: "Doctor added successfully" });
      }
      setShowForm(false);
      await fetchDoctors();
    } catch {
      setError("Save failed");
      showToast({ type: "error", message: "Failed to save doctor" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card cardTitle="Doctor List" className="mt-6">
      <div className="mb-4 flex justify-end">
        <Button onClick={handleAdd} color="primary">
          Add Doctor
        </Button>
      </div>
      {loading && <div>Loading...</div>}
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Full Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Actions</th>
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
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => setConfirmDeleteId(doctor.id)}
                  color="danger"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-center text-red-600">
              Confirm delete doctor
            </h3>
            <p className="mb-6 text-center">
              Are you sure you want to delete this doctor?
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                color="danger"
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={loading}
              >
                Delete
              </Button>
              <Button
                color="secondary"
                onClick={() => setConfirmDeleteId(null)}
                disabled={loading}
              >
                Cancel
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
              {editingId ? "Edit Doctor" : "Add Doctor"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
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
                  label="Password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleInputChange}
                  required
                  type="password"
                />
              )}
              <Input
                label="Age"
                name="age"
                value={formData.age || ""}
                onChange={handleInputChange}
                type="number"
                min={18}
              />
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Gender</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleInputChange}
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleInputChange}
                    />
                    Female
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.gender === "Other"}
                      onChange={handleInputChange}
                    />
                    Other
                  </label>
                </div>
              </div>
              <Input
                label="Address"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
              />
              <Input
                label="District"
                name="district"
                value={formData.district || ""}
                onChange={handleInputChange}
              />
              <Input
                label="City"
                name="city"
                value={formData.city || ""}
                onChange={handleInputChange}
              />
              <Input
                label="Specialization"
                name="specialization"
                value={formData.specialization || ""}
                onChange={handleInputChange}
              />
              {/* <Input
                label="Underlying disease"
                name="underlying_disease"
                value={formData.underlying_disease || ""}
                onChange={handleInputChange}
              /> */}
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <Button type="submit" color="primary">
                Save
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                color="secondary"
              >
                Cancel
              </Button>
            </div>
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowForm(false)}
              aria-label="Close"
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
