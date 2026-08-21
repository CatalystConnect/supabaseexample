"use client";

import InputField from "@/components/share/form/InputField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { errorMessage, successMessage } from "@/components/ToasterMessage";
import { useResetPassword } from "@/hooks/loginHook";
import { useForm } from "react-hook-form";

export default function ForgotPassword() {
  const form = useForm({
    defaultValues: { email: "" },
  });

  const resetPasswordMutation = useResetPassword();

  const onSubmit = (values) => {
    resetPasswordMutation.mutate(
      { email: values.email },
      {
        onSuccess: () => {
          successMessage({
            description: "Password reset link sent. Check your email.",
          });
        },
        onError: (err) => {
          errorMessage({
            description: err?.message || "Failed to send reset link",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-1">Forgot password</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your email to receive a reset link
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              form={form}
              name="email"
              placeholder="Enter your Email"
              className="h-12"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
