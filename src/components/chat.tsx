"use client";
import { ReactNode, useState } from "react";
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

  const handleSearch = async (e: Event) => {
    e.preventDefault();

    const value = search.trim();
    setSearch('');
    if (!value) return;

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: generateId(), role: 'user', display: <Message role={User.User} content={value} /> }
    ]);

    const message = await submitUserMessage(value);

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      message
    ]);
  };

  return (
    <section className="h-[calc(90dvh-80px)] flex flex-col justify-between">
      <div className="w-full max-h-[70dvh] flex flex-col gap-3 flex-grow overflow-y-scroll no-scrollbar">
        {conversation.map(({ display }: { display: ReactNode }, index: number) => (
          <div key={index} className="w-full">
            {/* {spinner} */}
            {display}
          </div>
        ))}
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