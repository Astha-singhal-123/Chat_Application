const { register, login, contacts, newchats, sendmsg } = require("../handlers/userHandler");

const router=require("express").Router();
router.post("/register",register);
router.post("/login",login);
router.get("/contacts/:id",contacts);
router.post("/newchats",newchats);
router.post("/sendmsg",sendmsg);
module.exports = router;