import {config} from "./config.js";



let apiKey = config.openai_api_key;
let model = config.model;
let prompt = config.prompt;
const sendMessage = async (message: string) => {
  try {
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            "role": "system",
            "content": prompt
          },
          {
            "role": "user",
            "content": message
          }
        ],
        max_tokens:256,
        temperature:0.4
      }),
    });
    
    return response.json()
      .then((data) => data.choices[0].message.content);
  } catch (e) {
    console.error(e)
    return "请再问我一次吧"
  }
}

export {sendMessage};