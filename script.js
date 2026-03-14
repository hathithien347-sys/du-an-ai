// 1. PHẢI CÓ API KEY Ở ĐÂY
const API_KEY = "AIzaSyBiGukWQmBTa8Lu7TQTjjREKwcxuEf7Nvg"; 

const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');

// 2. PHẢI CÓ SỰ KIỆN CLICK NÀY NÚT MỚI CHẠY ĐƯỢC
analyzeBtn.addEventListener('click', async () => {
    const text = document.getElementById('userInput').value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    // Hiển thị vòng xoay chờ
    loader.classList.remove('hidden');
    resultSection.classList.add('hidden');

    try {
        // 3. ĐƯỜNG DẪN V1 CHUẨN
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Phân tích cảm xúc văn bản này: "${text}". Chỉ trả về duy nhất 1 chuỗi JSON theo mẫu: {"sentiment": "Tích cực/Tiêu cực/Trung lập", "score": 80, "explanation": "lý do"}` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // 4. LẤY VÀ LÀM SẠCH JSON
        let rawText = data.candidates[0].content.parts[0].text;
        const jsonStart = rawText.indexOf('{');
        const jsonEnd = rawText.lastIndexOf('}') + 1;
        const cleanJson = rawText.substring(jsonStart, jsonEnd);
        
        const result = JSON.parse(cleanJson);
        
        // Gọi hàm hiển thị kết quả lên màn hình
        displayResult(result);

    } catch (error) {
        console.error(error);
        alert("Lỗi rồi: " + error.message);
    } finally {
        loader.classList.add('hidden');
    }
});

// 5. HÀM HIỂN THỊ (PHẢI CÓ ĐỂ RA MÀU XANH/ĐỎ)
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
