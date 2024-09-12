"use client";
import { ClientMessage, ModelConfig } from "@/actions/chat";
import Chat from "@/components/chat";
import Header from "@/components/header";
import Loader from "@/components/loader";
import Message from "@/components/message";
import InputSearch from "@/components/search";
import { Creativity, Models, Steps, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import { CloudMoonIcon, Code, Earth, PawPrint } from "lucide-react";
import { ReactNode, useState } from "react";
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
      setSearch("");
      setStepper(Steps.Loading);
      setTitle("");

      setConversation((currentConversation: ClientMessage[]) => [
        ...currentConversation,
        {
          id: generateId(),
          role: "user",
          display: <Message role={User.User} content={value} />
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

  const recommends = [
    {
      label: "Lista de nombres para mascotas",
      icon: <PawPrint className="size-[18px] text-yellow-500" />,
      onClick: () => handleSearch("Lista de nombres para mascotas")
    },
    {
      label: "Preguntar las capitales",
      icon: <Earth className="size-[18px] text-blue-400" />,
      onClick: () => handleSearch("Preguntar las capitales")
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
            <InitialPage recommends={recommends} onSearch={handleSearch} />
          )}

          {stepper === Steps.Loading && (
            <section className="w-full">
              <div className=" mx-auto flex flex-col items-center justify-center h-[80dvh]">
                <div className="flex flex-col items-center justify-center max-w-[610px]">
                  <div className="mb-6">
                    <Loader />
                  </div>
                  <h2 className="text-[20px] leading-[24px] sm:text-[30px] sm:leading-[36px] text-center font-medium">
                    Buscando en el rincón más profundo de la web para
                    responderte...🚀
                  </h2>
                </div>
              </div>
            </section>
          )}

          {stepper === Steps.Chat && <Chat />}
        </div>
      </main>
    </>
  );
}

interface InitialPageProps {
  recommends: {
    label: string;
    onClick?: () => void,
    icon: ReactNode
  }[];
  onSearch: (searchValue: string) => Promise<void>;
}

interface RecommendBoxProps {
  label: string;
  icon: ReactNode,
  onClick?: () => void
}

const RecommendBox = ({ label, icon, onClick }: RecommendBoxProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full relative flex flex-col gap-2 rounded-2xl border border-[rgba(0,0,0,.1)] dark:border-[hsla(0,0%,100%,.1)] px-3 pb-4 pt-3 text-start align-top text-[15px] shadow-[0px_4px_7px_#414040f] transition disabled:cursor-not-allowed hover:bg-neutral-100/30 dark:hover:bg-neutral-800"
    >
      {icon}
      <span className="line-clamp-3 max-w-full text-balance text-gray-600 dark:text-[#9b9b9b] break-word">
        {label}
      </span>
    </button>
  );
};

const InitialPage = ({ recommends, onSearch }: InitialPageProps) => {
  const [search, setSearch] = useState("");

  return (
    <section className="flex flex-col justify-between gap-4 pb-3 w-full">
      <div className="h-[calc(100%-70px)] flex flex-col justify-center">

        <h2 className="font-bold text-[23px] leading-[23px] md:text-[40px] md:leading-[43px] text-center">
          Donde la creatividad
          <br />
          se une al conocimiento
        </h2>
        <div className="grid grid-cols-2 gap-3 mt-[38px] md:flex md:flex-row md:gap-5 md:mt-[48px]">
          {recommends.map((recommend) => (
            <RecommendBox label={recommend.label} icon={recommend.icon} key={recommend.label} onClick={recommend.onClick} />
          ))}
        </div>
      </div>
      <div>
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
