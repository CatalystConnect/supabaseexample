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
    <div className="h-[calc(100vh-20px)] p-3">
      <div className="grid grid-cols-12 gap-3 h-full">
        {/* Sidebar */}
        <div className="col-span-4 h-full">
          <ChatSidebar
            activeConversationId={activeConversationId}
            onOpenConversation={(id) => setActiveConversationId(id)}
          />
        </div>

        {/* Chat Window */}
        <div className="col-span-8 h-full">
          <ChatWindow conversationId={activeConversationId} />
        </div>
      </div>
    </div>
  );
}
