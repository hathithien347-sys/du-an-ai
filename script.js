const API_KEY = "AIzaSyBiGukWQmBTa8Lu7TQTjjREKwcxuEf7Nvg"; 
const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');

analyzeBtn.addEventListener('click', async () => {
    const text = document.getElementById('userInput').value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    loader.classList.remove('hidden');
    resultSection.classList.add('hidden');

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Phân tích cảm xúc văn bản này: "${text}". Chỉ trả về duy nhất 1 chuỗi JSON theo mẫu, không kèm giải thích bên ngoài: {"sentiment": "Tích cực/Tiêu cực/Trung lập", "score": 80, "explanation": "lý do"}` }]
                }]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        // ĐOẠN QUAN TRỌNG: Lọc bỏ mọi ký tự lạ nếu AI trả về sai định dạng
        let rawOutput = data.candidates[0].content.parts[0].text;
        const cleanJson = rawOutput.substring(rawOutput.indexOf('{'), rawOutput.lastIndexOf('}') + 1);
        
        const result = JSON.parse(cleanJson);
        displayResult(result);

    } catch (error) {
        console.error(error);
        alert("Có lỗi: " + error.message);
    } finally {
        loader.classList.add('hidden');
    }
});

function displayResult(result) {
    const label = document.getElementById('sentimentLabel');
    const icon = document.getElementById('sentimentIcon');
    const explanation = document.getElementById('explanation');
    const scoreFill = document.getElementById('scoreFill');

    resultSection.classList.remove('hidden', 'status-positive', 'status-negative', 'status-neutral');
    label.innerText = result.sentiment;
    explanation.innerText = result.explanation;
    scoreFill.style.width = `${result.score}%`;

    if (result.sentiment.includes("Tích cực")) {
        resultSection.classList.add('status-positive');
        icon.innerHTML = '😊';
    } else if (result.sentiment.includes("Tiêu cực")) {
        resultSection.classList.add('status-negative');
        icon.innerHTML = '😠';
    } else {
        resultSection.classList.add('status-neutral');
        icon.innerHTML = '😐';
    }
}
