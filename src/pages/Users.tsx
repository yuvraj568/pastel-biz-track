import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserManagementModal } from '@/components/UserManagementModal';
import { supabase } from '@/integrations/supabase/client';
import { Users as UsersIcon, Plus } from 'lucide-react';
import { UserRole } from '@/types/transaction';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('users');
      if (error) throw error;
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data if API fails
      setUsers([
        { id: '1', name: 'John Doe', email: 'john@company.com', role: 'Admin', created_at: '2024-01-01' },
        { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'Accountant', created_at: '2024-01-02' },
        { id: '3', name: 'Mike Johnson', email: 'mike@company.com', role: 'Employee', created_at: '2024-01-03' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-primary text-primary-foreground';
      case 'Accountant':
        return 'bg-secondary text-secondary-foreground';
      case 'Employee':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <UsersIcon className="w-6 h-6" />
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Manage Users</span>
        </Button>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-card-foreground">Name</th>
                <th className="text-left py-3 px-4 font-medium text-card-foreground">Email</th>
                <th className="text-left py-3 px-4 font-medium text-card-foreground">Role</th>
                <th className="text-left py-3 px-4 font-medium text-card-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-border/50">
                    <td className="py-3 px-4 text-card-foreground">{user.name}</td>
                    <td className="py-3 px-4 text-card-foreground">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserManagementModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};