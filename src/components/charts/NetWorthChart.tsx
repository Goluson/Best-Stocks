import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { mockNetWorth } from '../../mock/data';
import Card from '../ui/Card';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDollar(value: number) {
  return `$${(value / 1000).toFixed(1)}k`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm">
      <p className="text-gray-400 text-xs mb-0.5">{label && formatDate(label)}</p>
      <p className="font-semibold text-gray-900">${payload[0].value.toLocaleString()}</p>
    </div>
  );
}

export default function NetWorthChart() {
  const first = mockNetWorth[0].value;
  const last  = mockNetWorth[mockNetWorth.length - 1].value;
  const pct   = (((last - first) / first) * 100).toFixed(1);
  const isUp  = last >= first;

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Net worth over 90 days</p>
          <p className="text-2xl font-semibold text-gray-900">${last.toLocaleString()}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${isUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {isUp ? '↑' : '↓'} {pct}%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={mockNetWorth} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#f0f0ee" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval={14}
          />
          <YAxis
            tickFormatter={formatDollar}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#netWorthGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
