import { Link } from "lucide-react";

interface SourceBoxProps {
  title: string;
  label: string;
}

const SourceBox = ({ title, label }: SourceBoxProps) => {
  return (
    <article className="max-w-[450px] w-full cursor-pointer bg-gray-200/45 px-5 pb-5 py-14 rounded-lg hover:bg-gray-200/70 transition-all duration-100 ease-in-out">
      <h2 className="text-[18px] uppercase text-neutral-700 line-clamp-3 text-balance">{title}</h2>
      <div className="flex items-center gap-2">
        <Link className="size-[14px] text-neutral-700" />
        <h3 className="text-[12px] uppercase font-bold text-neutral-700 line-clamp-1">{label}</h3>
      </div>
    </article>
  );
};

export default SourceBox;