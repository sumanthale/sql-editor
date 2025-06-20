import React, { useState } from 'react';
import { Connection, DatabaseType, EnvironmentType } from '../types/Connection';
import { X, Eye, EyeOff, Database, Shield, Sparkles, Check, AlertCircle, ChevronDown } from 'lucide-react';

interface AddConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (connection: Omit<Connection, 'id' | 'order'>) => void;
}

const defaultPorts = {
  PostgreSQL: 5432,
  MySQL: 3306,
  Oracle: 1521,
};

const databaseTypes: { value: DatabaseType; label: string; icon: string }[] = [
  { value: 'PostgreSQL', label: 'PostgreSQL', icon: '🐘' },
  { value: 'MySQL', label: 'MySQL', icon: '🐬' },
  { value: 'Oracle', label: 'Oracle', icon: '🔶' },
];

const environmentOptions: { value: EnvironmentType; label: string; icon: string }[] = [
  { value: 'dev', label: 'Development', icon: '🔧' },
  { value: 'qa', label: 'QA', icon: '🧪' },
  { value: 'staging', label: 'Staging', icon: '🎭' },
  { value: 'uat', label: 'UAT', icon: '👥' },
  { value: 'prod', label: 'Production', icon: '🚀' },
];

export const AddConnectionModal: React.FC<AddConnectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    type: 'PostgreSQL' as DatabaseType,
    connectionName: '',
    databaseName: '',
    host: 'localhost',
    port: defaultPorts.PostgreSQL,
    username: '',
    password: '',
    environment: 'dev' as EnvironmentType,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTypeChange = (type: DatabaseType) => {
    setFormData(prev => ({
      ...prev,
      type,
      port: defaultPorts[type],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      type: 'PostgreSQL',
      connectionName: '',
      databaseName: '',
      host: 'localhost',
      port: defaultPorts.PostgreSQL,
      username: '',
      password: '',
      environment: 'dev',
    });
    setShowPassword(false);
    setTestResult(null);
    onClose();
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestResult(null);
    
    // Simulate connection test
    setTimeout(() => {
      const isValid = formData.connectionName && formData.host && formData.username;
      setTestResult(isValid ? 'success' : 'error');
      setIsTestingConnection(false);
    }, 2000);
  };

  if (!isOpen) return null;

  const selectedDbType = databaseTypes.find(db => db.value === formData.type);
  const selectedEnv = environmentOptions.find(env => env.value === formData.environment);

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <div className="card-synchrony w-full max-w-md overflow-hidden border-0 shadow-theme-heavy">
        {/* Compact Header */}
        <div className="gradient-synchrony px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-charcoal" />
            <h2 className="text-lg font-bold text-charcoal">New Connection</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-charcoal hover:text-opacity-80 p-1 rounded transition-synchrony"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Database Type & Environment Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-theme-primary mb-1 block">Database Type</label>
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value as DatabaseType)}
                  className="input-synchrony w-full px-3 py-2 pr-8 text-sm appearance-none cursor-pointer"
                >
                  {databaseTypes.map((db) => (
                    <option key={db.value} value={db.value}>
                      {db.icon} {db.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-theme-primary mb-1 block">Environment</label>
              <div className="relative">
                <select
                  value={formData.environment}
                  onChange={(e) => setFormData(prev => ({ ...prev, environment: e.target.value as EnvironmentType }))}
                  className="input-synchrony w-full px-3 py-2 pr-8 text-sm appearance-none cursor-pointer"
                >
                  {environmentOptions.map((env) => (
                    <option key={env.value} value={env.value}>
                      {env.icon} {env.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Connection Name */}
          <div>
            <label className="text-xs font-medium text-theme-primary mb-1 block">Connection Name *</label>
            <input
              type="text"
              value={formData.connectionName}
              required
              onChange={(e) => setFormData(prev => ({ ...prev, connectionName: e.target.value }))}
              className="input-synchrony w-full px-3 py-2 text-sm"
              placeholder="My Database Connection"
            />
          </div>

          {/* Host & Port Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium text-theme-primary mb-1 block">Host *</label>
              <input
                type="text"
                value={formData.host}
                required
                onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
                className="input-synchrony w-full px-3 py-2 text-sm"
                placeholder="localhost"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-theme-primary mb-1 block">Port *</label>
              <input
                type="number"
                value={formData.port}
                required
                onChange={(e) => setFormData(prev => ({ ...prev, port: parseInt(e.target.value) || 0 }))}
                className="input-synchrony w-full px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Username & Database Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-theme-primary mb-1 block">Username *</label>
              <input
                type="text"
                value={formData.username}
                required
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="input-synchrony w-full px-3 py-2 text-sm"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-theme-primary mb-1 block">Database</label>
              <input
                type="text"
                value={formData.databaseName}
                onChange={(e) => setFormData(prev => ({ ...prev, databaseName: e.target.value }))}
                className="input-synchrony w-full px-3 py-2 text-sm"
                placeholder="database_name"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-theme-primary mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="input-synchrony w-full px-3 py-2 pr-10 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-primary transition-synchrony"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              testResult === 'success' 
                ? 'bg-dark-green bg-opacity-10 text-dark-green' 
                : 'bg-brick bg-opacity-10 text-brick'
            }`}>
              {testResult === 'success' ? (
                <Check className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="font-medium">
                {testResult === 'success' ? 'Connection successful!' : 'Connection failed'}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="flex-1 bg-dark-green text-white py-2 px-3 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-synchrony font-medium text-sm flex items-center justify-center gap-2"
            >
              {isTestingConnection ? (
                <>
                  <div className="spinner-synchrony w-3 h-3" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Shield className="w-3 h-3" />
                  <span>Test</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleClose}
              className="btn-synchrony-secondary px-4 py-2 rounded-lg transition-synchrony font-medium text-sm"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="btn-synchrony-primary flex-1 py-2 px-3 rounded-lg transition-synchrony font-medium text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3 h-3" />
              <span>Create</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};