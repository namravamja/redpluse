"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Link from "next/link";
import { useSignupMutation } from "@/app/lib/EventOrganizer";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";

const organizationTypes = ["Corporate", "Non-Profit", "Other"];

export default function SignupPage() {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    EventOrganizerName: "",
    number: "",
    email: "",
    password: "",
    reEnterPassword: "",
    organizationName: "",
    type: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.reEnterPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await signup({
        EventOrganizerName: formData.EventOrganizerName,
        number: formData.number,
        email: formData.email,
        password: formData.password,
        organizationName: formData.organizationName,
        type: formData.type,
      }).unwrap();

      toast.success("Verify your email: " + response?.message);
      setTimeout(() => {
        router.push("/frontend/waiting");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        toast.error(err.message);
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
            src="/BgAuth3.png"
            alt="Donor Illustration"
            layout="fill"
            objectFit="cover"
            className="opacity-80"
          />
        </div>
        <div className="w-full max-w-5xl relative rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row bg-green-50/80 rounded-2xl">
            {/* Left side - Signup form */}
            <div className="w-full md:w-1/2 p-8 z-10">
              <div className="max-w-md mx-auto">
                <h1 className="font-heading text-3xl font-bold mb-1 text-green-950 tracking-tight">
                  EVENT ORGANIZER REGISTRATION
                </h1>
                <p className="text-gray-700 mb-8 font-light text-base leading-relaxed">
                  Join our network of organizers and help coordinate life-saving
                  blood donation events
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Organizer Name*
                      </label>
                      <Input
                        type="text"
                        name="EventOrganizerName"
                        placeholder="Enter organizer name"
                        required
                        value={formData.EventOrganizerName}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Contact Number*
                      </label>
                      <Input
                        type="tel"
                        name="number"
                        placeholder="Enter contact number"
                        required
                        value={formData.number}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 font-light"
                      />
                    </div>
                  </div>

                  {/* Email and Password Fields */}
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

                  {/* Organization Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Organization Name*
                      </label>
                      <Input
                        type="text"
                        name="organizationName"
                        placeholder="Enter organization name"
                        required
                        value={formData.organizationName}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Organization Type*
                      </label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("type", value)
                        }
                        required
                      >
                        <SelectTrigger className="w-full rounded-md border-gray-300 font-light h-10">
                          <SelectValue placeholder="Select organization type" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizationTypes.map((type) => (
                            <SelectItem key={type} value={type.toLowerCase()}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    className="w-full bg-green-950 hover:bg-green-800 py-2 rounded-md font-medium text-base transition-colors duration-200"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing Up..." : "Register as Organizer"}
                  </Button>

                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-700">
                      Already have an account?{" "}
                      <Link
                        href="/frontend/Login/EventOrganizer"
                        className="text-green-950 font-medium hover:text-green-800 transition-colors"
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
                  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 25% 100%)",
                  backgroundColor: "#ffffff",
                }}
              >
                {/* Placeholder for event organization illustration */}
                <div className="h-full w-full flex items-center justify-center p-12">
                  <div className="w-full h-full opacity-80">
                    <Image
                      src="/event4.jpg"
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
