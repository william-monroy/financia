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
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
