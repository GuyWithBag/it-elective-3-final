import { useEffect, useState } from "react";

const emptyState = {
  item_name: "",
  category: "",
  stock_qty: "",
  unit_price: "",
};

function ItemForm({
  title,
  submitLabel,
  initialValues = defaultItem,
  onSubmit,
  onCancel,
  disabled,
  resetAfterSubmit = false,
}) {
  const [values, setValues] = useState(initialValues);
  const inputPrefix = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const makeId = (suffix) => `${inputPrefix}-${suffix}`;

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...values,
      stock_qty: Number(values.stock_qty),
      unit_price: Number(values.unit_price),
    });
    if (resetAfterSubmit) {
      setValues(defaultItem);
    }
  };

  return (
    <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between gap-4 mb-1">
        <h3 className="text-xl">{title}</h3>
        {onCancel && (
          <button
            type="button"
            className="border border-[#cbd5f5] bg-transparent text-gray-800 rounded-full py-1.5 px-3.5 font-semibold cursor-pointer transition-colors duration-200 hover:bg-white"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
      <label
        htmlFor={makeId("item-name")}
        className="font-semibold text-[0.95rem]"
      >
        Item name
      </label>
      <input
        id={makeId("item-name")}
        name="item_name"
        value={values.item_name}
        onChange={handleChange}
        placeholder="Device name"
        className="py-2.5 px-3 rounded-[10px] border border-gray-300 bg-white focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
        required
      />
      <label
        htmlFor={makeId("category")}
        className="font-semibold text-[0.95rem]"
      >
        Category
      </label>
      <input
        id={makeId("category")}
        name="category"
        value={values.category}
        onChange={handleChange}
        placeholder="Laptop, Accessories..."
        className="py-2.5 px-3 rounded-[10px] border border-gray-300 bg-white focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
        required
      />
      <label htmlFor={makeId("stock")} className="font-semibold text-[0.95rem]">
        Stock quantity
      </label>
      <input
        id={makeId("stock")}
        name="stock_qty"
        type="number"
        min="0"
        value={values.stock_qty}
        onChange={handleChange}
        className="py-2.5 px-3 rounded-[10px] border border-gray-300 bg-white focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
        required
      />
      <label htmlFor={makeId("price")} className="font-semibold text-[0.95rem]">
        Unit price
      </label>
      <input
        id={makeId("price")}
        name="unit_price"
        type="number"
        min="0"
        step="0.01"
        value={values.unit_price}
        onChange={handleChange}
        className="py-2.5 px-3 rounded-[10px] border border-gray-300 bg-white focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
        required
      />
      <button
        type="submit"
        disabled={disabled}
        className="py-2.5 px-4 rounded-full border-0 bg-red-400 text-white font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {disabled ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

export default ItemForm;
