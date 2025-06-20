import React, { useState } from "react";
import { Connection } from "../types/Connection";
import {
  Trash2,
  Database,
  Edit3,
  User,
  Network,
  Key,
  Grip,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ConnectionCardProps {
  connection: Connection;
  onDelete: (id: string) => void;
  onEdit: (connection: Connection) => void;
  onUpdatePassword: (connection: Connection) => void;
}

const environmentConfig = {
  dev: {
    icon: "🔧",
    badge: "badge-dev",
    border: "border-dark-green",
    bg: "bg-theme-accent",
    name: "Development"
  },
  qa: {
    icon: "🧪",
    badge: "badge-qa",
    border: "border-teal",
    bg: "bg-theme-accent",
    name: "QA"
  },
  staging: {
    icon: "🎭",
    badge: "badge-staging",
    border: "border-autumn",
    bg: "bg-theme-accent",
    name: "Staging"
  },
  uat: {
    icon: "👥",
    badge: "badge-uat",
    border: "border-turquoise",
    bg: "bg-theme-accent",
    name: "UAT"
  },
  prod: {
    icon: "🚀",
    badge: "badge-prod",
    border: "border-brick",
    bg: "bg-theme-accent",
    name: "Production"
  },
};

const databaseTypeConfig = {
  PostgreSQL: "db-postgresql",
  MySQL: "db-mysql",
  Oracle: "db-oracle",
};

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  onDelete,
  onEdit,
  onUpdatePassword,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: connection.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const envConfig = environmentConfig[connection.environment];

  const handleDeleteConfirmed = () => {
    onDelete(connection.id);
    setShowConfirmModal(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`
          group relative card-synchrony p-5 transition-synchrony
          ${isDragging ? "opacity-60 scale-105 shadow-theme-heavy" : "hover:shadow-theme-medium hover:scale-[1.02]"}
          ${envConfig.bg} border-l-4 ${envConfig.border}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="gradient-synchrony p-2 rounded-lg shadow-theme-light">
              <Database className="w-4 h-4 text-charcoal" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-theme-primary truncate">
                {connection.connectionName}
              </h3>
              <span className={`text-xs font-medium ${databaseTypeConfig[connection.type]}`}>
                {connection.type}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div
              {...attributes}
              {...listeners}
              className="p-1.5 rounded-lg cursor-grab active:cursor-grabbing bg-theme-secondary hover:bg-theme-tertiary border border-theme-light transition-synchrony"
              title="Drag to reorder"
            >
              <Grip className="w-4 h-4 text-theme-muted" />
            </div>
            <button
              onClick={() => onUpdatePassword(connection)}
              className="p-1.5 rounded-lg hover:bg-dark-green hover:bg-opacity-10 text-dark-green transition-synchrony"
              title="Update password"
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(connection)}
              className="p-1.5 rounded-lg hover:bg-teal hover:bg-opacity-10 text-teal transition-synchrony"
              title="Edit connection"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="p-1.5 rounded-lg hover:bg-brick hover:bg-opacity-10 text-brick transition-synchrony"
              title="Delete connection"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Connection Info */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-theme-secondary">
            <User className="w-4 h-4 text-theme-muted" />
            <span className="truncate font-medium">{connection.username}</span>
          </div>
          <div className="flex items-center gap-2 text-theme-secondary">
            <Network className="w-4 h-4 text-theme-muted" />
            <span className="truncate">
              {connection.host}:{connection.port}
            </span>
          </div>
          {connection.databaseName && (
            <div className="flex items-center gap-2 text-theme-secondary">
              <Database className="w-4 h-4 text-theme-muted" />
              <span className="truncate">{connection.databaseName}</span>
            </div>
          )}
        </div>

        {/* Environment Badge */}
        <div className="mt-4 pt-3 border-t border-theme-light">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${envConfig.badge}`}>
            <span className="mr-1">{envConfig.icon}</span>
            {envConfig.name}
          </span>
        </div>

        {/* Last Used */}
        {connection.lastUsed && (
          <div className="mt-2 text-xs text-theme-muted">
            Last used: {new Date(connection.lastUsed).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop px-4">
          <div className="card-synchrony max-w-sm w-full p-6 relative animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brick bg-opacity-10 p-2 rounded-full">
                <Trash2 className="w-5 h-5 text-brick" />
              </div>
              <h2 className="text-lg font-semibold text-theme-primary">
                Confirm Deletion
              </h2>
            </div>
            <p className="text-sm text-theme-secondary mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-theme-primary">{connection.connectionName}</strong>?<br />
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-synchrony-secondary px-4 py-2 rounded-lg text-sm transition-synchrony"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded-lg bg-brick hover:bg-opacity-90 text-white text-sm font-medium transition-synchrony"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};