import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HeadingProps {
  children: ReactNode;
  content: string;
  className?: string;
}

const Heading = ({ children, content, className }: HeadingProps) => {
  return (
    <div className={cn("flex gap-2 items-center", className)}>
      {children}
      <h2 className="font-bold text-xl">{content}</h2>
    </div>
  );
};

export default Heading;