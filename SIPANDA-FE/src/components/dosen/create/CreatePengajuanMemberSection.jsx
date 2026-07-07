import ListFilterSelect from "../../ui/ListFilterSelect";
import {
  getEligibleDosenOptions,
  MAX_ANGGOTA_KELOMPOK_DOSEN,
} from "../../../utils/dosenCreatePengajuanHelpers";

const ANGGOTA_FAKULTAS_FILTER_OPTIONS = [
  { value: "SAME_FAKULTAS", label: "Satu Fakultas" },
  { value: "ALL_FAKULTAS", label: "Semua Fakultas" },
];

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-body-xxs-regular text-error-100">{message}</p>;
}

function MemberRow({
  index,
  member,
  dosenOptions,
  onChange,
  onRemove,
  canRemove,
  disabled = false,
  className = "",
}) {
  return (
    <div className={`py-3 ${className}`}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[110px_minmax(0,1fr)_auto] md:items-center">
        <div className="text-sm font-medium text-black-100">
          Anggota {index + 1}
        </div>

        <ListFilterSelect
          label=""
          value={member.user_id}
          onChange={(value) => onChange("user_id", value)}
          options={dosenOptions}
          showAllOption
          placeholder="Pilih dosen"
          disabled={disabled}
        />

        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="w-fit text-sm font-medium text-error-100 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            Hapus
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

function CreatePengajuanMemberSection({
  usersData,
  userId,
  pemohon,
  memberEntries,
  anggotaFakultasFilter,
  setAnggotaFakultasFilter,
  onAddMember,
  onMemberChange,
  onRemoveMember,
  errors,
  isCreateBlocked,
  isMaxAnggotaReached,
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="w-full md:max-w-xs">
          <ListFilterSelect
            label="Filter Dosen"
            value={anggotaFakultasFilter}
            onChange={setAnggotaFakultasFilter}
            options={ANGGOTA_FAKULTAS_FILTER_OPTIONS}
            showAllOption={false}
          />
        </div>

        <div className="shrink-0 self-start md:self-end">
          <button
            type="button"
            onClick={onAddMember}
            disabled={isCreateBlocked || isMaxAnggotaReached}
            className="inline-flex w-fit rounded-lg border border-primary-100 px-4 py-2.5 text-sm font-medium text-primary-100 hover:bg-primary-20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Tambah Anggota
          </button>
        </div>
      </div>

      {memberEntries.length > 0 ? (
        <div className="rounded-lg border border-black-40 px-4">
          {memberEntries.map((member, index) => {
            const otherMemberEntries = memberEntries.filter(
              (_, itemIndex) => itemIndex !== index,
            );

            const memberOptions = getEligibleDosenOptions(
              usersData,
              userId,
              otherMemberEntries,
              {
                fakultasFilterMode: anggotaFakultasFilter,
                fakultasId: pemohon?.fakultas_id || "",
              },
            );

            return (
              <MemberRow
                key={`${index}-${member.user_id || "new"}`}
                index={index}
                member={member}
                dosenOptions={memberOptions}
                onChange={(key, value) => onMemberChange(index, key, value)}
                onRemove={() => onRemoveMember(index)}
                canRemove
                className={index > 0 ? "border-t border-black-40" : ""}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-black-80">Belum ada anggota dosen.</div>
      )}

      <FieldError message={errors.anggota} />
    </div>
  );
}

export default CreatePengajuanMemberSection;
