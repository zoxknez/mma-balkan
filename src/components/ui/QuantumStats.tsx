'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Target, Shield, Sword } from 'lucide-react';
import { AnimatedCounter } from './NeuralComponents';

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
  animated?: boolean;
  showPercentage?: boolean;
  icon?: React.ReactNode;
  pulse?: boolean;
}

export function QuantumStatBar({ 
  label, 
  value, 
  maxValue, 
  color = '#00ff88',
  animated = true,
  showPercentage = true,
  icon,
  pulse = false
}: StatBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / maxValue) * 100, 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  return (
    <div className="space-y-2">
      {/* Label and Value */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-gray-400">{icon}</div>}
          <span className="text-sm text-gray-300">{label}</span>
        </div>
        <div className="flex items-center space-x-2">
          <AnimatedCounter 
            value={displayValue} 
            className="text-sm font-bold text-white"
          />
          {showPercentage && (
            <span className="text-xs text-gray-400">
              ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
        {/* Background Glow */}
        <div 
          className="absolute inset-0 opacity-20 rounded-full"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
            animation: pulse ? 'pulse 2s infinite' : 'none'
          }}
        />
        
        {/* Progress Fill */}
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3,
              ease: "linear" 
            }}
          />
        </motion.div>

        {/* Particles */}
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              background: color,
              top: '50%',
              left: `${(percentage * (i + 1)) / 6}%`,
              transform: 'translateY(-50%)'
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Neural Network Visualization for Fighter Stats
interface NeuralStatsProps {
  stats: {
    striking: number;
    grappling: number;
    cardio: number;
    power: number;
    defense: number;
    aggression: number;
  };
  className?: string;
}

export function NeuralStats({ stats, className = '' }: NeuralStatsProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  
  const statNodes = [
    { key: 'striking', label: 'Striking', x: 50, y: 20, icon: <Sword className="w-4 h-4" />, color: '#ff3366' },
    { key: 'grappling', label: 'Grappling', x: 80, y: 40, icon: <Shield className="w-4 h-4" />, color: '#00ccff' },
    { key: 'cardio', label: 'Cardio', x: 70, y: 80, icon: <TrendingUp className="w-4 h-4" />, color: '#00ff88' },
    { key: 'power', label: 'Power', x: 20, y: 40, icon: <Zap className="w-4 h-4" />, color: '#ffaa00' },
    { key: 'defense', label: 'Defense', x: 30, y: 80, icon: <Shield className="w-4 h-4" />, color: '#8B5CF6' },
    { key: 'aggression', label: 'Aggression', x: 10, y: 65, icon: <Target className="w-4 h-4" />, color: '#EC4899' }
  ];

  return (
    <div className={`glass-card p-6 ${className}`}>
      <h3 className="text-lg font-bold text-white mb-6 flex items-center">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse" />
        Neural Combat Analysis
      </h3>

      {/* Neural Network Visualization */}
      <div className="relative h-64 mb-6">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Connection Lines */}
          {statNodes.map((node, i) => 
            statNodes.slice(i + 1).map((otherNode, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={node.x}
                y1={node.y}
                x2={otherNode.x}
                y2={otherNode.y}
                stroke="rgba(0, 255, 136, 0.2)"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: (i + j) * 0.1 }}
              />
            ))
          )}

          {/* Stat Nodes */}
          {statNodes.map((node, index) => {
            const statValue = stats[node.key as keyof typeof stats];
            const nodeSize = 2 + (statValue / 100) * 3;
            
            return (
              <g key={node.key}>
                {/* Node Glow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeSize + 1}
                  fill={node.color}
                  opacity="0.3"
                  className="animate-pulse"
                />
                
                {/* Main Node */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeSize}
                  fill={node.color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setActiveNode(node.key)}
                  onMouseLeave={() => setActiveNode(null)}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                />
                
                {/* Node Label */}
                <AnimatePresence>
                  {activeNode === node.key && (
                    <motion.g
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <rect
                        x={node.x - 6}
                        y={node.y - 8}
                        width="12"
                        height="4"
                        fill="rgba(0, 0, 0, 0.8)"
                        rx="1"
                      />
                      <text
                        x={node.x}
                        y={node.y - 5.5}
                        textAnchor="middle"
                        fontSize="2"
                        fill="white"
                      >
                        {node.label}: {statValue}
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detailed Stats */}
      <div className="space-y-4">
        {statNodes.map((node, index) => (
          <motion.div
            key={node.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <QuantumStatBar
              label={node.label}
              value={stats[node.key as keyof typeof stats]}
              maxValue={100}
              color={node.color}
              icon={node.icon}
              pulse={activeNode === node.key}
            />
          </motion.div>
        ))}
      </div>

      {/* Overall Rating */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Overall Combat Rating</span>
          <div className="flex items-center space-x-2">
            <AnimatedCounter 
              value={Math.round(Object.values(stats).reduce((a, b) => a + b, 0) / 6)}
              className="text-2xl font-bold text-green-400"
              suffix="/100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Momentum Graph Component
interface MomentumGraphProps {
  data: { date: string; value: number; result: 'win' | 'loss' | 'draw' }[];
  className?: string;
}

export function MomentumGraph({ data, className = '' }: MomentumGraphProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  
  return (
    <div className={`glass-card p-6 ${className}`}>
      <h3 className="text-lg font-bold text-white mb-6 flex items-center">
        <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
        Fighter Momentum
      </h3>

      <div className="relative h-48">
        <svg viewBox="0 0 300 100" className="w-full h-full">
          {/* Grid Lines */}
          {Array.from({ length: 5 }, (_, i) => (
            <line
              key={i}
              x1="0"
              y1={i * 25}
              x2="300"
              y2={i * 25}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.5"
            />
          ))}

          {/* Momentum Line */}
          <motion.path
            d={`M ${data.map((point, index) => {
              const x = (index / (data.length - 1)) * 300;
              const y = 100 - ((point.value - minValue) / (maxValue - minValue)) * 100;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}`}
            stroke="url(#momentumGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Data Points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 300;
            const y = 100 - ((point.value - minValue) / (maxValue - minValue)) * 100;
            const color = point.result === 'win' ? '#00ff88' : point.result === 'loss' ? '#ff3366' : '#ffaa00';
            
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="drop-shadow-lg"
              />
            );
          })}

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="momentumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff3366" />
              <stop offset="50%" stopColor="#ffaa00" />
              <stop offset="100%" stopColor="#00ff88" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full" />
          <span className="text-xs text-gray-300">Win</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full" />
          <span className="text-xs text-gray-300">Loss</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full" />
          <span className="text-xs text-gray-300">Draw</span>
        </div>
      </div>
    </div>
  );
}