import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TopicSummary, ModuleManifest } from '../types/modules';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Network, Search } from 'lucide-react';

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

  // Palette matching Obsidian Dark Violet theme
  const moduleColors: Record<string, string> = {
    am1: '#8b5cf6', // Violet
    algebra: '#a855f7', // Purple
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

    // 1. Add Module Hub Nodes
    activeManifests.forEach(m => {
      nList.push({
        id: `mod-${m.id}`,
        label: m.name,
        type: 'module',
        moduleId: m.id,
        moduleName: m.name,
        radius: 20,
        color: moduleColors[m.id] || '#9333ea',
      });
    });

    // 2. Add Topic Nodes
    const activeTopics =
      selectedModuleFilter === 'all'
        ? topics
        : topics.filter(t => t.moduleId === selectedModuleFilter);

    activeTopics.forEach(t => {
      const nodeId = `topic-${t.moduleId}-${t.slug}`;
      const baseColor = moduleColors[t.moduleId] || '#a855f7';

      nList.push({
        id: nodeId,
        label: t.title,
        type: 'topic',
        moduleId: t.moduleId,
        moduleName: t.moduleName,
        unit: t.unit,
        radius: Math.min(14, 7 + (t.formulaCount || 1) * 1.5),
        color: baseColor,
        formulaCount: t.formulaCount || 0,
      });

      // Link topic to module hub
      if (activeManifests.some(m => m.id === t.moduleId)) {
        lList.push({
          source: `mod-${t.moduleId}`,
          target: nodeId,
          value: 1,
        });
      }
    });

    // 3. Add inter-topic links (topics in the same unit or sharing tags)
    for (let i = 0; i < activeTopics.length; i++) {
      for (let j = i + 1; j < activeTopics.length; j++) {
        const t1 = activeTopics[i];
        const t2 = activeTopics[j];
        if (t1.moduleId === t2.moduleId && t1.unit === t2.unit) {
          lList.push({
            source: `topic-${t1.moduleId}-${t1.slug}`,
            target: `topic-${t2.moduleId}-${t2.slug}`,
            value: 0.5,
          });
        }
      }
    }

    return { nodes: nList, links: lList };
  }, [manifests, topics, selectedModuleFilter]);

  // D3 Simulation setup
  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Defs for glowing filters (Obsidian neon aesthetic)
    const defs = svg.append('defs');
    const glowFilter = defs.append('filter').attr('id', 'glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const container = svg.append('g').attr('class', 'graph-container');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 4])
      .on('zoom', event => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Initial center transform
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8));

    // Force simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force(
        'link',
        d3.forceLink<GraphNode, GraphLink>(links)
          .id(d => d.id)
          .distance(d => (d.value === 1 ? 90 : 50))
      )
      .force('charge', d3.forceManyBody().strength(-120))
      .force('collide', d3.forceCollide().radius(d => (d as GraphNode).radius + 8))
      .force('center', d3.forceCenter(0, 0));

    // Links render
    const link = container
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#3b2064')
      .attr('stroke-opacity', 0.4)
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
        d3.drag<SVGGElement, GraphNode>()
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
      .attr('stroke', '#160a2c')
      .attr('stroke-width', 2)
      .attr('filter', d => (d.type === 'module' ? 'url(#glow)' : null))
      .attr('opacity', 0.9);

    // Node labels
    node
      .append('text')
      .text(d => d.label)
      .attr('font-size', d => (d.type === 'module' ? '12px' : '9px'))
      .attr('font-weight', d => (d.type === 'module' ? 'bold' : 'normal'))
      .attr('fill', d => (d.type === 'module' ? '#f1f5f9' : '#cbd5e1'))
      .attr('dx', d => d.radius + 4)
      .attr('dy', '.35em')
      .attr('pointer-events', 'none')
      .attr('font-family', 'ui-sans-serif, system-ui, sans-serif')
      .attr('opacity', d => (d.type === 'module' ? 1 : 0.8));

    // Hover & click events
    node
      .on('mouseover', (_event, d) => {
        setHoveredNode(d);
        // Highlight connected
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
            (l.source as GraphNode).id === d.id || (l.target as GraphNode).id === d.id ? 0.9 : 0.05
          )
          .attr('stroke', l =>
            (l.source as GraphNode).id === d.id || (l.target as GraphNode).id === d.id
              ? '#a855f7'
              : '#3b2064'
          );
      })
      .on('mouseout', () => {
        setHoveredNode(null);
        node.attr('opacity', 0.9);
        link.attr('stroke-opacity', 0.4).attr('stroke', '#3b2064');
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
  }, [nodes, links, topics, onSelectTopic]);

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
      d3.select(svgRef.current)
        .transition()
        .duration(350)
        .call(zoomRef.current.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8));
    }
  };

  return (
    <div className="relative w-full h-full bg-[#1e1e1e] overflow-hidden flex flex-col select-none">
      {/* Top Floating Bar: Obsidian Graph Filters */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 bg-[#181818]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#2a2a2a] shadow-lg text-xs">
        <div className="flex items-center gap-1.5 text-[#cccccc] font-medium">
          <Network className="w-3.5 h-3.5 text-purple-400" />
          <span>Grafo</span>
        </div>

        <span className="text-[#333333]">|</span>

        {/* Module Filter */}
        <div className="flex items-center gap-1 text-xs">
          <Filter className="w-3 h-3 text-[#777777]" />
          <select
            value={selectedModuleFilter}
            onChange={e => setSelectedModuleFilter(e.target.value)}
            className="bg-[#222222] text-[#cccccc] border border-[#333333] rounded px-2 py-0.5 focus:outline-none"
          >
            <option value="all">Todos los Módulos ({topics.length} temas)</option>
            {manifests.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search inside graph */}
        <div className="relative flex items-center">
          <Search className="w-3 h-3 text-[#777777] absolute left-2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-6 pr-2 py-0.5 bg-[#222222] text-[#cccccc] text-xs rounded border border-[#333333] w-24 focus:w-36 transition-all focus:outline-none"
          />
        </div>

        <span className="text-[#333333]">|</span>

        {/* Zoom Controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-[#282828] text-[#888888] hover:text-[#cccccc] transition-colors"
            title="Acercar (Zoom In)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-[#282828] text-[#888888] hover:text-[#cccccc] transition-colors"
            title="Alejar (Zoom Out)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1 rounded hover:bg-[#282828] text-[#888888] hover:text-[#cccccc] transition-colors"
            title="Centrar Grafo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hover Info Tooltip */}
      {hoveredNode && (
        <div className="absolute bottom-6 left-4 z-10 bg-[#160d26]/90 backdrop-blur-md p-3 rounded-lg border border-purple-800/50 shadow-2xl text-xs max-w-xs pointer-events-none">
          <p className="font-bold text-slate-100 text-sm mb-0.5">{hoveredNode.label}</p>
          <p className="text-purple-300 font-mono text-[11px] mb-1">
            {hoveredNode.moduleName} {hoveredNode.unit ? `• ${hoveredNode.unit}` : ''}
          </p>
          {hoveredNode.type === 'topic' && (
            <p className="text-slate-400 text-[11px]">
              {hoveredNode.formulaCount} fórmulas • <span className="text-purple-400">Clic para abrir nota</span>
            </p>
          )}
        </div>
      )}

      {/* SVG Canvas for D3 */}
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
