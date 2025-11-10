import React, { useState } from "react";
import { Eye, EyeOff, Mail, User, Lock, CalendarDays } from "lucide-react";
import google from "/google.webp";

function AuthForms() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!formData.dob.trim()) {
        newErrors.dob = "Date of Birth is required";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const submitData = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          dob: formData.dob,
          email: formData.email,
          password: formData.password,
        };

    try {
      console.log(`${isLogin ? "Login" : "Signup"} data:`, submitData);
      alert(
        `${
          isLogin ? "Login" : "Account creation"
        } submitted successfully!\nCheck console for data.`
      );
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      dob: "",
      email: "",
      password: "",
    });
    setErrors({});
    setShowPassword(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-blue-600 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={toggleMode}
            className="text-red-500 hover:text-red-600 font-semibold transition-colors"
            type="button"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Name
              </label>
              <div className="relative">
                <User
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    formData.name.length > 0 ? "text-red-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full bg-white border ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  } rounded-3xl pl-10 pr-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                  placeholder="Full Name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <CalendarDays
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    formData.dob.length > 0 ? "text-red-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={`w-full bg-white border ${
                    errors.dob ? "border-red-500" : "border-gray-200"
                  } rounded-3xl pl-10 pr-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                />
              </div>
              {errors.dob && (
                <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
              )}
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                formData.email.length > 0 ? "text-red-500" : "text-gray-400"
              }`}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full bg-white border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } rounded-3xl pl-10 pr-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                formData.password.length > 0
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full bg-white border ${
                errors.password ? "border-red-500" : "border-gray-200"
              } rounded-3xl pl-10 pr-12 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex">
          <div className="grid grid-cols-2 gap-5">
            <button
              type="button"
              className="flex items-center justify-center w-50 px-4 py-3 border border-red-500 rounded-2xl text-md font-semibold hover:bg-red-50 transition-all"
            >
              <img className="h-6 pr-2" src={google} />
              Google
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-red-500 to-orange-400 text-white rounded-2xl py-3 text-md font-semibold hover:from-red-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30"
          >
            {isSubmitting
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthForms;
