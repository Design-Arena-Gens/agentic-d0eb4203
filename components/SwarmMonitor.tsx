'use client';

import { useEffect, useState } from 'react';
import { useArchiveStore } from '@/lib/store';
import { LLMAgent } from '@/lib/swarm-consciousness';

export default function SwarmMonitor() {
  const { swarm, activeTasks } = useArchiveStore();
  const [agents, setAgents] = useState<LLMAgent[]>([]);
  const [swarmStatus, setSwarmStatus] = useState({
    totalAgents: 0,
    idle: 0,
    working: 0,
    thinking: 0,
    totalTasksProcessed: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(swarm.getAgents());
      setSwarmStatus(swarm.getSwarmStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, [swarm]);

  return (
    <div className="space-y-6 p-6 bg-gray-900 rounded-lg border border-purple-500">
      <div className="border-b border-purple-500 pb-4">
        <h2 className="text-2xl font-bold text-purple-400 mb-2">Swarm Consciousness</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Total Agents:</span>
            <span className="ml-2 text-white font-mono">{swarmStatus.totalAgents}</span>
          </div>
          <div>
            <span className="text-gray-400">Tasks Processed:</span>
            <span className="ml-2 text-white font-mono">{swarmStatus.totalTasksProcessed}</span>
          </div>
          <div>
            <span className="text-green-400">Idle:</span>
            <span className="ml-2 text-white font-mono">{swarmStatus.idle}</span>
          </div>
          <div>
            <span className="text-yellow-400">Working:</span>
            <span className="ml-2 text-white font-mono">{swarmStatus.working}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-300">Active Tasks</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {activeTasks.length === 0 ? (
            <div className="text-gray-500 italic">No active tasks</div>
          ) : (
            activeTasks.slice(-5).reverse().map(task => (
              <div key={task.id} className="p-3 bg-black rounded border border-purple-600">
                <div className="text-sm text-purple-300 font-semibold mb-1">{task.query}</div>
                <div className="text-xs text-gray-400">
                  Subtasks: {task.decomposed.length} | Agents: {task.assignedAgents.length}
                </div>
                {task.consensus && (
                  <div className="mt-2 text-xs text-green-400">
                    ✓ Consensus: {task.consensus.consensusConfidence.toFixed(2)} confidence
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-300">Agent Grid</h3>
        <div className="grid grid-cols-10 gap-1">
          {agents.slice(0, 50).map(agent => (
            <div
              key={agent.id}
              title={`${agent.name}\n${agent.specialty}\nConfidence: ${agent.confidence.toFixed(2)}`}
              className={`w-8 h-8 rounded transition-all ${
                agent.status === 'working'
                  ? 'bg-yellow-500 animate-pulse'
                  : agent.status === 'thinking'
                  ? 'bg-purple-500'
                  : 'bg-green-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-purple-300">Specialized Agents</h3>
        <div className="grid grid-cols-2 gap-2 text-xs max-h-48 overflow-y-auto">
          {agents.slice(0, 20).map(agent => (
            <div key={agent.id} className="p-2 bg-black rounded border border-purple-700">
              <div className="text-purple-300 font-semibold">{agent.name}</div>
              <div className="text-gray-400">{agent.specialty}</div>
              <div className="text-gray-500 mt-1">
                Status: <span className={
                  agent.status === 'working' ? 'text-yellow-400' :
                  agent.status === 'thinking' ? 'text-purple-400' :
                  'text-green-400'
                }>{agent.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
