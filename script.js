// Cập nhật API URL lên bản v1 mới nhất
const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        contents: [{
            parts: [{ text: `Phân tích cảm xúc: "${text}". Trả về JSON: {"sentiment": "Tích cực/Tiêu cực/Trung lập", "score": 80, "explanation": "lý do"}` }]
        }]
    })
});

const data = await response.json();

// Kiểm tra nếu API trả về lỗi
if (data.error) {
    throw new Error(data.error.message);
}

// Lấy văn bản từ AI và làm sạch JSON
let rawText = data.candidates[0].content.parts[0].text;
const cleanJson = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
const result = JSON.parse(cleanJson);
displayResult(result);
