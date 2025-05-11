"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useSignupMutation } from "@/app/lib/BloodBank";
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

// Sample State-City Mapping
const indiaStatesWithCities: { [key: string]: string[] } = {
  "Andhra Pradesh": [
    "Amaravati",
    "Guntur",
    "Kurnool",
    "Nellore",
    "Tirupati",
    "Vijayawada",
    "Visakhapatnam",
  ],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang"],
  Assam: ["Dibrugarh", "Guwahati", "Jorhat", "Silchar", "Tezpur"],
  Bihar: ["Bhagalpur", "Gaya", "Muzaffarpur", "Patna"],
  Chhattisgarh: ["Bhilai", "Bilaspur", "Korba", "Raipur"],
  Goa: ["Madgaon", "Panaji", "Vasco da Gama"],
  Gujarat: ["Ahmedabad", "Gandhinagar", "Rajkot", "Surat", "Vadodara"],
  Haryana: ["Ambala", "Faridabad", "Gurugram", "Hisar", "Panipat", "Rohtak"],
  "Himachal Pradesh": ["Dharamshala", "Mandi", "Shimla", "Solan"],
  Jharkhand: ["Bokaro", "Dhanbad", "Jamshedpur", "Ranchi"],
  Karnataka: ["Bengaluru", "Hubballi", "Mangaluru", "Mysuru", "Shivamogga"],
  Kerala: ["Kochi", "Kollam", "Kozhikode", "Thiruvananthapuram", "Thrissur"],
  "Madhya Pradesh": ["Bhopal", "Gwalior", "Indore", "Jabalpur", "Ujjain"],
  Maharashtra: ["Mumbai", "Nagpur", "Nashik", "Pune", "Thane"],
  Manipur: ["Imphal"],
  Meghalaya: ["Shillong"],
  Mizoram: ["Aizawl"],
  Nagaland: ["Dimapur", "Kohima"],
  Odisha: ["Bhubaneswar", "Cuttack", "Puri", "Rourkela"],
  Punjab: ["Amritsar", "Jalandhar", "Ludhiana", "Mohali", "Patiala"],
  Rajasthan: ["Ajmer", "Jaipur", "Jodhpur", "Kota", "Udaipur"],
  Sikkim: ["Gangtok"],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Tiruchirappalli",
  ],
  Telangana: ["Hyderabad", "Karimnagar", "Khammam", "Warangal"],
  Tripura: ["Agartala"],
  "Uttar Pradesh": ["Agra", "Allahabad", "Kanpur", "Lucknow", "Varanasi"],
  Uttarakhand: ["Dehradun", "Haridwar", "Nainital", "Rishikesh"],
  "West Bengal": ["Asansol", "Durgapur", "Howrah", "Kolkata", "Siliguri"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  Chandigarh: ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa"],
  Delhi: ["Delhi", "New Delhi"],
  "Jammu and Kashmir": ["Jammu", "Srinagar"],
  Ladakh: ["Kargil", "Leh"],
  Lakshadweep: ["Kavaratti"],
  Puducherry: ["Karaikal", "Mahe", "Puducherry", "Yanam"],
};

