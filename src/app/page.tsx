"use client";
import { generateResultModel, generateTitle, searchOnInternet } from "@/actions/actions";
import Header from "@/components/header";
import Heading from "@/components/heading";
import InputSearch from "@/components/search";
import SourceBox from "@/components/source-box";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchResults } from "@/lib/types";
import { BookOpen, CopyIcon, EllipsisVertical, PenToolIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState("");
  const [sources, setSources] = useState<SearchResults[]>([]);
  const [title, setTitle] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: Event) => {
    setResults("");
    setSources([]);

    if (!search) {
      toast.error("Ingrese una pregunta para buscar");
    }

    e.preventDefault();
    setLoading(true);
    try {
      const sources = await searchOnInternet(search) as SearchResults[];
      const response = await generateResultModel(search);
      const titleResponde = await generateTitle(search) as string;


      if (!response) return;
      setSources(sources);
      setResults(response);
      setTitle(titleResponde);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    if (!results) return;
    await navigator.clipboard.writeText(results);
    toast.success("La respuesta ha sido copiada al portapapeles");
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
      <main className="bg-white flex min-h-[calc(100dvh-70px)] flex-col items-center justify-center px-4 py-10 md:p-10">
        <div className="w-full max-w-[1024px]">

          {/* Si no hay resultados y tampoco loading esta activo */}
          {!results && !loading && (
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

          {/* Si loading esta activo */}
          {!results && loading && (
            <p>Loading...</p>
          )}


          {/* {!loading ? (
            <section className="w-full mt-10 pb-10">
              {!!results && (
                <div className="mb-14">
                  <Heading className=" my-5" content="Source">
                    <BookOpen className="size-[22px]" />
                  </Heading>

                  <div className="flex flex-wrap md:grid md:grid-cols-4 gap-4 justify-between">
                    {(loading) ? (
                      <>
                        <Skeleton className="h-[130px]" />
                        <Skeleton className="h-[130px]" />
                        <Skeleton className="h-[130px]" />
                        <Skeleton className="h-[130px]" />
                      </>
                    ) :
                      <>
                        {sources && sources.slice(0, 4).map((result, index) => (
                          <SourceBox key={index} title={result.title} label={result.link} link={result.link} />
                        ))}
                      </>
                    }
                  </div>
                </div>
              )}

              {results && (
                <div>
                  <Heading className=" my-5" content="Answer">
                    <PenToolIcon className="size-[22px]" />
                  </Heading>

                  <div className="mb-6">
                    {results}
                  </div>

                  <div className="flex gap-2 justify-between">
                    <nav>
                      <Button variant="ghost" onClick={onCopy}>
                        <CopyIcon className="size-[16px] mr-2" />
                        Copy answer
                      </Button>
                      <Button variant="ghost">
                        <PencilIcon className="size-[16px] mr-2" />
                        Rewrite
                      </Button>
                    </nav>

                    <nav>
                      <Button variant="ghost">
                        <EllipsisVertical className="size-[16px]" />
                      </Button>
                    </nav>
                  </div>
                </div>
              )}
            </section>
          ) :
            <p>Loading...</p>
          } */}
        </div>
      </main>
    </>
  );
}
