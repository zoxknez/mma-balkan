'use client';

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/animated-counter';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

interface DonutChartProps {
  data: ChartData[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabels?: boolean;
  showValues?: boolean;
}

// Helper function for polar coordinates
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export const DonutChart = memo<DonutChartProps>(({
  data,
  size = 200,
  strokeWidth = 20,
  className = '',
  showLabels = true,
  showValues = true
}) => {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
  
  const chartData = useMemo(() => {
    let cumulativePercentage = 0;
    
    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const startAngle = (cumulativePercentage / 100) * 360;
      const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
      
      cumulativePercentage += percentage;
      
      return {
        ...item,
        percentage,
        startAngle,
        endAngle,
        index
      };
    });
  }, [data, total]);

  const radius = (size - strokeWidth) / 2;

  const getPathData = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(size / 2, size / 2, radius, endAngle);
    const end = polarToCartesian(size / 2, size / 2, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${size / 2} ${size / 2} Z`;
  };

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {chartData.map((item) => (
          <motion.path
            key={item.label}
            d={getPathData(item.startAngle, item.endAngle)}
            fill={item.color || `hsl(${(item.index * 137.5) % 360}, 70%, 50%)`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: item.index * 0.1 }}
            className="drop-shadow-sm"
          />
        ))}
      </svg>
      
      {showLabels && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={total} />
            </div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
        </div>
      )}
      
      {showValues && (
        <div className="mt-4 space-y-2">
          {chartData.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color || `hsl(${(item.index * 137.5) % 360}, 70%, 50%)` }}
                />
                <span className="text-sm text-gray-300">{item.label}</span>
              </div>
              <div className="text-sm text-white font-medium">
                <AnimatedCounter value={item.value} />
                <span className="text-gray-400 ml-1">({item.percentage.toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

DonutChart.displayName = 'DonutChart';
