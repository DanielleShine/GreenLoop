const { Router } = require("express");
const {
  fetchUser,
  fetchUsers,
  deleteUser,
  updateProfile,
} = require("../controllers/user");

const router = Router();

/*
| CRUD Operation     | HTTP Method | Route              |
|--------------------|-------------|--------------------|
| Retrieve All Users | GET         | /api/users/        |
| Retrieve One User  | GET         | /api/:userId       |
| Update User        | POST        | /api/users/:id     |
| Delete User        | DELETE      | /api/users/:id     |
*/

router.get("/users", fetchUsers);
router.get("/users/:userId", fetchUser);
router.put("/users/:userId", updateProfile);
router.delete("/users/:userId", deleteUser);

module.exports = router;
