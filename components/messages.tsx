import { useState, useEffect, useRef } from "react";
import { Database } from "../utils/db_types";
import supabase from "../utils/supabase";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

interface MessageRcvd {
  id: number;
  inserted_at: string;
  message: string | null;
  user_id: string;
  channel_id: number | null;
  profile?: User | null;
}

export default function Messages({ userId }: { userId: string | undefined }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    const { data: messages } = await supabase
      .from("messages")
      .select("*, profile:users(*)");

    setMessages(messages || []);
  };

  useEffect(() => {
    if (!userId) {
      setMessages([]);
      return;
    }

    fetchData();
  }, [userId]);

  useEffect(() => {
    const subscriptionChan = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          //   setMessages((prev) => [...prev, payload.new as Message]);
          fetchData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          //   fetchData();
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== payload.old?.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscriptionChan);
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-scroll bg-pink-200" ref={messagesRef}>
      <ul className="flex flex-col justify-end space-y-2 p-4">
        {messages.map((msg: MessageRcvd) => (
          <li
            key={msg.id}
            className={
              msg.user_id === userId
                ? "self-start rounded bg-blue-300 px-2 py-1"
                : "self-end rounded bg-gray-100 px-2 py-1"
            }
          >
            {msg.user_id === userId && (
              <span
                className="block text-xs cursor-pointer hover:text-red-600"
                onClick={async (e) => {
                  e.preventDefault();
                  const { data, error, status, statusText } = await supabase
                    .from("messages")
                    .delete()
                    .eq("id", msg.id)
                    .select();
                }}
              >
                Delete
              </span>
            )}
            <span className="block text-xs text-gray-600">
              {msg.profile?.username}
            </span>
            <span>{msg.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
