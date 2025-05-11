"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Link from "next/link";
import { useState } from "react";
import {
  useForgotPasswordMutation,
  useLoginMutation,
} from "@/app/lib/EventOrganizer";
import { useRouter } from "next/navigation";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

type LoginError = FetchBaseQueryError & {
  data?: { error?: string };
};

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [login, { isLoading }] = useLoginMutation();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      console.log("Login successful:", response);
      toast.success("Login successful!");
      router.push(" /EventOrganizer/Profile");
    } catch (err: unknown) {
      const typedErr = err as LoginError;
      if (typedErr?.data?.error) {
        toast.error(typedErr.data.error);
      } else {
        toast.error("Something went wrong. Try again.");
      }
    }
  };

  const [forgotPassword, { isLoading: isSending }] =
    useForgotPasswordMutation();

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      const response = await forgotPassword({ email: email.trim() }).unwrap();
      toast.success(response.message || "Reset link sent to your email.");
      setOpen(false);
      setEmail("");
    } catch (err: unknown) {
      const typedErr = err as LoginError;
      toast.error(
        typedErr?.data?.error || "Failed to send reset link. Try again."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap");

        body {
          font-family: "Inter", sans-serif;
        }

        .font-heading {
          font-family: "Montserrat", sans-serif;
          letter-spacing: -0.02em;
        }
      `}</style>

      <div className="flex items-center justify-center min-h-screen relative bg-[#D9D9D9] p-4">
        <div className="absolute w-full h-full">
          <Image
            src="/BgAuth3.png"
            alt="Donor Illustration"
            layout="fill"
            objectFit="cover"
            className="opacity-80"
          />
        </div>

        <div className="w-full max-w-5xl relative rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row bg-green-50/80 rounded-2xl">
            <div className="w-full md:w-2/5 p-8 z-10">
              <div className="max-w-md mx-auto">
                <h1 className="font-heading text-3xl font-bold mb-1 text-green-950 tracking-tight">
                  EVENT ORGANIZER PORTAL
                </h1>
                <p className="text-gray-700 mb-8 font-light text-base leading-relaxed">
                  Access your organizer dashboard. Manage your events,
                  donations, and track participation.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-md border-gray-300 font-light"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full pr-10 rounded-md border-gray-300 font-light"
                        required
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <IoEyeOffOutline size={18} />
                        ) : (
                          <IoEyeOutline size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(true);
                      }}
                      className="text-sm text-green-800 hover:text-green-600 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    className="w-full bg-green-950 hover:bg-green-800 py-2 rounded-md font-medium text-base transition-colors duration-200"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login to Organizer Account"}
                  </Button>

                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-700">
                      New organizer?{" "}
                      <Link
                        href=" /Signup/EventOrganizer"
                        className="text-green-950 font-medium hover:text-green-800 transition-colors"
                      >
                        Create an organizer account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="hidden md:block md:w-3/5 bg-transparent relative">
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  backgroundColor: "#ffffff",
                  zIndex: 0,
                }}
              >
                <div className="h-full w-full flex items-center justify-center">
                  <div className="w-full h-full relative">
                    <Image
                      src="/event1.jpg"
                      alt="Organizer"
                      layout="fill"
                      objectFit="cover"
                      className="opacity-70"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md font-heading">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Reset Password
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-light"
              />
              <Button
                onClick={handleForgotPassword}
                disabled={isSending}
                className="bg-green-950 hover:bg-green-800 font-medium"
              >
                {isSending ? "Processing..." : "Send Reset Link"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
