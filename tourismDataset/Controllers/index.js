import express from "express";

import chatWithDatasetController from "./Chat/chatWithDataset.js";
import chatController from "./Chat/chat.js";

const router = express.Router();

router.post("/chatWithDataset", chatWithDatasetController);
router.post("/chat", chatController);

export default router;
