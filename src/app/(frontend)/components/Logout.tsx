"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useLogOutMutation } from "../../lib/Donor"; // adjust path as needed

export const useLogout = () => {
  const router = useRouter();
  const [logOutMutation] = useLogOutMutation();

  const logout = async () => {
    try {
      await logOutMutation({}).unwrap(); // If your API expects no args
      toast.success("Logout successful");
      router.push("/");
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  return logout;
};
