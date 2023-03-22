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
            "content": message,
            "isContinuation": true
          }
        ],
        max_tokens:1024,
        temperature:0.4
      }),
    });
    if (!response.ok) {
      throw new Error(`API response error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (e) {
    console.error(e);
    return "请再问我一次吧";
  }
}

export {sendMessage};