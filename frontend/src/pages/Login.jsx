import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const { loading, login, forgotPassword } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a reset token in the URL
    const token = searchParams.get('token');
    if (token) {
      navigate(`/reset-password?token=${token}`);
    }
  }, [searchParams, navigate]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    // Forgot password only needs email
    if (forgotPasswordMode) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Email is invalid";
        valid = false;
      }
      
      setErrors(newErrors);
      return valid;
    }

    // Regular validation for login
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      if (forgotPasswordMode) {
        // Forgot password request
        const result = await forgotPassword(formData.email);
        if (result.success) {
          toast.success("Check your email for reset instructions");
          setForgotPasswordMode(false);
          resetForm();
        }
        return;
      }
      
      // Regular login
      const result = await login(formData.email, formData.password);
      if (result.success) {
        resetForm();
        // Redirect to home page after successful login
        navigate('/');
      }
    } catch (error) {
      // Error handling is done in the store
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordMode(true);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
    });
    setErrors({
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
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

  const handleBackToLogin = () => {
    resetForm();
    setForgotPasswordMode(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md z-10"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
              {forgotPasswordMode 
                ? "Forgot Password" 
                : "Welcome back 👋"}
            </CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              {forgotPasswordMode 
                ? "Enter your email to reset password" 
                : "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-semibold text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-pink-50 focus:bg-white"
                />
                {errors.email && (
                  <motion.p
                    className="text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {!forgotPasswordMode && (
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="font-semibold text-gray-700"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="bg-purple-50 focus:bg-white"
                  />
                  {errors.password && (
                    <motion.p
                      className="text-sm text-red-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>
              )}

              {!forgotPasswordMode && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-purple-600 hover:underline"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-bold shadow-lg hover:from-orange-600 hover:to-purple-600"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {forgotPasswordMode 
                    ? "Send Reset Link" 
                    : "Sign in"}
                </Button>
              </motion.div>
            </form>

            {(forgotPasswordMode) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 text-center text-sm"
              >
                <button
                  type="button"
                  className="text-purple-600 font-semibold hover:underline"
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </button>
              </motion.div>
            )}

            {!forgotPasswordMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 text-center text-sm"
              >
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-pink-600 font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      {/* Decorative animated background blobs */}
      <motion.div
        className="absolute -top-24 -left-24 w-72 h-72 bg-orange-300 rounded-full opacity-30 blur-2xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-300 rounded-full opacity-30 blur-2xl"
        animate={{ scale: [1, 1.1, 1], rotate: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-40 h-40 bg-pink-300 rounded-full opacity-20 blur-2xl"
        animate={{ scale: [1, 1.3, 1], x: [-20, 20, -20] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
    </div>
  );
};

export default Login;