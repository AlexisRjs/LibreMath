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
    <div className="flex flex-col h-full bg-[#09090b] text-white select-none">
      {/* Top Breadcrumbs */}
      <div className="h-10 border-b border-zinc-800 px-4 flex items-center justify-between bg-black shrink-0 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Grid className="w-3.5 h-3.5 text-[#a78bfa]" />
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="text-zinc-500">Herramientas</span>
            <span className="text-zinc-700">/</span>
            <span className="text-white font-medium">Calculadora Matricial</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-[#a78bfa] border border-[#7c3aed]/30 font-semibold">
            {size} × {size}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full select-text">
        <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>Calculadora de Matrices</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#7c3aed]/15 text-[#c084fc] border border-[#7c3aed]/30 font-mono font-medium">
                2×2 a 5×5
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Cálculo de determinante, matriz inversa, transpuesta y traza en tiempo real.
            </p>
          </div>
        </div>

        {/* Dimension & Presets Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0e0e12] p-3.5 rounded-xl border border-zinc-800">
          {/* Dimension Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">Dimensión:</span>
            <div className="flex gap-1 bg-black p-0.5 rounded-lg border border-zinc-800">
              {([2, 3, 4, 5] as MatrixDimension[]).map(dim => (
                <button
                  key={dim}
                  onClick={() => handleResize(dim)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                    size === dim
                      ? 'bg-white text-black font-bold shadow-xs'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
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
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
              title="Cargar matriz identidad"
            >
              <RefreshCw className="w-3 h-3 text-[#a78bfa]" />
              <span>Identidad</span>
            </button>
            <button
              onClick={setZeros}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
              title="Poner todos los coeficientes en cero"
            >
              <CircleSlash className="w-3 h-3 text-rose-400" />
              <span>Nula</span>
            </button>
            <button
              onClick={setRandom}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
              title="Generar coeficientes aleatorios"
            >
              <Shuffle className="w-3 h-3 text-amber-400" />
              <span>Aleatoria</span>
            </button>
          </div>
        </div>

        {/* Interactive Matrix Input Grid & LaTeX Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="p-4 rounded-xl bg-[#0e0e12] border border-zinc-800">
            <div className="text-xs font-mono text-zinc-400 mb-3 flex items-center justify-between">
              <span className="text-white font-semibold">Matriz $A$ ({size}×{size}):</span>
              <span className="text-[10px] text-zinc-500">Edita cualquier celda</span>
            </div>

            <div
              className="grid gap-2 mx-auto"
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
                    className={`w-full text-center py-2 px-1 bg-black border border-zinc-800 focus:border-[#7c3aed] rounded-lg text-white font-mono font-semibold outline-none transition-colors ${
                      size >= 4 ? 'text-xs' : 'text-sm'
                    }`}
                  />
                ))
              )}
            </div>
          </div>

          {/* Live LaTeX View */}
          <div className="p-4 rounded-xl bg-[#0e0e12] border border-zinc-800 flex flex-col items-center justify-center min-h-[170px]">
            <span className="text-xs font-mono text-zinc-400 mb-2 self-start font-semibold">Representación $\LaTeX$:</span>
            <div className="overflow-x-auto w-full text-center py-2 text-white">
              <MathRenderer math={`A = ${matrixToLatex(matrix)}`} block copyable />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Determinant */}
          <div className="p-4 rounded-xl bg-[#0e0e12] border border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">Determinante |A|</span>
              <Equal className="w-3.5 h-3.5 text-[#a78bfa]" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {Math.abs(det - Math.round(det)) < 1e-6 ? Math.round(det) : det.toFixed(4)}
            </div>
            <p className="text-[11px] text-zinc-500">
              {Math.abs(det) > 1e-9 ? (
                <span className="text-emerald-400 font-medium">Invertible (rango = {size})</span>
              ) : (
                <span className="text-rose-400 font-medium">Singular (rango &lt; {size})</span>
              )}
            </p>
          </div>

          {/* Trace */}
          <div className="p-4 rounded-xl bg-[#0e0e12] border border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">Traza Tr(A)</span>
              <span className="text-[10px] font-mono text-[#a78bfa]">Σ a_ii</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {Math.abs(trace - Math.round(trace)) < 1e-6 ? Math.round(trace) : trace.toFixed(2)}
            </div>
            <p className="text-[11px] text-zinc-500">Suma de la diagonal principal</p>
          </div>

          {/* Transpose preview */}
          <div className="p-4 rounded-xl bg-[#0e0e12] border border-zinc-800 space-y-1">
            <span className="text-xs font-mono text-zinc-400">Transpuesta $A^T$</span>
            <div className="overflow-x-auto text-xs py-2 text-white">
              <MathRenderer math={`A^T = ${matrixToLatex(transpose)}`} block={false} />
            </div>
          </div>
        </div>

        {/* Inverse Matrix Display */}
        <div className="p-5 rounded-xl bg-[#0e0e12] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-white">
              Matriz Inversa $A^{-1}$
            </h4>
            {Math.abs(det) > 1e-9 ? (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full font-medium">
                Existe
              </span>
            ) : (
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded-full font-medium">
                No existe (det = 0)
              </span>
            )}
          </div>

          {inv ? (
            <div className="overflow-x-auto text-center py-4 bg-black rounded-lg border border-zinc-800 text-white">
              <MathRenderer math={`A^{-1} = ${matrixToLatex(inv)}`} block copyable />
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-900/40 text-rose-300 text-xs text-center font-mono">
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
