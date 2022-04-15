require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const tmi = require("tmi.js");
const channels = require("./streamers");
const credentials = require("./credentials");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

let [, , user] = process.argv;
user = user || process.env.BOT_USERNAME;
const opts = {
  identity: credentials[user],
  channels: channels[user],
};

const client = new tmi.client(opts);
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);
client.connect();

async function getResponseFromAI(arg) {
  const completion = await openai.createCompletion("text-davinci-002", {
    prompt: generatePrompt(arg),
    temperature: 0,
    max_tokens: 100,
  });
  console.log(completion.data.choices);
  return completion.data.choices[0].text.trim();
}

function generatePrompt(pergunta) {
  //return `${pergunta}`.trim();
  return `No contexto de um MMORPG, ${pergunta}`;
}

async function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot
  const fullMsg = msg.trim().split(" ");
  const commandName = fullMsg[0];
  const arg1 = fullMsg.slice(1).join(" ");
  if (commandName === "!megamente") {
    var phrase = await getResponseFromAI(arg1);
    if (phrase) {
      client.say(target, `${phrase}`);
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`, user, channels[user]);
}
