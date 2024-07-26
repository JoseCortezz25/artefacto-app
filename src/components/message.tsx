"use client";
import { Brain, CopyIcon, EllipsisVertical, PencilIcon, User2Icon } from "lucide-react";
import Heading from "./heading";
import { Button } from "./ui/button";
import { toast } from "sonner";

export enum User {
  AI = 'ai',
  User = 'user'
}

interface MessageProps {
  role: User;
  content: string;
};

const Message = ({ role, content }: MessageProps) => {
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
      <div className="my-2">
        {content}
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