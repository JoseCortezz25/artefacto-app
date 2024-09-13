"use server";

import { Creativity, Models, SearchResults } from "@/lib/types";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI, ChatOpenAICallOptions, OpenAICallOptions } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { WeatherGeneral } from "@/components/weather-card";
import { z } from "zod";
import { RunnableConfig, RunnableLike, RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { ModelConfig } from "./chat";
import { AIMessageChunk } from "@langchain/core/messages";
import { StringPromptValueInterface } from "@langchain/core/prompt_values";
import { Annotation, END, MessagesAnnotation, START, StateGraph, StateGraphArgs } from "@langchain/langgraph";

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

export const generateTranslatedText = async (fromLang: string, toLang: string, input: string, config: ModelConfig) => {
  const TranslatorGraphState = Annotation.Root({
    fromLang: Annotation<string>,
    toLang: Annotation<string>,
    input: Annotation<string>,
    result: Annotation<string>({
      reducer: (oldValue: string, newValue: string) => {
        return newValue;
      }
    })
  });

  console.group("TRANSLATOR GRAPH STATE");
  console.log("fromLang", fromLang);
  console.log("toLang", toLang);
  console.log("input", input);
  console.groupEnd();

  const model = getModel(config);

  const translator = async (state: typeof TranslatorGraphState.State, config?: RunnableConfig
  ): Promise<Partial<typeof TranslatorGraphState.State>> => {
    const { fromLang, toLang, input } = state;

    const chain = RunnableSequence.from([
      PromptTemplate.fromTemplate(`
        Translate the text from {fromLang} to {toLang}.
        This is the text: {input}
      `),
      model
    ]);

    const response = await chain.invoke({ fromLang, toLang, input, config });
    console.log("RESULT - TRANSLATING", response);
    return { result: response.content as string };
  };

  const reviewer = async (state: typeof TranslatorGraphState.State, config?: RunnableConfig
  ): Promise<Partial<typeof TranslatorGraphState.State>> => {
    const { fromLang, toLang, result } = state;
    const chain = RunnableSequence.from([
      PromptTemplate.fromTemplate(`
        Review the translation of the text from {fromLang} to {toLang}.
        This is the translated text: {result}
      `),
      model
    ]);

    const response = await chain.invoke({ fromLang, toLang, result }, config);
    console.log("RESULT - REVIEWERING", response);


    // const promptReviewerTemplate = PromptTemplate.fromTemplate("Review the translation of the text from {fromLang} to {toLang}: {input}");
    // const chain = promptReviewerTemplate.pipe(model as RunnableLike<StringPromptValueInterface, AIMessageChunk>);
    // console.log("CHAIN", chain);

    // const modelResult = await chain.invoke({ fromLang, toLang, input });
    // console.log("RESULT - REVIEWERING", modelResult);
    return { result: response.content as string };
  };

  const builder = new StateGraph(TranslatorGraphState)
    .addNode("translator", translator)
    .addNode("reviewer", reviewer)
    .addEdge(START, "translator")
    .addEdge("translator", "reviewer")
    .addEdge("reviewer", END);

  const agent = builder.compile();
  console.log("AGENT", agent);
  return agent;
};


interface IState {
  fromLang: string;
  toLang: string;
  input: string;
  output: string;
}

export const getDummyAgent = async (fromLang: string, toLang: string, input: string, config: ModelConfig) => {

  const graphState: StateGraphArgs<IState>["channels"] = {
    fromLang: {
      reducer: (x, y) => y ?? x ?? ""
    },
    toLang: {
      reducer: (x, y) => y ?? x ?? ""
    },
    input: {
      reducer: (x, y) => y ?? x ?? ""
    },
    output: {
      reducer: (x, y) => y ?? x ?? ""
    }
  };
  // const InputAnnotation = Annotation.Root({
  //   fromLang: Annotation<string>({
  //     value: (x?: string, y?: string) => y ?? x ?? "",
  //     default: () => ""
  //   }),
  //   toLang: Annotation<string>({
  //     value: (x?: string, y?: string) => y ?? x ?? "",
  //     default: () => ""
  //   }),
  //   originalText: Annotation<string>({
  //     value: (x?: string, y?: string) => y ?? x ?? "",
  //     default: () => ""
  //   }),
  //   output: Annotation<string>({
  //     value: (x?: string, y?: string) => y ?? x ?? "",
  //     default: () => ""
  //   })
  // });

  const OutputAnnotation = Annotation.Root({
    translatedText: Annotation<string>({
      value: (x?: string, y?: string) => y ?? x ?? "",
      default: () => ""
    })
  });

  const model = getModel(config);

  const translatorNode = async (state: IState) => {
    const promptReviewerTemplate = PromptTemplate.fromTemplate(`
      Translate the text from {fromLang} to {toLang}.
      This is the text: {originalText}
    `);
    const chain = promptReviewerTemplate.pipe(model as RunnableLike<StringPromptValueInterface, AIMessageChunk>);
    const response = await chain.invoke({
      fromLang: state.fromLang,
      toLang: state.toLang,
      originalText: state.input as string
    });

    console.log("RESPONSE 1 -", response);

    return {
      ...state,
      output: response
    };
  };


  // const reviewerNode = (state: typeof InputAnnotation.State) => {
  //   const promptReviewerTemplate = PromptTemplate.fromTemplate(`
  //     Review the translation of the text from {fromLang} to {toLang}.
  //     This is the translated text: {translatedText}
  //   `);
  //   const chain = promptReviewerTemplate.pipe(model as RunnableLike<StringPromptValueInterface, AIMessageChunk>);
  //   const response = chain.invoke({
  //     fromLang: state.fromLang,
  //     toLang: state.toLang,
  //     translatedText: state.originalText
  //   });

  //   console.log("RESPONSE 2 -", response);
  //   return { translatedText: "hello" };
  // };

  // const graph = new StateGraph({
  //   input: InputAnnotation,
  //   output: OutputAnnotation
  // })
  const graph = new StateGraph({ channels: graphState })
    .addNode("answerNode", translatorNode)
    // .addNode("middleNode", reviewerNode)
    .addEdge("__start__", "answerNode")
    // .addEdge("answerNode", "middleNode")
    .compile();


  console.group("DUMMY AGENT");
  console.log("FROM LANG", fromLang);
  console.log("TO LANG", toLang);
  console.log("INPUT", input);
  console.groupEnd();

  const result = await graph.invoke({
    fromLang: fromLang,
    toLang: toLang,
    input: input
  });

  // console.log("RESULT", result);
  return result;

};

// Usando LangGraph
// export const generateTranslatedText = async (fromLang: string, toLang: string, input: string, config: ModelConfig) => {
//   // try {
//   // const StateAnnotation = Annotation.Root({
//   //   input: Annotation<string>({
//   //     reducer: (x, y) => y ?? x ?? ""
//   //   }),
//   //   fromLang: Annotation<string>({
//   //     reducer: (x, y) => y ?? x ?? ""
//   //   }),
//   //   toLang: Annotation<string>({
//   //     reducer: (x, y) => y ?? x ?? ""
//   //   })
//   // });

//   // // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   // const callModel = async (state: typeof StateAnnotation.State) => {
//   //   console.log("STATE [CALL MODEL]:", state);

//   //   const promptTemplate = PromptTemplate.fromTemplate(`
//   //     Actua como un traductor profesional. Tu misión es traducir el texto de un idioma a otro.
//   //     El idioma de origen es: {fromLang} y debes config?: RunnableConfigtraducirlo al idioma: {toLang}
//   //     El texto a traducir es: {input}

//   //     Instrucciones:
//   //     - Traduce el texto al idioma de destino.
//   //     - Manten la coherencia en la traducción.
//   //     - No agregues información adicional.
//   //     - No omitas información.
//   //     - La traducción debe ser precisa.
//   //   `);
//   //   const model = getModel(config);

//   //   const chain = promptTemplate.pipe(model as RunnableLike<StringPromptValueInterface, AIMessageChunk>);
//   //   const result: AIMessageChunk | string = await chain.invoke({
//   //     input: input,
//   //     fromLang: fromLang,
//   //     toLang: toLang
//   //   });

//   //   console.log("result", result);

//   //   return {
//   //     input: result.content as string,
//   //     fromLang: fromLang,
//   //     toLang: toLang
//   //   };
//   // };

//   // const verifyTranslation = async (state: typeof StateAnnotation.State) => {
//   //   const promptTemplate = PromptTemplate.fromTemplate(`
//   //     Actua como un corrector de traducciones. Tu misión es verificar la traducción realizada por un traductor.
//   //     La traducción realizada es: {input}
//   //     Verifica la traducción y corrige cualquier error que encuentres.
//   //     El idioma de origen es: {fromLang} y el idioma de destino es: {toLang}

//   //     Instrucciones:
//   //     - Corrige cualquier error en la traducción.
//   //     - Manten la coherencia en la traducción.
//   //     - No agregues información adicional.
//   //     - No omitas información.
//   //     - La traducción debe ser precisa.
//   //   `);

//   //   const model = getModel(config);
//   //   const chain = promptTemplate.pipe(model as RunnableLike<StringPromptValueInterface, AIMessageChunk>);

//   //   const result: AIMessageChunk | string = await chain.invoke({
//   //     input: state.input,
//   //     fromLang: state.fromLang,
//   //     toLang: state.toLang
//   //   });

//   //   return {
//   //     input: result.content as string
//   //   };
//   // };

//   // const StateAnnotation = Annotation.Root({
//   //   name: Annotation<string>({
//   //     reducer: (x, y) => y ?? x ?? ""
//   //   }),
//   //   isHuman: Annotation<boolean>({
//   //     reducer: (x, y) => y ?? x ?? false
//   //   })
//   // });


//   //Initialise the LangGraph
//   // const workflow = new StateGraph(MessagesAnnotation)
//   //   .addNode("sayHello", sayHello)
//   //   .addNode("sayBye", sayBye)
//   //   .addEdge(START, "sayHello")
//   //   .addEdge("sayHello", "sayBye")
//   //   .addEdge("sayBye", END);



//   // const workflow = new StateGraph(StateAnnotation)
//   //   .addNode("Agent", callModel)
//   //   .addEdge(START, "Agent")
//   //   .addNode("Verify", verifyTranslation)
//   //   .addEdge("Agent", "Verify")
//   //   .addEdge("Verify", END);

//   // const graph = workflow.compile();

//   // const inputs = {
//   //   messages: [new HumanMessage(`
//   //     Traduce el siguiente texto del idioma ${fromLang} al idioma ${toLang}: ${input}
//   //   `)]
//   // };

//   // for await (
//   //   const { input } of await graph.stream(inputs, {
//   //     streamMode: "values"
//   //   })
//   // ) {
//   //   const translatedText = input;
//   //   console.log("translatedText", translatedText);

//   // }
//   // } catch (error) {
//   //   console.log('HA OCURRIDO UN ERROR', error);

//   // };
// };


// // const finalState = await app.invoke({
// //   messages: [new HumanMessage("what is the weather in sf")]
// });

// console.log("finalState", finalState);

