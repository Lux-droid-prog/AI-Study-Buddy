
import React, { useState } from 'react';
import { PresentationSlide, Project } from '../types';
import { generatePresentationOutline } from '../services/geminiService';
import { Modal } from './Modal';

interface PresentationsProps {
    projects: Project[];
    selectedProject: Project | null;
}

export const Presentations: React.FC<PresentationsProps> = ({ projects, selectedProject }) => {
    const [isBuilderOpen, setBuilderOpen] = useState(false);
    const [outline, setOutline] = useState<PresentationSlide[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!selectedProject) return;
        setIsLoading(true);
        const result = await generatePresentationOutline(selectedProject.name, selectedProject.description);
        setOutline(result);
        setIsLoading(false);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Presentations</h1>
            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold">Presentation Builder</h2>
                <p className="text-gray-400 mt-2 mb-4">
                    AI will generate a presentation outline from your project notes. 
                    {selectedProject ? ` (Using project: ${selectedProject.name})` : ' Please select a project on the Projects page first.'}
                </p>
                <button 
                    onClick={() => { handleGenerate(); setBuilderOpen(true); }} 
                    disabled={!selectedProject}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    Generate Slides Outline
                </button>
            </div>
            
            <Modal isOpen={isBuilderOpen} onClose={() => setBuilderOpen(false)} title="AI-Generated Presentation Outline">
                {isLoading && <p>Generating outline...</p>}
                {outline && !isLoading && (
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                        {outline.map((slide, index) => (
                            <div key={index} className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-bold text-blue-400">Slide {index + 1}: {slide.title}</h3>
                                <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                                    {slide.content.map((point, pIndex) => (
                                        <li key={pIndex}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
                {!outline && !isLoading && <p>Could not generate an outline. Please try again.</p>}
            </Modal>
        </div>
    );
};
