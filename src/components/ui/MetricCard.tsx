import React, { memo } from 'react';
import Card from './Card';

interface Props {
  label: string;
  value: string;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
}

function MetricCardInner({ label, value, sub, trend }: Props) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400';

  return (
    <Card>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {sub && <p className={`text-xs mt-1 ${trendColor}`}>{sub}</p>}
    </Card>
  );
}

export default memo(MetricCardInner);
