import chat from "../../Services/Chat/chat.js";

const chatController = async (req, res) => {
  const { query } = req.body;

  try {
    const result = await chat(query);

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export default chatController;
