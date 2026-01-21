"use client";

import HideValueInput from "@/components/share/form/HideValueInput";
import InputField from "@/components/share/form/InputField";
import { errorMessage, successMessage } from "@/components/ToasterMessage";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLogin } from "@/hooks/loginHook";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const loginMutation = useLogin();
  const loginWithGoogle = async () => {
    const supabase = supabaseBrowser();
  
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  
    if (error) errorMessage({ description: error.message });
  };
  

  const onSubmit = (values) => {
    loginMutation.mutate(values, {
      onSuccess: () => router.push("/dashboard"),
      onError: (err) => {
        console.log("errerrerrerrerrerr", err);

        const msg =
          err?.message ||
          err?.error_description ||
          "Login failed. Please try again.";

        errorMessage({ description: msg });
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-1">Login</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Sign in to continue
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <InputField
              form={form}
              name="email"
              placeholder="Enter your Email"
              className="border border-[#E2E2E2] rounded-lg h-12 px-4"
            />

            <HideValueInput
              name="password"
              form={form}
              inputType="password"
              placeholder="Enter your password"
              className="border border-[#E2E2E2] rounded-lg h-12 px-4"
            />

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </Form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <Button
          type="button"
          onClick={loginWithGoogle}
          className="w-full cursor-pointer"
          variant="outline"
          disabled={googleLoading}
        >
          {googleLoading ? "Redirecting..." : "Login with Google"}
        </Button>
      </div>
    </div>
  );
}
