"use client";

import { useEffect, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useQueryClient } from "@tanstack/react-query";
import {
  appendMessage,
  useCurrentUser,
  useMessages,
  useSendMessage,
} from "@/hooks/messageHook";

import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import InputField from "@/components/share/form/InputField";
import { Button } from "@/components/ui/button";

export default function ChatWindow({ conversationId }) {
  const queryClient = useQueryClient();
  const { data: messages = [] } = useMessages(conversationId);
  const { data: me } = useCurrentUser();
  const sendMessage = useSendMessage();
  const bottomRef = useRef(null);

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

          queryClient.setQueryData(["messages", conversationId], (old) =>
            appendMessage(old, newMsg)
          );

          queryClient.invalidateQueries({ queryKey: ["conversation_list"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  // ✅ keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, conversationId]);

  const onSubmit = async (values) => {
    if (!values.text?.trim()) return;
    if (!conversationId) return;

    await sendMessage.mutateAsync({
      conversationId,
      text: values.text.trim(),
    });

    form.reset({ text: "" });
  };

  return (
    <Card className="h-full rounded-2xl">
      <CardContent className="flex h-full min-h-0 flex-col p-4">
        {!conversationId ? (
          <div className="flex h-full items-center justify-center text-sm opacity-60">
            Select a contact or chat
          </div>
        ) : (
          <>
            <div className="mb-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm opacity-60">
                  No messages yet. Say hello.
                </div>
              ) : (
                messages.map((m) => {
                  const isMine = me?.id && m.sender_id === me.id;

                  return (
                    <div
                      key={m.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                          isMine
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {m.text}
                        </p>
                        <p className="mt-1 text-[11px] opacity-70">
                          {m.created_at
                            ? new Date(m.created_at).toLocaleString()
                            : ""}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}

              <div ref={bottomRef} />
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex shrink-0 items-start gap-2"
              >
                <div className="flex-1">
                  <InputField
                    form={form}
                    name="text"
                    placeholder="Type message..."
                    className="h-12"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 cursor-pointer"
                  disabled={sendMessage.isPending}
                >
                  {sendMessage.isPending ? "Sending..." : "Send"}
                </Button>
              </form>
            </Form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
