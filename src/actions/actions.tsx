"use server";

import { Creativity, Models, SearchResults } from "@/lib/types";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { WeatherGeneral } from "@/components/weather-card";
import { z } from "zod";
import { RunnableLike, RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { ModelConfig } from "./chat";
import { AIMessageChunk, HumanMessage } from "@langchain/core/messages";
import { StringPromptValueInterface } from "@langchain/core/prompt_values";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";

const searchInternetTool = new DuckDuckGoSearch({
  maxResults: 5,
  searchOptions: {
    safeSearch: 0
  },
  verbose: true
});

const wikipediaTool = new WikipediaQueryRun({
  topKResults: 4,
  maxDocContentLength: 4000
});


const googleModel = new ChatGoogleGenerativeAI({
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

export const searchOnInternet = async (query: string) => {
  try {
    console.log("Searching on internet...");
    console.log("Query: ", query);


    const result = await searchInternetTool.invoke(query);
    console.log("Result: ", result);

    const parsedResult = JSON.parse(result) as SearchResults[];
    return parsedResult;
  } catch (error) {
    return error;
  }
};

export const generateResultModel = async (query: string) => {
  console.group("generateResultModel");
  console.log("Generating result model...");

  const promptTemplate = PromptTemplate.fromTemplate(`
    Actua como un asistente personal para ayudarte a encontrar información en internet.
    El usuario puede hacer preguntas y tu como asistente responderas la información relevante.
    Este es el resultado de la busqueda: {searchResults}
    Esta es la pregunta del usuario: {query}  

    Evita decir estas frases en tu respuesta:
    - "Según la información disponible en línea"
    - "Según la informacion de internet"
    - "Según la informacion que tengo"
    - "Según la información que tengo disponible"
  `);

  const chain = promptTemplate.pipe(googleModel);

  const result = await chain.invoke({
    query: query,
    searchResults: await searchInternetTool.invoke(query)
  });

  console.log("Result: ", result);
  console.groupEnd();
  return result.content as string;
};

export const generateTitle = async (content: string) => {
  const promptTemplate = PromptTemplate.fromTemplate(`
    Actua como un expero en generar titulos de acuerdo a la respuesta de una AI. 
    Tu misión es generar un titulo que resuma la respuesta de la AI.
    Limitate solamente a generar un titulo que resuma la respuesta de la AI.
    Esta es la respuesta de la AI: {content}

    Instrucciones para generar el titulo:
    - No generes preguntas.
    - Manten un tono objetivo.
    - Sé conciso y claro.
    - Solo genera un titulo, no generes un titulo que su contenido tenga dos puntos y semejantes.
  `);

  const chain = promptTemplate.pipe(googleModel);

  const result = await chain.invoke({
    content: content
  });

  return result.content as string;
};

export const searchOnWikipedia = async (query: string) => {
  try {
    console.group("searchOnWikipedia");
    console.log("Searching on Wikipedia...");
    console.log("Query: ", query);

    const result = await wikipediaTool.invoke(query);
    console.log("Result: ", result);
    console.groupEnd();

    return result;
  } catch (error) {
    return error;
  }
};


export const generateTranslatedText = async (fromLang: string, toLang: string, input: string, config: ModelConfig) => {
  try {
    const StateAnnotation = Annotation.Root({
      input: Annotation<string>({
        reducer: (x, y) => y ?? x ?? ""
      }),
      fromLang: Annotation<string>({
        reducer: (x, y) => y ?? x ?? ""
      }),
      toLang: Annotation<string>({
        reducer: (x, y) => y ?? x ?? ""
      })
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const callModel = async (state: typeof StateAnnotation.State) => {
      console.log("STATE [CALL MODEL]:", state);

      const promptTemplate = PromptTemplate.fromTemplate(`
        Actua como un traductor profesional. Tu misión es traducir el texto de un idioma a otro.
        El idioma de origen es: {fromLang} y debes config?: RunnableConfigtraducirlo al idioma: {toLang}
        El texto a traducir es: {input}
  
        Instrucciones:
        - Traduce el texto al idioma de destino.
        - Manten la coherencia en la traducción.
        - No agregues información adicional.
        - No omitas información.
        - La traducción debe ser precisa.
      `);
      const model = getModel(config);

      const chain = promptTemplate.pipe(model as RunnableLike<StringPromptValueInterface, AIMessageChunk>);
      const result: AIMessageChunk | string = await chain.invoke({
        input: input,
        fromLang: fromLang,
        toLang: toLang
      });

      console.log("result", result);

      return {
        input: result.content as string,
        fromLang: fromLang,
        toLang: toLang
      };
    };

    const verifyTranslation = async (state: typeof StateAnnotation.State) => {
      const promptTemplate = PromptTemplate.fromTemplate(`
        Actua como un corrector de traducciones. Tu misión es verificar la traducción realizada por un traductor.
        La traducción realizada es: {input}
        Verifica la traducción y corrige cualquier error que encuentres.
        El idioma de origen es: {fromLang} y el idioma de destino es: {toLang}
  
        Instrucciones:
        - Corrige cualquier error en la traducción.
        - Manten la coherencia en la traducción.
        - No agregues información adicional.
        - No omitas información.
        - La traducción debe ser precisa.
      `);

      const model = getModel(config);
      const chain = promptTemplate.pipe(model as RunnableLike<StringPromptValueInterface, AIMessageChunk>);

      const result: AIMessageChunk | string = await chain.invoke({
        input: state.input,
        fromLang: state.fromLang,
        toLang: state.toLang
      });

      return {
        input: result.content as string
      };
    };

    const workflow = new StateGraph(StateAnnotation)
      .addNode("Agent", callModel)
      .addEdge(START, "Agent")
      .addNode("Verify", verifyTranslation)
      .addEdge("Agent", "Verify")
      .addEdge("Verify", END);

    const graph = workflow.compile();

    const inputs = {
      messages: [new HumanMessage(`
        Traduce el siguiente texto del idioma ${fromLang} al idioma ${toLang}: ${input}
      `)]
    };

    for await (
      const { input } of await graph.stream(inputs, {
        streamMode: "values"
      })
    ) {
      const translatedText = input;
      console.log("translatedText", translatedText);

    }
  } catch (error) {
    console.log('HA OCURRIDO UN ERROR', error);

  };
};
