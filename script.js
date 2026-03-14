const API_KEY = "AIzaSyB01WU3XytsDb1cB3C0wQS1mgzH1L9_J4E"; // Key bạn đã điền
const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');

analyzeBtn.addEventListener('click', async () => {
    const text = document.getElementById('userInput').value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    loader.classList.remove('hidden');
    resultSection.classList.add('hidden');

    try {
        // Sử dụng model gemini-1.5-flash
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Phân tích cảm xúc văn bản này: "${text}". Trả về duy nhất 1 chuỗi JSON: {"sentiment": "Tích cực/Tiêu cực/Trung lập", "score": 0-100, "explanation": "lý do ngắn gọn"}` }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        let rawOutput = data.candidates[0].content.parts[0].text;
        
        // Xử lý để lấy đúng đoạn JSON kể cả khi AI trả về markdown
        const jsonStart = rawOutput.indexOf('{');
        const jsonEnd = rawOutput.lastIndexOf('}') + 1;
        const cleanJson = rawOutput.substring(jsonStart, jsonEnd);
        
        const result = JSON.parse(cleanJson);
        displayResult(result);

    } catch (error) {
        console.error("Lỗi chi tiết:", error);
        alert("Lỗi: " + error.message);
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
        icon.innerHTML = '<i class="fas fa-laugh-beam"></i>';
        scoreFill.style.backgroundColor = '#22c55e';
    } else if (result.sentiment.includes("Tiêu cực")) {
        resultSection.classList.add('status-negative');
        icon.innerHTML = '<i class="fas fa-angry"></i>';
        scoreFill.style.backgroundColor = '#ef4444';
    } else {
        resultSection.classList.add('status-neutral');
        icon.innerHTML = '<i class="fas fa-meh"></i>';
        scoreFill.style.backgroundColor = '#64748b';
    }
}
