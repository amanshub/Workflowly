const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Extract JSON from LLM response with multiple fallback strategies
 */
function extractJSON(text) {
    try {
        // Strategy 1: Direct parse
        return JSON.parse(text);
    } catch (e) {
        // Strategy 2: Extract from markdown code blocks
        const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (codeBlockMatch) {
            try {
                return JSON.parse(codeBlockMatch[1]);
            } catch (e2) {
                // Continue to next strategy
            }
        }

        // Strategy 3: Find first JSON object or array
        const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[1]);
            } catch (e3) {
                // Continue to next strategy
            }
        }

        // Strategy 4: Try to find JSON between specific markers
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('{') || line.startsWith('[')) {
                try {
                    // Try to parse from this line to the end
                    const jsonText = lines.slice(i).join('\n');
                    return JSON.parse(jsonText);
                } catch (e4) {
                    continue;
                }
            }
        }

        throw new Error('Could not extract valid JSON from response');
    }
}

/**
 * Call Gemini API with a prompt
 */
async function callGemini(prompt, options = {}) {
    try {
        const model = genAI.getGenerativeModel({
            model: options.model || 'gemini-pro'
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            success: true,
            text,
            parsed: options.parseJSON ? extractJSON(text) : null,
        };
    } catch (error) {
        console.error('Gemini API Error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Meeting transcript → action items + decisions
 */
function createMeetingPrompt(transcriptText) {
    return `You are an assistant that extracts structured action items and decisions from meeting transcripts. Output must be valid JSON only.

Here is the meeting transcript:
"""
${transcriptText}
"""

INSTRUCTIONS:
1. Produce a JSON object with keys: "title", "summary", "decisions", "action_items".
2. "decisions" is an array of { "id", "text", "context" }.
3. "action_items" is an array of { "id", "text", "owner" (optional), "due" (optional, ISO date or null), "confidence" (0-1) }.
4. If the owner or due date is ambiguous, set them to null and add "confidence": 0.4.
5. Keep output concise. No extra commentary.

Respond now with JSON only.`;
}

/**
 * Email → action items + suggested reply
 */
function createEmailPrompt(subject, emailBody) {
    return `Extract actionable tasks from an email. Output valid JSON.

Email subject: "${subject}"
Email body:
"""
${emailBody}
"""

INSTRUCTIONS:
- Return {"subject":"...", "action_items":[{ "id","text","owner","due","confidence"}], "suggested_reply": "<one-paragraph draft reply>"}
- If no action items, return action_items: [].
- Keep suggested_reply professional and short.

Respond with JSON only.`;
}

/**
 * Document/PDF → summary + action items
 */
function createDocumentPrompt(docText) {
    return `Summarize and extract action items from a document. Output JSON.

Document text:
"""
${docText}
"""

INSTRUCTIONS:
- Return {"title":"...","summary" (3-5 lines),"action_items":[{id,text,priority,owner (null),confidence}]}
- Extract up to 8 action_items with recommended priority low/med/high.

Respond with JSON only.`;
}

/**
 * Process source with appropriate prompt based on type
 */
async function processWithGemini(type, content) {
    let prompt;

    switch (type) {
        case 'meeting':
            prompt = createMeetingPrompt(content);
            break;
        case 'email':
            // Assume content has subject and body
            prompt = createEmailPrompt(content.subject || 'No Subject', content.body || content);
            break;
        case 'document':
            prompt = createDocumentPrompt(content);
            break;
        default:
            // Default to document processing
            prompt = createDocumentPrompt(content);
    }

    const result = await callGemini(prompt, { parseJSON: true });

    if (!result.success) {
        throw new Error(result.error);
    }

    return result.parsed;
}

module.exports = {
    callGemini,
    extractJSON,
    processWithGemini,
    createMeetingPrompt,
    createEmailPrompt,
    createDocumentPrompt,
};
