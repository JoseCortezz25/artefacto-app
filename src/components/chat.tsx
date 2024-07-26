"use client";
import { useState } from "react";
import InputSearch from "./search";
import { Steps } from "@/lib/types";
import { nanoid } from "nanoid";
import { useActions, useUIState } from "ai/rsc";
import Message from "./message";
import { AI } from "@/actions/chat";
import { User } from "@/lib/types";

const Chat = () => {
  const [search, setSearch] = useState("");
  const { submitUserMessage } = useActions();
  const [messages, setMessages] = useUIState<typeof AI>();

  const handleSearch = async (e: Event) => {
    e.preventDefault();
    try {

      const value = search.trim();
      setSearch('');
      if (!value) return;

      setMessages(currentMessages => [
        ...currentMessages,
        {
          id: nanoid(),
          display: <Message role={User.User} content={value} />
        }
      ]);

      const responseMessage = await submitUserMessage(search);
      setMessages(currentMessages => [...currentMessages, responseMessage]);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <section className="h-[calc(90dvh-80px)] flex flex-col">
      <div className="w-full flex flex-col gap-3 flex-grow">
        {messages.map(({ id, display }) => (
          <div key={id} className="w-full">
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