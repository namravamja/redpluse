"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import {
  useUpdateUserDataMutation,
  useGetUserDataQuery,
  useUploadProfilePhotoMutation,
} from "@/app/lib/Donor";
import toast from "react-hot-toast";
import { Pen } from "lucide-react";
import Image from "next/image";

// Sample state-city data (add more as needed)
const statesAndCities: Record<string, string[]> = {
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Delhi: ["New Delhi", "Dwarka", "Rohini"],
};

export default function Page() {
  const [bmi, setBmi] = useState("??");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    Adhar: "",
    contactNumber: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    address: "",
    pincode: "",
    age: "",
    height: "",
    weight: "",
    bmi: "",
    bloodGroup: "",
    ProfilePhoto: "",
  });

  const { data: userData, refetch } = useGetUserDataQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [uploadProfilePhoto, { isLoading: isUpload }] =
    useUploadProfilePhotoMutation();
  const [updateUserData, { isLoading: isUpdating }] =
    useUpdateUserDataMutation();

  useEffect(() => {
    if (userData) {
      setUserDetails((prev) => ({ ...prev, ...userData }));
      if (userData.ProfilePhoto) {
        setPhotoPreview(userData.ProfilePhoto);
      }
    }
  }, [userData]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const calculateBMI = useCallback(() => {
    const { height, weight, age } = userDetails;
    if (height && weight && age) {
      const heightInMeters = parseFloat(height) / 3.281;
      const bmiValue = (
        parseFloat(weight) /
        (heightInMeters * heightInMeters)
      ).toFixed(2);
      setBmi(bmiValue);
      setUserDetails((prev) => ({ ...prev, bmi: bmiValue }));
    }
  }, [userDetails]);

  useEffect(() => {
    calculateBMI();
  }, [calculateBMI]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      calculateBMI();
      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);
        const res = await uploadProfilePhoto(formData).unwrap();
        userDetails.ProfilePhoto = res.url;
        toast.success("Photo uploaded successfully");
      }

      await updateUserData(userDetails).unwrap();
      refetch();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Update failed");
      console.error(error);
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap");

        body {
          font-family: "Inter", sans-serif;
          background-color: #d9d9d9;
        }

        .font-heading {
          font-family: "Montserrat", sans-serif;
          letter-spacing: -0.02em;
        }
      `}</style>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col max-h-screen md:flex-row bg-blue-50/80">
          {/* Left side - Profile Form */}
          <div className="w-full md:w-4/5 p-8 z-10">
            <div className="max-w-2xl mx-auto">
              <h1 className="font-heading text-3xl font-extrabold mb-1 text-blue-950 tracking-tight">
                PROFILE UPDATE
              </h1>
              <p className="text-gray-700 mb-2 font-light text-base leading-relaxed">
                Update your donor information to keep your profile current.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* LEFT COLUMN */}
                <div className="space-y-2">
                  {["fullName", "email", "Adhar", "contactNumber"].map(
                    (field) => (
                      <div key={field}>
                        <Label
                          htmlFor={field}
                          className="text-sm font-medium text-gray-700"
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)}*
                        </Label>
                        <Input
                          id={field}
                          type="text"
                          placeholder={`Enter your ${field}`}
                          className="w-full rounded-md border-gray-300 font-light"
                          value={
                            userDetails[field as keyof typeof userDetails] || ""
                          }
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              [field]: e.target.value,
                            })
                          }
                        />
                      </div>
                    )
                  )}

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Gender
                    </Label>
                    <select
                      className="w-full p-2 border rounded-md border-gray-300 font-light"
                      value={userDetails.gender}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          gender: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      State
                    </Label>
                    <select
                      className="w-full p-2 border rounded-md border-gray-300 font-light"
                      value={userDetails.state}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          state: e.target.value,
                          city: "",
                        })
                      }
                    >
                      <option value="">Select State</option>
                      {Object.keys(statesAndCities).map((state) => (
                        <option key={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      City
                    </Label>
                    <select
                      className="w-full p-2 border rounded-md border-gray-300 font-light"
                      value={userDetails.city}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, city: e.target.value })
                      }
                      disabled={!userDetails.state}
                    >
                      <option value="">Select City</option>
                      {(statesAndCities[userDetails.state] || []).map(
                        (city) => (
                          <option key={city}>{city}</option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-2">
                  {["country", "address", "pincode"].map((field) => (
                    <div key={field}>
                      <Label
                        htmlFor={field}
                        className="text-sm font-medium text-gray-700"
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        id={field}
                        type="text"
                        placeholder={`Enter your ${field}`}
                        className="w-full rounded-md border-gray-300 font-light"
                        value={
                          userDetails[field as keyof typeof userDetails] || ""
                        }
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            [field]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Blood Group*
                    </Label>
                    <select
                      className="w-full p-2 border rounded-md border-gray-300 font-light"
                      value={userDetails.bloodGroup}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          bloodGroup: e.target.value,
                        })
                      }
                    >
                      {[
                        "",
                        "A+",
                        "A-",
                        "B+",
                        "B-",
                        "AB+",
                        "AB-",
                        "O+",
                        "O-",
                      ].map((group) => (
                        <option key={group} value={group}>
                          {group || "Select Blood Group"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {["age", "height", "weight"].map((field) => (
                      <div key={field}>
                        <Label className="text-sm font-medium text-gray-700">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </Label>
                        <Input
                          type="number"
                          placeholder={field}
                          className="w-full rounded-md border-gray-300 font-light"
                          value={
                            userDetails[field as keyof typeof userDetails] || ""
                          }
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              [field]: e.target.value,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      BMI
                    </Label>
                    <Input
                      type="text"
                      value={bmi}
                      readOnly
                      className="bg-gray-100 w-full rounded-md border-gray-300 font-light"
                    />
                    <p className="text-xs text-gray-500">
                      Calculated from Age, Height, and Weight
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Button
                  type="submit"
                  className="w-full bg-blue-950 hover:bg-blue-800 py-2 rounded-md font-medium text-base"
                >
                  {isUpload
                    ? "Uploading..."
                    : isUpdating
                    ? "Updating..."
                    : "Update Profile"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Photo (Desktop) */}
          <div className="hidden md:block md:w-2/5 bg-transparent relative">
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
                backgroundColor: "#ffffff",
                zIndex: 0,
              }}
            >
              <div className="flex pl-11 flex-col items-center justify-center h-full">
                <div className="mb-4 relative">
                  <Image
                    src={photoPreview || "/Avatar.svg"}
                    alt="Profile"
                    width={300}
                    height={300}
                    className="rounded-full border-2 border-gray-300 object-cover shadow-lg"
                  />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-2 right-2 bg-blue-950 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-800"
                  >
                    <Pen size={16} />
                  </label>
                </div>
                <h3 className="font-heading font-semibold text-xl text-blue-950">
                  {userDetails.fullName || "Your Profile"}
                </h3>
                <p className="text-gray-600 font-light">
                  {userDetails.bloodGroup
                    ? `Blood Group: ${userDetails.bloodGroup}`
                    : "Update your details"}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Photo */}
          <div className="md:hidden flex justify-center items-center p-6">
            <div className="flex flex-col items-center">
              <div className="mb-4 relative">
                <Image
                  src={photoPreview || "/Avatar.svg"}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full border-2 border-gray-300 object-cover shadow-lg"
                />
                <input
                  id="photo-upload-mobile"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload-mobile"
                  className="absolute bottom-1 right-1 bg-blue-950 text-white p-1.5 rounded-full cursor-pointer shadow-md hover:bg-blue-800"
                >
                  <Pen size={12} />
                </label>
              </div>
              <h3 className="font-heading font-semibold text-lg text-blue-950">
                {userDetails.fullName || "Your Profile"}
              </h3>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
