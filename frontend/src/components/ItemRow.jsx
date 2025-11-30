/**
 * ItemRow Component - Affichage d'un article
 * Component focused and reusable (SOLID)
 */
export default function ItemRow({
  item,
  onDelete,
  currentPseudo,
  isShoppingMode,
  onClick,
}) {
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering row click
    onDelete(item.id);
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
      return `${item.claimed_by} s'en occupe`;
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

  const handleClick = () => {
    if (isShoppingMode && !isLocked) {
      onClick(item);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between p-4 rounded-lg border-2 
        transition-all duration-300 ease-in-out
        animate-fadeIn
        ${getStatusColor()} 
        ${isShoppingMode && !isLocked ? 'cursor-pointer hover:shadow-md active:scale-95' : ''} 
        ${isLocked ? 'opacity-75' : ''}
        min-h-[60px]`}
      style={{
        animation: 'fadeIn 0.3s ease-in'
      }}
    >
      <div className="flex-1">
        <p
          className={`font-medium text-gray-800 transition-all duration-200 ${item.status === 'bought' ? 'line-through text-gray-500' : ''
            }`}
        >
          {item.name}
        </p>
        {getStatusText() && (
          <p className="text-sm text-gray-600 mt-1 animate-fadeIn">{getStatusText()}</p>
        )}
      </div>

      <div className="flex items-center gap-2 ml-4">
        {isLocked ? (
          <div className="text-orange-600 text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center" title="Verrouillé">
            🔒
          </div>
        ) : (
          !isShoppingMode && (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 min-w-[44px] min-h-[44px] 
                px-3 py-2 rounded-lg hover:bg-red-50 
                transition-all duration-200 
                active:scale-90"
              title="Supprimer"
              aria-label="Supprimer l'article"
            >
              🗑️
            </button>
          )
        )}
        {isShoppingMode && !isLocked && item.status === 'pending' && (
          <div className="text-gray-400 text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center">⬜</div>
        )}
        {isShoppingMode && !isLocked && item.status === 'claimed' && (
          <div className="text-orange-500 text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center animate-pulse">🟧</div>
        )}
        {isShoppingMode && item.status === 'bought' && (
          <div className="text-green-500 text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center animate-bounce-once">✅</div>
        )}
      </div>
    </div>
  );
}
