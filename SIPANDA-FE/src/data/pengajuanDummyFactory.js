import { dummyUsers } from "./dummyUsers";
import { dummyAkademik } from "./dummyAkademik";

export const AKADEMIK_AKTIF_ID =
  dummyAkademik.find((item) => Number(item.is_aktif) === 1)?.id ||
  dummyAkademik[0]?.id ||
  "";

export const AKADEMIK_SEBELUMNYA_ID =
  dummyAkademik.find((item) => item.id !== AKADEMIK_AKTIF_ID)?.id ||
  AKADEMIK_AKTIF_ID;

export function getUserById(userId) {
  return dummyUsers.find((item) => String(item.id) === String(userId)) || null;
}

export function makePemohon(userId) {
  const user = getUserById(userId);

  if (!user) {
    return {
      id: userId,
      role: "DOSEN",
      jabatan: "DOSEN",
      nidn: "",
      nama: "",
      email: "",
      fakultas_id: "",
      fakultas: "",
      prodi_id: "",
      prodi: "",
      no_hp: "",
    };
  }

  return {
    id: user.id,
    role: user.role,
    jabatan: user.jabatan,
    nidn: user.nidn,
    nama: user.nama,
    email: user.email,
    fakultas_id: user.fakultas_id,
    fakultas: user.fakultas,
    prodi_id: user.prodi_id,
    prodi: user.prodi,
    no_hp: user.no_hp,
  };
}

export function makeAnggota(userIds = []) {
  return userIds
    .map((userId, index) => {
      const user = getUserById(userId);
      if (!user) return null;

      return {
        id: Number(`${user.id}${index + 1}`),
        user_id: user.id,
        urutan: index + 2,
        peran: "ANGGOTA",
        role: user.role,
        jabatan: user.jabatan,
        nidn: user.nidn,
        nama: user.nama,
        email: user.email,
        fakultas_id: user.fakultas_id,
        fakultas: user.fakultas,
        prodi_id: user.prodi_id,
        prodi: user.prodi,
        no_hp: user.no_hp,
      };
    })
    .filter(Boolean);
}

export function makeDokumen(pengajuanId, items = []) {
  return items.map((item, index) => ({
    id: Number(`${pengajuanId}${String(index + 1).padStart(2, "0")}`),
    pengajuan_id: pengajuanId,
    kode_dokumen: item.kode_dokumen,
    original_name: item.original_name,
    mime_type: item.mime_type || "application/pdf",
    file_base64: "",
    file_size_bytes: item.file_size_bytes || 200000,
    created_at: item.created_at,
    updated_at: item.updated_at || item.created_at,
  }));
}

export function makeRiwayatStatus(pengajuanId, items = []) {
  return items.map((item, index) => ({
    id: Number(`${pengajuanId}${String(index + 1).padStart(2, "0")}`),
    pengajuan_id: pengajuanId,
    user_id: item.user_id,
    status_lama: item.status_lama ?? null,
    status_baru: item.status_baru,
    keterangan: item.keterangan,
    created_at: item.created_at,
  }));
}

export function createPengajuan({
  id,
  userId,
  parentId = null,
  rootId = id,
  nomorUrut,
  tahap,
  kategori,
  jenisPengajuan = "INDIVIDU",
  akademikId = AKADEMIK_AKTIF_ID,
  status,
  tanggalPengajuan,
  nomorSurat = null,
  tanggalSurat = null,
  catatanAdmin = null,
  updatedAt = tanggalPengajuan,
  anggotaUserIds = [],
  detailType,
  detail,
  dokumen = [],
  klarifikasi = [],
  riwayatStatus = [],
}) {
  return {
    id,
    user_id: userId,
    parent_id: parentId,
    root_pengajuan_id: rootId,
    nomor_urut_harian: nomorUrut,
    tahap,
    kategori,
    jenis_pengajuan: jenisPengajuan,
    akademik_id: akademikId,
    status_pengajuan: status,
    tanggal_pengajuan: tanggalPengajuan,
    nomor_surat: nomorSurat,
    tanggal_surat: tanggalSurat,
    catatan_admin: catatanAdmin,
    created_at: tanggalPengajuan,
    updated_at: updatedAt,
    pemohon: makePemohon(userId),
    anggota: makeAnggota(anggotaUserIds),
    detail_type: detailType,
    detail,
    dokumen: makeDokumen(id, dokumen),
    klarifikasi,
    riwayat_status: makeRiwayatStatus(id, riwayatStatus),
  };
}