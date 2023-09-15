const { Router } = require("express");

const DishesController = require("../controllers/DishesController");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const verifyIsAdmin = require("../middlewares/verifyIsAdmin");

const dishesRouter = Router();

const dishesController = new DishesController();

dishesRouter.use(ensureAuthenticated)

dishesRouter.post("/:user_id", verifyIsAdmin, dishesController.create);
dishesRouter.put("/:id", verifyIsAdmin, dishesController.update);
dishesRouter.get("/:id", dishesController.show);
dishesRouter.delete("/:id", dishesController.delete);
dishesRouter.get("/", dishesController.index);

module.exports = dishesRouter;
