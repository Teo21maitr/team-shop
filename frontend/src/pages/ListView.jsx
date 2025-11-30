import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listApi, itemApi } from '../services/api';
import ItemRow from '../components/ItemRow';
import AddItemForm from '../components/AddItemForm';
import useWebSocket from '../hooks/useWebSocket';

/**
 * ListView Page - Vue principale de la liste
 * Mobile-first design with responsive layout
 */
export default function ListView() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPseudo, setCurrentPseudo] = useState('');

  // Handle WebSocket messages for real-time updates
  const handleWebSocketMessage = useCallback((data) => {
    console.log('Handling WebSocket event:', data);

    if (data.event === 'ITEM_ADDED' && data.item) {
      setList((prevList) => {
        if (!prevList) return prevList;
        // Check if item already exists to avoid duplicates
        const exists = prevList.items.some((item) => item.id === data.item.id);
        if (exists) return prevList;
        return {
          ...prevList,
          items: [...prevList.items, data.item],
        };
      });
    } else if (data.event === 'ITEM_UPDATED' && data.item) {
      setList((prevList) => {
        if (!prevList) return prevList;
        return {
          ...prevList,
          items: prevList.items.map((item) =>
            item.id === data.item.id ? data.item : item
          ),
        };
      });
    } else if (data.event === 'ITEM_DELETED' && data.item_id) {
      setList((prevList) => {
        if (!prevList) return prevList;
        return {
          ...prevList,
          items: prevList.items.filter((item) => item.id !== data.item_id),
        };
      });
    }
  }, []);

  // Connect to WebSocket for real-time updates
  const { isConnected } = useWebSocket(listId, handleWebSocketMessage);

  // Load list data
  useEffect(() => {
    loadList();
    // No more polling - WebSocket handles real-time updates!
  }, [listId]);

  // Load pseudo from localStorage
  useEffect(() => {
    const savedPseudo = localStorage.getItem('teamshop_pseudo');
    if (savedPseudo) {
      setCurrentPseudo(savedPseudo);
    }
  }, []);

  const loadList = async () => {
    try {
      const data = await listApi.getList(listId);
      setList(data);
      setError('');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Liste introuvable');
      } else {
        setError('Erreur de chargement');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (name) => {
    try {
      await itemApi.addItem(listId, name);
      // No need to refresh - WebSocket will update automatically
    } catch (err) {
      alert("Erreur lors de l'ajout de l'article");
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await itemApi.deleteItem(itemId, currentPseudo);
      // No need to refresh - WebSocket will update automatically
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Cet article est verrouillé par un autre utilisateur');
      } else {
        alert('Erreur lors de la suppression');
      }
      console.error(err);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(listId);
    alert('Code copié !');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <p className="text-gray-800 font-semibold mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const pendingItems = list?.items?.filter((i) => i.status === 'pending') || [];
  const claimedItems = list?.items?.filter((i) => i.status === 'claimed') || [];
  const boughtItems = list?.items?.filter((i) => i.status === 'bought') || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800">Ma Liste</h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              ✖️
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-600">Code de partage</p>
              <p className="font-mono font-bold text-indigo-600">{listId}</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              title="Copier le code"
            >
              📋
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Pending Items */}
        {pendingItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              À acheter ({pendingItems.length})
            </h2>
            <div className="space-y-2">
              {pendingItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                  currentPseudo={currentPseudo}
                />
              ))}
            </div>
          </div>
        )}

        {/* Claimed Items */}
        {claimedItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              En cours ({claimedItems.length})
            </h2>
            <div className="space-y-2">
              {claimedItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                  currentPseudo={currentPseudo}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bought Items */}
        {boughtItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Dans le panier ({boughtItems.length})
            </h2>
            <div className="space-y-2">
              {boughtItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                  currentPseudo={currentPseudo}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!list?.items?.length && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600">Aucun article pour le moment</p>
            <p className="text-gray-500 text-sm mt-2">
              Ajoutez votre premier article ci-dessous
            </p>
          </div>
        )}
      </div>

      {/* Add Item Form - Sticky Bottom */}
      <AddItemForm onAdd={handleAddItem} disabled={!list} />
    </div>
  );
}
