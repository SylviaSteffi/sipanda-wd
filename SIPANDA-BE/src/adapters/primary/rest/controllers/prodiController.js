export class ProdiController {
  constructor({
    getAllUseCase,
    getOneUseCase,
    createUseCase,
    updateUseCase,
    removeUseCase,
  }) {
    this.getAllUseCase = getAllUseCase;
    this.getOneUseCase = getOneUseCase;
    this.createUseCase = createUseCase;
    this.updateUseCase = updateUseCase;
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
      const data = await this.getOneUseCase.execute({ id: req.params.id });
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  create = async (req, res) => {
    try {
      //TODO: Add Required Field validation

      const data = await this.createUseCase.execute(req.body);
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  update = async (req, res) => {
    try {
      //TODO: Add Required Field validation

      const data = await this.updateUseCase.execute({
        id: req.params.id,
        ...req.body,
      });
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  remove = async (req, res) => {
    try {
      const data = await this.removeUseCase.execute({ id: req.params.id });
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };
}
