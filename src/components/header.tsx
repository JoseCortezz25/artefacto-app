import SheetSettings from "./sheet-settings";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { SettingsIcon } from "lucide-react";

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="w-full py-4 bg-white/90 sticky top-0 backdrop-blur-md px-4 lg:px-4 dark:bg-neutral-900">
      <div className="mx-auto max-w-[1424px] flex items-center justify-between">
        <nav>
          <span className="text-[20px] font-bold ">Artefacto</span>
        </nav>

        <nav className="max-w-[50%] line-clamp-1  hidden lg:flex">
          {title && <p className="text-[15px]">{title}</p>}
        </nav>

        <nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="link">
                <SettingsIcon className="size-[24px]" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-bold text-[19px]">Configuración</SheetTitle>
                <SheetDescription className="text-[15px]">
                  Configura el modelo y la API KEY para generar la busqueda.
                </SheetDescription>

                <SheetSettings />
              </SheetHeader>
            </SheetContent>
          </Sheet>

        </nav>
      </div>
    </header>
  );
};

export default Header;