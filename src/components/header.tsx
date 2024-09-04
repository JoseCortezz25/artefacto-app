import SheetSettings from "./sheet-settings";
import { ModeToggle } from "./toggle-mode";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { SettingsIcon } from "lucide-react";

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="w-full py-4 bg-white/90 sticky top-0 backdrop-blur-md px-4 lg:px-4 dark:bg-black">
      <div className="mx-auto max-w-[1424px] flex items-center justify-between">
        <nav>
          <span className="text-[20px] font-bold flex items-center">Artefacto <Badge className="ml-2">Beta</Badge></span>
        </nav>

        <nav className="max-w-[50%] line-clamp-1  hidden lg:flex">
          {title && <p className="text-[15px]">{title}</p>}
        </nav>

        <nav className="flex gap-2">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
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