import {
  ConflictError,
  ValidationError,
} from "../../../../shared/errors/AppError.js";

const FIELD_LABELS = {
  user_id: "ID pengguna",
  tahap: "Tahap pengajuan",
  kategori: "Kategori pengajuan",
  akademik_id: "ID akademik",
};

function ensureRequired(value, fieldName) {
  const normalized = String(value || "").trim();

  if (!normalized) {
    const label = FIELD_LABELS[fieldName] || fieldName;
    throw ValidationError(`${label} wajib diisi.`);
  }

  return normalized;
}

class CreatePengajuanUseCase {
  constructor({ pengajuanRepository, dokumenRepository, dokumenService }) {
    this.pengajuanRepository = pengajuanRepository;
    this.dokumenRepository = dokumenRepository;
    this.dokumenService = dokumenService;
  }

  async execute(payload = {}) {
    const userId = ensureRequired(payload.user_id, "userId");
    const tahap = ensureRequired(payload.tahap, "tahap").toUpperCase();
    const kategori = ensureRequired(payload.kategori, "kategori").toUpperCase();
    const akademikId = ensureRequired(payload.akademik_id, "akademikId");

    const parentId = payload.parentId ? String(payload.parentId).trim() : null;
    const rootPengajuanId = payload.rootPengajuanId
      ? String(payload.rootPengajuanId).trim()
      : null;

    if (parentId && !rootPengajuanId) {
      throw ValidationError(
        "ID root pengajuan wajib diisi jika pengajuan memiliki parent.",
      );
    }

    if (rootPengajuanId) {
      // const rootExists =
      //   await this.pengajuanRepository.existsRootPengajuan(rootPengajuanId);
      // if (!rootExists) {
      //   throw ValidationError("ID root pengajuan tidak valid.");
      // }
    }

    const pengajuanPayload = {
      user_id: userId,
      parent_id: parentId,
      root_pengajuan_id: rootPengajuanId,
      anggota: payload.anggota,
      tahap,
      kategori,
      jenis_pengajuan: payload.jenis_pengajuan || "INDIVIDU",
      akademik_id: akademikId,
      detail: payload.detail || {},
      dokumen: payload.dokumen || [],
      klarifikasi: [],
      riwayat_status: [
        {
          status_lama: null,
          status_baru: "DIAJUKAN",
          user_id: userId,
          keterangan: "Pengajuan dibuat oleh dosen.",
          created_at: new Date().toISOString(),
        },
      ],
      tanggal_pengajuan: payload.tanggal_pengajuan || new Date().toISOString(),
    };

    if (
      parentId &&
      pengajuanPayload.root_pengajuan_id === pengajuanPayload.id
    ) {
      throw ConflictError(
        "Pengajuan turunan tidak boleh membentuk root pengajuan baru.",
      );
    }

    const preparedDokumen = this.dokumenService.validateAndPrepare(
      [].concat(payload.dokumen || []),
    );

    const newPengajuan =
      await this.pengajuanRepository.create(pengajuanPayload);

    const dokumen = await this.dokumenRepository.bulkCreateForPengajuan(
      newPengajuan.id,
      preparedDokumen,
    );

    // return pengajuan.toPersistence();
    return { ...newPengajuan, dokumen };
  }
}

export default CreatePengajuanUseCase;
