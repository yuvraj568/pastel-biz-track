export const Users = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'Accountant' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'Employee' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Users</h1>
      <div className="bg-biztrack-light-blue p-6 rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-biztrack-accent-blue">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-biztrack-accent-blue/50">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-biztrack-accent-blue text-gray-800 rounded-full text-sm font-medium">
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};