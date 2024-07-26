"use server";
import { SearchResults } from "@/lib/types";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

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


// export const generateResultFromWikipedia = async (query: string) => {
//   console.group("generateResultModel");
//   console.log("Generating result model...");

//   const promptTemplate = PromptTemplate.fromTemplate(`
//     Actua como un asistente personal para ayudarte a encontrar información en internet.
//     El usuario puede hacer preguntas y tu como asistente responderas la información relevante.
//     Este es el resultado de la busqueda: {searchResults}
//     Esta es la pregunta del usuario: {query}  

//     Evita decir estas frases en tu respuesta:
//     - "Según la información disponible en línea"
//     - "Según la informacion de internet"
//     - "Según la informacion que tengo"
//     - "Según la información que tengo disponible"
//   `);

//   const chain = promptTemplate.pipe(googleModel);

//   const result = await chain.invoke({
//     query: query,
//     searchResults: await 
//   });

//   console.log("Result: ", result);
//   console.groupEnd();
//   return result.content as string;
// };