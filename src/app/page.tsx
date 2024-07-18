import Heading from "@/components/heading";
import InputSearch from "@/components/search";
import SourceBox from "@/components/source-box";
import { Button } from "@/components/ui/button";
import { BookOpen, CopyIcon, EllipsisVertical, PenToolIcon, PencilIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <div className="max-w-[1024px]">
        <InputSearch className="min-w-[1024px]" />

        <section className="w-full mt-10">
          <div className="mb-14">
            <Heading className=" my-5" content="Source">
              <BookOpen className="size-[22px]" />
            </Heading>

            <div className="flex gap-4 justify-between">
              <SourceBox title="Source Box" label="This is a source box" />
              <SourceBox title="Source Box" label="This is a source box" />
              <SourceBox title="Source Box" label="This is a source box" />
              <SourceBox title="Source Box" label="This is a source box" />
            </div>
          </div>


          <div>
            {/* <h2 className="text-2xl font-bold mt-10">Answer</h2> */}
            <Heading className=" my-5" content="Answer">
              <PenToolIcon className="size-[22px]" />
            </Heading>


            <div className="mb-6">
              <p className="text-md mt-5">Recent TikTok cooking trends have captivated audiences with unique and innovative recipes:</p>
              <p className="text-md mt-5">Smashburger Tacos: A fusion of burgers and tacos, offering a cheesy, savory delight.
                Cottage Cheese in Everything: From ice cream to eggs, this versatile ingredient is trending.
                Frozen Fruit Shaved Ice: A healthy, simple dessert gaining millions of views.
                Tanghulu: Fruit dipped in boiling sugar, creating a crunchy, sweet treat.
                Mukbangs: Live-streamed eating shows, popular for their entertainment value.
                Girl Dinner: A mix of light and indulgent bites, sparking both intrigue and controversy</p>
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
