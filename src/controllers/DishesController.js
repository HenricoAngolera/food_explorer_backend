const knex = require("../database/knex");

class DishesController{
  async create(request, response) {
    const { image, name, price, description, category, ingredients } = request.body;
    const { user_id } = request.params;

    const [dish_id] = await knex("dishes").insert({
      image,
      name,
      price,
      description,
      category,
      user_id
    });

    console.log(dish_id)

    const ingredientsInsert = ingredients.map(ingredient => {
      return {
        name: ingredient,
        dish_id
      }
    });

    await knex("ingredients").insert(ingredientsInsert);

    return response.status(201).json();
  }

  async update(request, response) {
    const { image, name, price, description, category, ingredients } = request.body;
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();

    if (!dish) {
      throw new AppError("Alimento não encontrado.");
    }

    dish.image = image ?? dish.image;
    dish.name = name ?? dish.name;
    dish.price = price ?? dish.price;
    dish.description = description ?? dish.description;
    dish.category = category ?? dish.category;
    
    // conferir o id do prato ligado aos ingredientes.

    // verificar ingredientes apagados.

    // verificar ingredientes novos incluidos.

    // fazer a lista dos ingredientes novos || apagados

    // mandar para o banco de dados.

    return;
  }

  async show(request, response) {
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();

    const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

    return response.json({
      ...dish,
      ingredients
    });
  }
}

module.exports = DishesController;