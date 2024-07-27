"use client";
import { Brain, CopyIcon, EllipsisVertical, PencilIcon, User2Icon } from "lucide-react";
import Heading from "./heading";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { SourceType, User } from "@/lib/types";

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
    <article className="flex flex-col gap-3">
      <div>
        {role === User.AI && (
          <Heading content="Artefa">
            <Brain className="size-[22px]" />
          </Heading>
        )}

        {role === User.User && (
          <Heading content="Tú">
            <User2Icon className="size-[22px]" />
          </Heading>
        )}
      </div>
      <div className="flex flex-col items-start gap-2">
        {content}
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
      </div>
      {role === User.AI && (
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

          <nav>
            <Button variant="ghost">
              <EllipsisVertical className="size-[16px]" />
            </Button>
          </nav>
        </div>
      )}
    </article>
  );
};

export default Message;