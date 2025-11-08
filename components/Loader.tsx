
import React from 'react';

/**
 * A loader component to indicate that content is being loaded.
 * @returns {JSX.Element} The rendered loader.
 */
export const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
            <p className="font-orbitron text-lg mt-4 text-cyan-300">J-AI is processing the transmission...</p>
            <p className="text-sm text-gray-400 mt-1">Applying exponential thinking over linearism...</p>
        </div>
    );
};
