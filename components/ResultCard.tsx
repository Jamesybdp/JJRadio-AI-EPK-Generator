
import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface ResultCardProps {
  title: string;
  content: string;
  isSub?: boolean;
}

/**
 * A card component to display a result with a title and content.
 * It also includes a copy-to-clipboard functionality.
 * @param {ResultCardProps} props The component props.
 * @param {string} props.title The title of the result card.
 * @param {string} props.content The content to be displayed in the card.
 * @param {boolean} [props.isSub=false] Whether the card is a sub-card.
 * @returns {JSX.Element} The rendered result card.
 */
export const ResultCard: React.FC<ResultCardProps> = ({ title, content, isSub = false }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const titleClass = isSub 
      ? "text-md font-semibold text-purple-400"
      : "font-orbitron text-xl font-semibold text-cyan-300";

    const containerClass = isSub
      ? "bg-gray-900/70 p-4 rounded-md border border-gray-700 relative"
      : "bg-gray-800 p-5 rounded-lg border border-gray-700 relative shadow-lg";

    return (
        <div className={containerClass}>
            <div className="flex justify-between items-start">
                <h3 className={titleClass}>{title}</h3>
                <button 
                    onClick={handleCopy} 
                    className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                    aria-label={`Copy ${title}`}
                >
                    {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                </button>
            </div>
            <p className="mt-2 text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                {content}
            </p>
        </div>
    );
};
