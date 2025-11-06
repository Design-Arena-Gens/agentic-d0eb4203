'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useArchiveStore } from '@/lib/store';
import { KnowledgeNode, NodeRelation } from '@/lib/graph-engine';

export default function GraphVisualization() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { graph, selectNode, selectedNode } = useArchiveStore();

  useEffect(() => {
    if (!svgRef.current) return;

    const nodes = graph.getAllNodes();
    const links = graph.getAllRelations();

    if (nodes.length === 0) return;

    const width = 1200;
    const height = 800;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g');

    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .extent([[0, 0], [width, height]])
        .scaleExtent([0.1, 8])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        }) as any
    );

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(150)
        .strength(1))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', (d: NodeRelation) => d.bidirectional ? '#00ffff' : '#666')
      .attr('stroke-width', (d: NodeRelation) => d.weight * 3)
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', 'url(#arrowhead)');

    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#00ffff')
      .style('stroke', 'none');

    const nodeTypeColors: Record<string, string> = {
      character: '#ff00ff',
      concept: '#00ff00',
      location: '#ff9900',
      dialogue: '#0099ff',
      event: '#ff0066'
    };

    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d: KnowledgeNode) => 15 + d.energy * 20)
      .attr('fill', (d: KnowledgeNode) => nodeTypeColors[d.type] || '#888')
      .attr('stroke', (d: KnowledgeNode) =>
        selectedNode?.id === d.id ? '#ffffff' : '#000000'
      )
      .attr('stroke-width', (d: KnowledgeNode) =>
        selectedNode?.id === d.id ? 4 : 2
      )
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        selectNode(d as KnowledgeNode);
      })
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    const labels = g.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d: KnowledgeNode) => d.label)
      .attr('font-size', 12)
      .attr('dx', 25)
      .attr('dy', 4)
      .attr('fill', '#ffffff')
      .attr('pointer-events', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [graph, selectNode, selectedNode]);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border border-cyan-500">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
