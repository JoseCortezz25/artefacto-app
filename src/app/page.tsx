"use client";
import { generateResultModel, generateTitle, searchOnInternet } from "@/actions/actions";
import Header from "@/components/header";
import Heading from "@/components/heading";
import InputSearch from "@/components/search";
import SourceBox from "@/components/source-box";
import { Button } from "@/components/ui/button";
import { SearchResults } from "@/lib/types";
import { BookOpen, CopyIcon, EllipsisVertical, PenToolIcon, PencilIcon } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState("");
  const [sources, setSources] = useState<SearchResults[]>([]);
  const [title, setTitle] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sources = await searchOnInternet(search);
      const response = await generateResultModel(search);
      const titleResponde = await generateTitle(search);

      if (!response) return;
      setSources(sources || []);
      setResults(response);
      setTitle(titleResponde);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title={title} />
      <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-gray-50/50">
        <div className="max-w-[1024px]">
          <InputSearch
            className="min-w-[1024px]"
            value={search}
            onChange={({ target }) => setSearch(target.value)}
            onSubmit={handleSearch}
          />

          <section className="w-full mt-10">
            <div className="mb-14">
              <Heading className=" my-5" content="Source">
                <BookOpen className="size-[22px]" />
              </Heading>

              <div className="grid grid-cols-4 gap-4 justify-between">
                {sources && sources.slice(0, 4).map((result, index) => (
                  <SourceBox key={index} title={result.title} label={result.link} link={result.link} />
                ))}
              </div>
            </div>

            <div>
              <Heading className=" my-5" content="Answer">
                <PenToolIcon className="size-[22px]" />
              </Heading>

              <div className="mb-6">
                {results}
              </div>

              <div className="flex gap-2 justify-between">
                <nav>
                  <Button variant="ghost">
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
          </section>
        </div>
      </main>
    </>
  );
}
