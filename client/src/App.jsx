import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import InventoryTable from './components/InventoryTable';
import ItemForm from './components/ItemForm';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const defaultItem = {
  item_name: '',
  category: '',
  stock_qty: '',
  unit_price: '',
};

const RequireAuth = ({ user, loading, children }) => {
  if (loading) {
    return (
      <section className="bg-white rounded-[18px] p-6 shadow-[0_24px_40px_-32px_rgba(15,23,42,0.5)]">
        <p>Checking session…</p>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [itemsError, setItemsError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Session check failed', error);
      } finally {
        setSessionLoading(false);
      }
    };

    verifySession();
  }, []);

  useEffect(() => {
    if (user) {
      fetchItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchItems = async () => {
    setItemsLoading(true);
    setItemsError('');
    try {
      const response = await fetch(`${API_URL}/api/items`, {
        credentials: 'include',
      });

      if (response.status === 401) {
        await handleLogout(false);
        navigate('/login', { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error('Unable to load data');
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      setItemsError(error.message || 'Something went wrong');
    } finally {
      setItemsLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const message = response.status === 401 ? 'Invalid credentials' : 'Unable to login';
        throw new Error(message);
      }

      const data = await response.json();
      setUser(data.user);
      navigate('/app', { replace: true });
    } catch (error) {
      setAuthError(error.message || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async (redirect = true) => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      setEditingItem(null);
      if (redirect) {
        navigate('/login', { replace: true });
      }
    }
  };

  const handleCreate = async (payload) => {
    setMutating(true);
    setItemsError('');
    try {
      const response = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Unable to add item');
      }

      await fetchItems();
    } catch (error) {
      setItemsError(error.message || 'Action failed');
    } finally {
      setMutating(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingItem) return;
    setMutating(true);
    setItemsError('');
    try {
      const response = await fetch(`${API_URL}/api/items/${editingItem.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status === 404) {
        throw new Error('Item not found');
      }

      if (!response.ok) {
        throw new Error('Unable to update item');
      }

      setEditingItem(null);
      await fetchItems();
    } catch (error) {
      setItemsError(error.message || 'Action failed');
    } finally {
      setMutating(false);
    }
  };

  const LoginScreen = () => (
    <section className="bg-white rounded-[18px] p-6 shadow-[0_24px_40px_-32px_rgba(15,23,42,0.5)]">
      <LoginForm onSubmit={handleLogin} loading={authLoading || sessionLoading} error={authError} />
    </section>
  );

  const Dashboard = () => (
    <main className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
      <section className="bg-white rounded-[18px] p-6 shadow-[0_24px_40px_-32px_rgba(15,23,42,0.5)] col-span-2">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl my-2 mt-0">Items overview</h2>
            <p className="mt-1 mb-0 text-gray-500 text-[0.95rem]">
              Signed in as <strong>{user.username}</strong> ({user.role})
            </p>
          </div>
          <button
            className="border border-[#cbd5f5] bg-transparent text-gray-800 rounded-full py-1.5 px-3.5 font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            type="button"
            onClick={fetchItems}
            disabled={itemsLoading}
          >
            Refresh
          </button>
        </div>
        {itemsError && (
          <p className="bg-red-100 text-red-800 py-2 px-3 rounded-[10px]">{itemsError}</p>
        )}
        <InventoryTable items={items} loading={itemsLoading} canEdit={isAdmin} onEdit={(item) => setEditingItem(item)} />
      </section>

      {isAdmin && (
        <section className="bg-white rounded-[18px] p-6 shadow-[0_24px_40px_-32px_rgba(15,23,42,0.5)]">
          <div className="flex flex-col gap-6">
            <ItemForm
              title="Add new item"
              submitLabel="Save item"
              onSubmit={handleCreate}
              initialValues={defaultItem}
              disabled={mutating}
              resetAfterSubmit
            />
            {editingItem && (
              <ItemForm
                title={`Update #${editingItem.id}`}
                submitLabel="Update item"
                initialValues={editingItem}
                onSubmit={handleUpdate}
                disabled={mutating}
                onCancel={() => setEditingItem(null)}
              />
            )}
          </div>
        </section>
      )}
    </main>
  );

  return (
    <div className="max-w-[1100px] mx-auto pt-12 px-6 pb-20 flex flex-col gap-8">
      <header className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div>
          <p className="uppercase tracking-widest text-gray-500 text-[0.85rem] m-0">
            IT Elective 3 · Final Project
          </p>
          <h1 className="my-2 mt-2 mb-1 text-[2rem]">Inventory Access Portal</h1>
        </div>
        {user && (
          <button
            type="button"
            className="border border-[#cbd5f5] bg-transparent text-gray-800 rounded-full py-1.5 px-3.5 font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-50"
            onClick={() => handleLogout(true)}
          >
            Log out
          </button>
        )}
      </header>

      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/app"
          element={
            <RequireAuth user={user} loading={sessionLoading}>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to={user ? '/app' : '/login'} replace />} />
      </Routes>
    </div>
  );
}
export default App;

