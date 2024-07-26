"use client";
import { useState } from "react";
import InputSearch from "./search";
import { Steps } from "@/app/page";

interface ChatProps {
  messages: {
    role: string;
    content: string;
  }[];
};

const Chat = ({ messages }: ChatProps) => {
  const [search, setSearch] = useState("");

  const handleSearch = async (e: Event) => {
  };

  return (
    <section className="h-[calc(100dvh-80px)] flex flex-col">
      <div className="w-full flex-grow"></div>
      <div className="w-full ">
        <InputSearch
          className="w-full"
          value={search}
          onChange={({ target }) => setSearch(target.value)}
          onSubmit={handleSearch}
          variant={Steps.Chat}
        />
      </div>
    </section>
  );
};

export default Chat;