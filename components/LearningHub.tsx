
import React, { useState } from 'react';
import { Quiz, ExplanationStyle } from '../types';
import { generateQuiz, getExplanation } from '../services/geminiService';
import { Modal } from './Modal';

interface LearningHubProps {
    projectContext: string;
}

export const LearningHub: React.FC<LearningHubProps> = ({ projectContext }) => {
    const [isQuizModalOpen, setQuizModalOpen] = useState(false);
    const [isExplanationModalOpen, setExplanationModalOpen] = useState(false);

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isQuizLoading, setQuizLoading] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [showQuizResults, setShowQuizResults] = useState(false);

    const [explanationTopic, setExplanationTopic] = useState('');
    const [explanationStyle, setExplanationStyle] = useState<ExplanationStyle>(ExplanationStyle.ELI5);
    const [explanation, setExplanation] = useState('');
    const [isExplanationLoading, setExplanationLoading] = useState(false);

    const handleGenerateQuiz = async () => {
        setQuizLoading(true);
        setShowQuizResults(false);
        setSelectedAnswers({});
        const newQuiz = await generateQuiz(projectContext);
        setQuiz(newQuiz);
        setQuizLoading(false);
    };
    
    const handleGetExplanation = async () => {
        if (!explanationTopic) return;
        setExplanationLoading(true);
        const result = await getExplanation(explanationTopic, explanationStyle);
        setExplanation(result);
        setExplanationLoading(false);
    }
    
    const getScore = () => {
        if (!quiz) return 0;
        return quiz.questions.reduce((score, q, i) => {
            return selectedAnswers[i] === q.answer ? score + 1 : score;
        }, 0);
    }

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Learning Hub</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* AI Quiz Generator */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold">AI Quiz Generator</h2>
                    <p className="text-gray-400 mt-2 mb-4">Generate quizzes from your active project's context to test your team's knowledge.</p>
                    <button onClick={() => { handleGenerateQuiz(); setQuizModalOpen(true); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                        Generate Quiz
                    </button>
                </div>

                {/* Explain Like I'm... */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold">Explain Like I'm...</h2>
                    <p className="text-gray-400 mt-2 mb-4">Get explanations on complex topics, tailored to your preferred learning style.</p>
                    <button onClick={() => setExplanationModalOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">
                        Get Explanation
                    </button>
                </div>
            </div>

            {/* Quiz Modal */}
            <Modal isOpen={isQuizModalOpen} onClose={() => setQuizModalOpen(false)} title={quiz?.title || "AI-Generated Quiz"}>
                {isQuizLoading && <p>Generating quiz...</p>}
                {quiz && !isQuizLoading && (
                    <div className="space-y-6">
                        {quiz.questions.map((q, qIndex) => (
                            <div key={qIndex}>
                                <p className="font-semibold">{qIndex + 1}. {q.question}</p>
                                <div className="space-y-2 mt-2">
                                    {q.options.map((option, oIndex) => (
                                        <label key={oIndex} className={`block p-3 rounded-lg border-2 ${showQuizResults ? (option === q.answer ? 'border-green-500' : (selectedAnswers[qIndex] === option ? 'border-red-500' : 'border-gray-600')) : (selectedAnswers[qIndex] === option ? 'border-blue-500 bg-blue-900/50' : 'border-gray-600')} cursor-pointer`}>
                                            <input type="radio" name={`q${qIndex}`} value={option} checked={selectedAnswers[qIndex] === option} onChange={() => setSelectedAnswers(prev => ({...prev, [qIndex]: option}))} className="hidden" disabled={showQuizResults} />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {showQuizResults && (
                            <div className="text-center font-bold text-lg p-4 bg-gray-900 rounded-lg">
                                Your Score: {getScore()} / {quiz.questions.length}
                            </div>
                        )}
                        <div className="flex justify-between gap-4">
                           <button onClick={handleGenerateQuiz} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
                                Generate New Quiz
                           </button>
                           <button onClick={() => setShowQuizResults(true)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                                Submit Answers
                           </button>
                        </div>
                    </div>
                )}
            </Modal>
            
            {/* Explanation Modal */}
            <Modal isOpen={isExplanationModalOpen} onClose={() => setExplanationModalOpen(false)} title="Get an Explanation">
                <div className="space-y-4">
                    <input type="text" placeholder="What do you want explained?" value={explanationTopic} onChange={e => setExplanationTopic(e.target.value)} className="w-full bg-gray-700 p-2 rounded text-white" />
                    <select value={explanationStyle} onChange={e => setExplanationStyle(e.target.value as ExplanationStyle)} className="w-full bg-gray-700 p-2 rounded text-white">
                        <option value={ExplanationStyle.ELI5}>Explain Like I'm 5</option>
                        <option value={ExplanationStyle.PROFESSOR}>Professor</option>
                        <option value={ExplanationStyle.MEME}>With a Meme</option>
                        <option value={ExplanationStyle.STORY}>With a Story</option>
                    </select>
                    <button onClick={handleGetExplanation} disabled={isExplanationLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500">
                        {isExplanationLoading ? "Thinking..." : "Get Explanation"}
                    </button>
                    {explanation && (
                         <div className="p-4 bg-gray-900 rounded-lg mt-4 max-h-60 overflow-y-auto">
                            <p className="text-gray-300 whitespace-pre-wrap">{explanation}</p>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};
