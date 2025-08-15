import { Home, CreditCard, FileText, Package, BarChart3, Users, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Bills', href: '/bills', icon: FileText },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-biztrack-light-blue min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">BizTrack</h1>
      </div>
      
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200',
                  isActive
                    ? 'bg-biztrack-primary-blue text-white font-medium'
                    : 'hover:bg-biztrack-accent-blue hover:text-gray-900'
                )
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};