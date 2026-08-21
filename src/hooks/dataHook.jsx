import { supabaseBrowser } from "@/lib/supabase/browser";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useCountryData = ({
  page = 1,
  pageSize = 10,
  sortBy = "id",
  sortOrder = "asc",
} = {}) => {
  return useQuery({
    // The extra params stay under the "countries" prefix so the mutations
    // below still invalidate every page with a single key.
    queryKey: ["countries", { page, pageSize, sortBy, sortOrder }],
    // Keep the previous page on screen while the next one loads.
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const supabase = supabaseBrowser();

      const from = (page - 1) * pageSize;

      const { data, error, count } = await supabase
        .from("countries")
        .select("*", { count: "exact" })
        .order(sortBy, { ascending: sortOrder === "asc" })
        .range(from, from + pageSize - 1);

      if (error) throw error;
      return { rows: data ?? [], total: count ?? 0 };
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
