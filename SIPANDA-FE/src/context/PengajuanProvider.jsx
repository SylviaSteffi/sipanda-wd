import { useCallback, useEffect, useMemo, useState } from "react";
import { PengajuanContext } from "./pengajuanContext";
import { dummyPengajuan } from "../data/dummyPengajuan";
import { dummyPengajuanDosen } from "../data/dummyPengajuanDosen";
import { dummyUsers } from "../data/dummyUsers";
import { dummyAkademik } from "../data/dummyAkademik";
import { getNowSqlDateTime } from "../utils/dateHelpers";
import axios from "axios";
import Spinner from "../components/ui/Spinner.jsx";
import { FAKULTAS_OPTIONS, PRODI_OPTIONS } from "../utils/dosenHelpers.js";
const IS_DEMO = import.meta.env.VITE_AUTH_MODE === "demo";
const initialPengajuanData = [...dummyPengajuan, ...dummyPengajuanDosen];

function getNextNumericId(items = []) {
  const maxId = items.reduce((max, item) => {
    const value = Number(item?.id || 0);
    return value > max ? value : max;
  }, 0);

  return maxId + 1;
}

function getNextAlphabetCode(items = []) {
  const nextIndex = items.length % 26;
  return String.fromCharCode(65 + nextIndex);
}

function updateCollectionById(items = [], id, updater) {
  return items.map((item) =>
    String(item.id) === String(id) ? updater(item) : item,
  );
}

function buildCreatedDocuments(dokumen = [], pengajuanId, createdAt) {
  return dokumen.map((doc, index) => ({
    id: Number(`${pengajuanId}${index + 1}`),
    pengajuan_id: pengajuanId,
    kode_dokumen: doc.kode_dokumen,
    original_name: doc.original_name,
    mime_type: doc.mime_type || "application/octet-stream",
    file_base64: doc.file_base64 || "",
    file_size_bytes: Number(doc.file_size_bytes || 0),
    created_at: createdAt,
    updated_at: createdAt,
  }));
}

function buildInitialHistory(pengajuanId, userId, createdAt) {
  return [
    {
      id: Number(`${pengajuanId}01`),
      pengajuan_id: pengajuanId,
      user_id: Number(userId),
      status_lama: null,
      status_baru: "DIAJUKAN",
      keterangan: "Pengajuan dibuat oleh dosen.",
      created_at: createdAt,
    },
  ];
}

function buildNewUser(payload, usersData = []) {
  const createdAt = getNowSqlDateTime();
  const nextId = getNextNumericId(usersData);

  return {
    id: nextId,
    role: payload.role || "DOSEN",
    jabatan: payload.jabatan || "DOSEN",
    nidn: payload.nidn || "",
    nama: payload.nama || "",
    email: payload.email || "",
    password: payload.password || "dosen123",
    fakultas_id: payload.fakultas_id || "",
    fakultas: payload.fakultas || "",
    prodi_id: payload.prodi_id || "",
    prodi: payload.prodi || "",
    no_hp: payload.no_hp || "",
    created_at: createdAt,
  };
}

function buildNewPengajuan(payload, existingPengajuan = []) {
  const createdAt = getNowSqlDateTime();
  const nextId = getNextNumericId(existingPengajuan);
  const nomorUrutHarian = getNextAlphabetCode(existingPengajuan);

  return {
    id: nextId,
    user_id: payload.user_id,
    parent_id: payload.parent_id || null,
    root_pengajuan_id: payload.root_pengajuan_id || nextId,
    nomor_urut_harian: payload.nomor_urut_harian || nomorUrutHarian,
    tahap: payload.tahap,
    kategori: payload.kategori,
    jenis_pengajuan: payload.jenis_pengajuan || "INDIVIDU",
    akademik_id: payload.akademik_id,
    status_pengajuan: payload.status_pengajuan || "DIAJUKAN",
    tanggal_pengajuan: createdAt,
    nomor_surat: payload.nomor_surat || null,
    tanggal_surat: payload.tanggal_surat || null,
    catatan_admin: payload.catatan_admin || null,
    created_at: createdAt,
    updated_at: createdAt,
    pemohon: payload.pemohon || null,
    anggota: payload.anggota || [],
    detail_type: payload.detail_type || "",
    detail: payload.detail || {},
    dokumen: buildCreatedDocuments(payload.dokumen || [], nextId, createdAt),
    klarifikasi: payload.klarifikasi || [],
    riwayat_status:
      payload.riwayat_status ||
      buildInitialHistory(nextId, payload.user_id, createdAt),
  };
}

