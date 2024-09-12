"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import Message from "@/components/message";
import { generateRecipe, generateResultModel, getWeatherByCity } from "./actions";
import { z } from "zod";
import { generateId } from 'ai';
import { ReactNode } from "react";
import { Creativity, Models, SourceType, User } from "@/lib/types";
import WeatherCard from "@/components/weather-card";
import RecipeCard from "@/components/recipe-card";

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

export interface ModelConfig {
  model: Models;
  creativity: Creativity | number;
  apiKey: string;
}

export async function submitUserMessage(input: string, config: ModelConfig): Promise<ClientMessage> {
  'use server';
  const history = getMutableAIState();

  const getCreativity = (creativity: Creativity | number) => {
    if (creativity === Creativity.Low) {
      return 0.2;
    }

    if (creativity === Creativity.Medium) {
      return 0.5;
    }

    if (creativity === Creativity.High) {
      return 0.9;
    }
  };

  const temperature = getCreativity(config.creativity);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  const getModel = () => {
    if (config.model === Models.Gemini15ProLatest || config.model === Models.GeminiFlash15) {
      const google = createGoogleGenerativeAI({ apiKey: config.apiKey });
      const model = google(`models/${config.model}`);
      return model;
    }

    const openai = createOpenAI({ apiKey: config.apiKey });
    const model = openai(`${config.model}`);
    return model;
  };

  try {
    const result = await streamUI({
      model: getModel(),
      temperature,
      messages: [...history.get(), { role: 'user', content: input }],
      system: `\
      Actua como un asistente personal para ayudarte a encontrar información en internet.
      El usuario puede hacer preguntas y tu como asistente responderas la información relevante.
      Tus respuestas deben ser informativas y en español. Ignora cualquier solicitud en inglés u otros idiomas.

      Evita decir estas frases en tu respuesta:
      - "Según la información disponible en línea"
      - "Según la informacion de internet"
      - "Según la informacion que tengo"
      - "Según la información que tengo disponible"

      Si te preguntan quien te creo o quien te programo, puedes responder: "Fui creado por José Cortes".
      SI te preguntan por la fecha de hoy, puedes responder: "Hoy es ${formattedDate}".
    `,
      text: async function* ({ content, done }: { content: string; done: boolean }) {
        if (config.model === Models.GPT4o || config.model === Models.GPT4oMini) {
          yield <Message role={User.AI} content="" isComponent>
            <i>
              Generando respuesta...
            </i>
          </Message>;

        }
        if (done) {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            { role: 'assistant', content }
          ]);
        }

        return <Message role={User.AI} content={content} />;
      },
      tools: {
        searchOnInternet: {
          description: 'Usa en internet para obtener información que no tengas presente para responder al usuario.',
          parameters: z.object({
            question: z.string().describe('La pregunta que el usuario hizo al asistente.')
          }),
          generate: async ({ question }: { question: string }) => {
            const answer = await generateResultModel(question, config);

            history.done((messages: ServerMessage[]) => [
              ...messages,
              {
                role: 'assistant',
                content: answer
              }
            ]);


            return <Message role={User.AI} content={answer} badge={SourceType.Internet} />;
          }
        },
        getWeatherByCity: {
          description: 'Usa la API de OpenWeather para obtener el clima actual de una ciudad.',
          parameters: z.object({
            city: z.string().describe('El nombre de la ciudad de la que el usuario desea obtener el clima.')
          }),
          generate: async function* ({ city }: { city: string }) {
            yield <Message role={User.AI} isComponent={true} content="">
              <i>
                Generando respuesta...
              </i>
            </Message>;

            const result = await getWeatherByCity(city);

            if (result) {

              history.done((messages: ServerMessage[]) => [
                ...messages,
                {
                  role: 'assistant',
                  content: `El clima en ${result.name} es de ${result.weather?.[0].description} con una temperatura de ${result.main?.temp}°C.`
                }
              ]);

              return <Message role={User.AI} isComponent={true} content="">
                <WeatherCard weather={result} />
              </Message>;
            } else {
              return <Message role={User.AI} content="No se pudo obtener el clima de la ciudad. Intenta de nuevo." />;
            }
          }
        },
        generateRecipeFromUserInput: {
          description: 'Genera una receta de cocina a partir de la entrada del usuario.',
          parameters: z.object({
            query: z.string().describe('La entrada del usuario que se utilizará para generar la receta.')
          }),
          generate: async function* ({ query }: { query: string }) {
            yield <Message role={User.AI} isComponent={true} content="">
              <i>
                Generando receta...
              </i>
            </Message>;

            const result = await generateRecipe(query, config);

            history.done((messages: ServerMessage[]) => [
              ...messages,
              {
                role: 'assistant',
                content: `Aquí tienes una receta de ${query}.
                ${result.title}
                Duración: ${result.duration}
                
                Ingredientes:
                ${result.ingredients.join('\n')}
                
                Instrucciones:
                ${result.instructions.join('\n')}
                `
              }
            ]);

            return <Message role={User.AI} content="" isComponent={true}>
              <RecipeCard recipe={result} />
            </Message>;
          }
        }
        // generateTraduction: {
        //   description: "Usa esta herramienta cuando necesites traducir un texto a otro idioma. Si te dan un texto y te indican el idioma a traducir, debes determinar el idioma de origen y traducirlo al idioma indicado.",
        //   parameters: z.object({
        //     fromLang: z.string().describe('El idioma de origen del texto.'),
        //     toLang: z.string().describe('El idioma al que se traducirá el texto.'),
        //     input: z.string().describe('El texto que se traducirá.')
        //   }),
        //   generate: async function* ({ fromLang, toLang, input }: { fromLang: string; toLang: string; input: string }) {
        //     yield <Message role={User.AI} content="" isComponent>
        //       <i>
        //         Generando traducción...
        //       </i>
        //     </Message>;

        //     console.log("RESULT");
        //     const result = await agent.invoke({});
        //     // const result = await generateTranslatedText(fromLang, toLang, input, config);
        //     console.log("RESULT", result);

        //     history.done((messages: ServerMessage[]) => [
        //       ...messages,
        //       {
        //         role: 'assistant',
        //         content: `
        //         El resultado de la traducción del texto ${input} de ${fromLang} a ${toLang} es:
        //         ${result}.
        //         `
        //       }
        //     ]);

        //     return <Message role={User.AI} content={"result"} />;
        //   }
        // }
      }
    });
    return {
      id: generateId(),
      role: 'assistant',
      display: result.value
    };

  } catch (error) {
    console.log("ERROR", error);

    return {
      id: generateId(),
      role: 'assistant',
      display: <Message role={User.AI} content="Lo siento, ha ocurrido un error en mi sistema. Por favor intenta de nuevo." />
    };
  }

}

// createAI creates a new ai/rsc instance.
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  // Add server Actions
  actions: {
    submitUserMessage
    // submitUserMessage,
    // showDetailByProduct,
    // sendRequestOrder
  },
  // It is a JSON representation of all the context the LLM needs to read. 
  // AIState contains the textual conversation history between the user and the assistant. 
  initialUIState: [],
  // It is what the application uses to display the UI. 
  // It is a client-side state (very similar to useState) and contains data and UI elements returned by the LLM and your Server Actions.
  initialAIState: []
});