import { useState } from "react";

const defaultValues = {
  username: "",
  password: "",
};

function LoginForm({ onSubmit, loading, error }) {
  const [values, setValues] = useState({ username: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
      <h2 className="text-2xl my-2 mt-0">Sign in</h2>
      <p className="mt-1 mb-0 text-gray-500 text-[0.95rem]">
        Use the credentials stored in the MySQL users table.
      </p>
      <label htmlFor="username" className="font-semibold text-[0.95rem]">
        Username
      </label>
      <input
        id="username"
        name="username"
        value={values.username}
        onChange={handleChange}
        placeholder="admin"
        autoComplete="username"
        className="py-2.5 px-3 rounded-[10px] border border-gray-300 bg-white focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
        required
      />
      <label htmlFor="password" className="font-semibold text-[0.95rem]">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        placeholder="••••••••"
        autoComplete="current-password"
        className="py-2.5 px-3 rounded-[10px] border border-gray-300 bg-white focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
        required
      />
      {error && (
        <p className="bg-red-100 text-red-800 py-2 px-3 rounded-[10px]">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="py-2.5 px-4 rounded-full border-0 bg-red-400 text-white font-semibold cursor-pointer transition-colors duration-200 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in…" : "Login"}
      </button>
    </form>
  );
}

export default LoginForm;
