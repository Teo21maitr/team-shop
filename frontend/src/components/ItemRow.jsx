/**
 * ItemRow Component - Affichage d'un article
 * Component focused and reusable (SOLID)
 */
export default function ItemRow({ item, onDelete, currentPseudo }) {
  const handleDelete = () => {
    if (window.confirm('Supprimer cet article ?')) {
      onDelete(item.id);
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case 'claimed':
        return 'bg-orange-50 border-orange-200';
      case 'bought':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getStatusText = () => {
    if (item.status === 'claimed' && item.claimed_by) {
      return `Pris par ${item.claimed_by}`;
    }
    if (item.status === 'bought') {
      return 'Dans le panier';
    }
    return '';
  };

  const isLocked =
    item.status === 'claimed' &&
    item.claimed_by &&
    item.claimed_by !== currentPseudo;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${getStatusColor()}`}
    >
      <div className="flex-1">
        <p className="font-medium text-gray-800">{item.name}</p>
        {getStatusText() && (
          <p className="text-sm text-gray-600 mt-1">{getStatusText()}</p>
        )}
      </div>

      <div className="flex items-center gap-2 ml-4">
        {isLocked ? (
          <div className="text-orange-600 text-xl" title="Verrouillé">
            🔒
          </div>
        ) : (
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            title="Supprimer"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
