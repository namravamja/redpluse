"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function UserForm() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");

  const calculateBMI = () => {
    if (height && weight) { 
      const heightInMeters = parseFloat(height) / 100;
      const bmiValue = (
        parseFloat(weight) /
        (heightInMeters * heightInMeters)
      ).toFixed(2);
      setBmi(bmiValue);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#D9D9D9] p-4">
      <Card className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-xl h-max">
        <CardContent>
          <h2 className="text-2xl font-bold mb-10 mt-5 text-center">
            Donor Registration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Side - User Details */}
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input type="text" placeholder="Enter your name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="Enter your email" />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" placeholder="Enter password" />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input type="password" placeholder="Confirm password" />
              </div>
              <div>
                <Label>Phone No.</Label>
                <Input type="tel" placeholder="Enter phone number" />
              </div>
            </div>

            {/* Right Side - Other Details */}
            <div className="space-y-3">
              <div>
                <Label>Aadhaar Card No.</Label>
                <Input type="text" placeholder="Enter Aadhaar number" />
              </div>
              <div>
                <Label>Blood Group</Label>
                <Input type="text" placeholder="Enter blood group" />
              </div>

              {/* BMI Calculator */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Age</Label>
                  <Input type="number" placeholder="Age" />
                </div>
                <div>
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    placeholder="Height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    onBlur={calculateBMI}
                  />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    placeholder="Weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    onBlur={calculateBMI}
                  />
                </div>
              </div>
              <div>
                <Label>BMI</Label>
                <Input
                  type="text"
                  value={bmi}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <Label>Upload Photo</Label>
                <Input type="file" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <Link href="/frontend/Donor">
              <Button className="w-full bg-red-950 hover:bg-red-900">
                Submit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
