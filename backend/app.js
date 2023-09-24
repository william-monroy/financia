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
const { handlerAI } = require("./utils");
const { textToVoice } = require("./services/eventlab");
const { init } = require("bot-ws-plugin-openai");

// Plugin para determinar rol y personalidad del                      gb empleado
const employeesAddonConfig = {
  model: "gpt-3.5-turbo",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
};
const employeesAddon = init(employeesAddonConfig);

const flowVoiceNote = addKeyword(EVENTS.VOICE_NOTE).addAction(
  async (ctx, ctxFn) => {
    await ctxFn.flowDynamic("dame un momento para escucharte...🙉");
    console.log("🤖 voz a texto....");
    const text = await handlerAI(ctx);
    console.log(`🤖 Fin voz a texto....[TEXT]: ${text}`);

    const empleado = await employeesAddon.determine(text); //TODO<===
    employeesAddon._gotoFlow(empleado, ctxFn);
  }
);

const flowSecundario = addKeyword(EVENTS.WELCOME).addAnswer([
  "📄 Aquí tenemos el flujo donde se responderá con audio",
]);

const flowEncuesta = addKeyword("1", "ENCUESTA", { sensitive: true })
  .addAnswer(
    [
      "La vida es como montar en bicicleta. Para mantener el equilibrio, debes seguir adelante.\n_- Albert Einstein_",
      "📝 *¿Cuáles son tus metas financieras?*",
    ],
    { capture: true },
    async (ctx, { fallBack }) => {
      const { body } = ctx;
      console.log(body);
      // TODO: Guardar y evaluar las respuestas
    }
  )
  .addAnswer(
    "📝 *¿Cuánto tiempo quieres invertir?*",
    { capture: true },
    async (ctx, { fallBack }) => {
      const { body } = ctx;
      console.log(body);
      // TODO: Guardar y evaluar las respuestas
    }
  )
  .addAnswer(
    [
      "Gracias por tus respuestas, ahora te enviaré un mensaje con las opciones de inversión que tenemos para ti.",
    ],
    null,
    null,
    [flowSecundario]
  );

const flowDudas = addKeyword(["2", "dudas", "informacion"]).addAnswer(
  ["🙋 ¿Cuál es tu duda?"],
  null,
  null,
  [flowSecundario]
);

const flowPrincipal = addKeyword(["hola", "ole", "alo"])
  .addAnswer(
    "🙌 Hola bienvenido a 🌱*FinancIA*💰\n\n_Sere tu agente personal de acompañamiento de inversión. 🤝_"
  )
  .addAnswer(["*¿Cómo puedo aydudarte?*", ""], null, null, [
    flowEncuesta,
    flowDudas,
  ]);

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowVoiceNote, flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  const employees = [
    {
      name: "EMPLEADO_ASESOR_INVERSIONES",
      description:
        "Soy Rob el vendedor amable encargado de atentender si tienes intencion de invertir en algun fondo de inversión o producto, mis respuestas son breves. Envia 1-3 emojis:🤖 🚀 🤔",
      flow: flowEncuesta,
    },
    {
      name: "EMPLEADO_ATENCION_CLIENTE",
      description:
        "Soy Steffany eencargada de responder las dudas que tegnas acerca de FinanceIA, mis respuestas son breves.",
      flow: flowPrincipal,
    },
  ];

  employeesAddon.employees(employees);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
