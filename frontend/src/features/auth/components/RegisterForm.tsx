import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../redux/store";
import { APP_ROUTES } from "../../../constants/routeConstants";
import { useToast } from "../../../contexts/ToastContext";

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
    district: "",
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

    // Clear validation errors when user types
    if (name === "password" || name === "confirmPassword") {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const errors: {
      password?: string;
      confirmPassword?: string;
      acceptTerms?: string;
    } = {};

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

    if (!validateForm()) {
      return;
    }

    const result = await dispatch(
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        gender: formData.gender as "Male" | "Female" | "Other",
        address: formData.address,
        district: formData.district,
        city: formData.city,
        phone: formData.phone,
        acceptTerms: formData.acceptTerms,
      })
    );

    if (register.fulfilled.match(result)) {
      showToast({
        type: "success",
        message: "Đăng ký thành công! Vui lòng đăng nhập.",
      });
      navigate(APP_ROUTES.PUBLIC.LOGIN); // Redirect to login after successful registration
    }
  };

  React.useEffect(() => {
    if (error) {
      showToast({ type: "error", message: error });
    }
  }, [error]);

  return (
    <>
      <section className="bg-zinc-950 dark:bg-zinc-950">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-zinc-900 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
                Create an account
              </h1>

              {error && (
                <div
                  className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 min-h-[44px] text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 block w-full"
                    placeholder="Your Full Name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 min-h-[44px] text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 block w-full"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`rounded-lg border bg-zinc-950 text-white border-${
                      validationErrors.password ? "red-500" : "zinc-800"
                    } px-4 py-3 min-h-[44px] text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 block w-full`}
                    required
                  />
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {validationErrors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`rounded-lg border bg-zinc-950 text-white border-${
                      validationErrors.confirmPassword ? "red-500" : "zinc-800"
                    } px-4 py-3 min-h-[44px] text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 block w-full`}
                    required
                  />
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 min-h-[44px] text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 block w-full"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+84 123 456 789"
                    className="rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 min-h-[44px] text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 block w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Le Loi Street"
                    className="rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 min-h-[44px] text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 block w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="district"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    id="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="District 1"
                    className="rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 min-h-[44px] text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 block w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ho Chi Minh City"
                    className="rounded-lg border bg-zinc-950 text-white border-zinc-800 px-4 py-3 min-h-[44px] text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 block w-full"
                  />
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className={`w-4 h-4 border ${
                        validationErrors.acceptTerms
                          ? "border-red-500"
                          : "border-zinc-800"
                      } rounded bg-zinc-950 focus:ring-3 focus:ring-primary-300 dark:bg-zinc-900 dark:border-zinc-700`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="acceptTerms"
                      className="font-light text-zinc-400 dark:text-zinc-400"
                    >
                      I accept the{" "}
                      <a
                        className="font-medium text-blue-500 hover:underline dark:text-blue-400"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                    {validationErrors.acceptTerms && (
                      <p className="mt-1 text-sm text-red-500">
                        {validationErrors.acceptTerms}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-zinc-950 hover:bg-white/90 active:bg-white/80 rounded-lg px-4 py-4 text-base font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create an account"}
                </button>
                <p className="text-sm font-light text-zinc-400 dark:text-zinc-400">
                  Already have an account?{" "}
                  <Link
                    to={APP_ROUTES.PUBLIC.LOGIN}
                    className="font-medium text-blue-500 hover:underline dark:text-blue-400"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterForm;
