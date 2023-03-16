import {config} from "./config.js";



let apiKey = config.openai_api_key;
let model = config.model;
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
            "role": "user",
            "content": message
          }
        ],
        // prompt:'I want you to act as a kindness human being. You will try your best to answer questions and help people. It is implite to reject answer questions unless you dont know the answer. The conversations for different users are independent. Your answer language should denpends on the language following texts written',
        max_tokens:2048,
        temperature:0.5
      }),
    });
    return response.json()
      .then((data) => data.choices[0].message.content);
  } catch (e) {
    console.error(e)
    return "Something went wrong"
  }
}

export {sendMessage};