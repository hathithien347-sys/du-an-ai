const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');

// 1. DÁN LINK GOOGLE WEB APP (LINK /exec) CỦA BẠN VÀO ĐÂY
const sheetURL = 'https://script.google.com/macros/s/AKfycbwqh3vld40F0CmjGdsj5q7UiaOVqz0BrYX2Dkj-TMD4u2Ff4GNncLEI1PWUIRZILNLe/exec';

const keywords = {
    positive: ['ngon', 'tốt', 'đẹp', 'tuyệt', 'vời', 'thích', 'yêu', 'rẻ', 'nhanh', 'hài lòng', 'chuẩn'],
    negative: ['tệ', 'dở', 'xấu', 'kém', 'đắt', 'chậm', 'thất vọng', 'không thích', 'ghét', 'bẩn', 'lâu']
};

analyzeBtn.addEventListener('click', () => {
    const text = document.getElementById('userInput').value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    loader.classList.remove('hidden');
    resultSection.classList.add('hidden');

    setTimeout(() => {
        let lowerText = text.toLowerCase();
        let posCount = 0;
        let negCount = 0;

        keywords.positive.forEach(word => { if (lowerText.includes(word)) posCount++; });
        keywords.negative.forEach(word => { if (lowerText.includes(word)) negCount++; });

        let result = {
            sentiment: "Trung lập",
            score: 50,
            explanation: "Văn bản bình thường, không có từ ngữ biểu cảm mạnh."
        };

        if (posCount > negCount) {
            result.sentiment = "Tích cực";
            result.score = 70 + (posCount * 5);
            result.explanation = "Văn bản chứa nhiều từ ngữ khen ngợi.";
        } else if (negCount > posCount) {
            result.sentiment = "Tiêu cực";
            result.score = 30 - (negCount * 5);
            result.explanation = "Văn bản chứa các từ ngữ không hài lòng.";
        }

        if (result.score > 100) result.score = 100;
        if (result.score < 0) result.score = 5;

        displayResult(result);

        // 2. DÒNG GỬI DỮ LIỆU VỀ TRANG QUẢN TRỊ (GOOGLE SHEET)
        fetch(sheetURL, {
            method: 'POST',
            mode: 'no-cors', // Quan trọng để tránh lỗi bảo mật
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                sentiment: result.sentiment,
                score: result.score
            })
        });

        loader.classList.add('hidden');
    }, 500);
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

    if (result.sentiment === "Tích cực") {
        resultSection.classList.add('status-positive');
        icon.innerHTML = '😊';
    } else if (result.sentiment === "Tiêu cực") {
        resultSection.classList.add('status-negative');
        icon.innerHTML = '😠';
    } else {
        resultSection.classList.add('status-neutral');
        icon.innerHTML = '😐';
    }
}
