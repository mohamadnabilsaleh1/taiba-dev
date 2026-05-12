import React from "react";
import { Edit, Trash2, MoreVertical } from "lucide-react";

interface Column {
  header: string;
  accessor: string;
  render?: (item: any) => React.ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  isLoading?: boolean;
}

const AdminTable = ({ columns, data, onEdit, onDelete, isLoading }: AdminTableProps) => {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-white/5 bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-gray-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <tr>
              {columns.map((col) => (
                <th key={col.header} className="px-6 py-4">
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item._id || index} className="transition-colors hover:bg-white/5">
                  {columns.map((col) => (
                    <td key={col.header} className="px-6 py-4">
                      {col.render ? col.render(item) : item[col.accessor]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-500/10 hover:text-blue-500"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete?.(item)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
