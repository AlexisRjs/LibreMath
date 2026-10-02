import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TopicSummary, ModuleManifest } from '../types/modules';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Network, Search, Sliders } from 'lucide-react';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'module' | 'topic';
  moduleId: string;
  moduleName: string;
  unit?: string;
  radius: number;
  color: string;
  formulaCount?: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
}

interface GraphViewProps {
  manifests: ModuleManifest[];
  topics: TopicSummary[];
  onSelectTopic: (topic: TopicSummary) => void;
}

export const GraphView: React.FC<GraphViewProps> = ({
  manifests,
  topics,
  onSelectTopic,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [density, setDensity] = useState<'compact' | 'normal' | 'relaxed'>('compact');

  // Palette matching Clean Flat Modernism & UPL Violet
  const moduleColors: Record<string, string> = {
    am1: '#7c3aed', // UPL Violet
    algebra: '#8b5cf6', // Violet Light
    'fisica-1': '#10b981', // Emerald
    am2: '#6366f1', // Indigo
    'fisica-2': '#f59e0b', // Amber
  };

  // Build nodes & links
  const { nodes, links } = useMemo(() => {
    const nList: GraphNode[] = [];
    const lList: GraphLink[] = [];

    // Filter modules
    const activeManifests =
      selectedModuleFilter === 'all'
        ? manifests
        : manifests.filter(m => m.id === selectedModuleFilter);

    // 1. Add Module Hub Nodes with spacious distributed positions in a wide circle
    activeManifests.forEach((m, idx) => {
      const angle = (idx / activeManifests.length) * 2 * Math.PI - Math.PI / 2;
      const initialR = activeManifests.length > 1 ? 520 : 0;
      nList.push({
        id: `mod-${m.id}`,
        label: m.name,
        type: 'module',
        moduleId: m.id,
        moduleName: m.name,
        radius: 20,
        color: moduleColors[m.id] || '#7c3aed',
        x: Math.cos(angle) * initialR,
        y: Math.sin(angle) * initialR,
      });
    });

    // 2. Add Topic Nodes
    const activeTopics =
      selectedModuleFilter === 'all'
        ? topics
        : topics.filter(t => t.moduleId === selectedModuleFilter);

    // Group topics per module to give them initial circular offsets
    const topicsByModule: Record<string, TopicSummary[]> = {};
    activeTopics.forEach(t => {
      if (!topicsByModule[t.moduleId]) topicsByModule[t.moduleId] = [];
      topicsByModule[t.moduleId].push(t);
    });

    activeManifests.forEach((m, mIdx) => {
      const modAngle = (mIdx / activeManifests.length) * 2 * Math.PI - Math.PI / 2;
      const modX = Math.cos(modAngle) * (activeManifests.length > 1 ? 520 : 0);
      const modY = Math.sin(modAngle) * (activeManifests.length > 1 ? 520 : 0);
      const modTopics = topicsByModule[m.id] || [];

      modTopics.forEach((t, tIdx) => {
        const nodeId = `topic-${t.moduleId}-${t.slug}`;
        const baseColor = moduleColors[t.moduleId] || '#8b5cf6';
        const topicAngle = (tIdx / modTopics.length) * 2 * Math.PI;
        const initDist = 160;

        nList.push({
          id: nodeId,
          label: t.title,
          type: 'topic',
          moduleId: t.moduleId,
          moduleName: t.moduleName,
          unit: t.unit,
          radius: Math.min(13, 7 + (t.formulaCount || 1) * 1.1),
          color: baseColor,
          formulaCount: t.formulaCount || 0,
          x: modX + Math.cos(topicAngle) * initDist,
          y: modY + Math.sin(topicAngle) * initDist,
        });

        // Independent parent-child link only (pure starburst / solar system)
        lList.push({
          source: `mod-${t.moduleId}`,
          target: nodeId,
          value: 1,
        });
      });
    });

    return { nodes: nList, links: lList };
  }, [manifests, topics, selectedModuleFilter]);

  // D3 Simulation setup: generous radial spacing, strong subject separation, gentle center hold
  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Defs for glowing filters
    const defs = svg.append('defs');
    const glowFilter = defs
      .append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const container = svg.append('g').attr('class', 'graph-container');

    // Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 5])
      .on('zoom', event => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Initial center transform (0.55 scale to view all spaced-out subjects comfortably)
    const initialScale = selectedModuleFilter === 'all' ? 0.55 : 0.85;
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(initialScale));

    // Generous distance from module hub to topics so children never superimpose
    const linkDist = density === 'compact' ? 140 : density === 'normal' ? 180 : 230;

    // Force simulation: independent materias well separated with strong module repulsion
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id(d => d.id)
          .distance(linkDist)
          .strength(0.75)
      )
      // Strong repulsion between module hubs so subjects maintain substantial separation
      .force(
        'charge',
        d3.forceManyBody().strength(d => {
          const node = d as GraphNode;
          return node.type === 'module' ? -950 : -45;
        })
      )
      // Collision detection to prevent any nodes from overlapping
      .force(
        'collide',
        d3
          .forceCollide()
          .radius(d => {
            const node = d as GraphNode;
            return node.type === 'module' ? 42 : 24;
          })
          .strength(0.95)
      )
      // Gentle center hold: stops them from escaping infinitely without clumping them together
      .force('x', d3.forceX(0).strength(0.018))
      .force('y', d3.forceY(0).strength(0.018))
      .force('center', d3.forceCenter(0, 0));

    // Links render (pure independent links from parent to child)
    const link = container
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#27272a')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.max(1, d.value * 1.5));

    // Nodes container
    const node = container
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group cursor-pointer')
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node circles with glowing gradient
    node
      .append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('stroke', '#09090b')
      .attr('stroke-width', 2)
      .attr('filter', d => (d.type === 'module' ? 'url(#glow)' : null))
      .attr('opacity', 0.95);

    // Format label to concise title (Obsidian style) to avoid clutter, full title expands on hover
    const formatLabel = (d: GraphNode) => {
      if (d.type === 'module') return d.label;
      return d.label.length > 22 ? d.label.slice(0, 20) + '…' : d.label;
    };

    // Node labels with dark halo outline for maximum legibility and contrast
    node
      .append('text')
      .text(d => formatLabel(d))
      .attr('font-size', d => (d.type === 'module' ? '12px' : '9px'))
      .attr('font-weight', d => (d.type === 'module' ? '700' : '500'))
      .attr('fill', d => (d.type === 'module' ? '#ffffff' : '#e4e4e7'))
      .attr('stroke', '#09090b')
      .attr('stroke-width', 3.5)
      .attr('paint-order', 'stroke fill')
      .attr('dx', d => d.radius + 4)
      .attr('dy', '.35em')
      .attr('pointer-events', 'none')
      .attr('font-family', 'ui-sans-serif, system-ui, sans-serif')
      .attr('opacity', d => (d.type === 'module' ? 1 : 0.85));

    // Hover & click events
    node
      .on('mouseover', (event, d) => {
        setHoveredNode(d);
        // Expand label of hovered node to full title
        d3.select(event.currentTarget).select('text').text(d.label).attr('opacity', 1);

        const connectedIds = new Set<string>();
        connectedIds.add(d.id);
        links.forEach(l => {
          const s = (l.source as GraphNode).id;
          const t = (l.target as GraphNode).id;
          if (s === d.id) connectedIds.add(t);
          if (t === d.id) connectedIds.add(s);
        });

        node.attr('opacity', o => (connectedIds.has(o.id) ? 1 : 0.15));
        link
          .attr('stroke-opacity', l =>
            (l.source as GraphNode).id === d.id || (l.target as GraphNode).id === d.id ? 0.95 : 0.05
          )
          .attr('stroke', l =>
            (l.source as GraphNode).id === d.id || (l.target as GraphNode).id === d.id
              ? '#a78bfa'
              : '#27272a'
          );
      })
      .on('mouseout', (event, d) => {
        setHoveredNode(null);
        // Restore concise label
        d3.select(event.currentTarget)
          .select('text')
          .text(formatLabel(d))
          .attr('opacity', d.type === 'module' ? 1 : 0.85);

        node.attr('opacity', 0.95);
        link.attr('stroke-opacity', 0.6).attr('stroke', '#27272a');
      })
      .on('click', (_event, d) => {
        if (d.type === 'topic') {
          const match = topics.find(
            t => t.moduleId === d.moduleId && d.id.endsWith(t.slug)
          );
          if (match) onSelectTopic(match);
        }
      });

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, topics, onSelectTopic, density]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(250).call(zoomRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(250).call(zoomRef.current.scaleBy, 0.75);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomRef.current) {
      const width = svgRef.current.clientWidth || 800;
      const height = svgRef.current.clientHeight || 600;
      const targetScale = selectedModuleFilter === 'all' ? 0.55 : 0.85;
      d3.select(svgRef.current)
        .transition()
        .duration(350)
        .call(
          zoomRef.current.transform,
          d3.zoomIdentity.translate(width / 2, height / 2).scale(targetScale)
        );
    }
  };

  return (
    <div className="relative w-full h-full bg-[#09090b] overflow-hidden flex flex-col select-none">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 bg-[#0e0e12]/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 shadow-2xl text-xs text-white">
        <div className="flex items-center gap-1.5 font-bold tracking-tight">
          <Network className="w-3.5 h-3.5 text-[#a78bfa]" />
          <span>Grafo de Conocimiento</span>
        </div>

        <span className="text-zinc-700">|</span>

        {/* Module Filter */}
        <div className="flex items-center gap-1 text-xs">
          <Filter className="w-3 h-3 text-zinc-400" />
          <select
            value={selectedModuleFilter}
            onChange={e => setSelectedModuleFilter(e.target.value)}
            className="bg-black text-white border border-zinc-800 rounded px-2 py-0.5 focus:outline-hidden focus:border-[#7c3aed] text-xs cursor-pointer"
          >
            <option value="all">Todos los Módulos ({topics.length} temas)</option>
            {manifests.map(m => (
              <option key={m.id} value={m.id} className="bg-[#0e0e12]">
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-zinc-700">|</span>

        {/* Node Spacing / Density toggle */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <Sliders className="w-3 h-3 text-zinc-400" />
          <span className="text-zinc-400">Separación:</span>
          <button
            onClick={() => setDensity('compact')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${density === 'compact'
                ? 'bg-white text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
              }`}
            title="Nodos muy cercanos y agrupados"
          >
            Cercana
          </button>
          <button
            onClick={() => setDensity('normal')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${density === 'normal'
                ? 'bg-white text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
              }`}
            title="Separación estándar"
          >
            Media
          </button>
          <button
            onClick={() => setDensity('relaxed')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${density === 'relaxed'
                ? 'bg-white text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
              }`}
            title="Mayor dispersión"
          >
            Amplia
          </button>
        </div>

        <span className="text-zinc-700">|</span>

        {/* Search inside graph */}
        <div className="relative flex items-center">
          <Search className="w-3 h-3 text-zinc-400 absolute left-2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filtrar nodo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-6 pr-2 py-0.5 bg-black text-white text-xs rounded border border-zinc-800 w-24 focus:w-36 transition-all focus:outline-hidden focus:border-[#7c3aed] placeholder:text-zinc-500"
          />
        </div>

        <span className="text-zinc-700">|</span>

        {/* Zoom Controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Acercar (Zoom In)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Alejar (Zoom Out)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Centrar y acercar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hover Info Tooltip */}
      {hoveredNode && (
        <div className="absolute bottom-6 left-4 z-10 bg-[#0e0e12]/95 backdrop-blur-md p-3.5 rounded-xl border border-zinc-800 shadow-2xl text-xs max-w-xs pointer-events-none animate-in fade-in duration-150">
          <p className="font-bold text-white text-sm mb-0.5">{hoveredNode.label}</p>
          <p className="text-[#a78bfa] font-mono text-[11px] mb-1">
            {hoveredNode.moduleName} {hoveredNode.unit ? `• ${hoveredNode.unit}` : ''}
          </p>
          {hoveredNode.type === 'topic' && (
            <p className="text-zinc-400 text-[11px] flex items-center gap-1.5">
              <span>{hoveredNode.formulaCount} fórmulas</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[#a78bfa] font-medium">Clic para abrir nota</span>
            </p>
          )}
        </div>
      )}

      {/* SVG Canvas for D3 */}
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
