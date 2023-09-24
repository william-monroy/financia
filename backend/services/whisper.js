const fs = require("fs");
const { OpenAI} = require("openai");

/**
 *
 * @param {*} path url mp3
 */
const voiceToText = async (path) => {
  if (!fs.existsSync(path)) {
    throw new Error("No se encuentra el archivo");
  }

  try {

    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    // answer in spanish

    const resp = await openai.audio.transcriptions.create({
        file: fs.createReadStream(path),
        language: "es",
        model: "whisper-1",
      });

    return resp.text;
  } catch (err) {
    console.log(err);
    return "ERROR";
  }
};

module.exports = { voiceToText };