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
    
    const ingredientsInsert = ingredients.map(name => {
      return {
        dish_id: id,
        name
      }
    })

    await knex("dishes").where({ id }).update({ image: dish.image, name: dish.name, price: dish.price, description: dish.description, category: dish.category});

    await knex("ingredients").where({ dish_id: id }).delete();
    await knex("ingredients").insert(ingredientsInsert);

    return response.json();
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

  async delete(request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.json();
  } 

  async index(request, response) {
    const { name, ingredient } = request.query;

    if (name) {
      return response.json(await knex("dishes").whereLike("name", `%${name}%`).orderBy("name"))
    }

    if (ingredient) {
      return response.json(await knex("ingredients").whereLike("name", `%${ingredient}%`).orderBy("name"))
    }

    return response.json(await knex("dishes").orderBy("name"))

  }
}

module.exports = DishesController;