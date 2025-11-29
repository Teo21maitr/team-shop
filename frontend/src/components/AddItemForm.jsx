import { useState } from 'react';

/**
 * AddItemForm Component - Formulaire d'ajout d'article
 * Sticky bottom input (mobile-first)
 */
export default function AddItemForm({ onAdd, disabled }) {
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    setLoading(true);
    try {
      await onAdd(itemName.trim());
      setItemName('');
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-lg"
    >
      <div className="flex gap-2 max-w-4xl mx-auto">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Ajouter un article..."
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-base"
          disabled={disabled || loading}
        />
        <button
          type="submit"
          disabled={!itemName.trim() || disabled || loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
        >
          {loading ? '...' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}
