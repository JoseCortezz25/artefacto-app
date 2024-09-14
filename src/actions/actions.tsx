"use server";

import { Creativity, Models, SearchResults } from "@/lib/types";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI, ChatOpenAICallOptions, OpenAICallOptions } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { WeatherGeneral } from "@/components/weather-card";
import { z } from "zod";
import { RunnableLike, RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { ModelConfig } from "./chat";
import { AIMessageChunk } from "@langchain/core/messages";
import { StringPromptValueInterface } from "@langchain/core/prompt_values";
// import { Annotation, END, START, StateGraph, StateGraphArgs } from "@langchain/langgraph";

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

const MAX_OUTPUT_TOKENS = 2048;

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

export const getModel = (config: ModelConfig): ChatOpenAI<ChatOpenAICallOptions> | ChatGoogleGenerativeAI => {
  if (config.model === Models.GPT4o || config.model === Models.GPT4oMini) {
    const model = new ChatOpenAI({
      model: config.model,
      temperature: getCreativity(config.creativity),
      apiKey: config.apiKey,
      maxTokens: MAX_OUTPUT_TOKENS
    });

    return model;
  }

  const model = new ChatGoogleGenerativeAI({
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    temperature: getCreativity(config.creativity),
    apiKey: config.apiKey
  });

  return model;
};

export const searchOnInternet = async (query: string) => {
  try {
    const result = await searchInternetTool.invoke(query);
    const parsedResult = JSON.parse(result) as SearchResults[];
    return parsedResult;
  } catch (error) {
    return error;
  }
};

export const generateResultModel = async (query: string, config: ModelConfig) => {

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

  const model = getModel(config);
  const chain = promptTemplate.pipe(model as RunnableLike<StringPromptValueInterface, AIMessageChunk>);

  const result: AIMessageChunk | string = await chain.invoke({
    query: query,
    searchResults: await searchInternetTool.invoke(query)
  });

  return result.content as string;
};

export const generateTitle = async (content: string, config: ModelConfig) => {
  const promptTemplate = PromptTemplate.fromTemplate(`
    Actua como un expero en generar titulos de acuerdo a la respuesta de una AI. 
    Tu misión es generar un titulo que resuma la respuesta de la AI.
    Limitate solamente a generar un titulo que resuma la respuesta de la AI.
    Esta es la respuesta de la AI: {content}

    Instrucciones para generar el titulo:
    - No generes preguntas.
    - Manten un tono objetivo.
    - Sé conciso y clgoogleModelaro.
    - Solo genera un titulo, no generes un titulo que su contenido tenga dos puntos y semejantes.
  `);

  const model = getModel(config);
  const chain = promptTemplate.pipe(model as RunnableLike<StringPromptValueInterface, AIMessageChunk>);

  const result = await chain.invoke({
    content: content
  });

  return result.content as string;
};

export const searchOnWikipedia = async (query: string) => {
  try {
    const result = await wikipediaTool.invoke(query);
    return result;
  } catch (error) {
    return error;
  }
};

export const getWeatherByCity = (city: string): Promise<WeatherGeneral> => {
  return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`)
    .then(response => response.json())
    .then(json => {
      if (json.cod === '404' || json.cod === '400') {
        throw new Error(json.message);
      }
      return json as WeatherGeneral;
    })
    .catch(err => {
      throw new Error(err);
    });
};

export const generateRecipe = async (query: string, config: ModelConfig) => {
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      title: z.string(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
      duration: z.string()
    })
  );

  const model = getModel(config) as RunnableLike<OpenAICallOptions> | RunnableLike<ChatGoogleGenerativeAI>;

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
    Actua como un chef con 10 años de experiencia.Tu misión es generar una receta de acuerdo a la consulta del usuario.
    En internet buscarás una receta que se ajuste a la consulta del usuario y la presentarás de manera estructurada.
    Solucitud del usuario: {query}
    Este es el resultado de la busqueda: {searchResults}
    Estructura de la receta: {formatInstructions}
    La respuesta debe ser en español.
    `),
    model
  ]);

  const response = await chain.invoke({
    query: query,
    searchResults: await searchInternetTool.invoke(query),
    formatInstructions: parser.getFormatInstructions()
  });

  return response;
};

export const generateTranslatedText = async (
  fromLang: string,
  toLang: string,
  input: string,
  config: ModelConfig
) => {
  const model = getModel(config) as RunnableLike<OpenAICallOptions> | RunnableLike<ChatGoogleGenerativeAI>;

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
      Act as a professional translator. Your mission is to translate the text from one language to another.
      You have to translate the text from: {fromLang} to the language: {toLang}
      The text to translate is: {originalText}

      Instructions:
      - Translate the text to the target language.
      - Maintain coherence in the translation.
      - Do not add additional information.
      - Do not omit information.
      - The translation must be accurate.
    `),
    model
  ]);

  const response = await chain.invoke({
    fromLang: fromLang,
    toLang: toLang,
    originalText: input
  });

  return response;
};