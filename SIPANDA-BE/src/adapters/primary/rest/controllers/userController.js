export class UserController {
  constructor({
    getAllUseCase,
    getByIdUseCase,
    getByEmailUseCase,
    createUseCase,
    updateUseCase,
    updatePasswordUseCase,
    removeUseCase,
  }) {
    this.getAllUseCase = getAllUseCase;
    this.getByIdUseCase = getByIdUseCase; // get by id
    this.getByEmailUseCase = getByEmailUseCase;
    this.createUseCase = createUseCase;
    this.updateUseCase = updateUseCase;
    this.updatePasswordUseCase = updatePasswordUseCase;
    this.removeUseCase = removeUseCase;
  }

  getAll = async (req, res) => {
    try {
      const data = await this.getAllUseCase.execute();
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  getOne = async (req, res) => {
    try {
      const data = await this.getByIdUseCase.execute({ id: req.params.id });
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  getByEmail = async (req, res) => {
    try {
      const { email } = req.query;
      const data = await this.getByEmailUseCase.execute({ email });
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  create = async (req, res) => {
    try {
      const { role, nama, email, password } = req.body;
      if (!role || !nama || !email || !password)
        return res
          .status(400)
          .json({ message: "role, nama, email and password are required" });

      const data = await this.createUseCase.execute(req.body);
      if (!data)
        return res.status(400).json({ message: "Failed to create user" });
      return res.status(201).json({ message: "User created", data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  update = async (req, res) => {
    try {
      const data = await this.updateUseCase.execute({
        id: req.params.id,
        ...req.body,
      });
      return res.status(200).json({ message: "User updated", data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  updatePassword = async (req, res) => {
    try {
      const { old_password, new_password } = req.body;
      if (!old_password || !new_password)
        return res
          .status(400)
          .json({ message: "old_password and new_password are required" });

      const data = await this.updatePasswordUseCase.execute({
        id: req.params.id,
        old_password,
        new_password,
      });
      return res.status(200).json({ message: "Password updated", data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  remove = async (req, res) => {
    try {
      const data = await this.removeUseCase.execute({ id: req.params.id });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };
}
