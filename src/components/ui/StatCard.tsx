import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: 'up' | 'down' | 'flat';
  icon?: React.ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  unit,
  change,
  changeType,
  icon,
  color = '#3b82f6',
  size = 'md',
  onClick,
}: StatCardProps) {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const valueSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-card border border-default rounded-2xl ${sizeClasses[size]} hover:border-default transition-all group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted text-sm">{title}</p>
          <p className={`${valueSizes[size]} font-black text-primary mt-1`}>
            {value}
            {unit && <span className="text-sm text-muted font-normal mr-1">{unit}</span>}
          </p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
              changeType === 'up' ? 'text-green-500' : changeType === 'down' ? 'text-red-500' : 'text-muted'
            }`}>
              {changeType === 'up' ? <TrendingUp size={12} /> : changeType === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />}
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`${iconSizes[size]} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}
            style={{ backgroundColor: `${color}15` }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
}

export function StatGrid({ children, columns = 4 }: StatGridProps) {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  return <div className={`grid ${colClasses[columns]} gap-4`}>{children}</div>;
}
