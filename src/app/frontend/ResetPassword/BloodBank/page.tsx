"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useResetPasswordMutation } from "@/app/lib/BloodBank"; // RTK Query API

// Define error type for RTK Query
interface ApiError {
  data?: {
    message: string;
  };
  status?: number;
}

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetPassword] = useResetPasswordMutation();

  // Password validation
  const isPasswordValid = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  const handleResetPassword = async () => {
    if (!token) {
      toast.error("Invalid or expired reset link!");
      return;
    }

    // Basic validation
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!isPasswordValid(newPassword)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await resetPassword({ token, newPassword }).unwrap();
      toast.success(res.message || "Password reset successful! Redirecting...");
      setTimeout(() => router.push("/frontend/Login/BloodBank"), 3000); // Redirect after success
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="pt-2">
            <Button
              className="w-full"
              onClick={handleResetPassword}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Password must be at least 8 characters and include uppercase,
            lowercase, and a number.
          </p>
        </div>
      </div>
    </div>
  );
}
