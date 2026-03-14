const API_KEY = "AIzaSyB01WU3XytsDblcB3C0wQSlmgzHlL9_J4E";
const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');

analyzeBtn.addEventListener('click', async () => {
    const text = document.getElementById('userInput').value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    // Hiển thị trạng thái loading
    loader.classList.remove('hidden');
    resultSection.classList.add('hidden');

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Phân tích cảm xúc của đoạn văn bản sau và trả về kết quả theo định dạng JSON gồm: sentiment (Tích cực, Tiêu cực, hoặc Trung lập), score (0-100), explanation (1 câu giải thích ngắn gọn). Văn bản: "${text}"` }]
                }]
            })
        });

        const data = await response.json();
        const rawOutput = data.candidates[0].content.parts[0].text;
        
        // Xử lý chuỗi JSON từ AI (đôi khi AI trả về markdown ```json ... ```)
        const cleanJson = rawOutput.replace(/```json|```/g, '');
        const result = JSON.parse(cleanJson);

        displayResult(result);
    } catch (error) {
        alert("Có lỗi xảy ra khi gọi API. Kiểm tra lại API Key hoặc kết nối mạng.");
        console.error(error);
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
        scoreFill.style.backgroundColor = 'var(--success)';
    } else if (result.sentiment.includes("Tiêu cực")) {
        resultSection.classList.add('status-negative');
        icon.innerHTML = '<i class="fas fa-angry"></i>';
        scoreFill.style.backgroundColor = 'var(--danger)';
    } else {
        resultSection.classList.add('status-neutral');
        icon.innerHTML = '<i class="fas fa-meh"></i>';
        scoreFill.style.backgroundColor = 'var(--neutral)';
    }
}