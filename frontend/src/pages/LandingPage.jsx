import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listApi } from '../services/api';

/**
 * Page d'accueil - Créer ou rejoindre une liste
 */
export default function LandingPage() {
  const [listCode, setListCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateList = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listApi.createList();
      navigate(`/list/${data.list_id}`);
    } catch (err) {
      setError('Erreur lors de la création de la liste');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinList = async (e) => {
    e.preventDefault();
    if (!listCode.trim()) {
      setError('Veuillez entrer un code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await listApi.getList(listCode.toUpperCase());
      navigate(`/list/${listCode.toUpperCase()}`);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Liste introuvable');
      } else {
        setError('Erreur lors de la connexion');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">TeamShop</h1>
          <p className="text-gray-600">Vos courses en équipe, en temps réel</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Create List Button */}
        <button
          onClick={handleCreateList}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl mb-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? 'Chargement...' : 'Créer une nouvelle liste'}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">ou</span>
          </div>
        </div>

        {/* Join List Form */}
        <form onSubmit={handleJoinList} className="space-y-4">
          <div>
            <label
              htmlFor="listCode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Rejoindre une liste existante
            </label>
            <input
              type="text"
              id="listCode"
              value={listCode}
              onChange={(e) => setListCode(e.target.value.toUpperCase())}
              placeholder="Entrez le code (ex: ABC123)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              maxLength={6}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !listCode.trim()}
            className="w-full bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Rejoindre
          </button>
        </form>
      </div>
    </div>
  );
}
