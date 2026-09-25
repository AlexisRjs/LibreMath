import React, { useState } from 'react';
import { MathRenderer } from '../MathRenderer';
import { Grid, RefreshCw, Equal, Shuffle, CircleSlash } from 'lucide-react';

type MatrixDimension = 2 | 3 | 4 | 5;

export const MatrixCalculator: React.FC = () => {
  const [size, setSize] = useState<MatrixDimension>(3);
  const [matrix, setMatrix] = useState<number[][]>([
    [2, -1, 3, 0, 0],
    [1, 0, 2, 0, 0],
    [4, -2, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
  ]);

  const handleCellChange = (r: number, c: number, val: string) => {
    const num = parseFloat(val) || 0;
    const newM = matrix.map(row => [...row]);
    newM[r][c] = num;
    setMatrix(newM);
  };

  const handleResize = (newSize: MatrixDimension) => {
    setSize(newSize);
    const newM = Array.from({ length: 5 }, (_, r) =>
      Array.from({ length: 5 }, (_, c) => {
        if (r < matrix.length && c < matrix[r].length) {
          return matrix[r][c];
        }
        return r === c ? 1 : 0;
      })
    );
    setMatrix(newM);
  };

  const setIdentity = () => {
    const newM = Array.from({ length: 5 }, (_, i) =>
      Array.from({ length: 5 }, (_, j) => (i === j ? 1 : 0))
    );
    setMatrix(newM);
  };

  const setZeros = () => {
    const newM = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => 0));
    setMatrix(newM);
  };

  const setRandom = () => {
    const newM = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => Math.floor(Math.random() * 9) - 4)
    );
    setMatrix(newM);
  };

  // Determinant calculation (Gauss with partial pivoting)
  const det = calculateDeterminant(matrix, size);

  // Inverse calculation (Gauss-Jordan with partial pivoting)
  const inv = Math.abs(det) > 1e-9 ? calculateInverse(matrix, size) : null;

  // Transpose
  const activeSubMatrix = matrix.slice(0, size).map(row => row.slice(0, size));
  const transpose = Array.from({ length: size }, (_, colIdx) =>
    Array.from({ length: size }, (_, rowIdx) => activeSubMatrix[rowIdx][colIdx])
  );

  // Trace
  const trace = activeSubMatrix.reduce((acc, row, i) => acc + (row[i] ?? 0), 0);

  // Format matrix to LaTeX
  const matrixToLatex = (m: number[][]) => {
    const rows = m
      .slice(0, size)
      .map(r =>
        r
          .slice(0, size)
          .map(v => (Math.abs(v - Math.round(v)) < 1e-6 ? Math.round(v) : v.toFixed(2)))
          .join(' & ')
      )
      .join(' \\\\ ');
    return `\\begin{pmatrix} ${rows} \\end{pmatrix}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#dcddde] select-none">
      {/* Top Breadcrumbs */}
      <div className="h-10 border-b border-[#242424] px-4 flex items-center justify-between bg-[#181818] shrink-0 text-xs">
        <div className="flex items-center gap-2 text-[#888888]">
          <Grid className="w-3.5 h-3.5 text-purple-400" />
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="text-[#666666]">Herramientas</span>
            <span className="text-[#444444]">/</span>
            <span className="text-[#cccccc] font-medium">Calculadora Matricial</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
            {size} × {size}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full select-text">
        <div className="border-b border-[#262626] pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Calculadora de Matrices</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-800/30 font-mono">
                2×2 a 5×5
              </span>
            </h2>
            <p className="text-xs text-[#888888] mt-1">
              Cálculo de determinante, matriz inversa, transpuesta y traza en tiempo real.
            </p>
          </div>
        </div>

        {/* Dimension & Presets Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#181818] p-3 rounded-lg border border-[#262626]">
          {/* Dimension Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#888888]">Dimensión:</span>
            <div className="flex gap-1">
              {([2, 3, 4, 5] as MatrixDimension[]).map(dim => (
                <button
                  key={dim}
                  onClick={() => handleResize(dim)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    size === dim
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                      : 'bg-[#222222] text-[#888888] hover:bg-[#2c2c2c] hover:text-white'
                  }`}
                >
                  {dim} × {dim}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={setIdentity}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#222222] hover:bg-[#2a2a2a] border border-[#2e2e2e] text-[#cccccc] hover:text-white text-xs font-mono transition-colors"
              title="Cargar matriz identidad"
            >
              <RefreshCw className="w-3 h-3 text-purple-400" />
              <span>Identidad</span>
            </button>
            <button
              onClick={setZeros}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#222222] hover:bg-[#2a2a2a] border border-[#2e2e2e] text-[#cccccc] hover:text-white text-xs font-mono transition-colors"
              title="Poner todos los coeficientes en cero"
            >
              <CircleSlash className="w-3 h-3 text-rose-400" />
              <span>Nula</span>
            </button>
            <button
              onClick={setRandom}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#222222] hover:bg-[#2a2a2a] border border-[#2e2e2e] text-[#cccccc] hover:text-white text-xs font-mono transition-colors"
              title="Generar coeficientes aleatorios"
            >
              <Shuffle className="w-3 h-3 text-amber-400" />
              <span>Aleatoria</span>
            </button>
          </div>
        </div>

        {/* Interactive Matrix Input Grid & LaTeX Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="p-4 rounded-lg bg-[#181818] border border-[#262626]">
            <div className="text-xs font-mono text-[#888888] mb-3 flex items-center justify-between">
              <span className="text-slate-200 font-semibold">Matriz $A$ ({size}×{size}):</span>
              <span className="text-[10px] text-[#666666]">Edita cualquier celda</span>
            </div>

            <div
              className="grid gap-1.5 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                maxWidth: size === 5 ? '380px' : size === 4 ? '320px' : '260px',
              }}
            >
              {matrix.slice(0, size).map((row, rIdx) =>
                row.slice(0, size).map((val, cIdx) => (
                  <input
                    key={`${rIdx}-${cIdx}`}
                    type="number"
                    step="any"
                    value={val}
                    onChange={e => handleCellChange(rIdx, cIdx, e.target.value)}
                    className={`w-full text-center py-1.5 px-1 bg-[#131313] border border-[#2b2b2b] focus:border-purple-500 rounded text-white font-mono outline-none transition-colors ${
                      size >= 4 ? 'text-xs' : 'text-sm'
                    }`}
                  />
                ))
              )}
            </div>
          </div>

          {/* Live LaTeX View */}
          <div className="p-4 rounded-lg bg-[#181818] border border-[#262626] flex flex-col items-center justify-center min-h-[170px]">
            <span className="text-xs font-mono text-[#888888] mb-2 self-start">Representación $\LaTeX$:</span>
            <div className="overflow-x-auto w-full text-center py-2">
              <MathRenderer math={`A = ${matrixToLatex(matrix)}`} block copyable />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Determinant */}
          <div className="p-4 rounded-lg bg-[#181818] border border-[#262626] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#888888]">Determinante |A|</span>
              <Equal className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {Math.abs(det - Math.round(det)) < 1e-6 ? Math.round(det) : det.toFixed(4)}
            </div>
            <p className="text-[11px] text-[#777777]">
              {Math.abs(det) > 1e-9 ? (
                <span className="text-emerald-400">Invertible (rango = {size})</span>
              ) : (
                <span className="text-rose-400">Singular (rango &lt; {size})</span>
              )}
            </p>
          </div>

          {/* Trace */}
          <div className="p-4 rounded-lg bg-[#181818] border border-[#262626] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#888888]">Traza Tr(A)</span>
              <span className="text-[10px] font-mono text-purple-400">Σ a_ii</span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {Math.abs(trace - Math.round(trace)) < 1e-6 ? Math.round(trace) : trace.toFixed(2)}
            </div>
            <p className="text-[11px] text-[#777777]">Suma de la diagonal principal</p>
          </div>

          {/* Transpose preview */}
          <div className="p-4 rounded-lg bg-[#181818] border border-[#262626] space-y-1">
            <span className="text-xs font-mono text-[#888888]">Transpuesta $A^T$</span>
            <div className="overflow-x-auto text-xs py-1">
              <MathRenderer math={`A^T = ${matrixToLatex(transpose)}`} block={false} />
            </div>
          </div>
        </div>

        {/* Inverse Matrix Display */}
        <div className="p-4 rounded-lg bg-[#181818] border border-[#262626] space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-xs text-[#cccccc]">
              Matriz Inversa $A^{-1}$
            </h4>
            {Math.abs(det) > 1e-9 ? (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                Existe
              </span>
            ) : (
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded">
                No existe (det = 0)
              </span>
            )}
          </div>

          {inv ? (
            <div className="overflow-x-auto text-center py-3 bg-[#131313] rounded-lg border border-[#222222]">
              <MathRenderer math={`A^{-1} = ${matrixToLatex(inv)}`} block copyable />
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-[#1a1215] border border-rose-900/40 text-rose-300 text-xs text-center font-mono">
              La matriz es singular ($\det(A) = 0$), por lo tanto no tiene inversa.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// General N x N Determinant solver using Gaussian Elimination with Partial Pivoting
function calculateDeterminant(matrix: number[][], n: number): number {
  const m = matrix.slice(0, n).map(r => r.slice(0, n));
  let det = 1;

  for (let col = 0; col < n; col++) {
    // Find pivot row
    let maxRow = col;
    let maxVal = Math.abs(m[col][col]);
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(m[r][col]) > maxVal) {
        maxVal = Math.abs(m[r][col]);
        maxRow = r;
      }
    }

    if (maxVal < 1e-12) {
      return 0; // Singular matrix
    }

    // Swap rows if needed
    if (maxRow !== col) {
      const temp = m[col];
      m[col] = m[maxRow];
      m[maxRow] = temp;
      det = -det;
    }

    det *= m[col][col];

    // Eliminate below
    for (let r = col + 1; r < n; r++) {
      const factor = m[r][col] / m[col][col];
      for (let c = col; c < n; c++) {
        m[r][c] -= factor * m[col][c];
      }
    }
  }

  return det;
}

// General N x N Inversion solver using Gauss-Jordan on [A | I]
function calculateInverse(matrix: number[][], n: number): number[][] | null {
  // Create augmented matrix [A | I] of size n x 2n
  const aug: number[][] = Array.from({ length: n }, (_, r) => [
    ...matrix[r].slice(0, n),
    ...Array.from({ length: n }, (_, c) => (r === c ? 1 : 0)),
  ]);

  for (let col = 0; col < n; col++) {
    // Partial pivot
    let maxRow = col;
    let maxVal = Math.abs(aug[col][col]);
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(aug[r][col]) > maxVal) {
        maxVal = Math.abs(aug[r][col]);
        maxRow = r;
      }
    }

    if (maxVal < 1e-12) {
      return null; // Singular
    }

    // Swap rows
    if (maxRow !== col) {
      const temp = aug[col];
      aug[col] = aug[maxRow];
      aug[maxRow] = temp;
    }

    // Normalize pivot row
    const pivot = aug[col][col];
    for (let c = 0; c < 2 * n; c++) {
      aug[col][c] /= pivot;
    }

    // Eliminate all other rows
    for (let r = 0; r < n; r++) {
      if (r !== col) {
        const factor = aug[r][col];
        for (let c = 0; c < 2 * n; c++) {
          aug[r][c] -= factor * aug[col][c];
        }
      }
    }
  }

  // Extract right half (inverted matrix)
  const inv: number[][] = Array.from({ length: n }, (_, r) =>
    aug[r].slice(n, 2 * n)
  );

  return inv;
}
