/**
 * PseudoModal Component
 * Modal to request user's nickname for Shopping Mode.
 */
import { useState } from 'react';

export default function PseudoModal({ isOpen, onClose, onSave }) {
    const [pseudo, setPseudo] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pseudo.trim()) {
            onSave(pseudo.trim());
            setPseudo('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Qui fait les courses ?
                </h2>
                <p className="text-gray-600 mb-4">
                    Entrez votre pseudo pour que les autres sachent quels articles vous prenez.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)}
                        placeholder="Votre pseudo (ex: Alex)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                        autoFocus
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={!pseudo.trim()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Commencer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
