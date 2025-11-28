'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'email' | 'repeater';
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  fields?: FormField[];
}

interface FormBuilderProps {
  schema: {
    title: string;
    description?: string;
    fields: FormField[];
  };
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export function FormBuilder({ schema, onSubmit, loading }: FormBuilderProps) {
  const methods = useForm({
    mode: 'onChange',
  });

  const { control, watch, formState: { errors } } = methods;

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{schema.title}</h2>
        {schema.description && (
          <p className="text-sm text-gray-600 mt-2">{schema.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {schema.fields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            control={control}
            errors={errors}
            watch={watch}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}

function FormField({ field, control, errors, watch }: any) {
  if (field.type === 'repeater') {
    return (
      <RepeaterField
        field={field}
        control={control}
        errors={errors}
        watch={watch}
      />
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>

      <Controller
        name={field.id}
        control={control}
        rules={{ required: field.required }}
        render={({ field: fieldProps }) => {
          if (field.type === 'textarea') {
            return (
              <textarea
                {...fieldProps}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            );
          }

          if (field.type === 'number') {
            return (
              <input
                type="number"
                {...fieldProps}
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            );
          }

          if (field.type === 'date') {
            return (
              <input
                type="date"
                {...fieldProps}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            );
          }

          return (
            <input
              type={field.type}
              {...fieldProps}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          );
        }}
      />

      {errors[field.id] && (
        <p className="text-red-500 text-sm mt-1">{errors[field.id]?.message}</p>
      )}
    </div>
  );
}

function RepeaterField({ field, control, errors, watch }: any) {
  const items = watch(field.id) || [];
  const [items2, setItems] = useState<any[]>(items);

  const handleAddItem = () => {
    const newItems = [
      ...items2,
      field.fields.reduce((acc: any, f: FormField) => {
        acc[f.id] = '';
        return acc;
      }, {}),
    ];
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items2.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index: number, fieldId: string, value: any) => {
    const newItems = [...items2];
    newItems[index][fieldId] = value;
    setItems(newItems);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-4">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </h3>

      <Controller
        name={field.id}
        control={control}
        render={({ field: fieldProps }) => (
          <input
            type="hidden"
            {...fieldProps}
            value={JSON.stringify(items2)}
          />
        )}
      />

      <div className="space-y-4">
        {items2.map((item: any, index: number) => (
          <div
            key={index}
            className="border border-gray-100 rounded-lg p-3 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-600">
                Item {index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-600 text-sm hover:text-red-700"
              >
                Eliminar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {field.fields.map((subField: FormField) => (
                <div key={subField.id}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {subField.label}
                  </label>
                  <input
                    type={subField.type}
                    value={item[subField.id] || ''}
                    onChange={(e) =>
                      handleItemChange(index, subField.id, e.target.value)
                    }
                    placeholder={subField.placeholder}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddItem}
        className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300"
      >
        + Agregar {field.label.toLowerCase()}
      </button>
    </div>
  );
}
