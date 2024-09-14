"use client";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import InputSearch from "./search";

interface InitialPageProps {
  recommends: {
    label: string;
    onClick?: () => void,
    icon: ReactNode
  }[];
  onSearch: (searchValue: string, image?: string) => Promise<void>;
  setImagePreview?: Dispatch<SetStateAction<string | null>>;
}

interface RecommendBoxProps {
  label: string;
  icon: ReactNode,
  onClick?: () => void
}

const RecommendBox = ({ label, icon, onClick }: RecommendBoxProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full relative flex flex-col gap-2 rounded-2xl border border-[rgba(0,0,0,.1)] dark:border-[hsla(0,0%,100%,.1)] px-3 pb-4 pt-3 text-start align-top text-[15px] shadow-[0px_4px_7px_#414040f] transition disabled:cursor-not-allowed hover:bg-neutral-100/30 dark:hover:bg-neutral-800"
    >
      {icon}
      <span className="line-clamp-3 max-w-full text-balance text-gray-600 dark:text-[#9b9b9b] break-word">
        {label}
      </span>
    </button>
  );
};

const InitialPage = ({ recommends, onSearch, setImagePreview }: InitialPageProps) => {
  const [search, setSearch] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [image, setImage] = useState<string | null>(null);

  const handleImage = (value: string | null) => {
    setImage(value);
    setImagePreview!(value);
  };

  return (
    <section className="flex flex-col justify-between gap-4 pb-3 w-full">
      <div className="h-[calc(100%-70px)] flex flex-col justify-center">

        <h2 className="font-bold text-[23px] leading-[23px] md:text-[40px] md:leading-[43px] text-center">
          Donde la creatividad
          <br />
          se une al conocimiento
        </h2>
        <div className="grid grid-cols-2 gap-3 mt-[38px] md:flex md:flex-row md:gap-5 md:mt-[48px]">
          {recommends.map((recommend) => (
            <RecommendBox label={recommend.label} icon={recommend.icon} key={recommend.label} onClick={recommend.onClick} />
          ))}
        </div>
      </div>
      <div>
        <InputSearch
          className="w-full"
          value={search}
          onChange={({ target }) => setSearch(target.value)}
          onSubmit={() => onSearch(search, image ?? undefined)}
          setImage={(value) => handleImage(value)}
        />
      </div>
    </section>
  );
};

export default InitialPage;