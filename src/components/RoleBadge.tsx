import { UserRole } from '@/types/transaction';
import { cn } from '@/lib/utils';

interface RoleBadgeProps {
  role: UserRole;
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const styles = {
    Admin: 'bg-biztrack-primary-blue text-white',
    Accountant: 'bg-biztrack-accent-blue text-gray-800',
    Employee: 'bg-biztrack-light-blue text-gray-700',
  };

  return (
    <span className={cn('px-3 py-1 rounded-full text-sm font-medium', styles[role])}>
      {role}
    </span>
  );
};