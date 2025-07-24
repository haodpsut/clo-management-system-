import { GoogleGenAI } from "@google/genai";

const getApiKey = (): string => {
    if (typeof window === 'undefined') return '';
    const key = localStorage.getItem('gemini_api_key');
    return key ? JSON.parse(key) : '';
};

const getAiClient = () => {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("Khóa API Gemini không được tìm thấy. Vui lòng thiết lập nó trong phần Cài đặt.");
    }
    return new GoogleGenAI({ apiKey });
};

const handleApiError = (error: unknown, context: string): Error => {
    console.error(`Lỗi trong ${context}:`, error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid') || error.message.toLowerCase().includes('invalid api key')) {
            return new Error('Khóa API Gemini không hợp lệ. Vui lòng kiểm tra lại trong Cài đặt.');
        }
    }
    return new Error(`Đã xảy ra lỗi khi ${context}. Vui lòng kiểm tra khóa API, kết nối mạng và thử lại.`);
}

export const suggestCloDescription = async (bloomLevel: string, courseName: string, courseDescription: string): Promise<string> => {
    const ai = getAiClient();
    const prompt = `
        You are an expert in academic curriculum design.
        Generate a clear, measurable, and concise Course Learning Outcome (CLO) description for a university-level course.
        
        Course Name: ${courseName}
        Course Description: ${courseDescription}
        Bloom's Taxonomy Level: ${bloomLevel}
        
        The description should start with an action verb appropriate for the specified Bloom's level. 
        It should be a single sentence. Do not add any prefixes like "CLO Description:".
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });
        return response.text.trim();
    } catch (error) {
        throw handleApiError(error, 'tạo mô tả CLO');
    }
};


export const suggestBloomLevel = async (description: string): Promise<string> => {
    const ai = getAiClient();
    const prompt = `
      Analyze the following Course Learning Outcome (CLO) description and determine its corresponding level in Bloom's Taxonomy.
      The possible levels are: Remembering, Understanding, Applying, Analyzing, Evaluating, Creating.
      
      CLO Description: "${description}"
      
      Respond with only the name of the most appropriate Bloom's level. For example: "Applying".
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2,
            }
        });
        const level = response.text.trim().replace(/['".]/g, '');
        return level;
    } catch (error) {
        throw handleApiError(error, "gợi ý cấp độ Bloom");
    }
};

export const generateEvaluationSummary = async (evaluationData: { cloId: string, description: string, achievement: number }[]): Promise<string> => {
    const ai = getAiClient();
    const dataString = evaluationData.map(e => `${e.cloId} (${e.description.substring(0, 40)}...): ${e.achievement}% achieved`).join('\n');

    const prompt = `
        You are an academic advisor analyzing course performance.
        Based on the following Course Learning Outcome (CLO) achievement data, write a brief, 2-3 sentence summary for an academic review report.
        Highlight both the strengths (high achievement areas) and potential areas for improvement (low achievement areas). Be constructive.

        Data:
        ${dataString}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.6,
            }
        });
        return response.text;
    } catch(error) {
        throw handleApiError(error, 'tạo tóm tắt đánh giá');
    }
};