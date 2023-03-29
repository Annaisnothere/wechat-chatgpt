import { WechatyBuilder } from "wechaty";
import { Wechaty } from 'wechaty';
import QRCode from "qrcode";
import { ChatGPTBot } from "./bot.js";
const chatGPTBot = new ChatGPTBot();

const bot =  WechatyBuilder.build({
  name: "wechat-assistant", // generate xxxx.memory-card.json and save login data for the next login
});
async function main() {
  const initializedAt = Date.now()
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
        await chatGPTBot.onMessage(message);
      } catch (e) {
        console.error(e);
      }
    });

  async function clearOldMessages(bot: Wechaty, seconds: number) {
    const messages = await bot.Message.findAll();
    const cutoffTime = new Date(Date.now() - seconds * 1000);
    
    for (const message of messages) {
      if (message.date() < cutoffTime) {
        await message.del();
        console.log(`Message "${message.text()}" has been cleared.`);
      }
    }
  }
  // Clear old messages every 3 minutes
  setInterval(async () => {
    await clearOldMessages(bot, 180); // 180 seconds = 3 minutes
  }, 3 * 60 * 1000); //  3 minutes

  try {
    await bot.start();
  } catch (e) {
    console.error(
      `⚠️ Bot start failed, can you log in through wechat on the web?: ${e}`
    );
  }
}
main();
