const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class DishImageController {
  async update(request, response) {
    const { id }  = request.params;
    const user_id = request.user.id;
    const imageFilename = request.file.filename;

    const diskStorage = new DiskStorage();

    const user = await knex("users").where({ id: user_id }).first();

    if(!user) {
      throw new AppError("Only authenticated admins can change avatar", 401);
    }

    const dish = await knex("dishes").where({ id, user_id }).first();

    if(!dish) {
      throw new AppError("Food not found", 404);
    }

    if(dish.image) {
      await diskStorage.delete_file(dish.image);
    }

    const filename = await diskStorage.save_file(imageFilename);
    dish.image = filename;

    await knex("dishes").update(dish).where({ id });

    return response.json(dish);
  }
}

module.exports = DishImageController