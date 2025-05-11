"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllBloodDetailsQuery } from "../../../lib/BloodBank";
import { Loader2 } from "lucide-react";

// Define a type for the Bank object
type Bank = {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  category: string;
  city: string;
  state: string;
  availableBloodTypes: string[];
};

// Define the type for the API response
interface BloodDetailsResponse {
  data: Bank[];
  // Add other response fields if needed
  success?: boolean;
  message?: string;
}

export default function BloodBanksPage() {
  const { data, isLoading } = useGetAllBloodDetailsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  }) as { data?: BloodDetailsResponse; isLoading: boolean };

  // Memoize `allBanks` to avoid unnecessary re-renders
  const allBanks: Bank[] = useMemo(() => data?.data ?? [], [data?.data]);

  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectBloodType, setSelectBloodType] = useState<string>("");
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>([]); // Type the filtered banks state as an array of Bank objects
  const [currentPage, setCurrentPage] = useState<number>(1);
  const banksPerPage = 5;

  // Extract unique states and sort alphabetically
  const availableStates = [...new Set(allBanks.map((bank) => bank.state))]
    .filter(Boolean)
    .sort() as string[];

  // Get cities based on selected state and sort alphabetically
  const availableCities: string[] = selectedState
    ? [
        ...(Array.from(
          new Set(
            allBanks
              .filter((bank) => bank.state === selectedState)
              .map((bank) => bank.city)
          )
        ) as string[]),
      ]
        .filter(Boolean)
        .sort()
    : [];

  // Reset city selection when state changes
  useEffect(() => {
    setSelectedCity("");
  }, [selectedState]);

  // Memoize the handleSearch function
  const handleSearch = useCallback(() => {
    const filtered = allBanks.filter((bank) => {
      const matchState = selectedState ? bank.state === selectedState : true;
      const matchCity = selectedCity ? bank.city === selectedCity : true;
      const matchType = selectBloodType
        ? bank.availableBloodTypes?.includes(selectBloodType)
        : true;

      return matchState && matchCity && matchType;
    });

    setCurrentPage(1);
    setFilteredBanks(filtered);
  }, [allBanks, selectedState, selectedCity, selectBloodType]); // Include all relevant state variables

  // Show all banks by default
  useEffect(() => {
    if (allBanks.length) {
      handleSearch();
    }
  }, [allBanks, handleSearch]);

  const handleClearState = () => {
    setSelectedState("");
    setSelectedCity("");
  };

  const handleClearCity = () => {
    setSelectedCity("");
  };

  const handleClearBloodType = () => {
    setSelectBloodType("");
  };

  // Pagination logic
  const indexOfLastBank = currentPage * banksPerPage;
  const indexOfFirstBank = indexOfLastBank - banksPerPage;
  const currentBanks = filteredBanks.slice(indexOfFirstBank, indexOfLastBank);
  const totalPages = Math.ceil(filteredBanks.length / banksPerPage);

  // Generate page numbers for pagination with ellipsis for large page counts
  const getPageNumbers = () => {
    const maxPageButtons = 5;
    const pageNumbers = [];

    if (totalPages <= maxPageButtons) {
      // Show all pages if total pages is less than max buttons
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      if (currentPage > 3) {
        pageNumbers.push("ellipsis1");
      }

      // Calculate start and end of current page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(currentPage + 1, totalPages - 1);

      // Adjust range if at edges
      if (currentPage <= 3) {
        end = Math.min(maxPageButtons - 1, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - (maxPageButtons - 2));
      }

      // Add page numbers in range
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push("ellipsis2");
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold bg-red-600/100 text-white p-4 rounded">
        Blood Banks
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger>
            <SelectValue placeholder="Enter Your State" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {selectedState && (
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  handleClearState();
                }}
                className="w-full justify-start text-red-600/100 hover:text-red-700/100 hover:bg-red-50 mb-1"
              >
                Clear Selection
              </Button>
            )}
            {availableStates.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedCity}
          onValueChange={setSelectedCity}
          disabled={!selectedState}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                selectedState ? "Enter Your City" : "Select a state first"
              }
            />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {selectedCity && (
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  handleClearCity();
                }}
                className="w-full justify-start text-red-600/100 hover:text-red-700/100 hover:bg-red-50 mb-1"
              >
                Clear Selection
              </Button>
            )}
            {availableCities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectBloodType} onValueChange={setSelectBloodType}>
          <SelectTrigger>
            <SelectValue placeholder="Enter your Blood Type" />
          </SelectTrigger>
          <SelectContent>
            {selectBloodType && (
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  handleClearBloodType();
                }}
                className="w-full justify-start text-red-600/100 hover:text-red-700/100 hover:bg-red-50 mb-1"
              >
                Clear Selection
              </Button>
            )}
            <SelectItem value="A+">A+</SelectItem>
            <SelectItem value="A-">A-</SelectItem>
            <SelectItem value="O+">O+</SelectItem>
            <SelectItem value="O-">O-</SelectItem>
            <SelectItem value="AB+">AB+</SelectItem>
            <SelectItem value="AB-">AB-</SelectItem>
            <SelectItem value="B+">B+</SelectItem>
            <SelectItem value="B-">B-</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleSearch}
          className="bg-red-600/100 hover:bg-red-700/100 text-white"
        >
          Search
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-red-600/100" />
            </div>
          ) : currentBanks.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 text-black">
                      <TableHead className="whitespace-nowrap">
                        Sr. No.
                      </TableHead>
                      <TableHead className="whitespace-nowrap">Name</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Address
                      </TableHead>
                      <TableHead className="whitespace-nowrap">Phone</TableHead>
                      <TableHead className="whitespace-nowrap">Email</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Category
                      </TableHead>
                      <TableHead className="whitespace-nowrap">City</TableHead>
                      <TableHead className="whitespace-nowrap">State</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Available Blood Types
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBanks.map((bank, index) => (
                      <TableRow
                        key={bank._id || index}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>{indexOfFirstBank + index + 1}</TableCell>
                        <TableCell>{bank.name}</TableCell>
                        <TableCell>{bank.address}</TableCell>
                        <TableCell>{bank.phone}</TableCell>
                        <TableCell>{bank.email}</TableCell>
                        <TableCell>{bank.category}</TableCell>
                        <TableCell>{bank.city}</TableCell>
                        <TableCell>{bank.state}</TableCell>
                        <TableCell>
                          {bank.availableBloodTypes?.join(", ") || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6 flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3"
                  >
                    ← Prev
                  </Button>

                  {getPageNumbers().map((number, index) =>
                    number === "ellipsis1" || number === "ellipsis2" ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="flex items-center px-2"
                      >
                        ...
                      </span>
                    ) : (
                      <Button
                        key={number}
                        variant={currentPage === number ? "default" : "outline"}
                        onClick={() => setCurrentPage(number as number)}
                        className="w-10 h-10 p-0"
                      >
                        {number}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3"
                  >
                    Next →
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-600/100 p-10">
              Sorry, no data is available for your requirements.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-gray-500 mt-4 text-center">
        Showing{" "}
        {currentBanks.length > 0
          ? `${indexOfFirstBank + 1}-${Math.min(
              indexOfLastBank,
              filteredBanks.length
            )}`
          : "0"}{" "}
        of {filteredBanks.length} blood banks
      </div>
    </div>
  );
}
