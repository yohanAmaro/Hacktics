'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RequestData {
  [key: string]: any;
}

interface RequestDetailProps {
  data: RequestData;
  schema?: any;
}

export function RequestDetail({ data, schema }: RequestDetailProps) {
  const [expandedSections, setExpandedSections] = React.useState<
    Record<string, boolean>
  >({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">No especificado</span>;
    }

    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }

    if (Array.isArray(value)) {
      return (
        <div className="space-y-2 mt-2">
          {value.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
            >
              {typeof item === 'object' ? (
                <div className="space-y-1 text-sm">
                  {Object.entries(item).map(([k, v]) => (
                    <div key={k}>
                      <span className="font-medium text-gray-700">{k}: </span>
                      <span className="text-gray-600">{String(v)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-700">{String(item)}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <div className="space-y-2 mt-2 ml-4 border-l-2 border-gray-200 pl-4">
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <span className="font-medium text-gray-700">{k}: </span>
              <span className="text-gray-600">{renderValue(v)}</span>
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-gray-700">{String(value)}</span>;
  };

  return (
    <div className="space-y-3">
      {Object.entries(data).map(([key, value]) => (
        <div
          key={key}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleSection(key)}
            className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-900 capitalize">{key}</span>
            {expandedSections[key] ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {expandedSections[key] && (
            <div className="px-4 py-3 bg-white">
              {renderValue(value)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
