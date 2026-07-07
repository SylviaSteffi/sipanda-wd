import { EmailAlreadyExistsException } from "../../../domain/exceptions/AuthException.js";

export class RegisterUseCase {
  constructor(userRepository, jwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async execute({
    nama,
    email,
    password,
    role,
    nidn,
    fakultas_id,
    prodi_id,
    no_hp,
    jabatan,
  }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing && existing.isActive())
      throw new EmailAlreadyExistsException();

    const password_hash = await this.jwtService.hashPassword(password);

    const user = await this.userRepository.create({
      nama,
      email,
      password_hash,
      role,
      nidn: nidn || null,
      fakultas_id: fakultas_id || null,
      prodi_id: prodi_id || null,
      no_hp: no_hp || null,
      jabatan: jabatan || null,
    });

    return user.toPublic();
  }
}
