"use client";

import {
  useGetEventsQuery,
  useGetUserDataQuery,
  useSendDonorMutation,
} from "@/app/lib/EventOrganizer";
import { AlertCircle, CheckCircle, UploadCloud } from "lucide-react";
import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";

// Define TypeScript interfaces
interface DonorData {
  bloodGroup: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  quantity: string | number;
  eventName: string;
}

interface CSVDonorData {
  [key: string]: string;
}

interface Event {
  eventName: string;
  date: string;
  time: string;
}

function SendDonor() {
  const [donor, setDonor] = useState<DonorData>({
    bloodGroup: "",
    date: "",
    name: "",
    email: "",
    phone: "",
    quantity: "",
    eventName: "",
  });
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [donors, setDonors] = useState<CSVDonorData[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const [processingStatus, setProcessingStatus] = useState({
    total: 0,
    success: 0,
    error: 0,
    inProgress: false,
    failedDonors: [] as Array<{ name: string; error: string }>,
  });

  const [sendDonor, { isLoading }] = useSendDonorMutation();

  const { data, isLoading: isload } = useGetEventsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const { data: userData } = useGetUserDataQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const events = useMemo(() => data?.events || [], [data?.events]);

  const pastEvents = useMemo(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    return events.filter((event: Event) => {
      const eventDate = event.date.split("T")[0];
      const eventTime = event.time;
      return eventDate <= currentDate && eventTime <= currentTime;
    });
  }, [events]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setDonor((prev) => ({
      ...prev,
      [name]: name === "quantity" && value !== "" ? parseInt(value) : value,
    }));

    // When event is selected, auto-fill the date
    if (name === "eventName" && value) {
      const selectedEvent = pastEvents.find(
        (event: Event) => event.eventName === value
      );
      if (selectedEvent && selectedEvent.date) {
        const modifiedDate = selectedEvent.date.split("T")[0];
        setDonor((prev) => ({
          ...prev,
          date: modifiedDate,
          eventName: value,
        }));
      }
    }
  };

  const validateDonorData = (donorData: CSVDonorData, index: number) => {
    const requiredFields = ["name", "email", "phone", "bloodGroup", "quantity"];

    for (const field of requiredFields) {
      if (!donorData[field] || donorData[field].trim() === "") {
        return {
          isValid: false,
          error: `Missing required field "${field}" in record ${index + 1}`,
        };
      }
    }

    return { isValid: true, error: "" };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");

    if (!file) {
      setFileError("No file selected.");
      return;
    }

    if (file.size === 0) {
      setFileError("The file is empty.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt: ProgressEvent<FileReader>) => {
      try {
        const text = evt.target?.result as string;

        if (!text || text.trim() === "") {
          setFileError("The file content is empty.");
          return;
        }

        const lines = text.split("\n");

        if (lines.length <= 1) {
          setFileError("The file does not contain any donor data.");
          return;
        }

        const headers = lines[0].split(",").map((header) => header.trim());
        const donorsData: CSVDonorData[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = lines[i].split(",").map((value) => value.trim());
          const donorData: CSVDonorData = {};

          headers.forEach((header, index) => {
            const fieldMapping: Record<string, string> = {
              name: "name",
              email: "email",
              phone: "phone",
              bloodgroup: "bloodGroup",
              quantity: "quantity",
            };

            const fieldName =
              fieldMapping[header.toLowerCase()] || header.toLowerCase();

            if (fieldName !== "eventName") {
              donorData[fieldName] = values[index] || "";
            }
          });

          donorsData.push(donorData);
        }

        setDonors(donorsData);
        setFileUploaded(true);
        toast.success(`Loaded ${donorsData.length} donor record(s) from file`);
      } catch (error) {
        console.error("Error parsing file:", error);
        setFileError("Failed to parse the file. Please check the format.");
      }
    };

    reader.onerror = () => {
      setFileError("Error reading file");
    };

    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (fileUploaded && !donor.eventName) {
      toast.error("Please select an event for these donors");
      return;
    }

    try {
      if (fileUploaded && donors.length > 0) {
        // Validate all donors before submitting
        const validationMessages: string[] = [];

        donors.forEach((donorData, index) => {
          const { isValid, error } = validateDonorData(donorData, index);
          if (!isValid && error) {
            validationMessages.push(error);
          }
        });

        if (validationMessages.length > 0) {
          const displayErrors = validationMessages.slice(0, 3);
          const remainingCount = validationMessages.length - 3;

          let errorMessage = displayErrors.join(". ");
          if (remainingCount > 0) {
            errorMessage += ` and ${remainingCount} more error(s).`;
          }

          toast.error(errorMessage);
          return;
        }

        // Reset and initialize processing status
        setProcessingStatus({
          total: donors.length,
          success: 0,
          error: 0,
          inProgress: true,
          failedDonors: [],
        });

        // Process donors one by one
        let successCount = 0;
        let errorCount = 0;
        const failedDonors: Array<{ name: string; error: string }> = [];

        for (const donorData of donors) {
          try {
            await sendDonor({
              bloodGroup: donorData.bloodGroup || "",
              dateIssued: donor.date,
              name: donorData.name || "",
              email: donorData.email || "",
              phone: donorData.phone || "",
              quantity: donorData.quantity || "",
              eventName: donor.eventName,
              issuedBy: userData?.EventOrganizerName || "",
            }).unwrap();

            successCount++;
          } catch (err: unknown) {
            const errorObj = err as { data?: { error?: string } };
            const errorMessage = errorObj?.data?.error || "Unknown error";

            // Silently ignore specific error
            if (
              errorMessage.includes(
                "user with this email and blood group will not found"
              )
            ) {
              successCount++;
              continue;
            }

            errorCount++;
            failedDonors.push({
              name: donorData.name || `Unknown donor`,
              error: errorMessage,
            });

            toast.error(
              `Failed to add ${donorData.name || "donor"}: ${errorMessage}`
            );
          }
        }

        // Update final status
        setProcessingStatus({
          total: donors.length,
          success: successCount,
          error: errorCount,
          inProgress: false,
          failedDonors,
        });

        // Show success message after all processing is done
        if (successCount > 0) {
          toast.success(
            `Successfully added ${successCount} out of ${donors.length} donor(s)`
          );
        }

        resetFileUpload();
      } else {
        // Handle single donor from form
        await sendDonor({
          bloodGroup: donor.bloodGroup,
          dateIssued: donor.date,
          name: donor.name,
          email: donor.email,
          phone: donor.phone,
          quantity: donor.quantity,
          eventName: donor.eventName,
          issuedBy: userData?.EventOrganizerName || "",
        }).unwrap();

        toast.success("Donor&apos;s Details Sent successfully!");

        // Reset form after successful submission
        setDonor({
          bloodGroup: "",
          date: "",
          name: "",
          email: "",
          phone: "",
          quantity: "",
          eventName: "",
        });
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { error?: string } };
      toast.error(errorObj?.data?.error || "Adding failed. Try again.");
    }
  };

  const resetFileUpload = () => {
    setFileUploaded(false);
    setDonors([]);
    setFileError("");

    // Keep the eventName and date if already selected
    const { eventName, date } = donor;

    setDonor({
      bloodGroup: "",
      date,
      name: "",
      email: "",
      phone: "",
      quantity: "",
      eventName,
    });
  };

  return (
    <div className="flex justify-center items-center p-4 mt-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Add Donor</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-gray-600">
              Event (Past Events Only)
            </label>
            <select
              name="eventName"
              value={donor.eventName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Event</option>
              {isload ? (
                <option value="" disabled>
                  Loading events...
                </option>
              ) : pastEvents.length > 0 ? (
                pastEvents.map((event: Event) => (
                  <option key={event.eventName} value={event.eventName}>
                    {event.eventName}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No past events available
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-gray-600">Blood Group</label>
            <select
              name="bloodGroup"
              value={donor.bloodGroup}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              disabled={fileUploaded}
              required={!fileUploaded}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600">Date</label>
            <input
              type="date"
              name="date"
              value={donor.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              readOnly
            />
          </div>

          <div>
            <label className="block text-gray-600">Donor&apos;s Name</label>
            <input
              type="text"
              name="name"
              placeholder="Type name"
              value={donor.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              disabled={fileUploaded}
              required={!fileUploaded}
            />
          </div>

          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={donor.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              disabled={fileUploaded}
              required={!fileUploaded}
            />
          </div>

          <div>
            <label className="block text-gray-600">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="1010101010"
              value={donor.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              disabled={fileUploaded}
              required={!fileUploaded}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-600">Quantity Collected</label>
            <div className="flex items-center">
              <input
                type="number"
                name="quantity"
                placeholder="XX"
                value={donor.quantity}
                onChange={handleChange}
                className="w-20 p-2 border rounded-md text-center"
                disabled={fileUploaded}
                required={!fileUploaded}
              />
              <span className="ml-2">ml</span>
            </div>
          </div>

          {/* Divider with OR */}
          <div className="md:col-span-2 flex items-center justify-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* File Upload Section */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex flex-col items-center">
                <label className="flex flex-col items-center justify-center w-full">
                  <div className="flex flex-col items-center justify-center">
                    <UploadCloud className="w-10 h-10 text-gray-500 mb-2" />
                    <p className="text-gray-700 font-medium">
                      Upload CSV file with donor details
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Required fields: name, email, phone, bloodGroup, quantity
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="w-full block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 mt-4"
                  />
                </label>

                {fileError && (
                  <div className="mt-4 w-full">
                    <div className="flex items-center bg-green-50 p-3 rounded-md border border-green-200">
                      <AlertCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-green-700">{fileError}</span>
                    </div>
                  </div>
                )}

                {fileUploaded && (
                  <div className="mt-4 w-full">
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-green-700 font-medium">
                          {donors.length} donor(s) loaded successfully!
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={resetFileUpload}
                        className="text-green-600 hover:text-green-800"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Please select an event to associate with these donors.
                    </div>
                  </div>
                )}

                {processingStatus.inProgress && (
                  <div className="mt-4 w-full">
                    <div className="flex items-center bg-blue-50 p-3 rounded-md border border-blue-200">
                      <span className="text-blue-700">
                        Processing:{" "}
                        {processingStatus.success + processingStatus.error} of{" "}
                        {processingStatus.total} donors...
                      </span>
                    </div>
                  </div>
                )}

                {!processingStatus.inProgress &&
                  processingStatus.failedDonors.length > 0 && (
                    <div className="mt-4 w-full">
                      <div className="bg-green-50 p-3 rounded-md border border-green-200">
                        <div className="font-medium text-green-700 mb-1">
                          Failed to add {processingStatus.failedDonors.length}{" "}
                          donor(s):
                        </div>
                        <ul className="text-sm text-green-600 list-disc pl-5">
                          {processingStatus.failedDonors
                            .slice(0, 3)
                            .map((failedDonor, index) => (
                              <li key={index}>
                                {failedDonor.name}: {failedDonor.error}
                              </li>
                            ))}
                          {processingStatus.failedDonors.length > 3 && (
                            <li>
                              ...and {processingStatus.failedDonors.length - 3}{" "}
                              more
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              disabled={
                isLoading ||
                processingStatus.inProgress ||
                (!fileUploaded &&
                  (!donor.name || !donor.bloodGroup || !donor.eventName)) ||
                (fileUploaded && !donor.eventName)
              }
              className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition disabled:opacity-50"
            >
              {isLoading || processingStatus.inProgress
                ? "Processing..."
                : fileUploaded
                ? `Add ${donors.length} Donor(s)`
                : "Add Donor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SendDonor;
