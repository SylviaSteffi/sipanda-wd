import { PengajuanRepositoryPort } from "../../../core/application/ports/PengajuanRepository.js";
import { PengajuanEntity } from "../../../core/domain/entities/Pengajuan.js";
import {
  Akademik,
  DetailKemajuanPenelitian,
  DetailKemajuanPKM,
  DetailPengesahanPenelitian,
  DetailPengesahanPKM,
  DetailPengesahanArtikel,
  DetailPengesahanBuku,
  DetailTugasPenelitian,
  DetailTugasPKM,
  DetailTugasPublikasi,
  Dokumen,
  Fakultas,
  Klarifikasi,
  Pengajuan,
  PengajuanAnggota,
  RiwayatStatus,
  User,
} from "../orm/index.js";
import { ValidationError } from "../../../shared/errors/AppError.js";
import Prodi from "../orm/Prodi.js";

const detailMap = {
  "PENELITIAN-TUGAS": {
    model: DetailTugasPenelitian,
    as: "detailTugasPenelitian",
  },
  "PENELITIAN-KEMAJUAN": {
    model: DetailKemajuanPenelitian,
    as: "detailKemajuanPenelitian",
  },
  "PENELITIAN-PENGESAHAN": {
    model: DetailPengesahanPenelitian,
    as: "detailPengesahanPenelitian",
  },
  "PKM-TUGAS": { model: DetailTugasPKM, as: "detailTugasPKM" },
  "PKM-KEMAJUAN": { model: DetailKemajuanPKM, as: "detailKemajuanPKM" },
  "PKM-PENGESAHAN": { model: DetailPengesahanPKM, as: "detailPengesahanPKM" },
  "ARTIKEL-TUGAS": { model: DetailTugasPublikasi, as: "detailTugasPublikasi" },
  "ARTIKEL-PENGESAHAN": {
    model: DetailPengesahanArtikel,
    as: "detailPengesahanArtikel",
  },
  "BUKU-PENGESAHAN": {
    model: DetailPengesahanBuku,
    as: "detailPengesahanBuku",
  },
};

const asToDetailType = Object.entries(detailMap).reduce(
  (acc, [key, { as }]) => {
    const [kategori, tahap] = key.split("-");
    acc[as] = `detail_${tahap.toLowerCase()}_${kategori.toLowerCase()}`;
    return acc;
  },
  {},
);

asToDetailType["detailTugasPublikasi"] = "detail_tugas_publikasi";

const allDetailIncludes = Object.values(detailMap).map(({ model, as }) => ({
  model,
  as,
  required: false,
}));

const pengajuanIncludes = [
  {
    model: User,
    as: "user",
    include: [
      { model: Fakultas, as: "fakultas" },
      { model: Prodi, as: "prodi" },
    ],
  },
  {
    model: Akademik,
    as: "akademik",
    attributes: ["akademik_id", "nama_akademik"],
  },
  {
    model: PengajuanAnggota,
    as: "anggota",
    include: [
      {
        model: User,
        as: "user",
        include: [
          { model: Fakultas, as: "fakultas" },
          { model: Prodi, as: "prodi" },
        ],
      },
    ],
  },
  { model: Dokumen, as: "dokumen" },
  { model: RiwayatStatus, as: "riwayatStatuses" },
  { model: Klarifikasi, as: "klarifikasis" },
  ...allDetailIncludes,
];

function getDetailConfig(kategori, tahap) {
  let lookupKey = `${kategori}-${tahap}`;
  if (lookupKey.startsWith("BUKU-") && !lookupKey.includes("PENGESAHAN")) {
    lookupKey = lookupKey.replace("BUKU-", "ARTIKEL-");
  }
  const config = detailMap[lookupKey];
  if (!config) {
    throw new ValidationError(
      `Detail configuration not found for: ${lookupKey}`,
    );
  }
  return config;
}

export class PengajuanRepository extends PengajuanRepositoryPort {
  #toEntity(r) {
    const detailAlias = Object.values(detailMap).find((config) => r[config.as]);
    const detailData = detailAlias ? r[detailAlias.as] : {};

    const detailType = detailAlias
      ? (asToDetailType[detailAlias.as] ?? null)
      : null;

