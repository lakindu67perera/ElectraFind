const {Router} = require('express');
const controller = require('./src/students/controller');

const router = Router();

router.get("/", controller.getUsers);
router.get("/:id",controller.getUserById);
router.post("/",controller.addUser);
router.put("/:id",controller.updateUser);
router.delete("/:id",controller.removeUser);

module.exports = router;