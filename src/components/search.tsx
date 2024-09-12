"use client";

import { ArrowUp, Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { ChangeEventHandler, FormEvent, InputHTMLAttributes } from "react";
import { Steps } from "@/lib/types";

interface InputSearchProps extends InputHTMLAttributes<HTMLInputElement | HTMLFormElement> {
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
  variant?: Steps;
}

const InputSearch = ({ className, onChange, onSubmit, value, variant = Steps.Search, ...props }: InputSearchProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(e);
    }
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className={cn("pl-4 bg-neutral-200/30 dark:bg-[#2a2929] dark:text-white w-full flex gap-5 justify-between items-center rounded-full transition-all duration-200", className)}
      role="search"
    >
      <div className="flex-grow">
        <Input
          placeholder="¿Qué deseas buscar?"
          className="font-medium text-neutral-800 dark:placeholder:text-[#ececec] dark:text-[#ececec] placeholder:text-neutral-800 min-w-[250px] border-none bg-transparent ring-0 outline-none active:border-none active:outline-none active:ring-0 active:border-transparent focus:border-transparent focus:outline-none focus:rounded-none focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none focus-visible:outline-none focus-visible:shadow-none"
          onChange={onChange}
          value={value}
          {...props}
        />
      </div>
      <div className={cn(variant === Steps.Search && "pr-6 py-6", variant === Steps.Chat && "pr-3 py-3", "h-full pl-4 flex")}>
        {variant === Steps.Search && (
          <button type="submit" className="size-[22px]">
            <Search className="text-neutral-800 dark:text-[#ececec] cursor-pointer" />
          </button>
        )}

        {variant === Steps.Chat && (
          <button className="bg-neutral-800 dark:bg-white size-[40px] md:size-[45px] flex items-center justify-center rounded-full" type="submit">
            <ArrowUp className="text-white dark:text-[#2f2f2f] cursor-pointer size-[28px]" />
          </button>
        )}
      </div>
    </form>
  );
};

export default InputSearch;