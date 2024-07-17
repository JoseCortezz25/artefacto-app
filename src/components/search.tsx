import { Search } from "lucide-react";
import { Input } from "./ui/input";

const InputSearch = ({ ...props }) => {
  return (
    <div className="bg-white w-full border-[1.5px] border-gray-300/50 px-6 py-1 flex gap-5 justify-between items-center rounded-lg">
      <Search className="text-gray-600/50 size-[20px]" />
      <Input {...props} placeholder="¿Qué deseas buscar?" className="border-none min-w-[200px] bg-transparent outline-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus:border-transparent focus:outline-none focus:rounded-none" />
    </div>
  );
};

export default InputSearch;