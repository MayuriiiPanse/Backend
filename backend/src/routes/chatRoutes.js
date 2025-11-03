const router = require("express").Router();
const { auth } = require("../middleware/authMiddleware");
const ctrl = require("../controllers/chatController");

router.get("/by-food/:foodId", auth, ctrl.getByFood);

module.exports = router;
