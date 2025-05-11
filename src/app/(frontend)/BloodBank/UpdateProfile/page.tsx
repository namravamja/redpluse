"use client";
import { useState, ChangeEvent, useEffect, FormEvent } from "react";
import {
  useUpdateUserDataMutation,
  useGetUserDataQuery,
} from "@/app/lib/BloodBank";
import toast from "react-hot-toast";

// Define states and cities
const STATES = [
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

const CITIES_BY_STATE: { [key: string]: string[] } = {
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

export default function UpdateBloodBankForm() {
  const [formData, setFormData] = useState({
    BloodBankName: "",
    email: "",
    licenceNumber: "",
    phone: "",
    helplineNumber: "",
    contactPerson: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    parentHospital: "",
    category: "",
  });

  const [cityOptions, setCityOptions] = useState<string[]>([
    "Select a state first",
  ]);

  const { data: userData, refetch } = useGetUserDataQuery([], {
    refetchOnMountOrArgChange: true,
  });

  const [updateBloodBankData, { isLoading: isUpdateLoading }] =
    useUpdateUserDataMutation();

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({ ...prev, ...userData }));
    }
  }, [userData]);

  useEffect(() => {
    if (formData.state && CITIES_BY_STATE[formData.state]) {
      setCityOptions(CITIES_BY_STATE[formData.state]);
    } else {
      setCityOptions(["Select a state first"]);
    }
  }, [formData.state]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateBloodBankData(formData).unwrap();
      refetch();
      toast.success("Profile Updated successfully!");
    } catch (error) {
      console.error("Error during update", error);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Update Blood Bank Profile
        </h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            label="Blood Bank Name"
            name="BloodBankName"
            value={formData.BloodBankName}
            onChange={handleChange}
          />
          <Input
            label="Licence Number"
            name="licenceNumber"
            value={formData.licenceNumber}
            onChange={handleChange}
          />
          <Input
            label="Contact Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleSelectChange}
            options={["Government", "Private"]}
            placeholder="Select Category"
          />
          <Input
            label="Email ID"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
          />
          <Input
            label="Parent Hospital"
            name="parentHospital"
            value={formData.parentHospital}
            onChange={handleChange}
          />
          <Input
            label="Contact Person"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
          />
          <Input
            label="Helpline Number"
            name="helplineNumber"
            value={formData.helplineNumber}
            onChange={handleChange}
          />
          <Select
            label="State"
            name="state"
            value={formData.state}
            onChange={handleSelectChange}
            options={STATES}
            placeholder="Select State"
          />
          <Select
            label="City"
            name="city"
            value={formData.city}
            onChange={handleSelectChange}
            options={cityOptions}
            disabled={!formData.state}
          />
          <Input
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
          <div className="md:col-span-2">
            <label className="block text-gray-600">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter address"
            />
          </div>

          <div className="md:col-span-2 flex justify-center mt-2">
            <button
              type="submit"
              className="bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 transition"
            >
              {isUpdateLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper components for cleaner JSX
function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-md"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-gray-600">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-md"
        disabled={disabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
