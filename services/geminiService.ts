
import { GoogleGenAI, Type } from "@google/genai";
import { Quiz, ExplanationStyle, PresentationSlide, Task } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getChatResponse = async (history: { role: string, parts: { text: string }[] }[], newMessage: string): Promise<string> => {
    try {
        const fullHistory = [...history, { role: "user", parts: [{ text: newMessage }] }];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `The following is a conversation about a project. Act as a helpful AI assistant.
            ${fullHistory.map(m => `${m.role}: ${m.parts[0].text}`).join('\n')}
            user: ${newMessage}
            model:`,
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching chat response:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};


export const generateQuiz = async (projectContext: string): Promise<Quiz | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following project context, create a 3-question multiple-choice quiz to test understanding. Provide the question, four options, and the correct answer for each.
            
            Project Context: "${projectContext}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: 'A title for the quiz related to the project.' },
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    answer: { type: Type.STRING }
                                },
                                required: ['question', 'options', 'answer']
                            }
                        }
                    },
                    required: ['title', 'questions']
                },
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Quiz;
    } catch (error) {
        console.error("Error generating quiz:", error);
        return null;
    }
};

export const getExplanation = async (topic: string, style: ExplanationStyle): Promise<string> => {
    let prompt = `Explain the following topic: "${topic}".`;
    switch (style) {
        case ExplanationStyle.ELI5:
            prompt += " Explain it like I'm 5 years old.";
            break;
        case ExplanationStyle.PROFESSOR:
            prompt += " Explain it in a formal, academic tone, like a professor.";
            break;
        case ExplanationStyle.MEME:
            prompt += " Explain it using the format or concept of a popular internet meme.";
            break;
        case ExplanationStyle.STORY:
            prompt += " Explain it through a short, engaging story.";
            break;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting explanation:", error);
        return "Failed to get explanation.";
    }
};

export const generatePresentationOutline = async (projectName: string, projectContext: string): Promise<PresentationSlide[] | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on the project named "${projectName}" with the context "${projectContext}", generate a 5-slide presentation outline. For each slide, provide a title and 3-4 bullet points for the content.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "The title of the slide." },
                            content: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "An array of bullet points for the slide content."
                            }
                        },
                        required: ['title', 'content']
                    }
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PresentationSlide[];
    } catch (error) {
        console.error("Error generating presentation outline:", error);
        return null;
    }
};

export const analyzeTeamMood = async (moods: { member: string; mood: string; energy: number; note: string }[]): Promise<string> => {
    const moodSummary = moods.map(m => `${m.member} is feeling ${m.mood} (Energy: ${m.energy}/10) and noted: '${m.note}'`).join('. ');
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following team mood check-ins and provide a brief summary of the overall team sentiment and one actionable suggestion. Team status: ${moodSummary}`,
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing team mood:", error);
        return "Could not analyze team mood.";
    }
};

export const mediateConflict = async (conversation: string): Promise<{ analysis: string, suggestion: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following conversation for potential conflict or misunderstanding. Provide a neutral analysis of the situation and one diplomatic suggestion to resolve it. Conversation: "${conversation}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        analysis: { type: Type.STRING, description: "A neutral analysis of the conflict." },
                        suggestion: { type: Type.STRING, description: "A diplomatic suggestion to resolve it." }
                    },
                    required: ['analysis', 'suggestion']
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as { analysis: string, suggestion: string };
    } catch (error) {
        console.error("Error mediating conflict:", error);
        return { analysis: "Error analyzing conversation.", suggestion: "Please check the input and try again." };
    }
};

export const summarizeContributions = async (memberName: string, tasks: Task[]): Promise<string> => {
    if (tasks.length === 0) {
        return `${memberName} has no tasks assigned.`;
    }

    const taskSummary = tasks.map(t => `- "${t.title}" (Status: ${t.status})`).join('\n');
    const prompt = `Analyze the task list for team member "${memberName}" and provide a brief, one-paragraph summary of their workload and contributions. Focus on completed tasks and current efforts. Be encouraging and constructive. Task list:\n${taskSummary}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing contributions:", error);
        return "Could not generate contribution summary.";
    }
};