export function PengajuanProvider({ children }) {
  const [pengajuanData, setPengajuanData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [akademikData, setAkademikData] = useState([]);
  const [isLoading, setIsLoading] = useState(!IS_DEMO);
  const [fakultasData, setFakultasData] = useState([]);
  const [prodiData, setProdiData] = useState([]);

  useEffect(() => {
    if (IS_DEMO) {
      setPengajuanData(initialPengajuanData);
      setUsersData(dummyUsers);
      setAkademikData(dummyAkademik);
      setFakultasData(FAKULTAS_OPTIONS);
      setProdiData(PRODI_OPTIONS);

      return;
    }

    // API mode — fetch all base data in parallel
    const load = async () => {
      setIsLoading(true);
      try {
        const [pengajuanRes, usersRes, akademikRes, fakultasRes, prodiRes] =
          await Promise.all([
            axios.get("/api/pengajuan"),
            axios.get("/api/users"),
            axios.get("/api/akademik"),
            axios.get("/api/fakultas"),
            axios.get("/api/prodi"),
          ]);
        setPengajuanData(pengajuanRes?.data?.data);
        setUsersData(usersRes?.data?.data);
        setAkademikData(akademikRes?.data?.data);
        setFakultasData(fakultasRes?.data?.data);
        setProdiData(prodiRes?.data?.data);
      } catch (err) {
        console.error("Failed to load initial data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const getPengajuanById = useCallback(
    (id) =>
      pengajuanData.find((item) => String(item.id) === String(id)) || null,
    [pengajuanData],
  );

  const getUserById = useCallback(
    (id) => usersData.find((item) => String(item.id) === String(id)) || null,
    [usersData],
  );

  const getAkademikById = useCallback(
    (id) => akademikData.find((item) => String(item.id) === String(id)) || null,
    [akademikData],
  );

  const getActiveAkademik = useCallback(() => {
    return akademikData.find((item) => Number(item.is_aktif) === 1) || null;
  }, [akademikData]);

  const createAkademik = useCallback(
    async (payload) => {
      if (IS_DEMO) {
        const newItem = { id: getNextNumericId(akademikData), ...payload };
        setAkademikData((prev) => [...prev, newItem]);
        return newItem;
      }
      const res = await axios.post("/api/akademik", payload);
      setAkademikData((prev) => [...prev, res.data?.data]);
      return res.data;
    },
    [akademikData],
  );

  const updateAkademikById = useCallback(
    async (id, updater) => {
      if (IS_DEMO) {
        setAkademikData((prev) => updateCollectionById(prev, id, updater));
        return;
      }
      const current = akademikData.find((a) => String(a.id) === String(id));
      await axios.put(`/api/akademik/${id}`, updater(current));
      setAkademikData((prev) => updateCollectionById(prev, id, updater));
    },
    [akademikData],
  );

  const deleteAkademikById = useCallback(async (id) => {
    if (IS_DEMO) {
      setAkademikData((prev) =>
        prev.filter((a) => String(a.id) !== String(id)),
      );
      return;
    }
    await axios.delete(`/api/akademik/${id}`);
    setAkademikData((prev) => prev.filter((a) => String(a.id) !== String(id)));
  }, []);

  const getKetuaLppm = useCallback(() => {
    return usersData.find((item) => item.jabatan === "KETUA_LPPM") || null;
  }, [usersData]);

  const updatePengajuanById = useCallback(
    async (id, updater) => {
      if (IS_DEMO) {
        setPengajuanData((prev) => updateCollectionById(prev, id, updater));
        return;
      }
      const current = pengajuanData.find((p) => String(p.id) === String(id));
      const updated = updater(current);
      await axios.put(`/api/pengajuan/${id}`, updated);
      setPengajuanData((prev) => updateCollectionById(prev, id, updater));
    },
    [pengajuanData],
  );

  const updateUserById = useCallback(
    async (id, updater) => {
      if (IS_DEMO) {
        setUsersData((prev) => updateCollectionById(prev, id, updater));
        return;
      }
      const current = usersData.find((u) => String(u.id) === String(id));
      const updated = updater(current);
      const res = await axios.put(`/api/users/${id}`, updated);
      const updatedUser = res.data.data;
      setUsersData((prev) => {
        const findId = prev.find((u) => String(u.id) === String(id));
        if (!findId) return prev;
        return prev.map((item) =>
          String(item.id) === String(id) ? updatedUser : item,
        );
      });
      // setUsersData((prev) => updateCollectionById(prev, id, updater));
    },
    [usersData],
  );

  const createUser = useCallback(
    async (payload) => {
      if (IS_DEMO) {
        const newUser = buildNewUser(payload, usersData);
        setUsersData((prev) => [...prev, newUser]);
        return newUser;
      }
      const res = await axios.post("/api/users", payload);
      const newUser = res.data.data;
      setUsersData((prev) => [...prev, newUser]);
      return newUser;
    },
    [usersData],
  );

  const deleteUserById = useCallback(async (id) => {
    if (IS_DEMO) {
      setUsersData((prev) =>
        prev.filter((item) => String(item.id) !== String(id)),
      );
      return;
    }
    await axios.delete(`/api/users/${id}`);
    setUsersData((prev) =>
      prev.filter((item) => String(item.id) !== String(id)),
    );
  }, []);

  const createPengajuan = useCallback(
    async (payload) => {
      if (IS_DEMO) {
        const newPengajuan = buildNewPengajuan(payload, pengajuanData);
        setPengajuanData((prev) => [...prev, newPengajuan]);
        return newPengajuan;
      }
      const res = await axios.post("/api/pengajuan", payload);
      const newPengajuan = res.data?.data;
      const getPengajuanFromBE = await axios.get(
        `/api/pengajuan/${newPengajuan.id}`,
      );
      setPengajuanData((prev) => [...prev, getPengajuanFromBE.data?.data]);
      return newPengajuan;
    },
    [pengajuanData],
  );

  // Fakultas
  const createFakultas = useCallback(
    async (payload) => {
      if (IS_DEMO) {
        const newItem = { id: getNextNumericId(fakultasData), ...payload };
        setFakultasData((prev) => [...prev, newItem]);
        return newItem;
      }
      const res = await axios.post("/api/fakultas", payload);
      setFakultasData((prev) => [...prev, res.data?.data]);
      return res.data;
    },
    [fakultasData],
  );

  const updateFakultasById = useCallback(
    async (id, updater) => {
      if (IS_DEMO) {
        setFakultasData((prev) => updateCollectionById(prev, id, updater));
        return;
      }
      const current = fakultasData.find((f) => String(f.id) === String(id));
      await axios.put(`/api/fakultas/${id}`, updater(current));
      setFakultasData((prev) => updateCollectionById(prev, id, updater));
    },
    [fakultasData],
  );

  const deleteFakultasById = useCallback(async (id) => {
    if (IS_DEMO) {
      setFakultasData((prev) =>
        prev.filter((f) => String(f.id) !== String(id)),
      );
      return;
    }
    await axios.delete(`/api/fakultas/${id}`);
    setFakultasData((prev) => prev.filter((f) => String(f.id) !== String(id)));
  }, []);

  // Prodi
  const createProdi = useCallback(
    async (payload) => {
      if (IS_DEMO) {
        const newItem = { id: getNextNumericId(prodiData), ...payload };
        setProdiData((prev) => [...prev, newItem]);
        return newItem;
      }
      const res = await axios.post("/api/prodi", payload);
      setProdiData((prev) => [...prev, res.data?.data]);
      return res.data;
    },
    [prodiData],
  );

  const updateProdiById = useCallback(
    async (id, updater) => {
      if (IS_DEMO) {
        setProdiData((prev) => updateCollectionById(prev, id, updater));
        return;
      }
      const current = prodiData.find((f) => String(f.id) === String(id));
      await axios.put(`/api/prodi/${id}`, updater(current));
      setProdiData((prev) => updateCollectionById(prev, id, updater));
    },
    [prodiData],
  );

  const deleteProdiById = useCallback(async (id) => {
    if (IS_DEMO) {
      setProdiData((prev) => prev.filter((f) => String(f.id) !== String(id)));
      return;
    }
    await axios.delete(`/api/prodi/${id}`);
    setProdiData((prev) => prev.filter((f) => String(f.id) !== String(id)));
  }, []);

  const value = useMemo(
    () => ({
      pengajuanData,
      usersData,
      akademikData,
      getPengajuanById,
      getUserById,
      getAkademikById,
      getActiveAkademik,
      getKetuaLppm,
      updatePengajuanById,
      updateUserById,
      createUser,
      deleteUserById,
      createPengajuan,
      fakultasData,
      prodiData,
      createFakultas,
      updateFakultasById,
      deleteFakultasById,
      createProdi,
      updateProdiById,
      deleteProdiById,
      createAkademik,
      updateAkademikById,
      deleteAkademikById,
    }),
    [
      pengajuanData,
      usersData,
      akademikData,
      getPengajuanById,
      getUserById,
      getAkademikById,
      getActiveAkademik,
      getKetuaLppm,
      updatePengajuanById,
      updateUserById,
      createUser,
      deleteUserById,
      createPengajuan,
      fakultasData,
      prodiData,
      createFakultas,
      updateFakultasById,
      deleteFakultasById,
      createProdi,
      updateProdiById,
      deleteProdiById,
      createAkademik,
      updateAkademikById,
      deleteAkademikById,
    ],
  );

  return (
    <PengajuanContext.Provider value={value}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner label="Memuat data..." />
        </div>
      ) : (
        children
      )}
    </PengajuanContext.Provider>
  );
}
