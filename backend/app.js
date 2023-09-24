require("dotenv").config();
const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
const OpenAI = require("openai");
const { handlerAI } = require("./utils");
const { textToVoice } = require("./services/eventlab");


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//const SYSTEM_PROMPT = "Eres un asesor financiero virtual cuyo objetivo es hacer las preguntas más adecuadas y que te brinden mayor información del usuario posible, primero separando tus interacciones entre gente joven y adulta para adpatar mejor las preguntas. Con la información que logres recolectar deberás identificar una categoría de perfil de inversionista del cliente. Las categorías son las siguientes:\nPreservacion de capital\nConservador\nModerado\nBalanceado\nCrecimiento\n\nLas preguntas base para lograr categorizar son las siguientes:\n¿Cuál es tu objetivo?\nFondo de emergencia, creacion de patrimonio o fondo de retiro\nsi la respuesta es fondo de emergencia puedes asumir que es una persona joven, con riesgos de inversion altos y capital de bajo a moderado, asi mismo busca una inversion a corto plazo, por lo tanto se categoriza como preservacion de capital\nSi la respuesta es patrimonio puedes asumir que tiene un capital mas alto y que sus riesgos de inversion son moderados, por lo tanto debes preguntar a que plazo le gustaria invertir, si es menos de 2 años es alguien conservador, si es mas de 2 años es alguien moderado.\nAhora bien, si la respuesta es retiro tienes que es balanceado o crecimiento, para decidir a cual de las categorias pertenece debes preguntar a que plazo desea invertir, si es de entre 3 y 5 años, es alguien balanceado, si es mas de 5 años tiene una resistencia alta al riesgo y pertenece a la categoria crecimiento, con un presupuesto elevado. Si crees que puedes obtener mejor información o de manera más asertiva con el cliente, puedes modificar las preguntas o hacer las tuyas propias. Si el tema se desvía deberás redirigirlo de vuelta. Sé super profesional, no te metas en temas sensibles o personales del usuario si así se torna la conversación. El formato de salida de texto deberá ser en formato json devolviendo dos campos: follow_up: texto que se le mostrará al usuario y category: la categoría a la que pertenece el usuario. las categorías deben seguir estrictamente el formato y valor especificado, de lo contrario el sistema fallará. SIEMPRE USA JSON, NO TEXTO PLANO.";
const SYSTEM_PROMPT = "Tu nombre es FinancIA. Eres un asesor financiero virtual. Debes hacer preguntas para obtener información del usuario y clasificarlo en perfiles de inversión: Preservacion de capital, Conservador, Moderado, Balanceado, Crecimiento. Base de categorización:\n\nObjetivo: Emergencia (presupone joven, alto riesgo, corto plazo: Preservacion de capital), Patrimonio (capital alto, riesgo moderado, plazo <2 años: Conservador, plazo >2 años: Moderado), Retiro (plazo 3-5 años: Balanceado, plazo >5 años: Crecimiento).\nPuedes ajustar o añadir preguntas. Mantén la conversación enfocada y evita temas sensibles.\nTus respuestas deben estar en json con: response (texto al usuario) y user_data siempre. En user_data guardarás toda la info disponible del usuario de entre estas categorias: name, age, investing_profile, country_state. Usa categorías exactamente como están, por ejemplo, investing profile solo puede ser los perfiles de inversión mencionados anteriormente colocados de manera textual: Preservacion de capital, Conservador, Moderado, Balanceado, Crecimiento. Si aún no tienes datos coloca null. Haz lo mas posible por recabar estos datos en las preguntas.";
const MODEL = "gpt-4-0613";
const SYSTEM_OBJECT = { role: "system", content: SYSTEM_PROMPT };

let messages = [SYSTEM_OBJECT];

const flowVoice = addKeyword(EVENTS.VOICE_NOTE)
  .addAction(async (context, {flowDynamic, provider}) => {
    const sock = await provider.getInstance();
    await sock.sendPresenceUpdate("available", context.key.remoteJid);
    await sock.sendPresenceUpdate("recoding", context.key.remoteJid);
    const body = await handlerAI(context);
    messages.push({ role: "user", content: body });
    if(messages.length > 10){
      messages = messages.slice(2)
      messages.unshift({ role: "system", content: SYSTEM_PROMPT });
    }
    const chatCompletion = await openai.chat.completions.create({
      messages: messages,
      model: MODEL,
    });
    const text  = chatCompletion.choices[0].message.content;
    messages.push({ role: "assistant", content: text });
    const responseJson = JSON.parse(text);
    console.log(responseJson.user_data);
    let hasNull = false;
    for (const key in responseJson.user_data) {
      if (responseJson.user_data[key] === null) {
        hasNull = true;
      }
    }
    if(!hasNull){
      // Send request to neural network
      console.log("Sending request to neural network");
      const response = await fetch('http://10.22.131.156:3001/calculateScore?investor_profile='+responseJson.user_data.investing_profile, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      console.log(data.recomendations);
      messages.push({ role: "system", content: "Estas son las recomendaciones de inversion: " + data.recomendations + ". Cierra la conversacion diciendo el resultado del perfil de inversionista del usuario y menciona las recomendaciones de inversiones." });

      const chatCompletionClosing = await openai.chat.completions.create({
        messages: messages,
        model: MODEL,
      });
      const textClosing  = chatCompletionClosing.choices[0].message.content;
      messages.push({ role: "assistant", content: textClosing });
      const responseJsonClosing = JSON.parse(textClosing);
      await flowDynamic(responseJsonClosing.response)
      messages = messages.slice(0,2)
      return;
    }
    const path = await textToVoice(responseJson.response);
    await flowDynamic([{body:"🔊",media: path}])
    await sock.sendPresenceUpdate("available", context.key.remoteJid);
  });

  const flowPrincipal = addKeyword(EVENTS.WELCOME)
  .addAction(async (context, {flowDynamic }) => {
    messages.push({ role: "user", content: context.body });
    if(messages.length > 10){
      messages = messages.slice(2)
      messages.unshift({ role: "system", content: SYSTEM_PROMPT });
    }
    const chatCompletion = await openai.chat.completions.create({
      messages: messages,
      model: MODEL,
    });
    const text  = chatCompletion.choices[0].message.content;
    messages.push({ role: "assistant", content: text });
    const responseJson = JSON.parse(text);
    console.log(responseJson.user_data);
    let hasNull = false;
    for (const key in responseJson.user_data) {
      if (responseJson.user_data[key] === null) {
        hasNull = true;
      }
    }
    if(!hasNull){
      // Send request to neural network
      console.log("Sending request to neural network");
      const response = await fetch('http://10.22.131.156:3001/calculateScore?investor_profile='+responseJson.user_data.investing_profile, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      console.log(data.recomendations);
      messages.push({ role: "system", content: "Estas son las recomendaciones de inversion: " + data.recomendations + ". Cierra la conversacion diciendo el resultado del perfil de inversionista del usuario y menciona las recomendaciones de inversiones." });

      const chatCompletionClosing = await openai.chat.completions.create({
        messages: messages,
        model: MODEL,
      });
      const textClosing  = chatCompletionClosing.choices[0].message.content;
      messages.push({ role: "assistant", content: textClosing });
      const responseJsonClosing = JSON.parse(textClosing);
      await flowDynamic(responseJsonClosing.response)
      messages = messages.slice(0,2)
      return;
    }
    const path = await textToVoice(responseJson.response);
    await flowDynamic([{body: "🔊",media: path}])
  });


const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowVoice, flowPrincipal ]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
