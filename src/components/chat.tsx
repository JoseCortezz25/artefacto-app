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
  const messagesEndRef = useRef(null);

  // Cuando llegue un nuevo mensaje, ahcer que baje el scroll
  // useEffect(() => {
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <section className="h-[calc(90dvh-80px)] flex flex-col justify-between">
      <div className="w-full max-h-[70dvh] flex flex-col justify-start gap-3 overflow-y-scroll no-scrollbar relative">
        {conversation.map(({ display }: { display: ReactNode }, index: number) => (
          <div key={index} className="w-full">
            {display}
          </div>
        ))}
        {loading && <div className="w-full flex justify-center">
          <span className="bg-black text-white inline rounded-full py-1.5 px-4 mt-5 font-bold">
            AI esta pensando...
          </span>
        </div>}
        <div ref={messagesEndRef} />

      </div>

      <InputSearch
        className="w-full"
        value={search}
        onChange={({ target }) => setSearch(target.value)}
        onSubmit={handleSearch}
        variant={Steps.Chat}
      />
    </section>
  );
};

export default Chat;