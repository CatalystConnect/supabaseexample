"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  useConversationList,
  useCreateOrGetConversation,
} from "@/hooks/messageHook";
import { useUsers } from "@/hooks/useUsers";

export default function ChatSidebar({
  activeConversationId,
  onOpenConversation,
}) {
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: chats = [], isLoading: chatsLoading } = useConversationList();

  const createOrGetConversation = useCreateOrGetConversation();

  const startChat = async (otherUserId) => {
    const conversationId = await createOrGetConversation.mutateAsync(
      otherUserId
    );
    onOpenConversation(conversationId);
  };

  return (
    <Card className="h-full rounded-2xl">
      <CardContent className="p-4 h-full flex flex-col gap-4">
        {/* CONTACTS */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Contacts</h2>

          {usersLoading ? (
            <p className="text-sm opacity-60">Loading contacts...</p>
          ) : users.length === 0 ? (
            <p className="text-sm opacity-60">No other users yet.</p>
          ) : (
            <ScrollArea className="h-[220px] pr-2">
              <div className="space-y-2">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => startChat(u.id)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl border p-2 transition hover:bg-muted"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={u.avatar_url || ""} />
                      <AvatarFallback>
                        {u.full_name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 text-left">
                      <div className="truncate text-sm font-medium">
                        {u.full_name || "User"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* CHATS */}
        <div className="flex min-h-0 flex-1 flex-col">
          <h2 className="mb-2 shrink-0 text-lg font-semibold">Chats</h2>

          {chatsLoading ? (
            <p className="text-sm opacity-60">Loading chats...</p>
          ) : chats.length === 0 ? (
            <p className="text-sm opacity-60">No chats yet.</p>
          ) : (
            <ScrollArea className="min-h-0 flex-1 pr-2">
              <div className="space-y-2">
                {chats.map((c) => {
                  const isActive = activeConversationId === c.conversation_id;

                  return (
                    <button
                      key={c.conversation_id}
                      onClick={() => onOpenConversation(c.conversation_id)}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 transition hover:bg-muted ${
                        isActive ? "border-primary bg-muted" : ""
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={c.other_avatar_url || ""} />
                        <AvatarFallback>
                          {c.other_full_name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1 text-left">
                        <div className="truncate text-sm font-medium">
                          {c.other_full_name || "User"}
                        </div>
                        <div className="text-xs opacity-60 line-clamp-1">
                          {c.last_message || "No messages yet"}
                        </div>
                      </div>

                      {c.unread_count > 0 && (
                        <Badge className="rounded-full px-2">
                          {c.unread_count}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
