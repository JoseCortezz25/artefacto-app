import { useState, ChangeEventHandler, FormEvent, InputHTMLAttributes, SetStateAction, Dispatch, ClipboardEvent, ChangeEvent } from "react";
import { ArrowUp, X } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Steps } from "@/lib/types";
import Image from "next/image";

interface InputSearchProps extends InputHTMLAttributes<HTMLInputElement | HTMLFormElement> {
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLFormElement>;
  value?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
  variant?: Steps;
  setImage?: Dispatch<SetStateAction<string | null>>;
}

const InputSearch = ({
  className,
  onChange,
  onSubmit,
  value,
  setImage,
  ...props
}: InputSearchProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      if (imagePreview) {
        setImage!(imagePreview);
      }

      await onSubmit(e);
      setImagePreview(null);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);
          setImage!(event.target?.result as string);
        };
        reader.readAsDataURL(blob!);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);

      if (imagePreview) {
        setImage!(imagePreview);
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className={cn(
        imagePreview ? "items-start" : "items-center",
        "pl-4 bg-neutral-200/30 dark:bg-[#2a2929] dark:text-white w-full flex gap-5 justify-between rounded-[24px] transition-all duration-200",
        className
      )}
      role="search"
    >
      <div className="flex-grow">
        {imagePreview && (
          <div className="image-preview">
            <Image
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-40 mt-4"
              width={60}
              height={60}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="image-preview--delete"
            >
              <X className="size-[15px]" />
            </button>
          </div>
        )}
        <Input
          placeholder="¿Qué deseas buscar?"
          className="font-medium py-7 text-neutral-800 dark:placeholder:text-[#ececec] dark:text-[#ececec] placeholder:text-neutral-800 min-w-[250px] border-none bg-transparent ring-0 outline-none active:border-none active:outline-none active:ring-0 active:border-transparent focus:border-transparent focus:outline-none focus:rounded-none focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none focus-visible:outline-none focus-visible:shadow-none"
          onChange={handleChange}
          onPaste={handlePaste}
          value={value}
          {...props}
        />
      </div>
      <div className="pr-3 py-3 h-full pl-4 flex">
        <button type="submit" className="btn-search" disabled={value!.length > 0 ? false : true}>
          <ArrowUp className="btn-search--icon" />
        </button>
      </div>
    </form>
  );
};

export default InputSearch;