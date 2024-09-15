"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import InputSearch from "./search";
import { Creativity, Models, Steps, User } from "@/lib/types";
import { useActions, useUIState } from "ai/rsc";
import { ClientMessage, ModelConfig } from "@/actions/chat";
import { generateId } from "ai";
import Message from "./message";

const Chat = () => {
  const [search, setSearch] = useState("");
  const { submitUserMessage } = useActions();
  const [conversation, setConversation] = useUIState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [image, setImage] = useState<string | null>(null);

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

  const handleSearch = async (e: Event, image: string | undefined) => {
    e.preventDefault();

    const value = search.trim();
    setSearch('');
    // setImage(null);
    if (!value) return;
    setLoading(true);

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      {
        id: generateId(),
        role: 'user',
        display: image ? <Message role={User.User} content={value} isComponent>
          <img src={image} alt="Imagen" className="input-image-preview" />
        </Message> : <Message role={User.User} content={value} />
      }
    ]);

    const config: ModelConfig = {
      model: localStorage.getItem('model') as Models,
      creativity: localStorage.getItem('creativity') as Creativity,
      apiKey: localStorage.getItem('apiKey') as string
    };

    const message = await submitUserMessage(value, config, image);

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit={(e: any) => handleSearch(e, image ?? undefined)}
          variant={Steps.Chat}
          setImage={(value) => setImage(value)}
        />
        <p className="mt-2 text-[12px] md:text-[15px] text-center text-muted-foreground text-pretty">
          Artefacto puede cometer errores. Comprueba la información importante.
        </p>
      </div>
    </section>
  );
};

export default Chat;