const { Router } = require("express");
const {
  conversationMessage,
  message,
  hasReadMessage,
} = require("../controllers/message");

const router = Router();

/*
| CRUD Operation                           | HTTP Method   | Route                             |
|------------------------------------------|---------------|-----------------------------------|
| Fetch Messages from Current Conversation | GET           | /api/messages/:conversationId     |
| Fetch One Message                        | GET           | /api/message/:messageId           |
| Create New Message                       | POST          | /api/message                      |
*/

router.get("/messages/:conversationId", conversationMessage);
router.get("/message/:messageId", hasReadMessage);
router.post("/message", message);

module.exports = router;
