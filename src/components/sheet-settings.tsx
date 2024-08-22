import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const SheetSettings = () => {
  return (
    <section className="!mt-[30px]">

      <div className="group-fields">
        <Label>Selecciona el modelo</Label>
        <p>
          Elige el modelo de IA que deseas utilizar para la generación de la respuesta.
        </p>
        <Input type="text" />
      </div>

      <div className="group-fields">
        <Label>Selecciona el nivel de creatividad</Label>
        <p>
          Moldea la creatividad de la respuesta. Un nivel bajo generará respuestas más predecibles, mientras que un nivel alto generará respuestas más inesperadas.
        </p>
        <Input type="text" />
      </div>

      <div className="group-fields">
        <Label>Ingresa tu API KEY</Label>
        <p>
          Ingresa tu clave de API para poder utilizar los servicios del modelo que seleccionaste.
        </p>
        <Input type="text" />
      </div>

      <Button className="w-full">
        Guardar configuración
      </Button>
    </section>
  );
};

export default SheetSettings;
