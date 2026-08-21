"use client";

import { useEffect, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useQueryClient } from "@tanstack/react-query";


export default function ChatLayout() {
  const [activeConversationId, setActiveConversationId] = useState(null);

  const queryClient = useQueryClient();

  // ✅ realtime refresh sidebar (unread + last message preview)
  useEffect(() => {
    const supabase = supabaseBrowser();

    const channel = supabase
      .channel("sidebar:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["conversation_list"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="h-full">
      <div className="grid h-full grid-cols-1 gap-3 md:grid-cols-12">
        {/* Sidebar */}
        <div className="h-full min-h-0 md:col-span-4">
          <ChatSidebar
            activeConversationId={activeConversationId}
            onOpenConversation={(id) => setActiveConversationId(id)}
          />
        </div>

        {/* Chat Window */}
        <div className="h-full min-h-0 md:col-span-8">
          <ChatWindow conversationId={activeConversationId} />
        </div>
      </div>
    </div>
  );
}
