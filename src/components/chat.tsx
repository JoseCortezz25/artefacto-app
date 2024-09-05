"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import InputSearch from "./search";
import { Steps, User } from "@/lib/types";
import { useActions, useUIState } from "ai/rsc";
import { ClientMessage } from "@/actions/chat";
import { generateId } from "ai";
import Message from "./message";

const Chat = () => {
  const [search, setSearch] = useState("");
  const { submitUserMessage } = useActions();
  const [conversation, setConversation] = useUIState();
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = () => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    const atBottom: boolean = scrollHeight - scrollTop === clientHeight;
    setAutoScroll(atBottom);
  };

  useEffect(scrollToBottom, [conversation]);

  const handleSearch = async (e: Event) => {
    e.preventDefault();

    const value = search.trim();
    setSearch('');
    if (!value) return;
    setLoading(true);

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: generateId(), role: 'user', display: <Message role={User.User} content={value} /> }
    ]);

    const message = await submitUserMessage(value);

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      message
    ]);
    setLoading(false);
  };

  return (
    <section className="flex flex-col justify-between gap-4 pb-3 w-full">
      <div onScroll={handleScroll} className="w-full h-[calc(100%-76px)] flex flex-col justify-start gap-3 overflow-y-scroll no-scrollbar relative">        {conversation.map(({ display }: { display: ReactNode }, index: number) => (
        <div key={index} className="w-full">
          {display}
        </div>
      ))}
        <div ref={messagesEndRef} />

      </div>

      <div>
        <InputSearch
          className="w-full"
          value={search}
          onChange={({ target }) => setSearch(target.value)}
          onSubmit={handleSearch}
          variant={Steps.Chat}
        />
        <p className="mt-2 text-[15px] text-center text-muted-foreground">Artefacto puede cometer errores. Comprueba la información importante.</p>
      </div>
    </section>
  );
};

export default Chat;