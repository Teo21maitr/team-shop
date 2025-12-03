/**
 * RenameModal Component
 * Modal to allow users to change their pseudo while in shopping mode.
 * Validates uniqueness and broadcasts changes via WebSocket.
 */
import { useState } from 'react';

export default function RenameModal({ isOpen, onClose, onSave, currentPseudo }) {
    const [newPseudo, setNewPseudo] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const trimmedPseudo = newPseudo.trim();

        // Validation
        if (!trimmedPseudo) {
            setError('Le pseudo ne peut pas être vide');
            return;
        }

        if (trimmedPseudo === currentPseudo) {
            setError('Vous utilisez déjà ce pseudo');
            return;
        }

        // Call parent handler for validation and save
        onSave(trimmedPseudo);
        setNewPseudo('');
        setError('');
    };

    const handleClose = () => {
        setNewPseudo('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Changer de pseudo
                </h2>
                <p className="text-gray-600 mb-2">
                    Pseudo actuel : <span className="font-semibold text-indigo-600">{currentPseudo}</span>
                </p>
                <p className="text-gray-500 text-sm mb-4">
                    Entrez votre nouveau pseudo. Les autres verront le changement en temps réel.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newPseudo}
                        onChange={(e) => setNewPseudo(e.target.value)}
                        placeholder="Nouveau pseudo"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                        autoFocus
                    />

                    {error && (
                        <p className="text-red-600 text-sm mb-4">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={!newPseudo.trim()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Confirmer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
