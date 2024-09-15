/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ClientMessage, ModelConfig } from "@/actions/chat";
import Chat from "@/components/chat";
import Header from "@/components/header";
import InitialPage from "@/components/initial-page";
import LoadingPage from "@/components/loading-page";
import Message from "@/components/message";
import { Creativity, Models, Steps, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import { CloudMoonIcon, Code, PawPrint, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [_search, setSearch] = useState("");
  const [title, setTitle] = useState<string>("");
  const [stepper, setStepper] = useState<Steps>(Steps.Search);
  const { submitUserMessage } = useActions();
  const [_conversation, setConversation] = useUIState();
  const [image, setImage] = useState<string | null>(null);

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
      setSearch("");
      setStepper(Steps.Loading);
      setTitle("");
      setImage(null);

      setConversation((currentConversation: ClientMessage[]) => [
        ...currentConversation,
        {
          id: generateId(),
          role: "user",
          display: image ? <Message role={User.User} content={value} isComponent>
            <img src={image} alt="Imagen" className="input-image-preview" />
          </Message> : <Message role={User.User} content={value} />
        }
      ]);

      const config: ModelConfig = {
        model: localStorage.getItem("model") as Models,
        creativity: localStorage.getItem("creativity") as Creativity,
        apiKey: localStorage.getItem("apiKey") as string
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

      const message = await submitUserMessage(value, config, image);

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

  const recommends = [
    {
      label: "Lista de nombres para mascotas",
      icon: <PawPrint className="size-[18px] text-yellow-500" />,
      onClick: () => handleSearch("Lista de nombres para mascotas")
    },
    {
      label: "Dime el clima de Lima",
      icon: <CloudMoonIcon className="size-[18px] text-blue-400" />,
      onClick: () => handleSearch("Dime el clima de Lima")
    },
    {
      label: "Explicame un ejemplo de código Python",
      icon: <Code className="size-[18px]" />,
      onClick: () => handleSearch("Explicame un ejemplo de código Python")
    },
    {
      label: "Traduce 'Hola mundo' en noruego",
      icon: <Pencil className="size-[18px] text-green-400" />,
      onClick: () => handleSearch("Traduce 'Hola mundo' al noruego")
    }
  ];

  return (
    <>
      <Header title={title} />
      <main className="flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center px-2 sm:px-4 py-0 md:px-10">
        <div
          className={cn(
            "w-full max-w-[900px] h-[calc(100dvh-80px)] flex justify-center"
          )}
        >
          {stepper === Steps.Search && (
            <InitialPage
              recommends={recommends}
              onSearch={handleSearch}
              setImagePreview={setImage}
            />
          )}

          {stepper === Steps.Loading && (
            <LoadingPage />
          )}

          {stepper === Steps.Chat && <Chat />}
        </div>
      </main>
    </>
  );
}


