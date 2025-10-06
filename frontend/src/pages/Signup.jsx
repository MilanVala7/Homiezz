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
import { useNavigate, Link } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        aadharNumber: "",
        phone: "",
        otp: "",
        role: "tenant",
    });
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        aadharNumber: "",
        phone: "",
        otp: "",
        role: "",
    });
    const [userId, setUserId] = useState(null);
    const [showOTP, setShowOTP] = useState(false);

    const { loading, signup, verifyOTP, resendOTP } = useAuthStore();
    const navigate = useNavigate();

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            name: "",
            email: "",
            password: "",
            aadharNumber: "",
            phone: "",
            otp: "",
            role: "",
        };

        if (!showOTP) {
            if (!formData.name.trim()) {
                newErrors.name = "Name is required";
                valid = false;
            }

            if (!formData.email.trim()) {
                newErrors.email = "Email is required";
                valid = false;
            } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
                newErrors.email = "Email is invalid";
                valid = false;
            }

            if (!formData.aadharNumber.trim()) {
                newErrors.aadharNumber = "Aadhar number is required";
                valid = false;
            } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
                newErrors.aadharNumber = "Aadhar number must be 12 digits";
                valid = false;
            }

            if (!formData.phone.trim()) {
                newErrors.phone = "Phone number is required";
                valid = false;
            } else if (!/^\d{10}$/.test(formData.phone)) {
                newErrors.phone = "Phone number must be 10 digits";
                valid = false;
            }

            if (!formData.password) {
                newErrors.password = "Password is required";
                valid = false;
            } else if (formData.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters";
                valid = false;
            }
        } else {
            if (!formData.otp.trim()) {
                newErrors.otp = "OTP is required";
                valid = false;
            } else if (!/^\d{6}$/.test(formData.otp)) {
                newErrors.otp = "OTP must be 6 digits";
                valid = false;
            }
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (!showOTP) {
                const result = await signup({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    aadharNumber: formData.aadharNumber,
                    phone: formData.phone,
                    role: formData.role,
                });

                if (result.success) {
                    setUserId(result.userId);
                    setShowOTP(true);
                }
            } else {
                const result = await verifyOTP(userId, formData.otp);
                if (result.success) {
                    setShowOTP(false);
                    toast.success("Registration completed! Please login.");
                    resetForm();
                    navigate('/login');
                }
            }
        } catch (error) {
            // Error handling is done in the store
        }
    };

    const handleResendOTP = async () => {
        try {
            const result = await resendOTP(userId);
            if (result.success) {
                toast.success("OTP sent successfully");
            }
        } catch (error) {
            // Error handling is done in the store
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            aadharNumber: "",
            phone: "",
            otp: "",
            role: "tenant",
        });
        setErrors({
            name: "",
            email: "",
            password: "",
            aadharNumber: "",
            phone: "",
            otp: "",
            role: "",
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

    const handleRoleChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            role: value,
        }));
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
                            {showOTP
                                ? "Verify Email"
                                : "Create an account 🚀"}
                        </CardTitle>
                        <CardDescription className="text-base text-gray-600 mt-2">
                            {showOTP
                                ? "Enter the OTP sent to your email"
                                : "Fill in the form to get started"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!showOTP ? (
                                <>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="font-semibold text-gray-700"
                                        >
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={loading}
                                            className="bg-orange-50 focus:bg-white"
                                        />
                                        {errors.name && (
                                            <motion.p
                                                className="text-sm text-red-500"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                {errors.name}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="role"
                                            className="font-semibold text-gray-700"
                                        >
                                            Role
                                        </Label>
                                        <Select
                                            value={formData.role}
                                            onValueChange={handleRoleChange}
                                            disabled={loading}
                                        >
                                            <SelectTrigger className="bg-orange-50 focus:bg-white">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tenant">Tenant</SelectItem>
                                                <SelectItem value="owner">Owner</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.role && (
                                            <motion.p
                                                className="text-sm text-red-500"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                {errors.role}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="aadharNumber"
                                            className="font-semibold text-gray-700"
                                        >
                                            Aadhar Number
                                        </Label>
                                        <Input
                                            id="aadharNumber"
                                            name="aadharNumber"
                                            placeholder="1234 5678 9012"
                                            value={formData.aadharNumber}
                                            onChange={handleChange}
                                            disabled={loading}
                                            className="bg-orange-50 focus:bg-white"
                                        />
                                        {errors.aadharNumber && (
                                            <motion.p
                                                className="text-sm text-red-500"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                {errors.aadharNumber}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="phone"
                                            className="font-semibold text-gray-700"
                                        >
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            placeholder="9876543210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={loading}
                                            className="bg-orange-50 focus:bg-white"
                                        />
                                        {errors.phone && (
                                            <motion.p
                                                className="text-sm text-red-500"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                {errors.phone}
                                            </motion.p>
                                        )}
                                    </div>

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
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="otp"
                                        className="font-semibold text-gray-700"
                                    >
                                        Verification OTP
                                    </Label>
                                    <Input
                                        id="otp"
                                        name="otp"
                                        placeholder="123456"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="bg-purple-50 focus:bg-white"
                                    />
                                    {errors.otp && (
                                        <motion.p
                                            className="text-sm text-red-500"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {errors.otp}
                                        </motion.p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        className="text-sm text-purple-600 hover:underline"
                                        disabled={loading}
                                    >
                                        Didn't receive OTP? Resend
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
                                    {showOTP
                                        ? "Verify OTP"
                                        : "Sign up"}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mt-4 text-center text-sm"
                        >
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-purple-600 font-semibold hover:underline"
                            >
                                Sign in
                            </Link>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>

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

export default Signup;