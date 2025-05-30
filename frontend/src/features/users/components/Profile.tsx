import React, { useEffect, useState } from "react";
import { UserProfileUpdate, UserRole } from "../types";
import { useAuth } from "../../../hooks/useAuth";
import * as userService from "../services/userService";

const EditProfile: React.FC = () => {
  const [form, setForm] = useState<UserProfileUpdate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await userService.fetchMyInfo();
        setForm(profile);
      } catch (err: any) {
        setError("Cannot load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = <K extends keyof UserProfileUpdate>(
    key: K,
    value: UserProfileUpdate[K]
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    setError(null);
    setMessage("");
    try {
      await userService.updateUserInfo(form);
      setMessage("Update successful!");
    } catch (err: any) {
      setError("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  const isDoctor = user?.roles?.some((role) => role.name === UserRole.DOCTOR);
  const isUser = user?.roles?.some((role) => role.name === UserRole.USER);

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-8 rounded-2xl shadow-xl border border-blue-100 h-[80vh] flex flex-col">
      <div className="flex flex-col items-center mb-6 flex-shrink-0">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2 shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-blue-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-blue-700">Update Profile</h2>
        <p className="text-gray-500 text-sm">
          Update your personal information
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col gap-6 overflow-y-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={form?.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              className="w-full border border-blue-200 px-4 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
              value={form?.email || ""}
              disabled
              type="email"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Gender
            </label>
            <select
              className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={form?.gender || ""}
              onChange={(e) =>
                handleChange(
                  "gender",
                  e.target.value as UserProfileUpdate["gender"]
                )
              }
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Address
            </label>
            <input
              className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={form?.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter address"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Age
            </label>
            <input
              className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={form?.age ?? ""}
              onChange={(e) =>
                handleChange(
                  "age",
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
              type="number"
              min="0"
              placeholder="Enter age"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              District
            </label>
            <input
              className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={form?.district || ""}
              onChange={(e) => handleChange("district", e.target.value)}
              placeholder="Enter district"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              City/Province
            </label>
            <input
              className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={form?.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Enter city/province"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isUser && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Underlying Disease
              </label>
              <input
                className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={form?.underlying_disease || ""}
                onChange={(e) =>
                  handleChange("underlying_disease", e.target.value)
                }
                placeholder="Enter underlying disease (if any)"
              />
            </div>
          )}
          {isDoctor && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Specialization
              </label>
              <input
                className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={form?.specialization || ""}
                onChange={(e) => handleChange("specialization", e.target.value)}
                placeholder="Enter specialization (if doctor)"
              />
            </div>
          )}
        </div>
        <div className="mt-auto">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save changes"
            )}
          </button>
          {message && (
            <p className="text-green-600 text-center font-medium mt-2">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-600 text-center font-medium mt-2">{error}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
