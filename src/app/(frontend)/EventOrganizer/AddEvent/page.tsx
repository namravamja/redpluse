"use client";
import { useAddEventMutation } from "@/app/lib/EventOrganizer";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    city: "",
    state: "",
    time: { hour: "", minute: "" },
    eventDate: "",
  });

  const [errors, setErrors] = useState({
    eventId: "",
    eventDate: "",
    time: { hour: "", minute: "" },
  });

  const [addEvent, { isLoading }] = useAddEventMutation();
  const router = useRouter();

  // Indian states in alphabetical order
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  // Map of states to their major cities (sorted alphabetically)
  const citiesByState = useMemo(
    () => ({
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
      Haryana: [
        "Ambala",
        "Faridabad",
        "Gurugram",
        "Hisar",
        "Panipat",
        "Rohtak",
      ],
      "Himachal Pradesh": ["Dharamshala", "Mandi", "Shimla", "Solan"],
      Jharkhand: ["Bokaro", "Dhanbad", "Jamshedpur", "Ranchi"],
      Karnataka: ["Bengaluru", "Hubballi", "Mangaluru", "Mysuru", "Shivamogga"],
      Kerala: [
        "Kochi",
        "Kollam",
        "Kozhikode",
        "Thiruvananthapuram",
        "Thrissur",
      ],
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
    }),
    []
  );

  // Set available cities based on selected state
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Update cities when state changes
  useEffect(() => {
    if (formData.state) {
      setAvailableCities(
        citiesByState[formData.state as keyof typeof citiesByState] || []
      );
      // Clear city if state changed
      if (
        !citiesByState[formData.state as keyof typeof citiesByState]?.includes(
          formData.city
        )
      ) {
        setFormData((prev) => ({ ...prev, city: "" }));
      }
    } else {
      setAvailableCities([]);
    }
  }, [formData.state, formData.city, citiesByState]);

  // Set minimum date to today
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const validateField = (name: string, value: string | number) => {
    switch (name) {
      case "eventId":
        if (isNaN(Number(value)) || value === "") {
          toast.error("Event ID must be a number");
          return "Event ID must be a number";
        }
        return "";

      case "eventDate":
        const selectedDate = new Date(value as string);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!value) {
          toast.error("Date is required");
          return "Date is required";
        } else if (selectedDate < today) {
          toast.error("Past dates are not allowed");
          return "Past dates are not allowed";
        }
        return "";

      case "time.hour":
        const hour = Number(value);
        if (value === "" || isNaN(hour) || hour < 0 || hour > 23) {
          toast.error("Enter valid hour (0-23)");
          return "Enter valid hour (0-23)";
        }
        return "";

      case "time.minute":
        const minute = Number(value);
        if (value === "" || isNaN(minute) || minute < 0 || minute > 59) {
          toast.error("Enter valid minute (0-59)");
          return "Enter valid minute (0-59)";
        }
        return "";

      case "eventName":
        if (!(value as string).trim()) {
          toast.error("Event name is required");
          return "Event name is required";
        }
        return "";

      case "location":
        if (!(value as string).trim()) {
          toast.error("Location is required");
          return "Location is required";
        }
        return "";

      case "state":
        if (!value) {
          toast.error("Please select a state");
          return "Please select a state";
        }
        return "";

      case "city":
        if (!value && formData.state) {
          toast.error("Please select a city");
          return "Please select a city";
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      eventId: "",
      eventDate: "",
      time: { hour: "", minute: "" },
    };

    // Validate date
    newErrors.eventDate = validateField("eventDate", formData.eventDate);
    if (newErrors.eventDate) isValid = false;

    // Validate time
    newErrors.time.hour = validateField("time.hour", formData.time.hour);
    if (newErrors.time.hour) isValid = false;

    newErrors.time.minute = validateField("time.minute", formData.time.minute);
    if (newErrors.time.minute) isValid = false;

    // Validate other required fields
    const eventNameError = validateField("eventName", formData.eventName);
    if (eventNameError) isValid = false;

    const locationError = validateField("location", formData.location);
    if (locationError) isValid = false;

    const stateError = validateField("state", formData.state);
    if (stateError) isValid = false;

    const cityError = validateField("city", formData.city);
    if (cityError) isValid = false;

    setErrors(newErrors);
    return isValid;
  };

  // Validate on blur
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("time.")) {
      const key = name.split(".")[1];
      const errorMessage = validateField(name, value);

      setErrors((prev) => ({
        ...prev,
        time: {
          ...prev.time,
          [key]: errorMessage,
        },
      }));
    } else if (name === "eventId" || name === "eventDate") {
      const errorMessage = validateField(name, value);

      setErrors((prev) => ({
        ...prev,
        [name]: errorMessage,
      }));
    } else {
      // For other fields, just validate without updating errors state
      validateField(name, value);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (name.startsWith("time.")) {
        const key = name.split(".")[1]; // Extract 'hour' or 'minute'
        return {
          ...prevData,
          time: {
            ...prevData.time,
            [key]: value,
          },
        };
      }

      return { ...prevData, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all errors in the form");
      return;
    }

    try {
      const response = await addEvent({
        eventName: formData.eventName,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        time: `${formData.time.hour.padStart(
          2,
          "0"
        )}:${formData.time.minute.padStart(2, "0")}`,
        date: formData.eventDate,
      }).unwrap();

      router.push(" /EventOrganizer/Events");

      console.log("Add successful:", response);
      toast.success("Event added successfully!");
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Adding failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center p-4 mt-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Add Event</h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-gray-600">Event Name</label>
            <input
              type="text"
              name="eventName"
              required
              value={formData.eventName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Event Name"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-600">Date</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              onBlur={handleBlur}
              min={getTodayDate()}
              className={`w-full p-2 border rounded-md ${
                errors.eventDate ? "border-green-500" : ""
              }`}
              required
            />
            {errors.eventDate && (
              <p className="text-green-500 text-sm mt-1">{errors.eventDate}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600">Start Time</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  name="time.hour"
                  value={formData.time.hour}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="HH"
                  min="0"
                  max="23"
                  className={`w-full p-2 border rounded-md text-center ${
                    errors.time.hour ? "border-green-500" : ""
                  }`}
                  required
                />
                {errors.time.hour && (
                  <p className="text-green-500 text-sm mt-1">
                    {errors.time.hour}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  name="time.minute"
                  value={formData.time.minute}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="MM"
                  min="0"
                  max="59"
                  className={`w-full p-2 border rounded-md text-center ${
                    errors.time.minute ? "border-green-500" : ""
                  }`}
                  required
                />
                {errors.time.minute && (
                  <p className="text-green-500 text-sm mt-1">
                    {errors.time.minute}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-600">Location</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Address"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-600">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select State</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-2 border rounded-md"
              required
              disabled={!formData.state}
            >
              <option value="">Select City</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex justify-center mt-3">
            <button
              type="submit"
              className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
