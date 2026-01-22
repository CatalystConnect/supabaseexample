"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useQueryClient } from "@tanstack/react-query";
import { useMessages, useSendMessage } from "@/hooks/messageHook";

import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import InputField from "@/components/share/form/InputField";
import { Button } from "@/components/ui/button";

export default function ChatWindow({ conversationId }) {
  const queryClient = useQueryClient();
  const { data: messages = [] } = useMessages(conversationId);
  const sendMessage = useSendMessage();

  const form = useForm({
    defaultValues: { text: "" },
  });

  // ✅ mark chat read
  useEffect(() => {
    const markRead = async () => {
      if (!conversationId) return;

      const supabase = supabaseBrowser();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      await supabase
        .from("conversation_members")
        .update({ last_read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .eq("user_id", auth.user.id);

      queryClient.invalidateQueries({ queryKey: ["conversation_list"] });
    };

    markRead();
  }, [conversationId, queryClient]);

  // ✅ realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    const supabase = supabaseBrowser();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new;

          queryClient.setQueryData(["messages", conversationId], (old = []) => [
            ...old,
            newMsg,
          ]);

          queryClient.invalidateQueries({ queryKey: ["conversation_list"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  const onSubmit = async (values) => {
    if (!values.text?.trim()) return;
    if (!conversationId) return;

    await sendMessage.mutateAsync({
      conversationId,
      text: values.text,
    });

    form.reset({ text: "" });
  };

  return (
    <Card className="h-full rounded-2xl">
      <CardContent className="p-4 h-full flex flex-col">
        {!conversationId ? (
          <div className="h-full flex items-center justify-center text-sm opacity-60">
            Select a contact or chat
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto space-y-2 pr-2 mb-4">
              {messages.map((m) => (
                <div key={m.id} className="border rounded-xl p-3">
                  <p className="text-sm">{m.text}</p>
                  <p className="text-xs opacity-60 mt-1">{m.created_at}</p>
                </div>
              ))}
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-2"
              >
                <InputField
                  form={form}
                  name="text"
                  placeholder="Type message..."
                  className="border border-[#E2E2E2] rounded-lg h-12 px-4"
                />
                <Button
                  type="submit"
                  className="h-12"
                  disabled={sendMessage.isPending}
                >
                  Send
                </Button>
              </form>
            </Form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
