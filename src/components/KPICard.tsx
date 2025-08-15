import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number;
  currency: 'USD' | 'INR' | 'GBP';
  variant?: 'default' | 'accent';
}

export const KPICard = ({ title, value, currency, variant = 'default' }: KPICardProps) => {
  return (
    <div 
      className={cn(
        'p-6 rounded-lg shadow-sm',
        variant === 'accent' 
          ? 'bg-biztrack-primary-blue text-white' 
          : 'bg-biztrack-light-blue text-gray-800'
      )}
    >
      <h3 className={cn(
        'text-sm font-medium mb-2',
        variant === 'accent' ? 'text-white/80' : 'text-gray-600'
      )}>
        {title}
      </h3>
      <p className="text-2xl font-bold">
        {formatCurrency(value, currency)}
      </p>
    </div>
  );
};