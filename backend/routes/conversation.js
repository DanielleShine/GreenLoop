const { Router } = require("express");
const {
  conversation,
  userConversation,
} = require("../controllers/conversation");

const router = Router();

/*
| CRUD Operation            | HTTP Method  | Route                       |
|---------------------------|--------------|-----------------------------|
| Create Conversation       | POST         | /api/conversations          |
| Fetch User's Conversation | GET          | /api/conversationsign-in    |
*/

router.post("/conversations", conversation);
router.get("/conversations/:userId", userConversation);

module.exports = router;
