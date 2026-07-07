import { DokumenRepositoryPort } from "../../../core/application/ports/DokumenRepositoryPort.js";
import { DokumenEntity } from "../../../core/domain/entities/Dokumen.js";
import { Dokumen } from "../orm/index.js";

export class DokumenRepository extends DokumenRepositoryPort {
  async bulkCreateForPengajuan(pengajuanId, dokumenList = []) {
    const codes = dokumenList.map((d) => d.kode_dokumen);

    await Dokumen.destroy({
      where: {
        pengajuan_id: pengajuanId,
        kode_dokumen: codes,
      },
    });

    const records = dokumenList.map((doc) => ({
      pengajuan_id: pengajuanId,
      kode_dokumen: doc.kode_dokumen,
      original_name: doc.original_name,
      mime_type: doc.mime_type,
      file_base64: doc.file_base64,
      file_size_bytes: doc.file_size_bytes,
    }));

    const created = await Dokumen.bulkCreate(records, { returning: true });

    return created.map((row) => new DokumenEntity(row.toJSON()));
  }

  async deleteByPengajuanId(pengajuanId) {
    await Dokumen.destroy({ where: { pengajuan_id: pengajuanId } });
  }

  async findByPengajuanId(pengajuanId) {
    const rows = await Dokumen.findAll({
      where: { pengajuan_id: pengajuanId },
    });
    return rows.map((row) => new DokumenEntity(row.toJSON()));
  }
}
