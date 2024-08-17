"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { AIState, DELTA_STATUS, SourceType, UIState, User } from "@/lib/types";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { google } from '@ai-sdk/google';
import Message from "@/components/message";
import { generateResultModel, searchOnWikipedia } from "./actions";
import { z } from "zod";
import { generateId } from 'ai';
import { ReactNode } from "react";
import { SourceType, User } from "@/lib/types";


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

  console.log("history", history.get());

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
      }
      // searchOnWikipedia: {
      //   description: 'Usa Wikipedia para obtener información sobre hechos historicos, historia, geografia, eventos, personas, etc que no tengas presente para responder al usuario.',
      //   parameters: z.object({
      //     question: z.string().describe('La pregunta que el usuario hizo al asistente.')
      //   })
      // }
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