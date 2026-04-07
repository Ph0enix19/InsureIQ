require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/analyze', async (req, res) => {
    try {
        const { claimText } = req.body;
        if (!claimText) return res.status(400).json({ error: 'Claim text is required' });

        // 1. Get Claim Type from ML Service
        let mlResult = { claim_type: 'Unknown', confidence: 0 };
        try {
            const response = await axios.post(`${ML_SERVICE_URL}/classify`, { text: claimText });
            mlResult = response.data;
        } catch (err) {
            console.error('Error reaching ML service:', err.message);
        }

        // 2. Query Groq for Information Extraction
        const schema = `{
            "riskScore": "Number 1-10",
            "riskFlags": ["List", "of", "Flags"],
            "extractedInfo": {
                "date": "Extracted Date or Unknown",
                "amount": "Extracted Amount or Unknown",
                "location": "Extracted Location or Unknown"
            },
            "recommendation": "APPROVE, ESCALATE, or INVESTIGATE",
            "summary": "Short professional summary",
            "nextSteps": ["Step 1", "Step 2"]
        }`;

        const prompt = `You are an expert AI claims processing assistant.
Analyze the following claim text and extract key details following this JSON schema exactly: 
${schema}

Claim Text: "${claimText}"

Output only valid JSON, without any markdown formatting wrappers or explanations.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
        });

        let aiResultStr = chatCompletion.choices[0]?.message?.content || "{}";
        
        // Cleanup any markdown code blocks
        if (aiResultStr.startsWith('```json')) {
            aiResultStr = aiResultStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (aiResultStr.startsWith('```')) {
            aiResultStr = aiResultStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        const aiResult = JSON.parse(aiResultStr);

        // 3. Combine and Return
        res.json({
            claimType: mlResult.claim_type,
            confidence: mlResult.confidence,
            ...aiResult
        });
        
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Internal server error while analyzing claim' });
    }
});

app.listen(PORT, () => {
    console.log(`Gateway running on http://localhost:${PORT}`);
});
