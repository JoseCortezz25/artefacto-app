"use client";
import { ClientMessage, ModelConfig } from "@/actions/chat";
import Chat from "@/components/chat";
import Header from "@/components/header";
import Loader from "@/components/loader";
import Message from "@/components/message";
import InputSearch from "@/components/search";
import { Button } from "@/components/ui/button";
import { Creativity, Models, Steps, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
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

      const config: ModelConfig = {
        model: localStorage.getItem('model') as Models,
        creativity: localStorage.getItem('creativity') as Creativity,
        apiKey: localStorage.getItem('apiKey') as string
      };

      if (!config.apiKey) {
        toast.error("Por favor, ingrese una clave de API válida");
        setStepper(Steps.Search);
        return;
      }

      if (!config.model) {
        toast.error("Por favor, seleccione un modelo");
        setStepper(Steps.Search);
        return;
      }

      if (!config.creativity) {
        toast.error("Por favor, seleccione un nivel de creatividad");
        setStepper(Steps.Search);
        return;
      }

      const message = await submitUserMessage(value, config);

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
      label: "Historia de la computación",
      onClick: () => handleSearch("Historia de la computación")
    },
    {
      label: "Investigación reciente sobre la longevidad",
      onClick: () => handleSearch("Investigación reciente sobre la longevidad")
    },
    {
      label: "¿Cuál es el clima en Lima?",
      onClick: () => handleSearch("¿Cuál es el clima en Lima?")
    },
    {
      label: "Receta de pizza de pepperoni",
      onClick: () => handleSearch("Receta de pizza de pepperoni")
    },
    {
      label: "Dame un ejemplo de código Python",
      onClick: () => handleSearch("Dame un ejemplo de código Python")
    }
  ];

  return (
    <>
      <Header title={title} />
      <main className="flex min-h-[calc(100dvh-72px)] sm:min-h-[calc(100dvh-90px)] flex-col items-center justify-center  px-4 py-0 sm:py-7 md:px-10 md:py-0">
        <div className={cn("w-full max-w-[900px] h-[calc(100dvh-80px)] flex justify-center")}>
          {stepper === Steps.Search && (
            <InitialPage mocks={tagMocks} onSearch={handleSearch} />
          )}

          {stepper === Steps.Loading && (
            <section className="w-full">
              <div className=" mx-auto flex flex-col items-center justify-center h-[80dvh]">
                <div className="flex flex-col items-center justify-center max-w-[610px]">
                  <div className="mb-6">
                    <Loader />
                  </div>
                  <h2 className="text-[30px] leading-[36px] text-center font-medium">
                    Buscando en el rincón más profundo de la web para responderte...🚀
                  </h2>
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
    <section className="w-full h-full flex flex-col justify-center">
      <div className=" mx-auto flex flex-col items-center justify-between h-[60dvh]">
        <div className="flex items-center flex-col">
          <div className="flex flex-col justify-center gap-6 w-full md:w-[62%]">
            <h2 className="font-bold text-[28px] leading-[22px] md:text-[40px] md:leading-[45px] text-center">
              Donde la creatividad
              <br />
              se une al conocimiento
            </h2>
            <p className="text-sm text-muted-foreground font-medium text-center">
              Eligue alguna de las siguientes opciones para comenzar o pregunta algo.
            </p>
          </div>

          <div className="flex justify-center mt-8 w-full mx-auto flex-wrap gap-3">
            {mocks.map((tag, index) => (
              <Button key={index} variant="tag" className="gap-2" onClick={tag.onClick}>
                <span>{tag.label}</span>
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