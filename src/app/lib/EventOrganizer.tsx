import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the API service
export const api = createApi({
  reducerPath: "eventOrganizerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  }),
  endpoints: (builder) => ({
    // Signup endpoint
    signup: builder.mutation({
      query: (userData) => ({
        url: "/Signup/EventOrganizer",
        method: "POST",
        body: userData,
      }),
    }),

    // Login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: "/Login/EventOrganizer",
        method: "POST",
        body: credentials,
      }),
    }),

    emailVerification: builder.mutation({
      query: ({ token }) => ({
        url: "/EventOrganizer/verify-email",
        method: "POST",
        body: { token },
      }),
    }),

    //forgot password
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/EventOrganizer/forgot-password",
        method: "POST",
        body: email,
      }),
    }),

    // Reset password endpoint
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: "/EventOrganizer/reset-password",
        method: "POST",
        body: { token, newPassword },
      }),
    }),

    // Get user data endpoint (fetch user profile)
    getUserData: builder.query({
      query: () => "/EventOrganizer", // Adjust the URL if needed
    }),

    // Update user data endpoint
    updateUserData: builder.mutation({
      query: (credentials) => ({
        url: "/EventOrganizer/Update",
        method: "PUT", // or use the proper endpoint if different
        body: credentials,
      }),
    }),

    addEvent: builder.mutation({
      query: (credentials) => ({
        url: "/Event/Add",
        method: "POST", // or use the proper endpoint if different
        body: credentials,
      }),
    }),
    getEvents: builder.query({
      query: () => "/Event/List", // Ensure this matches your backend route
    }),

    updateEventData: builder.mutation({
      query: (credentials) => ({
        url: "/Event/Update",
        method: "PUT", // or use the proper endpoint if different
        body: credentials,
      }),
    }),
    deleteEvent: builder.mutation({
      query: (credentials) => ({
        url: `/Event/Delete`, // Ensure this matches your backend route
        method: "DELETE",
        body: credentials,
      }),
    }),

    sendDonor: builder.mutation({
      query: (credentials) => ({
        url: "/Donor/Certificate",
        method: "POST",
        body: credentials,
      }),
    }),
    getAllEvents: builder.query<unknown, void>({
      query: () => "/Event/All",
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useEmailVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserDataQuery,
  useUpdateUserDataMutation,
  useAddEventMutation,
  useGetEventsQuery,
  useUpdateEventDataMutation,
  useDeleteEventMutation,
  useSendDonorMutation,
  useGetAllEventsQuery,
} = api;
