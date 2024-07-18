import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface InputSearchProps {
  className?: string;
  link?: string;
}

const InputSearch = ({ className, link = "", ...props }: InputSearchProps) => {
  return (
    <Link href={link}>
      <div className={cn("bg-white w-full border-[1px] border-gray-300/50 px-6 py-1 flex gap-5 justify-between items-center rounded-xl", className)}>
        <Search className="text-gray-600/50 size-[20px]" />
        <Input {...props} placeholder="¿Qué deseas buscar?" className="font-medium text-gray-500 border-none min-w-[200px] bg-transparent outline-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus:border-transparent focus:outline-none focus:rounded-none" />
      </div>
    </Link>
  );
};

export default InputSearch;