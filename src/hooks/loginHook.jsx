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
