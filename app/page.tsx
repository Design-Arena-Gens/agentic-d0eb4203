'use client';

import { useEffect } from 'react';
import GraphVisualization from '@/components/GraphVisualization';
import ControlPanel from '@/components/ControlPanel';
import SwarmMonitor from '@/components/SwarmMonitor';
import { useArchiveStore } from '@/lib/store';

export default function Home() {
  const { seedInitialData, contextIntegral } = useArchiveStore();

  useEffect(() => {
    seedInitialData();
  }, [seedInitialData]);

  return (
    <main className="min-h-screen p-8 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          THE LIVING ARCHIVE
        </h1>
        <p className="text-gray-400 text-lg">
          A Self-Organizing Decentralized Creative Consciousness Ecosystem
        </p>
        <div className="text-cyan-400 font-mono text-sm">
          [GENESIS PROTOCOL ACTIVE] | Context Integral: Σ(N↔N) = {contextIntegral.toFixed(4)}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="h-[600px]">
            <GraphVisualization />
          </div>
        </div>
        <div className="space-y-6">
          <ControlPanel />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SwarmMonitor />
      </div>

      <footer className="text-center text-gray-600 text-sm space-y-1">
        <p>Distributed Cosmic Web Architecture | Neo4j-Inspired Graph Engine</p>
        <p>50+ Specialized LLM Agents | Swarm Consciousness Active</p>
        <p className="text-purple-500">∫(N_i ↔ N_j) dσ → Maximum Creative Emergence</p>
      </footer>
    </main>
  );
}
