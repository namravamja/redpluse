import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the API service
export const api = createApi({
  reducerPath: "donorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.VERCEL_URL
      ? `${process.env.VERCEL_URL}/api`
      : "http://localhost:3000/api",
  }),
  endpoints: (builder) => ({
    // Signup endpoint
    signup: builder.mutation({
      query: (userData) => ({
        url: "/Signup/Donor",
        method: "POST",
        body: userData,
      }),
    }),

    // Login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: "/Login/Donor",
        method: "POST",
        body: credentials,
      }),
    }),

    emailVerification: builder.mutation({
      query: ({ token }) => ({
        url: "/Donor/verify-email",
        method: "POST",
        body: { token },
      }),
    }),

    //forgot password
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/Donor/forgot-password",
        method: "POST",
        body: email,
      }),
    }),

    // Reset password endpoint
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: "/Donor/reset-password",
        method: "POST",
        body: { token, newPassword },
      }),
    }),

    uploadProfilePhoto: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: "/Donor/profilePhoto", // Ensure the correct API path
        method: "POST",
        body: formData,
      }),
    }),

    LogOut: builder.mutation({
      query: () => ({
        url: "/logout", // Ensure the correct API path
        method: "POST",
        credentials: "include", // Ensure cookies are handled correctly
      }),
    }),

    // Get user data endpoint (fetch user profile)
    getUserData: builder.query({
      query: () => "/Donor", // Adjust the URL if needed
    }),

    // Update user data endpoint
    updateUserData: builder.mutation({
      query: (credentials) => ({
        url: "/Donor/Update",
        method: "PUT", // or use the proper endpoint if different
        body: credentials,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useEmailVerificationMutation,
  useForgotPasswordMutation,
  useLogOutMutation,
  useResetPasswordMutation,
  useGetUserDataQuery,
  useUploadProfilePhotoMutation,
  useUpdateUserDataMutation,
} = api;
