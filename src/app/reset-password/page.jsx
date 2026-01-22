"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();

      // IMPORTANT: exchange URL code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );
      console.log("datadatadatadata", data);
      console.log("errorerrorerrorerror", error);
      if (error) {
        alert(error.message || "Invalid or expired reset link");
        return;
      }

      // session is now set in supabase client
      setReady(true);
    };

    run();
  }, []);

  const updatePassword = async () => {
    try {
      setLoading(true);
      const supabase = supabaseBrowser();

      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      alert("Password updated successfully");
      router.push("/");
    } catch (e) {
      alert(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-xl font-semibold">Reset Password</h1>

      {!ready ? (
        <p>Validating reset link...</p>
      ) : (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg h-12 px-4"
          />

          <button
            onClick={updatePassword}
            disabled={loading || !password}
            className="w-full h-12 rounded-lg bg-black text-white"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </>
      )}
    </div>
  );
}
