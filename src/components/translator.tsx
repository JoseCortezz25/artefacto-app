"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyIcon, Languages } from 'lucide-react';
import { toast } from "sonner";

export type TranslatorProps = {
  fromLang: string;
  toLang: string;
  inputText: string;
  translatedText: string;
}

export default function Translator({
  fromLang,
  toLang,
  inputText,
  translatedText
}: TranslatorProps) {
  const onCopy = () => {
    navigator.clipboard.writeText(translatedText);
    toast.success('Se ha copiado el texto traducido al portapapeles');
  };

  return (
    <Card className="w-full max-w-md md:max-w-4xl bg-white dark:bg-[#2a2929] rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-center gap-5 mb-4 w-full">
          <div className="text-end">
            <span className="font-bold uppercase text-lg">
              {fromLang}
            </span>
          </div>

          <div className="flex items-center">
            <Languages className="size-[20px]" />
          </div>

          <div className="">
            <span className="font-bold uppercase text-lg">
              {toLang}
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-4">
          <div className="flex-1">
            <div className="min-h-[100px] md:min-h-[200px] text-lg p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              {inputText}
            </div>
          </div>

          <div className="flex-1">
            <div className="min-h-[100px] md:min-h-[200px] text-lg p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg relative">
              {translatedText}

              <Button
                onClick={onCopy}
                className="absolute bottom-2 right-2 transition-transform transform active:scale-95"
                variant="ghost"
                size="icon"
              >
                <CopyIcon className="size-[18px]" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}