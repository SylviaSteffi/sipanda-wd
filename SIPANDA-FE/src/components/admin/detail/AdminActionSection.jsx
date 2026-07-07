import { Link } from "react-router-dom";
import SectionCard from "../../ui/SectionCard";
import { getPengajuanStatus } from "../../../utils/pengajuanHelpers";

const primaryActionClass =
  "inline-flex rounded-lg bg-primary-100 px-4 py-2.5 text-sm font-medium text-white no-underline hover:opacity-95";

const klarifikasiOutlineClass =
  "rounded-lg border border-secondary-100 px-4 py-2.5 text-sm font-medium text-secondary-100 hover:bg-secondary-20";

const klarifikasiActiveClass =
  "rounded-lg border border-secondary-100 bg-secondary-20 px-4 py-2.5 text-sm font-medium text-secondary-100";

const tolakOutlineClass =
  "rounded-lg border border-error-100 px-4 py-2.5 text-sm font-medium text-error-100 hover:bg-error-20";

const tolakActiveClass =
  "rounded-lg border border-error-100 bg-error-20 px-4 py-2.5 text-sm font-medium text-error-100";

function AdminActionSection({
  pengajuan,
  activeAction,
  setActiveAction,
  klarifikasiInput,
  setKlarifikasiInput,
  alasanTolak,
  setAlasanTolak,
  onMulaiPeriksa,
  onKirimKlarifikasi,
  onSetujui,
  onTolak,
}) {
  const currentStatus = getPengajuanStatus(pengajuan);

  return (
    <SectionCard title="Aksi Admin">
      <div className="space-y-4">
        {currentStatus === "DIAJUKAN" && (
          <button
            type="button"
            onClick={onMulaiPeriksa}
            className={primaryActionClass}
          >
            Mulai Periksa
          </button>
        )}

        {currentStatus === "DALAM_PEMERIKSAAN" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveAction("klarifikasi")}
                className={
                  activeAction === "klarifikasi"
                    ? klarifikasiActiveClass
                    : klarifikasiOutlineClass
                }
              >
                Kirim Klarifikasi
              </button>

              <button
                type="button"
                onClick={onSetujui}
                className="rounded-lg bg-success-100 px-4 py-2.5 text-sm font-medium text-white hover:opacity-95"
              >
                Setujui
              </button>

              <button
                type="button"
                onClick={() => setActiveAction("tolak")}
                className={
                  activeAction === "tolak"
                    ? tolakActiveClass
                    : tolakOutlineClass
                }
              >
                Tolak
              </button>
            </div>

            {activeAction === "klarifikasi" && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-black-100">
                  Pesan Klarifikasi
                </label>
                <textarea
                  value={klarifikasiInput}
                  onChange={(e) => setKlarifikasiInput(e.target.value)}
                  rows={4}
                  placeholder="Tulis pesan klarifikasi untuk dosen..."
                  className="w-full rounded-lg border border-black-40 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary-100"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onKirimKlarifikasi}
                    className="rounded-lg bg-secondary-100 px-4 py-2.5 text-sm font-medium text-white hover:opacity-95"
                  >
                    Kirim
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAction("");
                      setKlarifikasiInput("");
                    }}
                    className="rounded-lg border border-black-40 px-4 py-2.5 text-sm font-medium text-black-100 hover:bg-black-20"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {activeAction === "tolak" && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-black-100">
                  Alasan Penolakan
                </label>
                <textarea
                  value={alasanTolak}
                  onChange={(e) => setAlasanTolak(e.target.value)}
                  rows={4}
                  placeholder="Tulis alasan pengajuan ditolak..."
                  className="w-full rounded-lg border border-black-40 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary-100"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onTolak}
                    className="rounded-lg bg-error-100 px-4 py-2.5 text-sm font-medium text-white"
                  >
                    Konfirmasi Tolak
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAction("");
                      setAlasanTolak("");
                    }}
                    className="rounded-lg border border-black-40 px-4 py-2.5 text-sm font-medium text-black-100 hover:bg-black-20"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStatus === "PERLU_KLARIFIKASI" && (
          <div className="rounded-lg bg-warning-20 px-4 py-3 text-sm font-medium text-warning-100">
            Pengajuan sedang menunggu perbaikan dari dosen.
          </div>
        )}

        {currentStatus === "DISETUJUI" && (
          <div className="space-y-3">
            <div className="rounded-lg bg-success-20 px-4 py-3 text-sm font-medium text-success-100">
              Pengajuan sudah disetujui dan siap dilanjutkan ke kelola surat.
            </div>

            <Link
              to={`/admin/surat/${pengajuan.id}`}
              className={primaryActionClass}
            >
              Lanjut Kelola Surat
            </Link>
          </div>
        )}

        {currentStatus === "DITOLAK" && (
          <div className="rounded-lg bg-error-20 px-4 py-3 text-sm font-medium text-error-100">
            Pengajuan telah ditolak.
          </div>
        )}

        {currentStatus === "SELESAI" && (
          <div className="space-y-3">
            <div className="rounded-lg bg-primary-20 px-4 py-3 text-sm font-medium text-primary-100">
              Proses pengajuan telah selesai.
            </div>

            <Link
              to={`/admin/surat/${pengajuan.id}`}
              className={primaryActionClass}
            >
              Lihat Surat Final
            </Link>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export default AdminActionSection;