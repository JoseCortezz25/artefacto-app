"use client";
import { Brain, CopyIcon, User2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { SourceType, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Preview } from "./preview-markdown";
import { ReactNode } from "react";

interface MessageProps {
  role: User;
  content: string;
  badge?: SourceType
  isComponent?: boolean;
  children?: ReactNode;
};

const Message = ({ role = User.AI, content, badge = SourceType.NormalAnswer, isComponent = false, children }: MessageProps) => {
  const onCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    toast.success("La respuesta ha sido copiada al portapapeles");
  };

  return (
    <article className={cn(
      "flex gap-4 rounded-[25px] p-3 sm:py-5 sm:pl-7 sm:pr-4 w-full max-w-[100%] md:max-w-[85%]",
      role === User.AI && "bg-blue-100/60 dark:bg-[#3b82f6b8]",
      role === User.User && "bg-gray-100/80 dark:bg-[#2f2f2f]"
    )}>
      <div>
        {role === User.AI && (
          <div className="bg-blue-200 dark:bg-blue-600 p-2 rounded-full">
            <Brain className="size-[22px]" />
          </div>
        )}

        {role === User.User && (
          <div className="bg-gray-200/90 dark:bg-[#1d1d1d] p-2 rounded-full">
            <User2 className="size-[22px]" />
          </div>
        )}
      </div>

      {!isComponent ? (
        <div className="flex flex-col items-start gap-2 w-full font-[500]">
          <div className={cn("mt-2", role === User.User && "font-bold")}>
            <Preview markdown={content}></Preview>
          </div>

          {badge === SourceType.Internet && (
            <span className="whitespace-nowrap rounded-full bg-blue-200 dark:bg-blue-200 px-2.5 py-0.5 text-sm text-blue-800 dark:text-blue-800 font-medium">
              Generado con información de internet
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
                    Copiar respuesta
                  </Button>
                </nav>
              </div>
            </div>
          )}
        </div>
      ) : (
        children
      )}
    </article>
  );
};

export default Message;