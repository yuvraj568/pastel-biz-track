import { SettingsPanel } from '@/components/SettingsPanel';

export const Settings = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      <SettingsPanel />
    </div>
  );
};