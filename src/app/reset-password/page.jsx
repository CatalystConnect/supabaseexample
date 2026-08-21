"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";
import { errorMessage, successMessage } from "@/components/ToasterMessage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    const supabase = supabaseBrowser();
    let active = true;

    const run = async () => {
      // The browser client auto-exchanges the ?code= param on load, so look for
      // an existing session first and only exchange manually if it hasn't.
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        if (active) setReady(true);
        return;
      }

      // exchangeCodeForSession takes the auth code itself, not the full URL.
      const code = new URLSearchParams(window.location.search).get("code");

      if (!code) {
        if (active) setLinkError("Invalid or expired reset link");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!active) return;

      if (error) {
        setLinkError(error.message || "Invalid or expired reset link");
        return;
      }

      setReady(true);
    };

    run();

    return () => {
      active = false;
    };
  }, []);

  const updatePassword = async () => {
    try {
      setLoading(true);
      const supabase = supabaseBrowser();

      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      successMessage({ description: "Password updated successfully" });
      router.push("/");
    } catch (e) {
      errorMessage({ description: e?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-xl font-semibold">Reset Password</h1>

      {linkError ? (
        <div className="space-y-4">
          <p className="text-sm text-red-500">{linkError}</p>
          <button
            onClick={() => router.push("/forgotPassword")}
            className="w-full h-12 rounded-lg bg-black text-white cursor-pointer"
          >
            Request a new link
          </button>
        </div>
      ) : !ready ? (
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
            className="w-full h-12 rounded-lg bg-black text-white disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </>
      )}
    </div>
  );
}
