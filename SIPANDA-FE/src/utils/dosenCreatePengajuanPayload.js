import { getNowSqlDateTime } from "./dateHelpers";
import { DETAIL_TYPE_BY_TAHAP_KATEGORI } from "./dosenCreatePengajuanConfig";
import {
  isPublikasiKategori,
  normalizeCreateFormValues,
  toNumberOrEmpty,
} from "./dosenCreatePengajuanHelpers";

export async function toBase64(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : "";
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsDataURL(file);
  });
}

function buildAnggotaPayload(memberEntries = [], usersData = []) {
  return memberEntries
    .map((item, index) => {
      const user =
        usersData.find(
          (userItem) => String(userItem.id) === String(item.user_id),
        ) || null;
      if (!user) return null;
      return {
        // id: Number(`${user.id}${index + 1}`),
        id: -new Date(),
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

function getDetailTypeByTahapKategori(tahap, kategori) {
  return DETAIL_TYPE_BY_TAHAP_KATEGORI[tahap]?.[kategori] || "";
}

function buildPenelitianDetailPayload(tahap, formValues) {
  if (tahap === "TUGAS") {
    return {
      bidang_ilmu: formValues.bidang_ilmu,
      judul_proposal: formValues.judul_proposal,
    };
  }

  if (tahap === "KEMAJUAN") {
    return {
      bidang_ilmu: formValues.bidang_ilmu,
      judul_penelitian: formValues.judul_penelitian,
      no_surat_tugas: formValues.no_surat_tugas,
      tanggal_surat_tugas: formValues.tanggal_surat_tugas,
    };
  }

  if (tahap === "PENGESAHAN") {
    return {
      bidang_ilmu: formValues.bidang_ilmu,
      judul_penelitian: formValues.judul_penelitian,
      no_surat_tugas: formValues.no_surat_tugas,
      tanggal_mulai: formValues.tanggal_mulai,
      tanggal_selesai: formValues.tanggal_selesai,
    };
  }

  return {};
}

function buildPkmDetailPayload(tahap, formValues) {
  if (tahap === "TUGAS") {
    return {
      bidang_ilmu: formValues.bidang_ilmu,
      nama_institusi_pemohon: formValues.nama_institusi_pemohon,
      no_surat_permohonan: formValues.no_surat_permohonan,
      tanggal_surat_permohonan: 
        formValues.tanggal_surat_permohonan,
      jenis_pkm: formValues.jenis_pkm,
      judul_pkm: formValues.judul_pkm,
      judul_materi: formValues.judul_materi,
      tempat_pelaksanaan: formValues.tempat_pelaksanaan,
      waktu_pelaksanaan: formValues.waktu_pelaksanaan,
      sumber_dana: formValues.sumber_dana,
      besar_dana: toNumberOrEmpty(formValues.besar_dana),
    };
  }

  if (tahap === "KEMAJUAN") {
    return {
      bidang_ilmu: formValues.bidang_ilmu,
      judul_pkm: formValues.judul_pkm,
      no_surat_tugas: formValues.no_surat_tugas,
      tanggal_surat_tugas: formValues.tanggal_surat_tugas,
      tempat_pkm: formValues.tempat_pkm,
    };
  }

  if (tahap === "PENGESAHAN") {
    return {
      bidang_ilmu: formValues.bidang_ilmu,
      no_surat_tugas: formValues.no_surat_tugas,
      jenis_pkm: formValues.jenis_pkm,
      judul_pkm: formValues.judul_pkm,
      judul_materi: formValues.judul_materi,
      tempat_pelaksanaan: formValues.tempat_pelaksanaan,
      waktu_pelaksanaan: formValues.waktu_pelaksanaan,
    };
  }

  return {};
}

function buildArtikelPengesahanPayload(formValues) {
  return {
    bidang_ilmu: formValues.bidang_ilmu,
    tanggal_mulai: formValues.tanggal_mulai,
    no_surat_tugas: formValues.no_surat_tugas,
    judul_artikel: formValues.judul_artikel,
    nama_jurnal: formValues.nama_jurnal || null,
    cakupan_jurnal: formValues.cakupan_jurnal || null,
    peringkat_jurnal: formValues.peringkat_jurnal || null,
    volume: formValues.volume || null,
    nomor: formValues.nomor || null,
    doi: formValues.doi || null,
    tanggal_terbit: formValues.tanggal_terbit,
    penerbit: formValues.penerbit,
    link_artikel: formValues.link_artikel,
  };
}

function buildBukuPengesahanPayload(formValues) {
  return {
    bidang_ilmu: formValues.bidang_ilmu,
    tanggal_mulai: formValues.tanggal_mulai,
    no_surat_tugas: formValues.no_surat_tugas,
    judul_buku: formValues.judul_buku,
    judul_book_chapter: formValues.judul_book_chapter,
    halaman: formValues.halaman,
    isbn: formValues.isbn,
    tanggal_terbit: formValues.tanggal_terbit,
    penerbit: formValues.penerbit,
    link_buku: formValues.link_buku || null,
  };
}

function buildPublikasiDetailPayload(tahap, kategori, formValues) {
  if (tahap === "TUGAS") {
    return {
      bidang_ilmu: formValues.bidang_ilmu,
      judul_karya: formValues.judul_karya,
      tanggal_mulai: formValues.tanggal_mulai,
    };
  }

  if (tahap === "PENGESAHAN") {
    if (kategori === "ARTIKEL") {
      return buildArtikelPengesahanPayload(formValues);
    }
    if (kategori === "BUKU") {
      return buildBukuPengesahanPayload(formValues);
    }
  }

  return {};
}

function buildDetailPayload(tahap, kategori, formValues) {
  if (kategori === "PENELITIAN") {
    return buildPenelitianDetailPayload(tahap, formValues);
  }
  if (kategori === "PKM") {
    return buildPkmDetailPayload(tahap, formValues);
  }
  if (isPublikasiKategori(kategori)) {
    return buildPublikasiDetailPayload(tahap, kategori, formValues);
  }
  return {};
}

async function buildDocumentPayload(
  requiredDocuments = [],
  documentFiles = {},
) {
  const docs = await Promise.all(
    requiredDocuments.map(async (item) => {
      const file = documentFiles[item.code];
      if (!file) return null;
      return {
        kode_dokumen: item.code,
        original_name: file.name,
        mime_type: file.type,
        file_size_bytes: file.size,
        file_base64: await toBase64(file),
      };
    }),
  );
  return docs.filter(Boolean);
}

export async function buildCreatePengajuanPayload({
  tahap,
  kategori,
  jenisPengajuan,
  formValues,
  memberEntries = [],
  usersData = [],
  pemohon,
  akademikId,
  requiredDocuments = [],
  documentFiles = {},
}) {
  const normalizedFormValues = normalizeCreateFormValues(formValues);
  const now = getNowSqlDateTime();

  return {
    user_id: pemohon.id,
    tahap,
    kategori,
    jenis_pengajuan: jenisPengajuan,
    akademik_id: akademikId,
    status_pengajuan: "DIAJUKAN",
    pemohon,
    anggota:
      jenisPengajuan === "KELOMPOK"
        ? buildAnggotaPayload(memberEntries, usersData)
        : [],
    detail_type: getDetailTypeByTahapKategori(tahap, kategori),
    detail: buildDetailPayload(tahap, kategori, normalizedFormValues),
    dokumen: await buildDocumentPayload(requiredDocuments, documentFiles),
    catatan_admin: null,
    nomor_surat: null,
    tanggal_surat: null,
    created_at: now,
    updated_at: now,
  };
}
