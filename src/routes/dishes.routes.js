const { Router } = require("express");

const DishesController = require("../controllers/DishesController");

const dishesRouter = Router();

const dishesController = new DishesController();

dishesRouter.post("/:user_id", dishesController.create);
dishesRouter.put("/:id", dishesController.update);
dishesRouter.get("/:id", dishesController.show);

module.exports = dishesRouter;
