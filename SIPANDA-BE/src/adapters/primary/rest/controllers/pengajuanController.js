export class PengajuanController {
  constructor({
    createUseCase,
    getAllUseCase,
    getOneUseCase,
    updateUseCase,
    changeStatusUseCase,
  }) {
    this.createUseCase = createUseCase;
    this.getAllUseCase = getAllUseCase;
    this.getOneUseCase = getOneUseCase;
    this.updateUseCase = updateUseCase;
    this.changeStatusUseCase = changeStatusUseCase;
  }

  getAll = async (req, res) => {
    try {
      // const currentUser = req.user;
      // const userRole = req.user.role;

      // console.log(`User ID: ${currentUser.id} with Role: ${userRole}`);

      const data = await this.getAllUseCase.execute(req.query);
      return res.status(200).json({ data });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  getOne = async (req, res) => {
    try {
      const data = await this.getOneUseCase.execute({ id: req.params.id });
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  create = async (req, res) => {
    try {
      const data = await this.createUseCase.execute(req.body);

      return res.status(200).json({ data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  update = async (req, res) => {
    try {
      const currentUser = req.user;
      const data = await this.updateUseCase.execute({
        id: req.params.id,
        dto: req.body,
        updatedById: currentUser.id,
      });
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  changeStatus = async (req, res) => {
    try {
      const data = await this.changeStatusUseCase.execute(
        req.param.id,
        req.body.status_pengajuan,
      );
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };
}

// const allDetailIncludes = Object.values(detailMap).map(({ model, as }) => ({
//   model,
//   as,
//   required: false,
// }));
//
// // GET /pengajuan
// export const getAll = async (req, res) => {
//   try {
//     const { status, kategori, tahap, user_id } = req.query;
//     const where = {};
//     if (status) where.status_pengajuan = status;
//     if (kategori) where.kategori = kategori;
//     if (tahap) where.tahap = tahap;
//     if (user_id) where.user_id = user_id;
//
//     const data = await Pengajuan.findAll({
//       where,
//       include: [
//         { model: User, as: "user", attributes: ["id", "nama", "email"] },
//         {
//           model: Akademik,
//           as: "akademik",
//           attributes: ["id", "nama_akademik"],
//         },
//         {
//           model: PengajuanAnggota,
//           as: "anggota",
//           include: [{ model: User, as: "user", attributes: ["id", "nama"] }],
//         },
//         ...allDetailIncludes,
//       ],
//       order: [["created_at", "DESC"]],
//     });
//     res.json({ data });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
//
// // GET /pengajuan/:id
// export const getOne = async (req, res) => {
//   try {
//     const data = await Pengajuan.findByPk(req.params.id, {
//       include: [
//         { model: User, as: "user" },
//         { model: Akademik, as: "akademik" },
//         {
//           model: PengajuanAnggota,
//           as: "anggota",
//           include: [
//             { model: User, as: "user", attributes: ["id", "nama", "email"] },
//           ],
//         },
//         { model: Dokumen, as: "dokumens" },
//         { model: Klarifikasi, as: "klarifikasis" },
//         { model: RiwayatStatus, as: "riwayatStatuses" },
//         ...allDetailIncludes,
//       ],
//     });
//     if (!data) return res.status(404).json({ message: "Pengajuan not found" });
//     res.json({ data });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
//
// // POST /pengajuan
// export const create = async (req, res) => {
//   try {
//     const { anggota, detail, ...pengajuanBody } = req.body;
//
//     const pengajuan = await Pengajuan.create(pengajuanBody);
//
//     // Create anggota if provided
//     if (anggota?.length) {
//       const anggotaData = anggota.map((a) => ({
//         ...a,
//         pengajuan_id: pengajuan.id,
//       }));
//       await PengajuanAnggota.bulkCreate(anggotaData);
//     }
//
//     // Create detail based on kategori + tahap
//     if (detail) {
//       const key = `${pengajuan.kategori}-${pengajuan.tahap}`;
//       const target = detailMap[key];
//       if (target) {
//         await target.model.create({ ...detail, pengajuan_id: pengajuan.id });
//       }
//     }
//
//     // Log initial status
//     await RiwayatStatus.create({
//       pengajuan_id: pengajuan.id,
//       user_id: pengajuan.user_id,
//       status_lama: null,
//       status_baru: pengajuan.status_pengajuan,
//       keterangan: "Pengajuan dibuat",
//     });
//
//     res.status(201).json({ data: pengajuan });
//   } catch (err) {
//     res.status(422).json({ message: err.message });
//   }
// };
//
// // PUT /pengajuan/:id
// export const update = async (req, res) => {
//   try {
//     const pengajuan = await Pengajuan.findByPk(req.params.id);
//     if (!pengajuan)
//       return res.status(404).json({ message: "Pengajuan not found" });
//
//     const { detail, ...body } = req.body;
//     const statusLama = pengajuan.status_pengajuan;
//
//     await pengajuan.update(body);
//
//     // Update detail if provided
//     if (detail) {
//       const key = `${pengajuan.kategori}-${pengajuan.tahap}`;
//       const target = detailMap[key];
//       if (target) {
//         await target.model.upsert({ ...detail, pengajuan_id: pengajuan.id });
//       }
//     }
//
//     // Log status change if changed
//     if (body.status_pengajuan && body.status_pengajuan !== statusLama) {
//       await RiwayatStatus.create({
//         pengajuan_id: pengajuan.id,
//         user_id: req.body.updated_by ?? pengajuan.user_id,
//         status_lama: statusLama,
//         status_baru: body.status_pengajuan,
//         keterangan: body.catatan_admin ?? null,
//       });
//     }
//
//     res.json({ data: pengajuan });
//   } catch (err) {
//     res.status(422).json({ message: err.message });
//   }
// };
//
// // DELETE /pengajuan/:id
// export const remove = async (req, res) => {
//   try {
//     const pengajuan = await Pengajuan.findByPk(req.params.id);
//     if (!pengajuan)
//       return res.status(404).json({ message: "Pengajuan not found" });
//     await pengajuan.destroy();
//     res.json({ message: "Pengajuan deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
