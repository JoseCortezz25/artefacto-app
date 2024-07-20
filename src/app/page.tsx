"use client";
import { searchOnInternet } from "@/actions/actions";
import Heading from "@/components/heading";
import InputSearch from "@/components/search";
import SourceBox from "@/components/source-box";
import { Button } from "@/components/ui/button";
import { SearchResults } from "@/lib/types";
import { BookOpen, CopyIcon, EllipsisVertical, PenToolIcon, PencilIcon } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResults | undefined>();

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await searchOnInternet(search);
      console.log('response', response);
      console.log('query', search);
      if (!response) return;
      setResults(response);
    } catch (error) {

    }
  };

  return (
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
              {results && results.slice(0, 4).map((result, index) => (
                <SourceBox key={index} title={result.title} label={result.link} link={result.link} />
              ))}
            </div>
          </div>


          <div>
            {/* <h2 className="text-2xl font-bold mt-10">Answer</h2> */}
            <Heading className=" my-5" content="Answer">
              <PenToolIcon className="size-[22px]" />
            </Heading>


            <div className="mb-6">
              {results && results.map((result, index) => (
                <div key={index} className="bg-white rounded-lg p-5 shadow-md">
                  <h3 className="text-xl font-bold">{result.title}</h3>
                  <p className="text-md mt-2" dangerouslySetInnerHTML={{ __html: result.snippet }}></p>
                </div>
              ))}
              {/* <p className="text-md mt-5">Recent TikTok cooking trends have captivated audiences with unique and innovative recipes:</p>
              <p className="text-md mt-5">Smashburger Tacos: A fusion of burgers and tacos, offering a cheesy, savory delight.
                Cottage Cheese in Everything: From ice cream to eggs, this versatile ingredient is trending.
                Frozen Fruit Shaved Ice: A healthy, simple dessert gaining millions of views.
                Tanghulu: Fruit dipped in boiling sugar, creating a crunchy, sweet treat.
                Mukbangs: Live-streamed eating shows, popular for their entertainment value.
                Girl Dinner: A mix of light and indulgent bites, sparking both intrigue and controversy</p> */}
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
  );
}
