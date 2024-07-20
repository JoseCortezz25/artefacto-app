"use server";
import { SearchResults } from "@/lib/types";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

const searchInternetTool = new DuckDuckGoSearch({
  maxResults: 5,
  searchOptions: {
    safeSearch: 0
  },
  verbose: true
});

const googleModel = new ChatGoogleGenerativeAI({
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

export const searchOnInternet = async (query: string) => {
  try {
    // Instantiate the DuckDuckGoSearch tool.

    // Get the results of a query by calling .invoke on the tool.
    const result = await searchInternetTool.invoke(query);

    const parsedResult = JSON.parse(result) as SearchResults[];
    console.log("Resultado de la búsqueda", parsedResult);
    return parsedResult;


    // console.log("Resultado de la búsqueda", result);
    // return result;
  } catch (error) {

  }
};

export const generateResultModel = async (query: string) => {
  const promptTemplate = PromptTemplate.fromTemplate(`
    Actua como un asistente personal para ayudarte a encontrar información en internet.
    El usuario puede hacer preguntas y tu como asistente responderas la información relevante.
    Este es el resultado de la busqueda: {searchResults}
    Esta es la pregunta del usuario: {query}  
  `);

  const chain = promptTemplate.pipe(googleModel);

  const result = await chain.invoke({
    query: query,
    searchResults: await searchInternetTool.invoke(query)
  });

  return result.content as string;
};

export const generateTitle = async (content: string) => {
  const promptTemplate = PromptTemplate.fromTemplate(`
    Actua como un expero en generar titulos de acuerdo a la respuesta de una AI. 
    Tu misión es generar un titulo que resuma la respuesta de la AI.
    Limitate solamente a generar un titulo que resuma la respuesta de la AI.
    Esta es la respuesta de la AI: {content}
  `);

  const chain = promptTemplate.pipe(googleModel);

  const result = await chain.invoke({
    content: content
  });

  return result.content as string;
};
