import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const SheetSettings = () => {
  return (
    <section className="!mt-[30px]">

      <div className="group-fields">
        <Label>Selecciona el modelo</Label>
        <p>Elige el modelo que deseas utilizar para generar el JSON. Necesitas añadir la API KEY correspondiente al model seleccionado para poder utilizarlo.</p>
        <Input type="text" />
      </div>

      <div className="group-fields">
        <Label>Selecciona el nivel de creatividad</Label>
        <p>Elige el nivel de creatividad que deseas que tenga el modelo para generar el JSON.</p>
        <Input type="text" />
      </div>

      <div className="group-fields">
        <Label>Ingresa tu API KEY</Label>
        <p>Ingresa la API KEY correspondiente al modelo seleccionado para poder utilizarlo y generar el JSON.</p>
        <Input type="text" />
      </div>

      <Button className="w-full">
        Guardar configuración
      </Button>
    </section>
  );
};

export default SheetSettings;

// Revision de algunas cosas de HIT con jair en la mañana y una reunio rapida con cristian para eso como para validarlo
// Mientras esta el servicio he estaod revisando temas de Storybook, Langchain y el SDK de Vercel