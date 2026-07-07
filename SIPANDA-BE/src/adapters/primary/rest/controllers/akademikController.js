export class AkademikController {
  constructor({
    getAllUseCase,
    getUseCase,
    createUseCase,
    updateUseCase,
    deactivateUseCase,
  }) {
    this.getAllUseCase = getAllUseCase;
    this.getUseCase = getUseCase;
    this.createUseCase = createUseCase;
    this.updateUseCase = updateUseCase;
    this.deactivateUseCase = deactivateUseCase;
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
      const data = await this.getUseCase.execute({ id: req.params.id });
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  create = async (req, res) => {
    try {
      const { kode_akademik, nama_akademik } = req.body;
      if (!kode_akademik || !nama_akademik)
        return res
          .status(400)
          .json({ message: "kode akademik dan nama akademik wajib diisi!" });

      const data = await this.createUseCase.execute(req.body);
      return res.status(201).json({ message: "Akademik created", data });
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
      return res
        .status(200)
        .json({ message: "Akademik berhasil disunting!", data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  deactivate = async (req, res) => {
    try {
      const result = await this.deactivateUseCase.execute({
        id: req.params.id,
      });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };
}