    return new PengajuanEntity({
      pengajuan_id: r.pengajuan_id,
      user_id: r.user_id,
      parent_id: r.parent_id,
      root_pengajuan_id: r.root_pengajuan_id,
      nomor_urut_harian: r.nomor_urut_harian,
      tahap: r.tahap,
      kategori: r.kategori,
      jenis_pengajuan: r.jenis_pengajuan,
      akademik_id: r.akademik_id,

      status: r.status_pengajuan,

      tanggal_pengajuan: r.tanggal_pengajuan,
      tanggal_surat: r.tanggal_surat,
      nomor_surat: r.nomor_surat,
      catatan_admin: r.catatan_admin,
      created_at: r.created_at,
      updated_at: r.updated_at,

      detail: detailData,
      detail_type: detailType,
      user: r.user
        ? {
            ...r.user,
            fakultas: r.user.fakultas?.nama_fakultas ?? r.user.fakultas ?? null,
            prodi: r.user.prodi?.nama_prodi ?? r.user.prodi ?? null,
          }
        : null,
      dokumen: r.dokumen || [],
      riwayat_status: r.riwayatStatuses || [],
      klarifikasi: r.klarifikasis || [],
      anggota: (r.anggota || []).map((a) => ({
        ...a,
        nama: a.user?.nama ?? null,
        nidn: a.user?.nidn ?? null,
        email: a.user?.email ?? null,
        fakultas: a.user?.fakultas?.nama_fakultas ?? a.user?.fakultas ?? null,
        prodi: a.user?.prodi?.nama_prodi ?? a.user?.prodi ?? null,
      })),
    });
  }

  async findAll(query) {
    const { status, kategori, tahap, user_id } = query;
    const where = {};
    if (status) where.status_pengajuan = status;
    if (kategori) where.kategori = kategori;
    if (tahap) where.tahap = tahap;
    if (user_id) where.user_id = user_id;

    const data = await Pengajuan.findAll({
      where,
      include: pengajuanIncludes,
      order: [["created_at", "DESC"]],
    });
    return data.map((r) => this.#toEntity(r.toJSON()));
  }

  async findOne(id) {
    const record = await Pengajuan.findOne({
      where: { pengajuan_id: id },
      include: pengajuanIncludes,
    });
    return this.#toEntity(record.toJSON());
  }

  async findOneByKode(kode) {
    const record = await Pengajuan.findOne({ where: { kode_prodi: kode } });
    return this.#toEntity(record);
  }

  async create(dto) {
    const { anggota, detail, ...pengajuanBody } = dto;

    const record = await Pengajuan.create(pengajuanBody);

    if (anggota?.length) {
      const anggotaData = anggota.map((a) => {
        delete a.id;
        return { ...a, pengajuan_id: record.pengajuan_id };
      });
      await PengajuanAnggota.bulkCreate(anggotaData);
    }

    if (!record.root_pengajuan_id && record.tahap === "TUGAS") {
      record.root_pengajuan_id = record.pengajuan_id;
      await record.save();
    }

    if (detail) {
      if (!!detail.no_surat_tugas) {
        const findLastPengajuan = await Pengajuan.findOne({
          where: { nomor_surat: detail.no_surat_tugas },
        });

        if (findLastPengajuan) {
          record.parent_id = findLastPengajuan.pengajuan_id;
          record.root_pengajuan_id = findLastPengajuan.root_pengajuan_id;
          await record.save();
        }
      }

      const detailConfig = getDetailConfig(record.kategori, record.tahap);
      await detailConfig.model.create({
        ...detail,
        pengajuan_id: record.pengajuan_id,
      });
    }

    // Log initial status
    await RiwayatStatus.create({
      pengajuan_id: record.pengajuan_id,
      user_id: record.user_id,
      status_lama: null,
      status_baru: record.status_pengajuan,
      keterangan: "Pengajuan dibuat",
    });

    return await this.findOne(record.dataValues.pengajuan_id);
  }

  async update(id, dto, updatedById) {
    const record = await Pengajuan.findByPk(id);

    const { detail, klarifikasi, ...body } = dto;
    const statusLama = record.status_pengajuan;
    const statusBaru = body.status_pengajuan;

    await record.update(body);

    if (detail) {
      const detailConfig = getDetailConfig(record.kategori, record.tahap);
      await detailConfig.model.upsert({
        ...detail,
        pengajuan_id: record.pengajuan_id,
      });
    }

    if (klarifikasi) {
      for (const klarif of klarifikasi) {
        await Klarifikasi.upsert({
          klarifikasi_id:
            klarif.klarifikasi_id > 0 ? klarif.klarifikasi_id : undefined,
          pengajuan_id: record.pengajuan_id,
          pesan_admin: klarif.pesan_admin,
          waktu_minta: klarif.waktu_minta,
          status_klarifikasi: klarif.status_klarifikasi,
          pesan_dosen: klarif.pesan_dosen,
          waktu_jawab: klarif.waktu_jawab,
        });
      }
    }

    const statusChangesMessage = {
      DIAJUKAN: "Dosen mengirim perbaikan klarifikasi",
      DALAM_PEMERIKSAAN: "Admin mulai memeriksa pengajuan.",
      PERLU_KLARIFIKASI: "Admin mengirim klarifikasi.",
      DISETUJUI: "Pengajuan disetujui.",
      DITOLAK: `Pengajuan ditolak. Alasan: ${body.catatan_admin || "Tidak ada alasan"}.`,
      SELESAI: `Surat final diunggah.`,
    };

    if (statusBaru && statusBaru !== statusLama) {
      await RiwayatStatus.create({
        pengajuan_id: record.pengajuan_id,
        user_id: updatedById ?? record.user_id,
        status_lama: statusLama,
        status_baru: statusBaru,
        keterangan: statusChangesMessage[statusBaru] || null,
      });
    }

    if (statusBaru === "SELESAI" && body.nomor_surat) {
      const parts = String(body.nomor_surat).split(".");
      const urutanRaw = parts[2]
        ? parts[2].split("/")[0].trim().toUpperCase()
        : null;
      if (urutanRaw && /^[A-Z]$/.test(urutanRaw)) {
        await record.update({ nomor_urut_harian: urutanRaw });
      }
    }

    return this.findOne(record.pengajuan_id);
  }

  async updateStatus(id, status) {
    const record = await Pengajuan.findByPk(id);
    if (!record) return null;
    await record.update({ status_pengajuan: status });
    return this.#toEntity(record.dataValues);
  }

  async remove(id) {
    const record = await Pengajuan.findByPk(id);
    if (!record) return null;
    await record.destroy();
  }
}
