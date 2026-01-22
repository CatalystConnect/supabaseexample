import { useQuery } from "@tanstack/react-query";
import { supabaseBrowser } from "@/lib/supabase/browser";

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const supabase = supabaseBrowser();

      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .neq("id", auth.user.id)
        .order("full_name", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });
