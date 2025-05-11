"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useResetPasswordMutation } from "@/app/lib/Donor"; // RTK Query API

interface ErrorResponse {
  data?: {
    message?: string;
  };
}

export default function ResetPassword() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword] = useResetPasswordMutation();

  const handleResetPassword = async () => {
    if (!token) {
      toast.error("Invalid or expired reset link!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await resetPassword({ token, newPassword }).unwrap();
      toast.success(res.message || "Password reset successful! Redirecting...");
      setTimeout(() => router.push("/frontend/Login/Donor"), 3000); // Redirect after success
    } catch (error: unknown) {
      if (error && typeof error === "object" && "data" in error) {
        const err = error as ErrorResponse;
        toast.error(err.data?.message || "Failed to reset password");
      } else {
        toast.error("Failed to reset password");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-center mb-4">
          Reset Password
        </h2>
        <Input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-2"
        />
        <Button className="w-full mt-4" onClick={handleResetPassword}>
          Reset Password
        </Button>
      </div>
    </div>
  );
}
