import fs from "fs";
import csvWriter from "csv-writer";
import chat from "../../Services/Chat/chat.js";

const chatWithDatasetController = async (req, res) => {
  const { query } = req.body;
  let rawdata = fs.readFileSync("allCountriesInfo.json");
  let dataset = JSON.parse(rawdata);
  try {
    const results = [];
    const writer = csvWriter.createObjectCsvWriter({
      path: "data.csv",
      header: [
        { id: "query", title: "Query" },
        { id: "title", title: "Title" },
        { id: "description", title: "Description" },
        { id: "address", title: "Address" },
        { id: "categories", title: "Categories" },
        { id: "website", title: "Website" },
        { id: "image", title: "Image" },
      ],
    });

    for (const country of dataset) {
      const countryResult = await chat(country.name + "," + query);
      results.push(JSON.parse(countryResult).data[0]);

      for (const state of country.states) {
        const stateResult = await chat(state.name + "," + query);
        results.push(JSON.parse(stateResult).data[0]);

        for (const city of state.cities) {
          const cityResult = await chat(city + "," + query);
          results.push(JSON.parse(cityResult).data[0]);
        }
      }
    }

    /////////////////////////////* Below is the code for testing which includes Country Pakistan and its state Azad Kashmir */////////////////////////

    // const pakistan = dataset.find((country) => country.name === "Pakistan");

    // if (pakistan) {
    //   // Process Pakistan
    //   const pakistanResult = await chat("Pakistan," + query);
    //   results.push(JSON.parse(pakistanResult).data[0]);

    //   // Find Azad Kashmir in the states of Pakistan
    //   const azadKashmir = pakistan.states.find(
    //     (state) => state.name === "Azad Kashmir"
    //   );

    //   if (azadKashmir) {
    //     // Process Azad Kashmir
    //     const azadKashmirResult = await chat("Azad Kashmir," + query);
    //     results.push(JSON.parse(azadKashmirResult).data[0]);
    //   }
    // }

    await writer.writeRecords(results);

    res.status(200).send(results);
    // res.status(200).sendFile("data.csv", { root: "." });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export default chatWithDatasetController;
