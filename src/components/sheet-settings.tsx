"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";

const SheetSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [creativity, setCreativity] = useState("");

  const onSaveSettings = () => {
    console.log({ apiKey, model, creativity });

    if (!localStorage.getItem("apiKey")) {
      localStorage.setItem("apiKey", apiKey);
    }
    if (!localStorage.getItem("model")) {
      localStorage.setItem("model", model);
    }
    if (!localStorage.getItem("creativity")) {
      localStorage.setItem("creativity", creativity);
    }
  };

  return (
    <section className="!mt-[30px]">

      <div className="group-fields">
        <Label>Selecciona el modelo</Label>
        <p>
          Elige el modelo de IA que deseas utilizar para la generación de la respuesta.
        </p>
        <Select onValueChange={(e) => setModel(e)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar el modelo" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="gtp4o">Open AI - GPT4o </SelectItem>
            <SelectItem value="gtp4o-mini">Open AI - GPT4o mini</SelectItem>
            <SelectItem value="gemini-pro-1.5">Google - Gemini Pro 1.5 </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="group-fields">
        <Label>Selecciona el nivel de creatividad</Label>
        <p>
          Moldea la creatividad de la respuesta. Un nivel bajo generará respuestas más predecibles, mientras que un nivel alto generará respuestas más inesperadas.
        </p>
        <Select onValueChange={(e) => setCreativity(e)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar el nivel de creatividad" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="high">Alto</SelectItem>
            <SelectItem value="medium">Medio</SelectItem>
            <SelectItem value="low">Bajo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="group-fields">
        <Label>Ingresa tu API KEY</Label>
        <p>
          Ingresa tu clave de API para poder utilizar los servicios del modelo que seleccionaste.
        </p>
        <Input type="text" onChange={(e) => setApiKey(e.target.value)} />
      </div>

      <Button className="w-full" onClick={onSaveSettings}>
        Guardar configuración
      </Button>
    </section>
  );
};

export default SheetSettings;
