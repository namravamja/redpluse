"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  FaPlus,
  FaEdit,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaTrash,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa"
import { useRouter } from "next/navigation"
import { useDeleteEventMutation, useGetEventsQuery, useUpdateEventDataMutation } from "@/app/lib/EventOrganizer"
import toast from "react-hot-toast"

// Define TypeScript interfaces
interface EventData {
  eventId: string
  eventName: string
  date: string
  time: string
  location: string
  city: string
  state: string
}

interface ValidationErrors {
  [key: string]: string
}

interface ApiError {
  data?: {
    error?: string
  }
  status?: number
}

// Indian States list for dropdown
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
]

// Major Indian Cities by state
const CITIES_BY_STATE: { [key: string]: string[] } = {
  "Andhra Pradesh": ["Amaravati", "Guntur", "Kurnool", "Nellore", "Tirupati", "Vijayawada", "Visakhapatnam"],
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
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
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
}

// Default cities if state isn't selected yet
const DEFAULT_CITIES = ["Select a state first"]

const Events: React.FC = () => {
  const router = useRouter()
  const { data, error, isLoading, refetch } = useGetEventsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    },
  )

  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventDataMutation()
  const [deleteEvent] = useDeleteEventMutation()

  // State to track which event is being edited
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  // State for edited event data
  const [editedEvent, setEditedEvent] = useState<EventData>({
    eventId: "",
    eventName: "",
    date: "",
    time: "",
    location: "",
    city: "",
    state: "",
  })

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<EventData | null>(null)

  // State for available cities based on selected state
  const [availableCities, setAvailableCities] = useState<string[]>(DEFAULT_CITIES)

  // Get today's date in YYYY-MM-DD format for date input min attribute
  const today = new Date().toISOString().split("T")[0]

  // Effect to update available cities when state changes
  useEffect(() => {
    if (editedEvent.state && CITIES_BY_STATE[editedEvent.state]) {
      setAvailableCities(CITIES_BY_STATE[editedEvent.state])
    } else {
      setAvailableCities(DEFAULT_CITIES)
    }
  }, [editedEvent.state])

  const handleAddEvent = () => {
    router.push(" /EventOrganizer/AddEvent")
    refetch()
  }

  const handleEditToggle = (event: EventData) => {
    if (editingEventId === event.eventId) {
      // Cancel edit mode
      setEditingEventId(null)
      setValidationErrors({})
    } else {
      // Enter edit mode and load event data
      setEditingEventId(event.eventId)
      setEditedEvent({
        eventId: event.eventId,
        eventName: event.eventName || "",
        date: event.date || "",
        time: event.time || "",
        location: event.location || "",
        city: event.city || "",
        state: event.state || "",
      })
      // Set available cities based on the event's state
      if (event.state && CITIES_BY_STATE[event.state]) {
        setAvailableCities(CITIES_BY_STATE[event.state])
      } else {
        setAvailableCities(DEFAULT_CITIES)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    setEditedEvent((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateEventData = () => {
    const errors: ValidationErrors = {}

    if (!editedEvent.eventName.trim()) {
      errors.eventName = "Event name is required"
    }

    if (!editedEvent.date) {
      errors.date = "Date is required"
    } else {
      // Check if date is in the past
      const selectedDate = new Date(editedEvent.date)
      selectedDate.setHours(0, 0, 0, 0)
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      if (selectedDate < currentDate) {
        errors.date = "Cannot select a past date"
      }
    }

    if (!editedEvent.time) {
      errors.time = "Time is required"
    } else {
      // Validate time format (HH:MM)
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(editedEvent.time)) {
        errors.time = "Invalid time format (use HH:MM)"
      } else if (editedEvent.date) {
        // Check if date and time combined are in the past
        const selectedDate = new Date(editedEvent.date)
        const [hours, minutes] = editedEvent.time.split(":").map(Number)
        selectedDate.setHours(hours, minutes, 0, 0)
        const currentDate = new Date()

        if (selectedDate < currentDate) {
          errors.time = "Event time has already passed"
        }
      }
    }

    if (!editedEvent.location.trim()) {
      errors.location = "Location is required"
    }

    if (!editedEvent.city || editedEvent.city === "Select a state first") {
      errors.city = "City is required"
    }

    if (!editedEvent.state) {
      errors.state = "State is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveEvent = async () => {
    if (!validateEventData()) {
      toast.error("Please fix the validation errors")
      return
    }

    try {
      await updateEvent(editedEvent).unwrap()
      setEditingEventId(null)
      refetch()
      toast.success("Event updated successfully!")
    } catch (err: unknown) {
      const error = err as ApiError
      console.error("Failed to update the event:", error)
      toast.error(error?.data?.error || "Failed to update event. Please try again.")
    }
  }

  const openDeleteConfirm = (event: EventData) => {
    setEventToDelete(event)
    setShowDeleteConfirm(true)
  }

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false)
    setEventToDelete(null)
  }

  const handleDelete = async () => {
    if (!eventToDelete) return

    try {
      await deleteEvent(eventToDelete).unwrap()
      toast.success(`"${eventToDelete.eventName}" deleted successfully!`)
      closeDeleteConfirm()
      refetch() // Refresh the events list after deletion
    } catch (err: unknown) {
      const error = err as ApiError
      toast.error(error?.data?.error || "Failed to delete event. Please try again.")
      closeDeleteConfirm()
    }
  }

  // Function to check if an event date has passed
  const isEventPassed = (eventDate: string, eventTime: string): boolean => {
    if (!eventDate) return false

    const currentDateTime = new Date()
    const eventDateTime = new Date(eventDate)

    // If time is provided, set the hours and minutes
    if (eventTime) {
      const [hours, minutes] = eventTime.split(":").map(Number)
      eventDateTime.setHours(hours, minutes, 0, 0)
    } else {
      // If no time provided, set to end of day to be safe
      eventDateTime.setHours(23, 59, 59, 999)
    }

    return eventDateTime < currentDateTime
  }

  // Conditional rendering after all hooks are defined
  if (isLoading) return <div className="p-6 text-center">Loading...</div>
  if (error) {
    const apiError = error as ApiError
    return (
      <div className="p-6 text-center text-green-500">
        Error loading events: {apiError?.data?.error || "Unknown error"}
      </div>
    )
  }
  if (!data) return <div className="p-6 text-center">No data available</div>

  // Extract the events array from the data object
  const events = data.events || []

  // Separate active and completed events
  const activeEvents = events.filter((event: EventData) => !isEventPassed(event.date, event.time))
  const completedEvents = events.filter((event: EventData) => isEventPassed(event.date, event.time))

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Events</h1>
        <button
          className="flex items-center bg-white px-4 py-2 rounded-lg shadow-md self-end sm:self-auto"
          onClick={handleAddEvent}
        >
          <div
            className="bg-green-600 text-white p-2 rounded-full shadow flex items-center justify-center"
            aria-label="Add new event"
          >
            <FaPlus size={16} />
          </div>
          <span className="ml-3 text-gray-700 font-medium">Add Event</span>
        </button>
      </div>

      {/* No Events State */}
      {events.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">No events currently available</h2>
          <p className="text-gray-500 mb-8">Create a new event to get started</p>
          <button
            onClick={handleAddEvent}
            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-md"
          >
            <FaPlus className="mr-2" size={16} />
            Create Event
          </button>
        </div>
      )}

      {/* Active Event Cards Grid */}
      {activeEvents.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-700 mb-4 mt-6">Active Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEvents.map((event: EventData, index: number) => (
              <div
                key={event.eventId || index}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col"
              >
                {/* Card Header - Enhanced Event Name */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5">
                  <h2 className="text-sm font-medium mb-2">{`Event ID: ` + event.eventId}</h2>
                  {editingEventId === event.eventId ? (
                    <div>
                      <input
                        type="text"
                        name="eventName"
                        value={editedEvent.eventName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white text-gray-800 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Event Name"
                      />
                      {validationErrors.eventName && (
                        <p className="text-yellow-200 text-sm mt-1">{validationErrors.eventName}</p>
                      )}
                    </div>
                  ) : (
                    <h2 className="text-xl font-extrabold tracking-wide uppercase text-center">{event.eventName}</h2>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Date Section */}
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-green-50 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                      <FaCalendarAlt className="text-green-600" size={20} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs text-gray-500 font-medium">Date</p>
                      {editingEventId === event.eventId ? (
                        <div>
                          <input
                            type="date"
                            name="date"
                            value={editedEvent.date ? new Date(editedEvent.date).toISOString().split("T")[0] : ""}
                            onChange={handleInputChange}
                            min={today}
                            className="w-full px-2 py-1 bg-white text-gray-800 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          {validationErrors.date && (
                            <p className="text-green-500 text-sm mt-1">{validationErrors.date}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-800 font-semibold">
                          {event.date
                            ? new Date(event.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })
                            : "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Time Section */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg mt-1 flex-shrink-0">
                      <FaClock className="text-blue-600" size={18} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs text-gray-500 font-medium">Time</p>
                      {editingEventId === event.eventId ? (
                        <div>
                          <input
                            type="time"
                            name="time"
                            value={editedEvent.time}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 bg-white text-gray-800 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                          {validationErrors.time && (
                            <p className="text-green-500 text-sm mt-1">{validationErrors.time}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-800">{event.time || "Not specified"}</p>
                      )}
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="flex items-start space-x-3 mb-5">
                    <div className="bg-green-100 p-2 rounded-lg mt-1 flex-shrink-0">
                      <FaMapMarkerAlt className="text-green-600" size={18} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs text-gray-500 font-medium">Location</p>
                      {editingEventId === event.eventId ? (
                        <div className="space-y-2">
                          <div>
                            <input
                              type="text"
                              name="location"
                              value={editedEvent.location}
                              onChange={handleInputChange}
                              className="w-full px-2 py-1 bg-white text-gray-800 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="Location"
                            />
                            {validationErrors.location && (
                              <p className="text-green-500 text-sm mt-1">{validationErrors.location}</p>
                            )}
                          </div>
                          <div>
                            <select
                              name="state"
                              value={editedEvent.state}
                              onChange={handleInputChange}
                              className="w-full px-2 py-1 bg-white text-gray-800 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              <option value="">Select State</option>
                              {STATES.map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </select>
                            {validationErrors.state && (
                              <p className="text-green-500 text-sm mt-1">{validationErrors.state}</p>
                            )}
                          </div>
                          <div>
                            <select
                              name="city"
                              value={editedEvent.city}
                              onChange={handleInputChange}
                              className="w-full px-2 py-1 bg-white text-gray-800 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                              disabled={!editedEvent.state}
                            >
                              <option value="">Select City</option>
                              {availableCities.map((city) => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
                            </select>
                            {validationErrors.city && (
                              <p className="text-green-500 text-sm mt-1">{validationErrors.city}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-800">
                          {event.location
                            ? `${event.location}${
                                event.city ? ", " + event.city : ""
                              }${event.state ? ", " + event.state : ""}`
                            : "Location not specified"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Button Section - Margin-top: auto pushes it to the bottom */}
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    {editingEventId === event.eventId ? (
                      <>
                        <button
                          className="flex items-center justify-center bg-green-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-green-300"
                          onClick={handleSaveEvent}
                          disabled={isUpdating}
                        >
                          <FaSave className="mr-2" size={16} />
                          {isUpdating ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="flex items-center justify-center bg-gray-500 text-white font-medium px-4 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
                          onClick={() => {
                            setEditingEventId(null)
                            setValidationErrors({})
                          }}
                        >
                          <FaTimes className="mr-2" size={16} />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="flex items-center justify-center bg-blue-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                          onClick={() => handleEditToggle(event)}
                        >
                          <FaEdit className="mr-2" size={16} />
                          Update
                        </button>
                        <button
                          className="flex items-center justify-center bg-red-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-red-700 transition duration-300"
                          onClick={() => openDeleteConfirm(event)}
                        >
                          <FaTrash className="mr-2" size={16} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Completed Events Section */}
      {completedEvents.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-700 mb-4 mt-10">Completed Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedEvents.map((event: EventData, index: number) => (
              <div
                key={event.eventId || index}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 opacity-80"
              >
                {/* Card Header with complete badge */}
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-5 relative">
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <FaCheckCircle size={12} className="mr-1" />
                    <span>Completed</span>
                  </div>
                  <h2 className="text-sm font-medium mb-2">{`Event ID: ` + event.eventId}</h2>
                  <h2 className="text-xl font-extrabold tracking-wide uppercase text-center">{event.eventName}</h2>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Date Section */}
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-gray-200 p-2 rounded-lg">
                      <FaCalendarAlt className="text-gray-600" size={20} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs text-gray-500 font-medium">Date</p>
                      <p className="text-gray-800 font-semibold">
                        {event.date
                          ? new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Time Section */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="bg-gray-200 p-2 rounded-lg mt-1">
                      <FaClock className="text-gray-600" size={18} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs text-gray-500 font-medium">Time</p>
                      <p className="text-gray-800">{event.time || "Not specified"}</p>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="flex items-start space-x-3 mb-5">
                    <div className="bg-gray-200 p-2 rounded-lg mt-1">
                      <FaMapMarkerAlt className="text-gray-600" size={18} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs text-gray-500 font-medium">Location</p>
                      <p className="text-gray-800">
                        {event.location
                          ? `${event.location}${
                              event.city ? ", " + event.city : ""
                            }${event.state ? ", " + event.state : ""}`
                          : "Location not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && eventToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <FaExclamationTriangle size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete &quot;
              <span className="font-semibold">{eventToDelete.eventName}</span>&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-medium flex items-center"
              >
                <FaTrash className="mr-2" size={14} />
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Events
