'use client';

import { useState } from 'react';
import { useArchiveStore } from '@/lib/store';
import { KnowledgeNode } from '@/lib/graph-engine';

export default function ControlPanel() {
  const { addNode, addRelation, graph, contextIntegral, selectedNode, submitQuery } = useArchiveStore();
  const [query, setQuery] = useState('');
  const [nodeForm, setNodeForm] = useState({
    type: 'concept' as KnowledgeNode['type'],
    label: '',
    energy: 0.85
  });
  const [relationForm, setRelationForm] = useState({
    source: '',
    target: '',
    type: '',
    weight: 0.8,
    bidirectional: true
  });

  const handleAddNode = () => {
    if (!nodeForm.label) return;

    const newNode: KnowledgeNode = {
      id: `node-${Date.now()}`,
      type: nodeForm.type,
      label: nodeForm.label,
      properties: {},
      energy: nodeForm.energy,
      cryptoKey: crypto.randomUUID()
    };

    addNode(newNode);
    setNodeForm({ type: 'concept', label: '', energy: 0.85 });
  };

  const handleAddRelation = () => {
    if (!relationForm.source || !relationForm.target || !relationForm.type) return;

    addRelation({
      source: relationForm.source,
      target: relationForm.target,
      type: relationForm.type,
      weight: relationForm.weight,
      bidirectional: relationForm.bidirectional
    });

    setRelationForm({
      source: '',
      target: '',
      type: '',
      weight: 0.8,
      bidirectional: true
    });
  };

  const handleQuery = async () => {
    if (!query.trim()) return;
    await submitQuery(query);
    setQuery('');
  };

  const allNodes = graph.getAllNodes();

  return (
    <div className="space-y-6 p-6 bg-gray-900 rounded-lg border border-cyan-500">
      <div className="border-b border-cyan-500 pb-4">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">Living Archive Control</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Total Nodes:</span>
            <span className="ml-2 text-white font-mono">{allNodes.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Relations:</span>
            <span className="ml-2 text-white font-mono">{graph.getAllRelations().length}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-400">Context Integral:</span>
            <span className="ml-2 text-cyan-400 font-mono">{contextIntegral.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-cyan-300">Swarm Query</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask the swarm consciousness..."
            className="flex-1 px-4 py-2 bg-black border border-cyan-600 rounded text-white placeholder-gray-500"
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
          />
          <button
            onClick={handleQuery}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white font-semibold transition"
          >
            Query
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-cyan-300">Add Knowledge Node</h3>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={nodeForm.type}
            onChange={(e) => setNodeForm({ ...nodeForm, type: e.target.value as KnowledgeNode['type'] })}
            className="px-3 py-2 bg-black border border-cyan-600 rounded text-white"
          >
            <option value="character">Character</option>
            <option value="concept">Concept</option>
            <option value="location">Location</option>
            <option value="dialogue">Dialogue</option>
            <option value="event">Event</option>
          </select>
          <input
            type="text"
            value={nodeForm.label}
            onChange={(e) => setNodeForm({ ...nodeForm, label: e.target.value })}
            placeholder="Label"
            className="px-3 py-2 bg-black border border-cyan-600 rounded text-white placeholder-gray-500"
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            value={nodeForm.energy}
            onChange={(e) => setNodeForm({ ...nodeForm, energy: parseFloat(e.target.value) })}
            className="px-3 py-2 bg-black border border-cyan-600 rounded text-white"
          />
          <button
            onClick={handleAddNode}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold transition"
          >
            Add Node
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-cyan-300">Add Relation</h3>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={relationForm.source}
            onChange={(e) => setRelationForm({ ...relationForm, source: e.target.value })}
            className="px-3 py-2 bg-black border border-cyan-600 rounded text-white"
          >
            <option value="">Source Node</option>
            {allNodes.map(node => (
              <option key={node.id} value={node.id}>{node.label}</option>
            ))}
          </select>
          <select
            value={relationForm.target}
            onChange={(e) => setRelationForm({ ...relationForm, target: e.target.value })}
            className="px-3 py-2 bg-black border border-cyan-600 rounded text-white"
          >
            <option value="">Target Node</option>
            {allNodes.map(node => (
              <option key={node.id} value={node.id}>{node.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={relationForm.type}
            onChange={(e) => setRelationForm({ ...relationForm, type: e.target.value })}
            placeholder="Relation Type"
            className="px-3 py-2 bg-black border border-cyan-600 rounded text-white placeholder-gray-500"
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            value={relationForm.weight}
            onChange={(e) => setRelationForm({ ...relationForm, weight: parseFloat(e.target.value) })}
            className="px-3 py-2 bg-black border border-cyan-600 rounded text-white"
          />
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={relationForm.bidirectional}
              onChange={(e) => setRelationForm({ ...relationForm, bidirectional: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Bidirectional</span>
          </label>
          <button
            onClick={handleAddRelation}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold transition"
          >
            Add Relation
          </button>
        </div>
      </div>

      {selectedNode && (
        <div className="space-y-2 p-4 bg-black rounded border border-cyan-500">
          <h3 className="text-lg font-semibold text-cyan-300">Selected Node</h3>
          <div className="space-y-1 text-sm">
            <div><span className="text-gray-400">Type:</span> <span className="text-white">{selectedNode.type}</span></div>
            <div><span className="text-gray-400">Label:</span> <span className="text-white">{selectedNode.label}</span></div>
            <div><span className="text-gray-400">Energy:</span> <span className="text-cyan-400">{selectedNode.energy.toFixed(2)}</span></div>
            <div><span className="text-gray-400">Crypto Key:</span> <span className="text-gray-600 font-mono text-xs">{selectedNode.cryptoKey.substring(0, 16)}...</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
