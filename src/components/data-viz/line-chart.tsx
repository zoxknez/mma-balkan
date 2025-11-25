'use client';

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

export interface LineChartData {
  x: number | string;
  y: number;
  label?: string;
}

interface LineChartProps {
  data: LineChartData[];
  width?: number;
  height?: number;
  className?: string;
  showGrid?: boolean;
  showDots?: boolean;
  color?: string;
}

export const LineChart = memo<LineChartProps>(({
  data,
  width = 400,
  height = 200,
  className = '',
  showGrid = true,
  showDots = true,
  color = '#00ff88'
}) => {
  const { points } = useMemo(() => {
    if (data.length === 0) return { points: [] };
    
    const xValues = data.map(d => typeof d.x === 'number' ? d.x : 0);
    const yValues = data.map(d => d.y);
    
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    
    const points = data.map((d, index) => {
      const x = typeof d.x === 'number' ? d.x : index;
      const normalizedX = ((x - minX) / (maxX - minX)) * (width - 40) + 20;
      const normalizedY = height - 20 - ((d.y - minY) / (maxY - minY)) * (height - 40);
      return { x: normalizedX, y: normalizedY, original: d };
    });
    
    return { points };
  }, [data, width, height]);

  const pathData = useMemo(() => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0]!.x} ${points[0]!.y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]!;
      const curr = points[i]!;
      
      const cp1x = prev.x + (curr.x - prev.x) / 3;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) / 3;
      const cp2y = curr.y;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    
    return path;
  }, [points]);

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {showGrid && (
          <g className="opacity-20">
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={`h-${ratio}`}
                x1={20}
                y1={20 + ratio * (height - 40)}
                x2={width - 20}
                y2={20 + ratio * (height - 40)}
                stroke="currentColor"
                strokeWidth={1}
                className="text-gray-600"
              />
            ))}
            {/* Vertical grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={`v-${ratio}`}
                x1={20 + ratio * (width - 40)}
                y1={20}
                x2={20 + ratio * (width - 40)}
                y2={height - 20}
                stroke="currentColor"
                strokeWidth={1}
                className="text-gray-600"
              />
            ))}
          </g>
        )}
        
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {showDots && points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="drop-shadow-sm"
          />
        ))}
      </svg>
    </div>
  );
});

LineChart.displayName = 'LineChart';
