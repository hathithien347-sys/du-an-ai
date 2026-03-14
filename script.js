// 1. Hãy đảm bảo dán API KEY của bạn vào đây
const API_KEY = "AIzaSyCB77nC9J4JlyzY8ezNPfGGKVCmLhR5o_g"; 

const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');

analyzeBtn.addEventListener('click', async () => {
    const text = document.getElementById('userInput').value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    loader.classList.remove('hidden');
    resultSection.classList.add('hidden');

    try {
        // SỬA LẠI ĐƯỜNG DẪN THÀNH v1beta
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Phân tích cảm xúc: "${text}". Trả về JSON: {"sentiment": "Tích cực/Tiêu cực/Trung lập", "score": 80, "explanation": "Lý do"}` }]
                }]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        let rawText = data.candidates[0].content.parts[0].text;
        // Làm sạch dữ liệu JSON phòng trường hợp AI trả về markdown
        const cleanJson = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
        const result = JSON.parse(cleanJson);
        
        displayResult(result);

    } catch (error) {
        console.error(error);
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
        icon.innerHTML = '😊';
    } else if (result.sentiment.includes("Tiêu cực")) {
        resultSection.classList.add('status-negative');
        icon.innerHTML = '😠';
    } else {
        resultSection.classList.add('status-neutral');
        icon.innerHTML = '😐';
    }
}
