"use client";
import Chat from "@/components/chat";
import Header from "@/components/header";
// import Heading from "@/components/heading";
import InputSearch from "@/components/search";
// import SourceBox from "@/components/source-box";
import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
import { Steps } from "@/lib/types";
// import { BookOpen, CopyIcon, EllipsisVertical, PenToolIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState<string>("");
  const [stepper, setStepper] = useState<Steps>(Steps.Search);

  const handleSearch = async (e: Event) => {
    if (stepper === Steps.Search) {
      setStepper(Steps.Loading);
    }

    if (stepper === Steps.Loading) {
      setStepper(Steps.Chat);
    }

    if (!search) {
      toast.error("Ingrese una pregunta para buscar");
    }

    e.preventDefault();
    try {

      setStepper(Steps.Chat);
      setTitle("");
    } catch (error) {
      if (stepper === Steps.Loading) {
        setStepper(Steps.Search);
      }
    }
  };

  const tagMocks = [
    {
      label: "Historia de la computación",
      onClick: () => {
        setSearch("Historia de la computación");
        handleSearch(new Event("submit"));
      }
    },
    {
      label: "Recetas de cocina",
      onClick: () => {
        setSearch("Recetas de cocina");
        handleSearch(new Event("submit"));
      }
    },
    {
      label: "Lugares turisticos de Peru",
      onClick: () => {
        setSearch("Lugares turisticos de Peru");
        handleSearch(new Event("submit"));
      }
    },
    {
      label: "Joe Biden",
      onClick: () => {
        setSearch("Joe Biden");
        handleSearch(new Event("submit"));
      }
    }
  ];

  return (
    <>
      <Header title={title} />
      <main className="bg-white flex min-h-[calc(100dvh-90px)] flex-col items-center justify-center px-4 py-7 md:px-10 md:py-0">
        <div className="w-full max-w-[1024px]">
          {stepper === Steps.Search && (
            <div className="flex flex-col gap-6 justify-center items-center py-28 rounded-xl">
              <h1 className="font-bold text-center text-[27px] leading-[31px] md:text-[45px] md:leading-[49px] text-neutral-900">
                ¿Qué deseas buscar?
              </h1>
              <InputSearch
                className="w-full"
                value={search}
                onChange={({ target }) => setSearch(target.value)}
                onSubmit={handleSearch}
              />
              <div className="flex flex-wrap gap-2 lg:gap-4">
                {tagMocks.map((tag, index) => (
                  <Button key={index} variant="tag" className="gap-2" onClick={tag.onClick}>
                    <b className="text-[16px]">#</b><span>{tag.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {stepper === Steps.Loading && (
            <p>Loading...</p>
          )}

          {stepper === Steps.Chat && (
            <Chat />
          )}
        </div>
      </main>
    </>
  );
}
