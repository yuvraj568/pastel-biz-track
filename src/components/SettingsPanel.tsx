import { useState } from 'react';

export const SettingsPanel = () => {
  const [aiCategorization, setAiCategorization] = useState(true);
  const [inventoryLink, setInventoryLink] = useState(true);

  const roles = ['Admin', 'Accountant', 'Employee'];

  return (
    <div className="space-y-8">
      <div className="bg-biztrack-light-blue p-6 rounded-lg">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">AI Expense Categorization</h3>
              <p className="text-gray-600">Automatically categorize expenses using AI</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiCategorization}
                onChange={(e) => setAiCategorization(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-biztrack-primary-blue peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Inventory Link</h3>
              <p className="text-gray-600">Connect with inventory management system</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inventoryLink}
                onChange={(e) => setInventoryLink(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-biztrack-primary-blue peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-biztrack-light-blue p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Roles & Access</h3>
        <div className="flex space-x-4">
          {roles.map((role) => (
            <span
              key={role}
              className="px-4 py-2 bg-biztrack-accent-blue text-gray-800 rounded-full font-medium"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};