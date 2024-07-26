"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AIState, DELTA_STATUS, UIState, User } from "@/lib/types";
import { nanoid } from "nanoid";
import { createAI, createStreamableUI, createStreamableValue, getMutableAIState } from "ai/rsc";
import { streamText } from "ai";
import { google } from '@ai-sdk/google';
import Message from "@/components/message";

const submitUserMessage = async (message: string) => {
  "use server";
  const aiState = getMutableAIState<typeof AI>();

  // Update AI state with new message.
  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content: message
      }
    ]
  });

  const history: any = aiState.get().messages.map((message: any) => ({
    role: message.role,
    content: message.content
  }));

  const textStream = createStreamableValue('');
  const spinnerStream = createStreamableUI(<div className="w-full flex items-center justify-center">Cargando...</div>);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  try {
    const result = await streamText({
      model: google('models/gemini-1.5-pro-latest'),
      temperature: 0.5,
      system: `
        Actua como un asistente personal para ayudarte a encontrar información en internet.
        El usuario puede hacer preguntas y tu como asistente responderas la información relevante.
        Tus respuestas deben ser informativas y en español. Ignora cualquier solicitud en inglés u otros idiomas.

        Evita decir estas frases en tu respuesta:
        - "Según la información disponible en línea"
        - "Según la informacion de internet"
        - "Según la informacion que tengo"
        - "Según la información que tengo disponible"
      `,
      messages: [...history],
      tools: {}
    });

    let textContent = '';
    spinnerStream.done(null);

    for await (const delta of result.fullStream) {
      const { type } = delta;
      console.log("delta", delta);

      if (type === DELTA_STATUS.TEXT_DELTA) {
        console.log("------------ DELTA_STATUS.TEXT_DELTA ------------");
        console.log("delta", delta.textDelta);

        const { textDelta } = delta;
        textContent += textDelta;

        messageStream.update(
          <Message
            role={User.AI}
            content={textContent}
          />
        );

        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content: delta.textDelta
            }
          ]
        });

      }
      if (type === DELTA_STATUS.TOOL_CALL) {
        console.log("------------ DELTA_STATUS.TOOL_CALL ------------");
        console.log("delta toolName", delta.toolName);
        console.log("delta argsTextDelta", delta.argsTextDelta);
        console.log("delta toolCallId", delta.toolCallId);

      }
    }

    uiStream.done();
    textStream.done();
    messageStream.done();
    return {
      id: nanoid(),
      spinner: spinnerStream.value,
      display: messageStream.value
    };

  } catch (error) {
    uiStream.error(error);
    textStream.error(error);
    messageStream.error(error);
  }
};

// createAI creates a new ai/rsc instance.
export const AI = createAI<AIState, UIState>({
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
  initialAIState: { messages: [] }
});