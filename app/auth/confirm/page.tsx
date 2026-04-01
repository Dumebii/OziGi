"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthConfirm() {
  const router = useRouter();

  useEffect(() => {
    const handleConfirmation = async () => {
      // The access token is in the URL fragment, which we can access client-side
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      if (accessToken && refreshToken) {
        // Set session client-side
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("Error setting session:", error);
          router.push("/auth-error");
          return;
        }

        // Now user is signed in, send welcome email (fire and forget)
        if (data.user?.email) {
          fetch("/api/send-welcome", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: data.user.email,
              name: data.user.user_metadata?.full_name || data.user.email.split("@")[0],
            }),
          }).catch(console.error);
        }

        // Redirect to dashboard or desired page
        router.push("/dashboard");
      } else {
        router.push("/auth-error");
      }
    };

    handleConfirmation();
  }, [router]);

  return <div>Confirming your email...</div>;
}