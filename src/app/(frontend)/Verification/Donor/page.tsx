"use client";
import { useEmailVerificationMutation } from "@/app/lib/Donor";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

// Changed the component name to 'Page' with an uppercase 'P'
const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL

  // Use the mutation hook for email verification
  const [emailVerification, { isLoading }] = useEmailVerificationMutation();

  const verification = async () => {
    try {
      if (token) {
        await emailVerification({ token });
        toast.success(
          "Email verified successfully! Redirecting to login page..."
        );
        setTimeout(() => {
          router.push(" /Login/Donor");
        }, 1500);
      } else {
        toast.error("Token is missing. Please check the URL.");
      }
    } catch (err: unknown) {
      // TypeScript error handling for unknown error types
      const error = err as Error;
      console.log(error);
      toast.error(error?.message || "Email verification failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 font-sans text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">
        Verify Your Email
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Please check your email to verify your account before logging in.
      </p>
      <Link href=" /Login/EventOrganizer">
        <Button
          onClick={verification}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          {isLoading ? "Verifying..." : "Click to Verify"}
        </Button>
      </Link>
    </div>
  );
};

export default Page; // Export the component with the corrected name
