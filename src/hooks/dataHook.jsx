import { supabaseBrowser } from "@/lib/supabase/browser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCountryData = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const supabase = supabaseBrowser();

      const { data, error } = await supabase.from("countries").select("*");

      if (error) throw error;
      return data;
    },
  });
};
export const useUploadCountryData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const supabase = supabaseBrowser();

      const { data, error } = await supabase
        .from("countries")
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    onSuccess: () => {
      // refresh table
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
};

export const useUpdateCountryData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const supabase = supabaseBrowser();

      const { data, error } = await supabase
        .from("countries")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
};

export const useCountryDataById = (id) => {
  return useQuery({
    queryKey: ["country", id],
    enabled: !!id,
    queryFn: async () => {
      const supabase = supabaseBrowser();

      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useDeleteCountryById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const supabase = supabaseBrowser();

      const { error } = await supabase.from("countries").delete().eq("id", id);

      if (error) throw error;
      return true;
    },

    onSuccess: () => {
      // refresh table list
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
};
