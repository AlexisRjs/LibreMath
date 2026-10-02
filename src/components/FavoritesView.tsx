import React from 'react';
import { Topic, FormulaItem } from '../types/modules';
import { FormulaCard } from './FormulaCard';
import { Bookmark, ExternalLink } from 'lucide-react';

interface FavoritesViewProps {
  topics: Topic[];
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onOpenCalculator?: (formula: FormulaItem) => void;
  onSelectTopic: (topic: Topic) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  topics,
  favoriteIds,
  onToggleFavorite,
  onOpenCalculator,
  onSelectTopic,
}) => {
  // Collect all favorite formulas
  const favoriteFormulas: { formula: FormulaItem; topic: Topic }[] = [];

  for (const t of topics) {
    for (const f of t.formulas || []) {
      if (favoriteIds.includes(f.id)) {
        favoriteFormulas.push({ formula: f, topic: t });
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-white select-none">
      {/* Modern Top Breadcrumbs Bar */}
      <div className="h-10 border-b border-zinc-800 px-4 flex items-center justify-between bg-black shrink-0 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Bookmark className="w-3.5 h-3.5 text-[#7c3aed] fill-current" />
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="text-zinc-500">Marcadores</span>
            <span className="text-zinc-700">/</span>
            <span className="text-white font-medium">Fórmulas Guardadas</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
            {favoriteFormulas.length} guardadas
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full select-text">
        <div className="border-b border-zinc-800 pb-3">
          <h2 className="text-xl font-bold tracking-tight text-white">Fórmulas Guardadas</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Expresiones matemáticas marcadas para consulta rápida y análisis.
          </p>
        </div>

        {favoriteFormulas.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#0e0e12] rounded-xl border border-zinc-800 p-8 shadow-sm">
            <Bookmark className="w-8 h-8 mx-auto text-zinc-600" />
            <h3 className="text-sm font-semibold text-zinc-200">No tienes fórmulas guardadas aún</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Haz clic en el icono de marcador en cualquier tarjeta de fórmula para guardarla aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {favoriteFormulas.map(({ formula, topic }) => (
              <div key={formula.id} className="relative group/fav">
                <FormulaCard
                  formula={formula}
                  onOpenCalculator={onOpenCalculator}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                />
                <button
                  onClick={() => onSelectTopic(topic)}
                  className="mt-1 text-[11px] font-mono text-zinc-400 hover:text-white hover:underline flex items-center gap-1 transition-colors px-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3 text-[#a78bfa]" />
                  <span>Ir al tema: <strong className="text-white font-medium">{topic.title}</strong></span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
