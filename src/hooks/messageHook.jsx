import { supabaseBrowser } from "@/lib/supabase/browser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// A message you send is written to the cache twice: once here on mutation
// success and again when the realtime INSERT event echoes it back. Dedupe by
// id so it only shows up once.
export const appendMessage = (old = [], message) =>
  old.some((m) => m.id === message.id) ? old : [...old, message];

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, text }) => {
      const supabase = supabaseBrowser();

      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: conversationId,
            sender_id: auth.user.id,
            text,
          },
        ])
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },

    onSuccess: (newMsg) => {
      queryClient.setQueryData(["messages", newMsg.conversation_id], (old) =>
        appendMessage(old, newMsg)
      );

      queryClient.invalidateQueries({ queryKey: ["conversation_list"] });
    },
  });
};

export const useMessages = (conversationId) =>
  useQuery({
    queryKey: ["messages", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const supabase = supabaseBrowser();

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });

export const useCreateOrGetConversation = () =>
  useMutation({
    mutationFn: async (otherUserId) => {
      const supabase = supabaseBrowser();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) throw new Error("Not logged in");

      const { data, error } = await supabase.rpc("create_or_get_conversation", {
        user1: auth.user.id,
        user2: otherUserId,
      });

      if (error) throw error;
      return data;
    },
  });

export const useConversationList = () =>
  useQuery({
    queryKey: ["conversation_list"],
    queryFn: async () => {
      const supabase = supabaseBrowser();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("conversation_list")
        .select("*")
        .eq("current_user_id", auth.user.id)
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

export const useCurrentUser = () =>
  useQuery({
    queryKey: ["current_user"],
    queryFn: async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase.auth.getUser();

      if (error) throw error;
      return data?.user ?? null;
    },
  });
