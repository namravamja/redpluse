"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useGetAllEventsQuery } from "../../../lib/EventOrganizer";

// Define types for event data
type Event = {
  event: {
    _id: string;
    date: string;
    eventName: string;
    location: string;
    city: string;
    state: string;
    time: string;
  };
  organizerName: string;
  organizerNumber: string;
};

// Define the query response type
interface EventsQueryResponse {
  events: Event[];
}

export default function EventsPage() {
  const { data, isLoading } = useGetAllEventsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  }) as { data: EventsQueryResponse | undefined; isLoading: boolean };

  // Memoize the events to prevent unnecessary recalculations
  const events: Event[] = useMemo(() => data?.events ?? [], [data]);

  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const eventsPerPage = 10;

  useEffect(() => {
    if (!data || !Array.isArray(events)) return;

    const validEvents = events
      .filter((e) => e.event.city && e.event.time && e.event.time !== ":")
      .sort(
        (a, b) =>
          new Date(a.event.date).getTime() - new Date(b.event.date).getTime()
      );

    // Only update if the filtered list changed
    setFilteredEvents((prev) => {
      const prevIds = prev.map((e) => e.event._id).join(",");
      const newIds = validEvents.map((e) => e.event._id).join(",");
      return prevIds === newIds ? prev : validEvents;
    });
  }, [data, events]);

  const handleSearch = () => {
    const validEvents = events
      .filter((e) => e.event.city && e.event.time && e.event.time !== ":")
      .filter((e) => {
        const matchState = selectedState
          ? e.event.state === selectedState
          : true;
        const matchCity = selectedCity ? e.event.city === selectedCity : true;
        const matchDate = date
          ? format(new Date(e.event.date), "yyyy-MM-dd") ===
            format(date, "yyyy-MM-dd")
          : true;
        return matchState && matchCity && matchDate;
      })
      .sort(
        (a, b) =>
          new Date(a.event.date).getTime() - new Date(b.event.date).getTime()
      );

    setCurrentPage(1); // Reset to page 1 on new search
    setFilteredEvents(validEvents);
  };

  // Get unique states and cities for the dropdown
  const uniqueStates = [
    ...new Set(events.map((e) => e.event.state).filter(Boolean)),
  ];
  const uniqueCities = [
    ...new Set(events.map((e) => e.event.city).filter(Boolean)),
  ];

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Enhanced pagination functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page buttons to display
  const getPageButtons = () => {
    const pages = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      // Show all pages if total pages are less than max visible buttons
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic for many pages
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisibleButtons / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

      // Adjust if we're near the end
      if (endPage - startPage + 1 < maxVisibleButtons) {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
      }

      // Add first page
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("ellipsis");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold bg-blue-600/100 text-white p-4 rounded">
        Events
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
        <Select onValueChange={setSelectedState}>
          <SelectTrigger>
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            {uniqueStates.map((state) => (
              <SelectItem key={`state-${state}`} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            {uniqueCities.map((city) => (
              <SelectItem key={`city-${city}`} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {date ? format(date, "yyyy-MM-dd") : "Select Date"}
              <CalendarIcon className="ml-auto h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={date ?? new Date()}
              onSelect={(d) => setDate(d ?? null)}
            />
          </PopoverContent>
        </Popover>

        <Button
          onClick={handleSearch}
          className="bg-blue-600/100 hover:bg-blue-700/100 text-white"
        >
          Search
        </Button>
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <p className="text-center p-6">Loading...</p>
          ) : filteredEvents.length === 0 ? (
            <p className="text-center text-gray-500 p-6">
              No events available.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sr. No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentEvents.map((e, index) => (
                    <TableRow key={e.event._id || `event-row-${index}`}>
                      <TableCell>{indexOfFirstEvent + index + 1}</TableCell>
                      <TableCell>
                        {format(new Date(e.event.date), "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell>{e.event.eventName}</TableCell>
                      <TableCell>{e.event.location || "N/A"}</TableCell>
                      <TableCell>{e.event.city}</TableCell>
                      <TableCell>{e.event.state}</TableCell>
                      <TableCell>{e.event.time}</TableCell>
                      <TableCell>{e.organizerName}</TableCell>
                      <TableCell>{e.organizerNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    size="sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {getPageButtons().map((page, index) =>
                    page === "ellipsis" ? (
                      <span key={`ellipsis-${index}`} className="px-2">
                        ...
                      </span>
                    ) : (
                      <Button
                        key={`page-${page}`}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page as number)}
                        size="sm"
                        className="min-w-8"
                      >
                        {page}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    size="sm"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <span className="text-sm text-gray-500 ml-2">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}