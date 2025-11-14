function InventoryTable({ items, loading, canEdit, onEdit }) {
  if (loading) {
    return <p>Loading records…</p>;
  }
  if (!loading && items.length === 0) {
    return <p>No records yet. Add your first inventory item.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left py-3 px-2.5 border-b border-indigo-100 uppercase text-xs tracking-wider text-slate-500">
              ID
            </th>
            <th className="text-left py-3 px-2.5 border-b border-indigo-100 uppercase text-xs tracking-wider text-slate-500">
              Item name
            </th>
            <th className="text-left py-3 px-2.5 border-b border-indigo-100 uppercase text-xs tracking-wider text-slate-500">
              Category
            </th>
            <th className="text-left py-3 px-2.5 border-b border-indigo-100 uppercase text-xs tracking-wider text-slate-500">
              Stock
            </th>
            <th className="text-left py-3 px-2.5 border-b border-indigo-100 uppercase text-xs tracking-wider text-slate-500">
              Unit price
            </th>
            {canEdit && (
              <th
                aria-label="actions"
                className="text-left py-3 px-2.5 border-b border-indigo-100"
              />
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50">
              <td className="text-left py-3 px-2.5 border-b border-indigo-100">
                {item.id}
              </td>
              <td className="text-left py-3 px-2.5 border-b border-indigo-100">
                {item.item_name}
              </td>
              <td className="text-left py-3 px-2.5 border-b border-indigo-100">
                {item.category}
              </td>
              <td className="text-left py-3 px-2.5 border-b border-indigo-100">
                {item.stock_qty}
              </td>
              <td className="text-left py-3 px-2.5 border-b border-indigo-100">
                PHP {Number(item.unit_price).toFixed(2)}
              </td>
              {canEdit && (
                <td className="text-left py-3 px-2.5 border-b border-indigo-100">
                  <button
                    type="button"
                    className="border border-[#cbd5f5] bg-transparent text-gray-800 rounded-full py-1.5 px-3.5 font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;