export default function BloodBankForm() {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    state: "",
    city: "",
    address: "",
    pincode: "",
    BloodBankName: "",
    parentHospital: "",
    category: "",
    contactPerson: "",
    email: "",
    password: "",
    contactNo: "",
    licenceNo: "",
    helplineNo: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { city: "" }), // Reset city if state changes
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await signup({
        BloodBankName: formData.BloodBankName,
        email: formData.email,
        password: formData.password,
        licenceNumber: formData.licenceNo,
        phone: formData.contactNo,
        helplineNumber: formData.helplineNo,
        contactPerson: formData.contactPerson,
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode,
        address: formData.address,
        parentHospital: formData.parentHospital,
        category: formData.category,
      }).unwrap();

      toast.success("Verify your email: " + response?.message);
      setTimeout(() => {
        router.push("/frontend/waiting");
      }, 2000);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "error" in err.data
      ) {
        toast.error(
          (err.data as { error: string }).error || "Signup failed. Try again."
        );
      } else {
        toast.error("Signup failed. Try again.");
      }
    }
  };

  const states = Object.keys(indiaStatesWithCities);
  const cities = indiaStatesWithCities[formData.state] || [];

  return (
    <div className="flex items-center justify-center realtive min-h-screen bg-[#D9D9D9] p-4">
      <div className="absolute w-full h-full">
        <Image
          src="/BgAuth2.png"
          alt="Donor Illustration"
          layout="fill"
          objectFit="cover"
          className="opacity-80"
        />
      </div>
      <div className="w-full max-w-5xl relative rounded-2xl overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row bg-red-50/80 rounded-2xl">
          {/* Left side - Signup form - Increased width */}
          <div className="w-full md:w-1/2 p-5 md:p-6 z-10">
            <div className="mx-auto">
              <h1 className="font-montserrat text-xl md:text-2xl font-bold mb-1 text-red-950 tracking-tight">
                BLOOD BANK REGISTRATION
              </h1>
              <p className="text-gray-700 mb-4 font-light text-xs md:text-sm leading-relaxed">
                Join our lifesaving network and help connect donors with
                patients
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* First row - Blood Bank Name and Parent Hospital */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Blood Bank Name*
                    </label>
                    <Input
                      type="text"
                      name="BloodBankName"
                      placeholder="Enter name"
                      required
                      onChange={handleChange}
                      className="rounded-md border-gray-300 font-light h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Parent Hospital
                    </label>
                    <Input
                      type="text"
                      name="parentHospital"
                      placeholder="Enter hospital"
                      onChange={handleChange}
                      className="rounded-md border-gray-300 font-light h-8 text-sm"
                    />
                  </div>
                </div>

                {/* Second row - Category and Contact Person */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Category*
                    </label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                      required
                    >
                      <SelectTrigger className="rounded-md border-gray-300 font-light h-8 text-sm">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Government">Government</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Contact Person*
                    </label>
                    <Input
                      type="text"
                      name="contactPerson"
                      placeholder="Enter name"
                      required
                      onChange={handleChange}
                      className="rounded-md border-gray-300 font-light h-8 text-sm"
                    />
                  </div>
                </div>

                {/* Third row - State and City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      State*
                    </label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("state", value)
                      }
                      required
                    >
                      <SelectTrigger className="rounded-md border-gray-300 font-light h-8 text-sm">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      City*
                    </label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("city", value)
                      }
                      required
                      disabled={!formData.state}
                    >
                      <SelectTrigger className="rounded-md border-gray-300 font-light h-8 text-sm">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Fourth row - Address and Pincode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Address*
                    </label>
                    <Input
                      type="text"
                      name="address"
                      placeholder="Enter address"
                      required
                      onChange={handleChange}
                      className="rounded-md border-gray-300 font-light h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Pincode*
                    </label>
                    <Input
                      type="text"
                      name="pincode"
                      placeholder="Enter pincode"
                      required
                      onChange={handleChange}
                      className="rounded-md border-gray-300 font-light h-8 text-sm"
                    />
                  </div>
                </div>

                {/* Fifth row - Email and Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Email*
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      required
                      onChange={handleChange}
                      className="rounded-md border-gray-300 font-light h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Password*
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create password"
                        required
                        onChange={handleChange}
                        className="w-full pr-10 rounded-md border-gray-300 font-light h-8 text-sm"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <IoEyeOffOutline size={16} />
                        ) : (
                          <IoEyeOutline size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sixth row - Contact, Helpline, License */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Contact No.*
                    </label>
                    <Input
                      type="text"
                      name="contactNo"
                      placeholder="Contact number"
                      required
                      onChange={handleChange}
                      className="rounded-md border-gray-300 font-light h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Helpline No.*
                    </label>
                    <Input
                      type="text"
                      name="helplineNo"
                      placeholder="Helpline number"
                      required
                      onChange={handleChange}
                      className="rounded-md border-gray-300 font-light h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      License No.*
                    </label>
                    <Input
                      type="text"
                      name="licenceNo"
                      placeholder="License number"
                      required
                      onChange={handleChange}
                      className="rounded-md border-gray-300 font-light h-8 text-sm"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  className="w-full bg-red-950 hover:bg-red-800 py-1 h-9 rounded-md font-medium text-sm transition-colors duration-200 mt-3"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing Up..." : "Register Blood Bank"}
                </Button>

                <div className="text-center mt-1">
                  <p className="text-xs text-gray-700">
                    Already have an account?{" "}
                    <Link
                      href="/frontend/Login/BloodBank"
                      className="text-red-950 font-medium hover:text-red-800 transition-colors"
                    >
                      Login to your account
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right side - Diagonal content area - Decreased width */}
          <div className="hidden md:block md:w-1/2 bg-transparent relative">
            {/* Diagonal mask - Adjusted clip path to make the right section smaller */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 45% 100%)",
                backgroundColor: "#ffffff",
              }}
            >
              {/* Placeholder for medical/blood bank illustration */}
              <div className="h-full w-full flex items-center justify-center p-12">
                <div className="w-full h-full opacity-80">
                  {/* You can replace this comment with your blood bank image or illustration */}
                  <Image
                    src="/bloodbank.png"
                    alt="Organizer"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="left"
                    className="opacity-80 translate-x-16 object-left scale-110 "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
