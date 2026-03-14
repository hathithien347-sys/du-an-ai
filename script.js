const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');

// DÁN LINK DÀI (KO CÓ DẤU ...) VÀO ĐÂY
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

        let result = { sentiment: "Trung lập", score: 50, explanation: "Bình thường." };
        if (posCount > negCount) { result = { sentiment: "Tích cực", score: 80, explanation: "Hài lòng." }; }
        else if (negCount > posCount) { result = { sentiment: "Tiêu cực", score: 20, explanation: "Không hài lòng." }; }

        displayResult(result);

        // LỆNH QUAN TRỌNG NHẤT: GỬI DỮ LIỆU ĐI
        fetch(sheetURL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ text: text, sentiment: result.sentiment, score: result.score })
        }).then(() => console.log("Đã gửi!"));

        loader.classList.add('hidden');
    }, 500);
});

function displayResult(result) {
    const label = document.getElementById('sentimentLabel');
    const explanation = document.getElementById('explanation');
    const scoreFill = document.getElementById('scoreFill');
    resultSection.classList.remove('hidden');
    label.innerText = result.sentiment;
    explanation.innerText = result.explanation;
    scoreFill.style.width = `${result.score}%`;
}
