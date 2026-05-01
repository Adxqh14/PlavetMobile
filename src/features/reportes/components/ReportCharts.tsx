import { memo } from "react"
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from "recharts"

interface ChartDataItem {
  name: string;
  [key: string]: string | number;
}

interface PieDataItem {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export const MemoizedAreaChart = memo(({ data }: { data: ChartDataItem[] }) => (
  <ResponsiveContainer width="100%" height={350}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
      <Tooltip 
        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}}
      />
      <Area 
        type="monotone" 
        dataKey={Object.keys(data[0] || {}).find(k=>k!=='name') || 'value'} 
        stroke="var(--primary)" 
        strokeWidth={3} 
        fillOpacity={1} 
        fill="url(#colorValue)" 
      />
    </AreaChart>
  </ResponsiveContainer>
));

export const MemoizedPieChart = memo(({ data }: { data: PieDataItem[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RechartsPieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={90}
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="bottom" height={36}/>
    </RechartsPieChart>
  </ResponsiveContainer>
));

MemoizedAreaChart.displayName = 'MemoizedAreaChart'
MemoizedPieChart.displayName = 'MemoizedPieChart'
