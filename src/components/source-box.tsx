import { Link } from "lucide-react";

interface SourceBoxProps {
  title?: string;
  label?: string;
  link?: string;
}

const SourceBox = ({ title, label, link }: SourceBoxProps) => {
  return (
    <a href={link} target="_blank" className="flex flex-col justify-end w-full cursor-pointer bg-neutral-200/30 px-5 pb-5 py-14 rounded-lg hover:bg-gray-200/70 transition-all duration-100 ease-in-out">
      <article className="">
        <h2 className="text-[18px] leading-[22.8px]  font-bold mb-2 uppercase text-neutral-700 line-clamp-3 text-balance">{title}</h2>
        <div className="w-full flex items-center gap-2">
          <Link className="size-[14px] text-neutral-700 min-w-[14px]" />
          <h3 className="text-[12px] uppercase text-neutral-700 font-medium line-clamp-1">{label}</h3>
        </div>
      </article>
    </a>
  );
};

export default SourceBox;