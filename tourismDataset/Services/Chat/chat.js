import dotenv from "dotenv";

import openai from "../../Models/openai.js";
import { getJson } from "serpapi";

dotenv.config();

const chat = async (query) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful tourist assistant who can answer any question related to toursim and travel and you are designed to output JSON.
          Output should be in this JSON format : {data: [{query:"user query" ,title: "content of the user query. If no result, return N/A.", description: "Detailed description and experience of the place mentioned in the query", address: "Address of the place mentioned in the query. In case of no result, return N/A.", categories: "All tags related to the place. If no categories or tags available, return N/A", website: "website of the place mentioned in the query. It is important and you have to give the website. If no website is available, return N/A"]}
          If the query answer contains multiple answers, provide each answer completely. For example, if the query asks for 10 answers provide 10 answers, if query asks for 50 answers provide 50 answers.`,
        },
        { role: "user", content: query },
      ],
      model: "gpt-4-1106-preview",
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(completion.choices[0].message.content).data;

    const imagesPromises = data.map(async (item) => {
      const imageTitle = `${item.title} ${item.address}`;
      const json = await getJson({
        q: imageTitle,
        engine: "google_images",
        ijn: "0",
        api_key: process.env.SERPAPI_KEY,
      });
      item.image = json?.images_results[0]?.original;
      return item;
    });

    await Promise.all(imagesPromises);

    // let imageTitle =
    //   JSON.parse(completion.choices[0].message.content).data[0].title +
    //   " " +
    //   JSON.parse(completion.choices[0].message.content).data[0].address;

    // const json = await getJson({
    //   q: imageTitle,
    //   engine: "google_images",
    //   ijn: "0",
    //   api_key: process.env.SERPAPI_KEY,
    // });

    // const data = JSON.parse(completion.choices[0].message.content).data;
    // data[0].image = json?.images_results[0]?.original;

    return JSON.stringify({ data: data });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default chat;
