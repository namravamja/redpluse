"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Link from "next/link";
import { useSignupMutation } from "@/app/lib/Donor";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import GoogleLoginButton from "../../components/GoogleLoginButton";

export default function SignupPage() {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.reEnterPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      toast.success("Verify your email: " + response?.message);
      setTimeout(() => {
        router.push(" /waiting");
      }, 2000);
    } catch (err: unknown) {
      // Improved type handling for err
      if (err instanceof Error) {
        toast.error(err.message || "Signup failed. Try again.");
      } else {
        toast.error("Signup failed. Try again.");
      }
    }
  };

  return (
    <>
      {/* Font imports */}
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

      <div className="flex items-center justify-center relative min-h-screen bg-[#D9D9D9] p-4">
        <div className="absolute w-full h-full">
          <Image
            src="/BgAuth1.png"
            alt="Donor Illustration"
            layout="fill"
            objectFit="cover"
            className="opacity-80"
          />
        </div>
        <div className="w-full max-w-5xl relative rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row bg-blue-50/80 rounded-2xl">
            {/* Left side - Signup form */}
            <div className="w-full md:w-1/2 p-8 z-10">
              <div className="max-w-md mx-auto">
                <h1 className="font-heading text-3xl font-bold mb-1 text-blue-950 tracking-tight">
                  BLOOD DONOR REGISTRATION
                </h1>
                <p className="text-gray-700 mb-8 font-light text-base leading-relaxed">
                  Join our community of donors and contribute to saving lives
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 ">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name*
                      </label>
                      <Input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Email*
                      </label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 font-light"
                      />
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Password*
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Create password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pr-10 rounded-md border-gray-300 font-light"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <IoEyeOffOutline size={18} />
                          ) : (
                            <IoEyeOutline size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm Password*
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          name="reEnterPassword"
                          placeholder="Re-enter password"
                          required
                          value={formData.reEnterPassword}
                          onChange={handleChange}
                          className="w-full pr-10 rounded-md border-gray-300 font-light"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <IoEyeOffOutline size={18} />
                          ) : (
                            <IoEyeOutline size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Aadhaar and Blood Group */}

                  {/* Submit Button */}
                  <Button
                    className="w-full bg-blue-950 hover:bg-blue-800 py-2 rounded-md font-medium text-base transition-colors duration-200"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing Up..." : "Register as Donor"}
                  </Button>

                  {/* Google Login Button */}
                  <div className="">
                    <div>
                      {" "}
                      ---------------------------- OR
                      ----------------------------{" "}
                    </div>
                    <GoogleLoginButton />
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-700">
                      Already have an account?{" "}
                      <Link
                        href=" /Login/Donor"
                        className="text-blue-950 font-medium hover:text-blue-800 transition-colors"
                      >
                        Login to your account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Right side - Diagonal content area */}
            <div className="hidden md:block md:w-1/2 bg-transparent relative">
              {/* Diagonal mask */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 35% 100%)",
                  backgroundColor: "#ffffff",
                }}
              >
                {/* Placeholder for blood donation illustration */}
                <div className="h-full w-full flex items-center justify-center p-12">
                  <div className="w-full h-full opacity-80">
                    <Image
                      src="/event3.jpg"
                      alt="Organizer"
                      layout="fill"
                      objectFit="cover"
                      className="opacity-80"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
