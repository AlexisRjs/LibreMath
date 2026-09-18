import React, { useState } from 'react';
import { MathRenderer } from '../MathRenderer';
import { Grid, RefreshCw, Equal } from 'lucide-react';

export const MatrixCalculator: React.FC = () => {
  const [size, setSize] = useState<2 | 3>(3);
  const [matrix, setMatrix] = useState<number[][]>([
    [2, -1, 3],
    [1, 0, 2],
    [4, -2, 1],
  ]);

  const handleCellChange = (r: number, c: number, val: string) => {
    const num = parseFloat(val) || 0;
    const newM = matrix.map(row => [...row]);
    newM[r][c] = num;
    setMatrix(newM);
  };

  const handleResize = (newSize: 2 | 3) => {
    setSize(newSize);
    if (newSize === 2) {
      setMatrix([
        [matrix[0][0] ?? 1, matrix[0][1] ?? 2],
        [matrix[1][0] ?? 3, matrix[1][1] ?? 4],
      ]);
    } else {
      setMatrix([
        [matrix[0][0] ?? 1, matrix[0][1] ?? 2, 0],
        [matrix[1][0] ?? 3, matrix[1][1] ?? 4, 0],
        [0, 0, 1],
      ]);
    }
  };

  // Determinant calculation
  const det = calculateDeterminant(matrix, size);

  // Inverse calculation (if det != 0)
  const inv = det !== 0 ? calculateInverse(matrix, size, det) : null;

  // Transpose
  const transpose = matrix[0].map((_, colIdx) => matrix.map(row => row[colIdx]));

  // LaTeX representation of matrix
  const matrixToLatex = (m: number[][]) => {
    const rows = m
      .slice(0, size)
      .map(r => r.slice(0, size).map(v => (Number.isInteger(v) ? v : v.toFixed(2))).join(' & '))
      .join(' \\\\ ');
    return `\\begin{pmatrix} ${rows} \\end{pmatrix}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#dcddde] select-none">
      {/* Obsidian Top Navigation & Breadcrumbs Bar */}
      <div className="h-10 border-b border-[#242424] px-4 flex items-center justify-between bg-[#181818] shrink-0 text-xs">
        <div className="flex items-center gap-2 text-[#888888]">
          <Grid className="w-3.5 h-3.5 text-[#999999]" />
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="text-[#666666]">Herramientas</span>
            <span className="text-[#444444]">/</span>
            <span className="text-[#cccccc] font-medium">Calculadora Matricial</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#242424] text-[#aaaaaa] border border-[#2e2e2e]">
            {size} × {size}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full select-text">
        <div className="border-b border-[#262626] pb-3">
          <h2 className="text-xl font-bold tracking-tight text-white">Calculadora de Matrices</h2>
          <p className="text-xs text-[#888888] mt-1">
            Cálculo analítico y numérico de determinante, transpuesta e inversa en tiempo real.
          </p>
        </div>

        {/* Control bar: Dimension & Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#181818] p-2.5 rounded-md border border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#888888]">Dimensión:</span>
            <div className="flex gap-1">
              <button
                onClick={() => handleResize(2)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  size === 2
                    ? 'bg-[#2a2a2a] text-white font-bold border border-[#383838]'
                    : 'text-[#888888] hover:bg-[#222222] hover:text-white'
                }`}
              >
                2 × 2
              </button>
              <button
                onClick={() => handleResize(3)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  size === 3
                    ? 'bg-[#2a2a2a] text-white font-bold border border-[#383838]'
                    : 'text-[#888888] hover:bg-[#222222] hover:text-white'
                }`}
              >
                3 × 3
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              const identity = Array.from({ length: size }, (_, i) =>
                Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
              );
              setMatrix(identity);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#222222] hover:bg-[#2a2a2a] border border-[#2e2e2e] text-[#cccccc] hover:text-white text-xs font-mono transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Matriz Identidad
          </button>
        </div>

        {/* Interactive Matrix Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="p-4 rounded-md bg-[#181818] border border-[#262626]">
            <div className="text-xs font-mono text-[#888888] mb-3 flex items-center justify-between">
              <span>Matriz $A$:</span>
              <span className="text-[10px] text-[#666666]">Edita los coeficientes</span>
            </div>

            <div
              className="grid gap-2 max-w-xs mx-auto"
              style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
            >
              {matrix.slice(0, size).map((row, rIdx) =>
                row.slice(0, size).map((val, cIdx) => (
                  <input
                    key={`${rIdx}-${cIdx}`}
                    type="number"
                    step="any"
                    value={val}
                    onChange={e => handleCellChange(rIdx, cIdx, e.target.value)}
                    className="w-full text-center py-2 px-1 bg-[#141414] border border-[#2a2a2a] focus:border-[#555555] rounded text-white font-mono text-sm outline-none transition-colors"
                  />
                ))
              )}
            </div>
          </div>

          {/* Live LaTeX display */}
          <div className="p-4 rounded-md bg-[#181818] border border-[#262626] flex flex-col items-center justify-center min-h-[140px]">
            <span className="text-xs font-mono text-[#888888] mb-2">Expresión $\LaTeX$:</span>
            <MathRenderer math={`A = ${matrixToLatex(matrix)}`} block copyable />
          </div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Determinant */}
          <div className="p-3.5 rounded-md bg-[#181818] border border-[#262626] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#888888]">Determinante |A|</span>
              <Equal className="w-3.5 h-3.5 text-[#a78bfa]" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {Number.isInteger(det) ? det : det.toFixed(4)}
            </div>
            <p className="text-[11px] text-[#777777]">
              {det !== 0 ? (
                <span className="text-emerald-400">Invertible (rg = {size})</span>
              ) : (
                <span className="text-rose-400">Singular (rg &lt; {size})</span>
              )}
            </p>
          </div>

          {/* Trace */}
          <div className="p-3.5 rounded-md bg-[#181818] border border-[#262626] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#888888]">Traza Tr(A)</span>
              <span className="text-[11px] font-mono text-[#666666]">
                <MathRenderer math="\sum a_{ii}" block={false} />
              </span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {matrix.slice(0, size).reduce((acc, row, i) => acc + row[i], 0)}
            </div>
            <p className="text-[11px] text-[#777777]">Suma diagonal</p>
          </div>

          {/* Transpose preview */}
          <div className="p-3.5 rounded-md bg-[#181818] border border-[#262626] space-y-1">
            <span className="text-xs font-mono text-[#888888]">Transpuesta $A^T$</span>
            <div className="overflow-x-auto text-xs py-1">
              <MathRenderer math={`A^T = ${matrixToLatex(transpose)}`} block={false} />
            </div>
          </div>
        </div>

        {/* Inverse Matrix Display */}
        <div className="p-4 rounded-md bg-[#181818] border border-[#262626] space-y-2.5">
          <h4 className="font-semibold text-xs text-[#cccccc] flex items-center justify-between">
            <span>Matriz Inversa $A^{-1}$</span>
            {det !== 0 && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-2 py-0.5 rounded">
                Existe
              </span>
            )}
          </h4>

          {det !== 0 && inv ? (
            <div className="overflow-x-auto text-center py-2 bg-[#141414] rounded border border-[#222222]">
              <MathRenderer math={`A^{-1} = ${matrixToLatex(inv)}`} block copyable />
            </div>
          ) : (
            <div className="p-3 rounded bg-[#1f1616] border border-rose-900/30 text-rose-300 text-xs text-center font-mono">
              La matriz no admite inversa porque $\det(A) = 0$.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper determinant solver
function calculateDeterminant(m: number[][], size: number): number {
  if (size === 2) {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  }
  // 3x3 Sarrus or expansion
  const a = m[0][0], b = m[0][1], c = m[0][2];
  const d = m[1][0], e = m[1][1], f = m[1][2];
  const g = m[2][0], h = m[2][1], i = m[2][2];
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

// Helper inverse solver
function calculateInverse(m: number[][], size: number, det: number): number[][] {
  if (size === 2) {
    return [
      [m[1][1] / det, -m[0][1] / det],
      [-m[1][0] / det, m[0][0] / det],
    ];
  }
  const a = m[0][0], b = m[0][1], c = m[0][2];
  const d = m[1][0], e = m[1][1], f = m[1][2];
  const g = m[2][0], h = m[2][1], i = m[2][2];

  // Matrix of cofactors transposed / det
  const inv: number[][] = [
    [(e * i - f * h) / det, -(b * i - c * h) / det, (b * f - c * e) / det],
    [-(d * i - f * g) / det, (a * i - c * g) / det, -(a * f - c * d) / det],
    [(d * h - e * g) / det, -(a * h - b * g) / det, (a * e - b * d) / det],
  ];
  return inv;
}
