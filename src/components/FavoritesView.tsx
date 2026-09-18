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
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#dcddde] select-none">
      {/* Obsidian Top Navigation & Breadcrumbs Bar */}
      <div className="h-10 border-b border-[#242424] px-4 flex items-center justify-between bg-[#181818] shrink-0 text-xs">
        <div className="flex items-center gap-2 text-[#888888]">
          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="text-[#666666]">Marcadores</span>
            <span className="text-[#444444]">/</span>
            <span className="text-[#cccccc] font-medium">Fórmulas Guardadas</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#242424] text-[#aaaaaa] border border-[#2e2e2e]">
            {favoriteFormulas.length} guardadas
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full select-text">
        <div className="border-b border-[#262626] pb-3">
          <h2 className="text-xl font-bold tracking-tight text-white">Fórmulas Guardadas</h2>
          <p className="text-xs text-[#888888] mt-1">
            Expresiones matemáticas marcadas para consulta rápida y análisis.
          </p>
        </div>

        {favoriteFormulas.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#181818] rounded-md border border-[#242424] p-8">
            <Bookmark className="w-8 h-8 mx-auto text-[#555555]" />
            <h3 className="text-sm font-semibold text-[#cccccc]">No tienes fórmulas guardadas aún</h3>
            <p className="text-xs text-[#777777] max-w-md mx-auto">
              Haz clic en el icono de marcador en cualquier tarjeta de fórmula para guardarla aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  className="mt-1 text-[11px] font-mono text-[#777777] hover:text-white flex items-center gap-1 transition-colors px-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Ir al tema: {topic.title}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
