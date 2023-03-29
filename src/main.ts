import { WechatyBuilder } from "wechaty";
import { Wechaty, Message } from 'wechaty';
import QRCode from "qrcode";
import { ChatGPTBot } from "./bot.js";

const chatGPTBot = new ChatGPTBot();
const messageCache = new Map();
const bot = WechatyBuilder.build({
  name: "wechat-assistant", // generate xxxx.memory-card.json and save login data for the next login
});
async function main() {
  const initializedAt = Date.now();
  bot
    .on("scan", async (qrcode, status) => {
      const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`;
      console.log(`Scan QR Code to login: ${status}\n${url}`);
      console.log(
        await QRCode.toString(qrcode, { type: "terminal", small: true })
      );
    })
    .on("login", async (user) => {
      console.log(`User ${user} logged in`);
      chatGPTBot.setBotName(user.name());
    })
    .on("message", async (message) => {
      if (message.date().getTime() < initializedAt) {
        return;
      }
      if (message.text().startsWith("/ping")) {
        await message.say("pong");
        return;
      }
      try {
        await handleMessage(message);
      } catch (e) {
        console.error(e);
      }
    });

  try {
    await bot.start();
  } catch (e) {
    console.error(
      `⚠️ Bot start failed, can you log in through wechat on the web?: ${e}`
    );
  }
}

async function handleMessage(message: Message) {
  const messageId = message.id;
  const messageDate = message.date();
  messageCache.set(messageId, messageDate);

  // Handle message with ChatGPTBot
  await chatGPTBot.onMessage(message);

  // 4 hours clean once
  clearOldMessagesFromCache(4 * 60 * 60);  
}

function clearOldMessagesFromCache(seconds: number) {
  const cutoffTime = new Date(Date.now() - seconds * 1000);

  for (const [messageId, messageDate] of messageCache.entries()) {
    if (messageDate < cutoffTime) {
      messageCache.delete(messageId);
    console.log(`Message has been cleared from cache.`);
    // console.log(`Message "${messageId}" has been cleared from cache.`);
    }
  }
}

main();