import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    let messages = [
      {
        role: "system",
        content:
          "You have to make three very short useful questions based on the user messages you will receive; it will be 1 to 3 user messages, if the messages are more than 1, then the instructions are that you read all the questions and if all the questions are revolving around one topic, then you have to make questions in relevance to that topic, and if the questions are revolving around different topics, then you have to make questions based on the last message to show the relevant questions to the user; make your best decision on this part; and don't be like you give one question in relevance to first message, and 2nd question in relevance to 2nd message; no, it has to be of generice nature and best possible questions that the user would want to ask based on all the messages sent by the user. And don't mention anything else, just make the different questions separated with \n (new line) and don't give numbering to those 3 questions. And make sure you don't give your own questions to the user, just make the questions that you believe the user would want to ask you about. And just for the safe passage, suppose if the user messages has no meaningful content that no quesions can be derived from; then just write random three questions on any interesting topic. Now that you've read all the instructions, next you will receive the user messages.",
      },
    ];
    if (prompt.firstMessage) {
      messages.push({
        role: "user",
        content: prompt.firstMessage,
      });
    }
    if (prompt.secondMessage) {
      messages.push({
        role: "user",
        content: prompt.secondMessage,
      });
    }
    if (prompt.thirdMessage) {
      messages.push({
        role: "user",
        content: prompt.thirdMessage,
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k-0613",
      messages: [
        ...messages,
        {
          role: "system",
          content:
            "Now that you've got the user messages too, you have to make the questions based on the user messages, just make the different questions separated with \n (new line) and don't give numbering to those 3 questions. Avoid introductory or leading sentences; provide the questions directly. And make sure you don't give your own questions to the user, just make the questions that you believe the user would want to ask you about.",
        },
      ],
    });
    res.status(200).json(response.choices[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
