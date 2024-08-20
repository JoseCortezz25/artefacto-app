"use client";
import { ClientMessage } from "@/actions/chat";
import Chat from "@/components/chat";
import Header from "@/components/header";
import Message from "@/components/message";
import InputSearch from "@/components/search";
import { Button } from "@/components/ui/button";
import { Steps, User } from "@/lib/types";
import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import { Brain, User2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState<string>("");
  const [stepper, setStepper] = useState<Steps>(Steps.Search);
  const { submitUserMessage } = useActions();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setConversation] = useUIState();


  const handleSearch = async (searchValue: string) => {
    if (stepper === Steps.Search) {
      setStepper(Steps.Loading);
    }

    if (stepper === Steps.Loading) {
      setStepper(Steps.Chat);
    }

    if (!searchValue) {
      toast.error("Ingrese una pregunta para buscar");
    }

    try {
      const value = searchValue.trim();
      setSearch('');
      setStepper(Steps.Loading);
      setTitle("");

      setConversation((currentConversation: ClientMessage[]) => [
        ...currentConversation,
        { id: generateId(), role: 'user', display: <Message role={User.User} content={value} /> }
      ]);


      const message = await submitUserMessage(value);

      setConversation((currentConversation: ClientMessage[]) => [
        ...currentConversation,
        message
      ]);

      setStepper(Steps.Chat);

    } catch (error) {
      if (stepper === Steps.Loading) {
        setStepper(Steps.Search);
      }
    }
  };

  const tagMocks = [
    {
      label: "Historia de la computación"
    },
    {
      label: "Recetas de cocina"
    },
    {
      label: "Lugares turisticos de Peru"
    },
    {
      label: "Joe Biden"
    }
  ];

  return (
    <>
      <Header title={title} />
      <main className="bg-white flex min-h-[calc(100dvh-90px)] flex-col items-center justify-center px-4 py-7 md:px-10 md:py-0">
        <div className="w-full max-w-[1024px]">
          {stepper === Steps.Search && (
            <InitialPage mocks={tagMocks} onSearch={handleSearch} />
          )}

          {stepper === Steps.Loading && (
            <section className="w-full">
              <div className=" mx-auto flex flex-col items-center justify-between h-[60dvh]">

                <div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Brain className="size-[22px] max-w-[22pxa<Z]" />
                  </div>
                  <h2 className="text-[30px] font-semibold">Cargando el contenido...</h2>
                </div>
              </div>
            </section>
          )}

          {stepper === Steps.Chat && (
            <Chat />
          )}
        </div>
      </main >
    </>
  );
}

interface InitialPageProps {
  mocks: { label: string; onClick?: () => void }[];
  onSearch: (searchValue: string) => Promise<void>
}

const InitialPage = ({ mocks, onSearch }: InitialPageProps) => {
  const [search, setSearch] = useState("");

  return (
    <section className="w-full">
      <div className=" mx-auto flex flex-col items-center justify-between h-[60dvh]">
        <div className="w-full md:w-[60%]">
          <div className="flex flex-col justify-center gap-6">
            <h2 className="font-bold text-[28px] leading-[25px] md:text-[45px] md:leading-[45px] text-center">
              Donde la creatividad
              <br />
              se une al conocimiento
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Eligue alguna de las siguientes opciones para comenzar o pregunta algo.
            </p>
          </div>

          <div className="flex justify-center mt-8 w-full mx-auto flex-wrap gap-3">
            {mocks.map((tag, index) => (
              <Button key={index} variant="tag" className="gap-2" onClick={tag.onClick}>
                <b className="text-[16px]">#</b><span>{tag.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <InputSearch
          className="w-full"
          value={search}
          onChange={({ target }) => setSearch(target.value)}
          onSubmit={() => onSearch(search)}
        />
      </div>
    </section>
  );
};