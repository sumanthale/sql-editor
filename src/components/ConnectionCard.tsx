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
    badge: "bg-green-600",
    border: "border-green-600",
    bg: "bg-green-50",
    name: "Development",
  },
  qa: {
    icon: "🧪",
    badge: "bg-blue-600",
    border: "border-blue-500",
    bg: "bg-blue-50",
    name: "QA",
  },
  staging: {
    icon: "🎭",
    badge: "bg-yellow-600",
    border: "border-yellow-600",
    bg: "bg-yellow-50",
    name: "Staging",
  },
  uat: {
    icon: "👥",
    badge: "bg-purple-600",
    border: "border-purple-600",
    bg: "bg-purple-50",
    name: "UAT",
  },
  prod: {
    icon: "🚀",
    badge: "bg-red-600",
    border: "border-red-600",
    bg: "bg-red-50",
    name: "Production",
  },
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
    group relative p-4 transition-synchrony rounded-lg
    ${
      isDragging
        ? "opacity-60 scale-105 shadow-theme-heavy"
        : "hover:shadow-theme-medium hover:scale-[1.02]"
    }
    border-l-4 ${envConfig.border} ${envConfig.bg}

  `}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-sm font-semibold text-theme-primary truncate">
                {connection.connectionName}
              </h3>
            </div>
          </div>

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

        <span
          className={`inline-flex items-center  px-2 py-[1px] rounded-md text-[10px] font-bold z-50
            tracking-wider
            text-theme-primary bg-theme-tertiary uppercase absolute  right-3 bottom-3 border ${envConfig.border} ${envConfig.bg}`}
        >
          {envConfig.name}
        </span>

        {/* Last Used */}
        {/* {connection.lastUsed && (
          <div className="mt-2 text-xs text-theme-muted">
            Last used: {new Date(connection.lastUsed).toLocaleDateString()}
          </div>
        )} */}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop px-4">
          <div className="card-synchrony max-w-sm w-full p-6 relative animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className=" bg-opacity-10 p-2 rounded-full">
                <Trash2 className="w-5 h-5 text-brick" />
              </div>
              <h2 className="text-lg font-semibold text-theme-primary">
                Confirm Deletion
              </h2>
            </div>
            <p className="text-sm text-theme-secondary mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-theme-primary">
                {connection.connectionName}
              </strong>
              ?<br />
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
