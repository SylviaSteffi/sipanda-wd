// components/ui/BaseTable.jsx
import React from "react";

/**
 * @typedef {Object} ColumnDef
 * @property {string} key - unique key for the column
 * @property {string} label - header label
 * @property {string} [className] - th/td className override
 * @property {function(row): React.ReactNode} render - cell renderer
 */

/**
 * @param {Object} props
 * @param {Array} props.data - array of row objects
 * @param {ColumnDef[]} props.columns - column definitions
 * @param {string} props.title - table heading
 * @param {string} [props.countLabel] - e.g. "Menampilkan 3 dari 10 pengajuan"
 * @param {string} [props.emptyMessage] - shown when data is empty
 * @param {function(row): string|number} [props.rowKey] - fn to get row key, defaults to row.id
 */
const BaseTable = ({
  data = [],
  columns = [],
  title,
  countLabel,
  emptyMessage = "Tidak ada data.",
  rowKey = (row) => row.id,
}) => {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-black-40 bg-white">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-black-40 p-5 lg:flex-row lg:items-center lg:justify-between">
        {title && (
          <h2 className="text-body-sm-medium text-black-100">{title}</h2>
        )}
        {countLabel && (
          <div className="text-body-xxs-regular text-black-100">
            {countLabel}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden">
        <table className="w-full table-fixed text-left">
          <thead className="bg-black-20 text-body-xxs-medium text-black-80">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.headerClassName ?? "px-4 py-4"}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-body-xxs-regular text-black-100">
            {data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-t border-black-20 align-top"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={col.cellClassName ?? "px-4 py-4 align-top"}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center text-black-80"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BaseTable;
