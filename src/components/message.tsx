"use client";
import { Brain, CopyIcon, PencilIcon, User2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { SourceType, User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MessageProps {
  role: User;
  content: string;
  badge?: SourceType
};

const Message = ({ role = User.AI, content, badge = SourceType.NormalAnswer }: MessageProps) => {
  const onCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    toast.success("La respuesta ha sido copiada al portapapeles");
  };

  return (
    <article className={cn(
      "flex gap-4 rounded-[25px] py-5 pl-7 pr-4 w-full max-w-[100%] md:max-w-[85%]",
      role === User.AI && "bg-blue-100/30",
      role === User.User && "bg-gray-100/10"
    )}>
      <div>
        {role === User.AI && (
          <div className="bg-blue-100 p-2 rounded-full">
            <Brain className="size-[22px]" />
          </div>
        )}

        {role === User.User && (
          <div className="bg-gray-200/80 p-2 rounded-full">
            <User2 className="size-[22px]" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="mt-2">
          {content}
        </div>

        {badge === SourceType.Internet && (
          <span className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700">
            Internet
          </span>
        )}

        {badge === SourceType.Wikipedia && (
          <span className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700">
            Wikipedia
          </span>
        )}

        {role === User.AI && (
          <div className="flex justify-end w-full mt-2">
            <div className="flex gap-2 justify-between">
              <nav className="flex gap-2">
                <Button variant="ghost" onClick={onCopy}>
                  <CopyIcon className="size-[16px] mr-2" />
                  Copy answer
                </Button>
                <Button variant="ghost">
                  <PencilIcon className="size-[16px] mr-2" />
                  Rewrite
                </Button>
              </nav>
            </div>
          </div>
        )}
      </div>

    </article>
  );
};

export default Message;