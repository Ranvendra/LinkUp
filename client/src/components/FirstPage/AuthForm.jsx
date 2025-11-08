import React, { useState } from "react";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import google from "/google.webp";

function AuthForms() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
    // Clear error for this field when user starts typing
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
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
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
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Prepare data for server
    const submitData = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        };

    try {
      // Example API call structure (uncomment and modify for your backend)
      /*
      const response = await fetch(`/api/${isLogin ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      
      const data = await response.json();
      console.log('Success:', data);
      // Handle success (e.g., store token, redirect)
      */

      // For now, just log the data
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
    setErrors({});
    setShowPassword(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Form Header */}
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
        {/* Name Fields - Only show in signup mode */}
        {!isLogin && (
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full bg-white border ${
                    errors.firstName ? "border-red-500" : "border-gray-200"
                  } rounded-3xl pl-10 pr-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                  placeholder="Full Name"
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Date Of Birth
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="Date"
                  name="Date"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full bg-white border ${
                    errors.lastName ? "border-red-500" : "border-gray-200"
                  } rounded-3xl pl-10 pr-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                  placeholder="Doe"
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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

        <div className="flex">
          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-5">
            <button
              type="button"
              className="flex items-center justify-center w-50 px-4 py-3 border border-red-500 rounded-2xl text-md font-semibold hover:bg-red-50 transition-all"
            >
              <img className="h-6 pr-2" src={google} />
              Google
            </button>
          </div>

          {/* Submit Button */}
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
