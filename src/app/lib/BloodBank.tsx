import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the API service
export const api = createApi({
  reducerPath: "BloodBankApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    // Signup endpoint
    signup: builder.mutation({
      query: (userData) => ({
        url: "/Signup/BloodBank",
        method: "POST",
        body: userData,
      }),
    }),

    // Login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: "/Login/BloodBank",
        method: "POST",
        body: credentials,
      }),
    }),

    emailVerification: builder.mutation({
      query: ({ token }) => ({
        url: "/BloodBank/verify-email",
        method: "POST",
        body: { token },
      }),
    }),

    //forgot password
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/BloodBank/forgot-password",
        method: "POST",
        body: email,
      }),
    }),

    // Reset password endpoint
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: "/BloodBank/reset-password",
        method: "POST",
        body: { token, newPassword },
      }),
    }),

    // Get user data endpoint (fetch user profile)
    getUserData: builder.query({
      query: () => "/BloodBank", // Adjust the URL if needed
    }),

    // Update user data endpoint
    updateUserData: builder.mutation({
      query: (credentials) => ({
        url: "/BloodBank/Update",
        method: "PUT", // or use the proper endpoint if different
        body: credentials,
      }),
    }),

    addCollectedDonorDetails: builder.mutation({
      query: (credentials) => ({
        url: "/BloodBank/CollectedBlood",
        method: "POST", // or use the proper endpoint if different
        body: credentials,
      }),
    }),

    addSuppliedSeekerDetails: builder.mutation({
      query: (credentials) => ({
        url: "/BloodBank/SuppliedBlood",
        method: "POST", // or use the proper endpoint if different
        body: credentials,
      }),
    }),

    getBloodDetails: builder.query({
      query: () => "/BloodBank/Dashboard",
    }),

    getAllBloodDetails: builder.query<unknown, void>({
      query: () => "/BloodBank/All",
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
  useAddCollectedDonorDetailsMutation,
  useAddSuppliedSeekerDetailsMutation,
  useGetBloodDetailsQuery,
  useGetAllBloodDetailsQuery,
} = api;
