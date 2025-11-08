
import React from 'react';

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
}

/**
 * A reusable text area field component.
 * @param {TextAreaFieldProps} props The component props.
 * @param {string} props.label The label for the text area field.
 * @param {string} props.name The name of the text area field.
 * @returns {JSX.Element} The rendered text area field.
 */
export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, name, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-cyan-300 mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className="block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition"
        {...props}
      />
    </div>
  );
};
