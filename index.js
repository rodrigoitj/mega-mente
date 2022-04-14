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

function getResponseFromAI(arg) {
    const completion = await openai.createCompletion("text-davinci-002", {
        prompt: generatePrompt(req.body.animal),
        temperature: 0.6,
    });
}

function generatePrompt(pergunta) {
    return `No contexto de um MMORPG, ${pergunta}`;
}

function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot
  const [commandName, arg1] = msg.trim().split(" ");
  if (commandName === "!megamente") {
    var phrase = getResponseFromAI(arg1);
    if (phrase) {
      client.say(target, `${phrase}`);
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`, user, channels[user]);
}
