"use client";

import { toast } from "sonner";
// Function to show an error toast
export function errorMessage({ description }) {
  toast.error(description, {
    action: {
      label: "Dismiss",
      onClick: () => console.log("Dismissed"),
    },
  });
}
// Function to show a success toast
export function successMessage({ description }) {
  toast.success(description, {
    action: {
      label: "Dismiss",
      onClick: () => console.log("Dismissed"),
    },
  });
}
