import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../redux/authSlice";
import { APP_ROUTES } from "../../../constants/routeConstants";
import { useToast } from "../../../contexts/ToastContext";
import { RootState, AppDispatch } from "../../../redux/store";

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
    address: "",
    city: "",
    phone: "",
    acceptTerms: false,
  });

  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
    if (name === "password" || name === "confirmPassword") {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.acceptTerms) {
      errors.acceptTerms = "You must accept the terms and conditions";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const result = await dispatch(
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        gender: formData.gender as "Male" | "Female" | "Other",
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        acceptTerms: formData.acceptTerms,
      })
    );
    if (register.fulfilled.match(result)) {
      showToast({
        type: "success",
        message: "Registration successful! Please log in.",
      });
      navigate(APP_ROUTES.PUBLIC.LOGIN);
    }
  };

  React.useEffect(() => {
    if (error) {
      showToast({ type: "error", message: error });
    }
  }, [error]);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-zinc-900 to-zinc-950">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg mb-2">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Create a new account
          </h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-zinc-300 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-zinc-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                className={`w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border ${
                  validationErrors.password
                    ? "border-red-500"
                    : "border-zinc-700"
                } focus:border-blue-500 focus:outline-none`}
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.password}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <label className="block text-zinc-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className={`w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border ${
                  validationErrors.confirmPassword
                    ? "border-red-500"
                    : "border-zinc-700"
                } focus:border-blue-500 focus:outline-none`}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-zinc-300 mb-1">Gender</label>
              <select
                name="gender"
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-zinc-300 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>
          </div>
          <div>
            <label className="block text-zinc-300 mb-1">Address</label>
            <input
              type="text"
              name="address"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              value={formData.address}
              onChange={handleChange}
              autoComplete="address"
            />
          </div>
          <div>
            <label className="block text-zinc-300 mb-1">City</label>
            <input
              type="text"
              name="city"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
              value={formData.city}
              onChange={handleChange}
              autoComplete="address-level2"
            />
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mr-2 accent-blue-500"
              required
            />
            <label className="text-zinc-300 text-sm">
              I agree to the{" "}
              <a href="/terms" className="text-blue-400 hover:underline">
                Terms of Service
              </a>
            </label>
          </div>
          {validationErrors.acceptTerms && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.acceptTerms}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2 mt-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="text-center mt-4">
            <span className="text-zinc-400 text-sm">
              Already have an account?{" "}
              <a
                href={APP_ROUTES.PUBLIC.LOGIN}
                className="text-blue-400 hover:underline"
              >
                Log in
              </a>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterForm;
