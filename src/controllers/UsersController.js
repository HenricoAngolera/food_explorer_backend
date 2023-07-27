const AppError = require("../utils/AppError")

class UsersController {
  create(request, response) {
    const { name, email, password } = request.body;

    if (!name || name === " ") {
      throw new AppError("O nome é obrigatório!")
    }

    return response.status(201).json({ name, email, password });
  }
}

module.exports = UsersController;