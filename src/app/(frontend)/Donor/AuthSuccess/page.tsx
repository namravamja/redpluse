"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthSuccess = () => {
  const router = useRouter();
  const [loading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const hasToken = document.cookie.includes("token=");
      const justLoggedIn = document.cookie.includes("justLoggedIn=");

      if (hasToken || justLoggedIn) {
        document.cookie = "justLoggedIn=; Max-Age=0; path=/";
        clearInterval(interval);
        router.push("/Donor/Profile");
      }
    }, 300); // check every 300ms

    // Stop checking after 5
    return () => clearInterval(interval);
  }, [router]);

  return (
    <p>
      {loading
        ? "Logging you in, please wait..."
        : "Failed to login, redirecting..."}
    </p>
  );
};

export default AuthSuccess;
