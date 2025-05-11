// app /AuthSuccess/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    // ✅ Check for the cookie manually on the client
    const hasJustLoggedIn = document.cookie
      .split("; ")
      .some((c) => c.startsWith("justLoggedIn="));

    if (!hasJustLoggedIn) {
      router.push(" /Donor/Profile");
    } else {
      // Optional: delete the cookie immediately
      document.cookie = "justLoggedIn=; Max-Age=0; path=/";
    }
  }, [router]);

  return <p>Logging you in, please wait...</p>;
};

export default AuthSuccess;
