import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { ChangeEventHandler, InputHTMLAttributes } from "react";

interface InputSearchProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (e: any) => void;
}

const InputSearch = ({ className, onChange, onSubmit, value, ...props }: InputSearchProps) => {
  return (
    <form onSubmit={onSubmit} className={cn("bg-neutral-200/30 w-full px-6 py-3 flex gap-5 justify-between items-center rounded-full transition-all duration-200", className)}>
      <Input
        placeholder="¿Qué deseas buscar?"
        className="font-medium text-neutral-800 placeholder:text-neutral-800 border-none min-w-[250px] bg-transparent outline-none focus-visible:border-none focus-visible:outline-none active:border-none active:outline-none focus-visible:ring-0 active:ring-0 active:border-transparent focus:border-transparent focus:outline-none focus:rounded-none"
        onChange={onChange}
        value={value}
        {...props}
      />
      <Search className="text-neutral-800 size-[22px]" />
    </form>

  );
};

export default InputSearch;