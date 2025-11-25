'use client';

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

export interface BarChartData {
  category: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  width?: number;
  height?: number;
  className?: string;
  showValues?: boolean;
  horizontal?: boolean;
}

export const BarChart = memo<BarChartProps>(({
  data,
  width = 400,
  height = 200,
  className = '',
  showValues = true,
  horizontal = false
}) => {
  const { maxValue, barWidth, barSpacing } = useMemo(() => {
    const maxValue = Math.max(...data.map(d => d.value));
    const barCount = data.length;
    const availableSpace = horizontal ? height - 40 : width - 40;
    const barWidth = (availableSpace / barCount) * 0.8;
    const barSpacing = (availableSpace / barCount) * 0.2;
    
    return { maxValue, barWidth, barSpacing };
  }, [data, width, height, horizontal]);

  const getBarProps = (item: BarChartData, index: number) => {
    const barHeight = (item.value / maxValue) * (height - 40);
    const x = horizontal ? 20 : 20 + index * (barWidth + barSpacing);
    const y = horizontal ? 20 + index * (barWidth + barSpacing) : height - 20 - barHeight;
    
    return {
      x,
      y,
      width: horizontal ? barHeight : barWidth,
      height: horizontal ? barWidth : barHeight,
      color: item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`
    };
  };

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {data.map((item, index) => {
          const props = getBarProps(item, index);
          
          return (
            <g key={item.category}>
              <motion.rect
                x={props.x}
                y={props.y}
                width={props.width}
                height={props.height}
                fill={props.color}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="drop-shadow-sm"
              />
              
              {showValues && (
                <motion.text
                  x={props.x + props.width / 2}
                  y={props.y - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                >
                  {item.value}
                </motion.text>
              )}
              
              <motion.text
                x={props.x + props.width / 2}
                y={height - 5}
                textAnchor="middle"
                className="text-xs fill-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
              >
                {item.category}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});

BarChart.displayName = 'BarChart';
