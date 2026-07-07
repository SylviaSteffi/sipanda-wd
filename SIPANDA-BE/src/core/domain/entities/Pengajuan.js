import { randomUUID } from "node:crypto";
import {
  PENGAJUAN_STATUS,
  canTransitionPengajuanStatus,
  ensureValidPengajuanStatus,
} from "../value-objects/PengajuanStatus.js";
import {
  clonePlainArray,
  normalizeArray,
  normalizeNullableString,
  normalizeRequiredString,
  nowIsoString,
} from "../../../shared/utils/mapper.js";

const FIELD_LABELS = {
  pengajuan_id: "ID pengajuan",
  user_id: "ID pengguna",
  tahap: "Tahap pengajuan",
  kategori: "Kategori pengajuan",
  jenis_pengajuan: "Jenis pengajuan",
  akademik_id: "ID akademik",
  tanggal_pengajuan: "Tanggal pengajuan",
  created_at: "Tanggal dibuat",
  updated_at: "Tanggal diperbarui",
  nomor_surat: "Nomor surat",
  tanggal_surat: "Tanggal surat",
};

export class PengajuanEntity {
  constructor({
    pengajuan_id,
    user_id,
    parent_id = null,
    root_pengajuan_id = null,
    nomor_urut_harian = null,
    tahap,
    kategori,
    jenis_pengajuan = "INDIVIDU",
    akademik_id,
    status = PENGAJUAN_STATUS.DIAJUKAN,
    tanggal_pengajuan = nowIsoString(),
    tanggal_surat = null,
    nomor_surat = null,
    catatan_admin = null,
    detail = {},
    detail_type,
    dokumen = [],
    klarifikasi = [],
    riwayat_status = [],
    created_at = nowIsoString(),
    updated_at = nowIsoString(),
    user,
    anggota,
  }) {
    this.id = normalizeRequiredString(
      pengajuan_id,
      "pengajuan_id",
      FIELD_LABELS,
    );
    this.user_id = normalizeRequiredString(user_id, "user_id", FIELD_LABELS);
    this.parent_id = normalizeNullableString(parent_id);
    this.root_pengajuan_id =
      normalizeNullableString(root_pengajuan_id) || this.id;
    this.nomor_urut_harian = normalizeNullableString(nomor_urut_harian);
    this.tahap = normalizeRequiredString(
      tahap,
      "tahap",
      FIELD_LABELS,
    ).toUpperCase();
    this.kategori = normalizeRequiredString(
      kategori,
      "kategori",
      FIELD_LABELS,
    ).toUpperCase();
    this.jenis_pengajuan = normalizeRequiredString(
      jenis_pengajuan,
      "jenis_pengajuan",
      FIELD_LABELS,
    ).toUpperCase();
    this.akademik_id = normalizeRequiredString(
      akademik_id,
      "akademik_id",
      FIELD_LABELS,
    );
    this.status = ensureValidPengajuanStatus(status);
    this.tanggal_pengajuan = normalizeRequiredString(
      tanggal_pengajuan,
      "tanggal_pengajuan",
      FIELD_LABELS,
    );
    this.tanggal_surat = normalizeNullableString(tanggal_surat);
    this.nomor_surat = normalizeNullableString(nomor_surat);
    this.catatan_admin = normalizeNullableString(catatan_admin);
    this.detail = detail && typeof detail === "object" ? { ...detail } : {};
    this.detail_type = detail_type;
    this.dokumen = clonePlainArray(normalizeArray(dokumen));
    this.klarifikasi = clonePlainArray(normalizeArray(klarifikasi));
    this.riwayat_status = clonePlainArray(normalizeArray(riwayat_status));
    this.created_at = normalizeRequiredString(
      created_at,
      "created_at",
      FIELD_LABELS,
    );
    this.updated_at = normalizeRequiredString(
      updated_at,
      "updated_at",
      FIELD_LABELS,
    );

    this.ensureHierarchyConsistency();

    //relations
    this.pemohon = user;
    this.anggota = anggota;
  }

  ensureHierarchyConsistency() {
    if (this.parent_id && !this.root_pengajuan_id) {
      throw new Error(
        "ID root pengajuan wajib diisi jika pengajuan memiliki parent.",
      );
    }

    if (!this.parent_id && +this.root_pengajuan_id !== +this.id) {
      throw new Error(
        "ID root pengajuan harus sama dengan ID pengajuan untuk data root.",
      );
    }
  }

  isOwnedBy(userId) {
    return String(this.userId) === String(userId || "");
  }

  canBeAccessedByDosen(userId) {
    return this.isOwnedBy(userId);
  }

  canUploadFinalSurat() {
    return this.status === PENGAJUAN_STATUS.DISETUJUI;
  }

  isFinalState() {
    return (
      this.status === PENGAJUAN_STATUS.DITOLAK ||
      this.status === PENGAJUAN_STATUS.SELESAI
    );
  }

  updateDetail(nextDetail = {}) {
    this.detail =
      nextDetail && typeof nextDetail === "object" ? { ...nextDetail } : {};
    this.touch();
    return this;
  }

  replaceDokumen(nextDokumen = []) {
    this.dokumen = clonePlainArray(normalizeArray(nextDokumen));
    this.touch();
    return this;
  }

  replaceKlarifikasi(nextKlarifikasi = []) {
    this.klarifikasi = clonePlainArray(normalizeArray(nextKlarifikasi));
    this.touch();
    return this;
  }

  setCatatanAdmin(catatanAdmin) {
    this.catatan_admin = normalizeNullableString(catatanAdmin);
    this.touch();
    return this;
  }

  setNomorSurat({ nomorSurat, tanggalSurat, nomorUrutHarian = null }) {
    this.nomor_surat = normalizeRequiredString(
      nomorSurat,
      "nomor_surat",
      FIELD_LABELS,
    );
    this.tanggal_surat = normalizeRequiredString(
      tanggalSurat,
      "tanggal_surat",
      FIELD_LABELS,
    );
    this.nomor_urut_harian = normalizeNullableString(nomorUrutHarian);
    this.touch();
    return this;
  }

  transitionStatus({
    toStatus,
    // actorUserId = null,
    // keterangan = null,
    // changedAt = nowIsoString(),
  }) {
    const normalizedTarget = ensureValidPengajuanStatus(toStatus);

    if (!canTransitionPengajuanStatus(this.status, normalizedTarget)) {
      throw new Error(
        `Transisi status pengajuan tidak valid: ${this.status} ke ${normalizedTarget}.`,
      );
    }

    // const previousStatus = this.status;
    // this.status = normalizedTarget;
    // this.updated_at = changedAt;

    // this.riwayatStatus.push({
    //   status_lama: previousStatus,
    //   status_baru: normalizedTarget,
    //   user_id: actorUserId,
    //   keterangan: normalizeNullableString(keterangan),
    //   created_at: changedAt,
    // });

    return this;
  }

  touch(changedAt = nowIsoString()) {
    this.updated_at = changedAt;
    return this;
  }
}
