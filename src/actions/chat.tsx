"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { google } from '@ai-sdk/google';
import Message from "@/components/message";
import { generateResultModel, getWeatherByCity } from "./actions";
import { z } from "zod";
import { generateId } from 'ai';
import { ReactNode } from "react";
import { SourceType, User } from "@/lib/types";
import WeatherCard from "@/components/weather-card";


export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

export async function submitUserMessage(input: string): Promise<ClientMessage> {
  'use server';

  const history = getMutableAIState();

  const result = await streamUI({
    model: google('models/gemini-1.5-pro-latest'),
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

      Si te preguntan quien te creo o quien te programo, puedes responder: "Fui creado por Alfonso Chavarro".
    `,
    text: ({ content, done }) => {
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
        generate: async ({ question }) => {
          const answer = await generateResultModel(question);

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
        generate: async ({ city }) => {
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
      }
    }
  });

  return {
    id: generateId(),
    role: 'assistant',
    display: result.value
  };
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