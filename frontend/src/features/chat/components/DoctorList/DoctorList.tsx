import React, { useEffect, useState } from "react";
import apiClient from "../../../../utils/apiClient";
import { UserProfile } from "../../../users/types";
import { useAuth } from "../../../../hooks/useAuth";

interface DoctorListProps {
  onSelectDoctor: (doctorId: string) => void;
  mode?: "add" | "create"; // add: thêm vào conversation, create: tạo mới (mặc định)
}

const DoctorList: React.FC<DoctorListProps> = ({
  onSelectDoctor,
  mode = "create",
}) => {
  const [doctors, setDoctors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/users/doctors");
        setDoctors(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div
        className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">
          No doctors available at the moment.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <h3 className="bg-blue-500 text-white font-bold py-2 px-4 rounded-t-lg">
        Available Doctors
      </h3>
      <ul className="divide-y divide-gray-200">
        {doctors.map((doctor) => (
          <li
            key={doctor.id}
            className="p-4 hover:bg-gray-50 flex justify-between items-center"
          >
            <div>
              <h4 className="font-medium">{doctor.name || doctor.email}</h4>
              {doctor.specialization && (
                <p className="text-sm text-gray-500">
                  Specialization: {doctor.specialization}
                </p>
              )}
            </div>
            <button
              onClick={() => onSelectDoctor(doctor.id)}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded text-sm"
            >
              {mode === "add" ? "Add to Chat" : "Chat Now"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
