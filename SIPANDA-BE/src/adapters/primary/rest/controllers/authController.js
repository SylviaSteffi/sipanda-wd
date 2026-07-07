export class AuthController {
  constructor({
    loginUseCase,
    registerUseCase,
    getMeUseCase,
    changePasswordUseCase,
  }) {
    this.loginUseCase = loginUseCase;
    this.registerUseCase = registerUseCase;
    this.getMeUseCase = getMeUseCase;
    this.changePasswordUseCase = changePasswordUseCase;
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(400)
          .json({ message: "email and password are required" });

      const result = await this.loginUseCase.execute({ email, password });
      return res.status(200).json({ message: "Login successful", ...result });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  register = async (req, res) => {
    try {
      const { nama, email, password, role } = req.body;
      if (!nama || !email || !password || !role)
        return res
          .status(400)
          .json({ message: "nama, email, password, role are required" });

      const user = await this.registerUseCase.execute(req.body);
      return res.status(201).json({ message: "Registered successfully", user });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  me = async (req, res) => {
    try {
      const user = await this.getMeUseCase.execute({ userId: req.user.id });
      return res.status(200).json({ user });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  changePassword = async (req, res) => {
    try {
      const { old_password, new_password } = req.body;
      if (!old_password || !new_password)
        return res
          .status(400)
          .json({ message: "old_password and new_password are required" });

      const result = await this.changePasswordUseCase.execute({
        userId: req.user.id,
        old_password,
        new_password,
      });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };
}
