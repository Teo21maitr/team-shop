import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listApi, itemApi } from '../services/api';
import ItemRow from '../components/ItemRow';
import AddItemForm from '../components/AddItemForm';
import PseudoModal from '../components/PseudoModal';
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
  const [isShoppingMode, setIsShoppingMode] = useState(false);
  const [showPseudoModal, setShowPseudoModal] = useState(false);

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
    } else if (data.event === 'LIST_RESET' && data.list) {
      console.log('LIST_RESET event received', data.list);
      // Replace entire list state with fresh data from server
      setList(data.list);
      // Exit shopping mode for everyone
      setIsShoppingMode(false);
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
      if (err.response?.status === 404) {
        alert('❌ Liste introuvable. Veuillez vérifier le code.');
      } else if (err.response?.status >= 500) {
        alert('⚠️ Erreur serveur. Veuillez réessayer.');
      } else {
        alert("❌ Impossible d'ajouter l'article. Vérifiez votre connexion.");
      }
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await itemApi.deleteItem(itemId, currentPseudo);
      // No need to refresh - WebSocket will update automatically
    } catch (err) {
      if (err.response?.status === 403) {
        alert('🔒 Cet article est en cours de récupération par quelqu\'un d\'autre.');
      } else if (err.response?.status === 404) {
        alert('❌ Article introuvable.');
      } else {
        alert('❌ Impossible de supprimer l\'article. Veuillez réessayer.');
      }
      console.error(err);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(listId);
    alert('Code copié !');
  };

  const toggleShoppingMode = () => {
    if (!isShoppingMode && !currentPseudo) {
      setShowPseudoModal(true);
    } else {
      setIsShoppingMode(!isShoppingMode);
    }
  };

  const handleSavePseudo = (pseudo) => {
    localStorage.setItem('teamshop_pseudo', pseudo);
    setCurrentPseudo(pseudo);
    setShowPseudoModal(false);
    setIsShoppingMode(true);
  };

  const handleItemClick = async (item) => {
    if (!isShoppingMode) return;

    try {
      if (item.status === 'pending') {
        // Claim item
        await itemApi.updateItem(item.id, {
          status: 'claimed',
          claimed_by: currentPseudo,
          current_pseudo: currentPseudo,
        });
      } else if (item.status === 'claimed' && item.claimed_by === currentPseudo) {
        // Validate item (bought)
        await itemApi.updateItem(item.id, {
          status: 'bought',
          current_pseudo: currentPseudo,
        });
      }
    } catch (err) {
      console.error('Error updating item:', err);
      if (err.response?.status === 403) {
        alert('🔒 Un autre utilisateur a déjà pris cet article.');
      } else if (err.response?.status === 404) {
        alert('❌ Article introuvable.');
      } else {
        alert('❌ Impossible de modifier l\'article. Vérifiez votre connexion.');
      }
    }
  };

  const handleResetList = async () => {
    try {
      await listApi.resetList(listId);
      // WebSocket will handle the list update and mode change
      // Don't update state here to avoid race conditions
    } catch (err) {
      console.error('Error resetting list:', err);
      if (err.response?.status >= 500) {
        alert('⚠️ Erreur serveur. Impossible de terminer les courses.');
      } else {
        alert('❌ Erreur lors de la réinitialisation. Veuillez réessayer.');
      }
    }
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
            className="bg-indigo-600 text-white px-6 py-3 min-h-[48px] rounded-lg hover:bg-indigo-700 transition-all duration-200 active:scale-95"
            aria-label="Retour à l'accueil"
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
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-gray-800">Ma Liste</h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800 min-w-[44px] min-h-[44px] flex items-center justify-center transition-transform active:scale-90"
              aria-label="Retour à l'accueil"
            >
              ✖️
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleShoppingMode}
              className={`flex-1 px-4 py-3 min-h-[48px] rounded-lg font-medium transition-all duration-200 ${isShoppingMode
                ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 active:scale-95'
                }`}
            >
              {isShoppingMode ? '🛒 Mode Courses' : '✏️ Mode Édition'}
            </button>
            <button
              onClick={handleCopyCode}
              className="bg-gray-100 text-gray-600 px-4 py-3 min-h-[48px] min-w-[48px] rounded-lg hover:bg-gray-200 transition-all duration-200 active:scale-90"
              title="Copier le code"
              aria-label="Copier le code de la liste"
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
                  isShoppingMode={isShoppingMode}
                  onClick={handleItemClick}
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
                  isShoppingMode={isShoppingMode}
                  onClick={handleItemClick}
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
                  isShoppingMode={isShoppingMode}
                  onClick={handleItemClick}
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
      {!isShoppingMode && (
        <AddItemForm onAdd={handleAddItem} disabled={!list} />
      )}

      {/* Finish Shopping Button - Sticky Bottom for Shopping Mode */}
      {isShoppingMode && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-gray-200 shadow-2xl flex justify-center animate-fadeIn">
          <button
            onClick={handleResetList}
            className="w-full max-w-4xl bg-green-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 min-h-[56px]"
            aria-label="Terminer les courses"
          >
            <span>🏁</span>
            <span>Terminer les courses</span>
          </button>
        </div>
      )}

      {/* Pseudo Modal */}
      <PseudoModal
        isOpen={showPseudoModal}
        onClose={() => setShowPseudoModal(false)}
        onSave={handleSavePseudo}
      />
    </div>
  );
}
