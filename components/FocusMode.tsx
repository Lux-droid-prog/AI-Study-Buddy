import React, { useState, useEffect, useCallback } from 'react';
import { TeamMember } from '../types';

const TimerDisplay: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="relative w-64 h-64 rounded-full flex items-center justify-center bg-gray-700 shadow-inner">
            <div className="absolute w-56 h-56 rounded-full bg-gray-800"></div>
            <span className="relative text-6xl font-mono font-bold text-white z-10">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </div>
    );
};

export const FocusMode: React.FC<{ teamMembers: TeamMember[] }> = ({ teamMembers }) => {
    const [mode, setMode] = useState<'individual' | 'group'>('individual');
    
    // Individual Timer State
    const [individualDuration, setIndividualDuration] = useState(25 * 60);
    const [timeLeft, setTimeLeft] = useState(individualDuration);
    const [isActive, setIsActive] = useState(false);

    // Group Timer State (simulated)
    const [isGroupSessionActive, setGroupSessionActive] = useState(false);
    const [groupTimeLeft, setGroupTimeLeft] = useState(0);
    
    useEffect(() => {
        // FIX: Changed NodeJS.Timeout to number for browser compatibility.
        let interval: number | null = null;
        
        const activeTimer = mode === 'individual' ? isActive : isGroupSessionActive;
        const currentTimerValue = mode === 'individual' ? timeLeft : groupTimeLeft;
        const setTimerValue = mode === 'individual' ? setTimeLeft : setGroupTimeLeft;

        if (activeTimer && currentTimerValue > 0) {
            interval = setInterval(() => {
                setTimerValue(prevTime => prevTime - 1);
            }, 1000);
        } else if (currentTimerValue === 0) {
            if(mode === 'individual') setIsActive(false);
            else setGroupSessionActive(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, isGroupSessionActive, timeLeft, groupTimeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);
    
    const resetTimer = useCallback(() => {
        setIsActive(false);
        setTimeLeft(individualDuration);
    }, [individualDuration]);
    
    const handleSetDuration = (minutes: number) => {
        const newDuration = minutes * 60;
        setIndividualDuration(newDuration);
        setTimeLeft(newDuration);
        setIsActive(false);
    };
    
    const startGroupSession = (minutes: number) => {
        const duration = minutes * 60;
        setGroupTimeLeft(duration);
        setGroupSessionActive(true);
    };
    
    const stopGroupSession = () => {
        setGroupSessionActive(false);
        setGroupTimeLeft(0);
    }
    
    const LeaderControls: React.FC = () => (
        <div className="flex flex-col items-center">
            <p className="text-gray-400 mb-4">Anyone can start a focus session for the whole team.</p>
            <div className="flex gap-4">
                <button onClick={() => startGroupSession(25)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">Start 25 min Session</button>
                <button onClick={() => startGroupSession(50)} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg">Start 50 min Session</button>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Focus Mode</h1>
            
            <div className="bg-gray-800 p-6 rounded-lg">
                <div className="flex justify-center mb-8 bg-gray-700 rounded-lg p-1 max-w-sm mx-auto">
                    <button onClick={() => setMode('individual')} className={`w-1/2 py-2 text-sm rounded-md transition-colors ${mode === 'individual' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:bg-gray-600'}`}>Individual</button>
                    <button onClick={() => setMode('group')} className={`w-1/2 py-2 text-sm rounded-md transition-colors ${mode === 'group' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:bg-gray-600'}`}>Group</button>
                </div>

                {mode === 'individual' && (
                    <div className="flex flex-col items-center space-y-6">
                        <TimerDisplay timeLeft={timeLeft} />
                        <div className="flex space-x-4">
                            <button onClick={toggleTimer} className={`w-32 py-3 font-bold rounded-lg ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}>
                                {isActive ? 'Pause' : 'Start'}
                            </button>
                            <button onClick={resetTimer} className="w-32 py-3 bg-red-600 hover:bg-red-700 font-bold rounded-lg">Reset</button>
                        </div>
                         <div className="flex space-x-2 text-sm">
                            <button onClick={() => handleSetDuration(25)} className={`px-4 py-2 rounded-full ${individualDuration === 25*60 ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}>25 min</button>
                            <button onClick={() => handleSetDuration(50)} className={`px-4 py-2 rounded-full ${individualDuration === 50*60 ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}>50 min</button>
                            <button onClick={() => handleSetDuration(90)} className={`px-4 py-2 rounded-full ${individualDuration === 90*60 ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}>90 min</button>
                        </div>
                    </div>
                )}
                
                {mode === 'group' && (
                    <div className="flex flex-col items-center space-y-6">
                        {isGroupSessionActive ? (
                            <>
                                <h2 className="text-2xl font-semibold">Group Session in Progress</h2>
                                <TimerDisplay timeLeft={groupTimeLeft} />
                                <button onClick={stopGroupSession} className="w-48 py-3 bg-red-600 hover:bg-red-700 font-bold rounded-lg">Stop Group Session</button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-semibold">Start a Group Focus Session</h2>
                                <LeaderControls />
                            </>
                        )}
                         <div className="w-full max-w-lg mt-8">
                            <h3 className="text-lg font-semibold text-center mb-4">Team Members</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {teamMembers.map(member => (
                                    <div key={member.id} className="bg-gray-700 p-3 rounded-lg flex items-center justify-center space-x-2">
                                        <span className={`w-3 h-3 rounded-full ${isGroupSessionActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                                        <span className="font-medium text-sm">{member.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};