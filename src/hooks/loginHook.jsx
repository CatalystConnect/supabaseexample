import { supabaseBrowser } from "@/lib/supabase/browser";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const supabase = supabaseBrowser();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ email }) => {
      const supabase = supabaseBrowser();

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return data;
    },
  });
};
