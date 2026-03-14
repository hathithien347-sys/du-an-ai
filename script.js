const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');

// Dán link Web App đầy đủ của bạn vào đây (Link kết thúc bằng /exec)
const sheetURL = 'https://script.google.com/macros/s/AKfycbwqh3vld40F0CmjGdsj5q7UiaOVqz0BrYX2Dkj-TMD4u2Ff4GNncLEI1PWUIRZILNLe/exec';

const keywords = {
    positive: ['ngon', 'tốt', 'đẹp', 'tuyệt', 'vời', 'thích', 'yêu', 'rẻ', 'nhanh', 'hài lòng', 'chuẩn'],
    negative: ['tệ', 'dở', 'xấu', 'kém', 'đắt', 'chậm', 'thất vọng', 'ghét', 'bẩn', 'lâu', 'ko ngon', 'không ngon']
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
            explanation: "Văn bản bình thường."
        };

        if (posCount > negCount) {
            result = { sentiment: "Tích cực", score: 85, explanation: "Khách hàng hài lòng." };
        } else if (negCount > posCount) {
            result = { sentiment: "Tiêu cực", score: 15, explanation: "Khách hàng không hài lòng." };
        }

        displayResult(result);

        // Gửi dữ liệu về Google Sheets
        fetch(sheetURL, {
            method: 'POST',
            mode: 'no-cors',
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

    // Xóa tất cả class màu cũ
    resultSection.classList.remove('hidden', 'status-positive', 'status-negative', 'status-neutral');
    
    label.innerText = result.sentiment;
    explanation.innerText = result.explanation;
    scoreFill.style.width = `${result.score}%`;

    // Kích hoạt màu sắc dựa trên cảm xúc
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
