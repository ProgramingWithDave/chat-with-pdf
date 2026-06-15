"use client";

import { useUser } from "@clerk/nextjs";
import {
  FormEvent,
  startTransition,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { db } from "@/firebase/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { askQuestion } from "@/actions/askQuestion";
import { Loader2Icon } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useToast } from "@/lib/hooks/use-toast";

export type Message = {
  id?: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
};

function Chat({ id }: { id: string }) {
  const { user } = useUser();
  const { toast } = useToast();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const [snapshot, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user?.id, "files", id, "chat"),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!snapshot) return;
    console.log("Uploadted snapshot", snapshot.docs);

    // get second last message to check if the AI is thinking
    const lastMessage = messages.pop();

    if (lastMessage?.role === "ai" && lastMessage?.message === "thinking...") {
      // return  as this is a dummy placeholder message
      return;
    }

    const newMessages = snapshot.docs.map((doc) => {
      const { role, message, createdAt } = doc.data();

      return {
        id: doc.id,
        role,
        message,
        createdAt: createdAt.toDate(),
      };
    });

    setMessages(newMessages);
  }, [snapshot]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const q = input;
    setInput("");

    // Optimistic Ui update
    setMessages((prev) => [
      ...prev,
      {
        role: "human",
        message: q,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "thinking...",
        createdAt: new Date(),
      },
    ]);

    startTransition(async () => {
      const { success, message } = await askQuestion(id, q);

      if (!success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });

        setMessages((pre) =>
          pre.slice(0, pre.length - 1).concat([
            {
              role: "ai",
              message: `Whoops... ${message}`,
              createdAt: new Date(),
            },
          ])
        );
      }
    });
  };

  return (
    <div className="flex flex-col h-full overflow-scroll">
      {/* Chat contents */}
      <div className="flex-1 w-full">
        {/* Chat message */}

        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2Icon className="animate-pulse h-20 w-20 text-sky-600 mt-20" />
          </div>
        ) : (
          <div className="py-5 px-6">
            {messages.length === 0 && (
              <ChatMessage
                key={"placeholder"}
                message={{
                  role: "ai",
                  message: "ask me anything about the document",
                  createdAt: new Date(),
                }}
              />
            )}
          </div>
        )}

        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        <div ref={bottomOfChatRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex sticky bottom-0 space-x-2 p-5 bg-sky-500/75 overflow-x-hidden"
      >
        <Input
          placeholder="Ask a Question..."
          className="text-black font-medium text-wrap"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button type="submit" disabled={!input || isPending}>
          Ask
        </Button>
      </form>
    </div>
  );
}
export default Chat;
