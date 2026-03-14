const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');

// Danh sách từ vựng đơn giản để phân tích (Bạn có thể thêm từ tùy ý)
const keywords = {
    positive: ['ngon', 'tốt', 'đẹp', 'tuyệt', 'vời', 'thích', 'yêu', 'rẻ', 'nhanh', 'hài lòng', 'chuẩn'],
    negative: ['tệ', 'dở', 'xấu', 'kém', 'đắt', 'chậm', 'thất vọng', 'không thích', 'ghét', 'bẩn', 'lâu']
};

analyzeBtn.addEventListener('click', () => {
    const text = document.getElementById('userInput').value.trim().toLowerCase();
    if (!text) return alert("Vui lòng nhập nội dung!");

    loader.classList.remove('hidden');
    resultSection.classList.add('hidden');

    // Giả lập thời gian xử lý 0.5 giây cho giống thật
    setTimeout(() => {
        let score = 50; // Điểm trung bình ban đầu
        let posCount = 0;
        let negCount = 0;

        // Thuật toán đếm từ
        keywords.positive.forEach(word => { if (text.includes(word)) posCount++; });
        keywords.negative.forEach(word => { if (text.includes(word)) negCount++; });

        let result = {
            sentiment: "Trung lập",
            score: 50,
            explanation: "Văn bản bình thường, không có từ ngữ biểu cảm mạnh."
        };

        if (posCount > negCount) {
            result.sentiment = "Tích cực";
            result.score = 70 + (posCount * 5);
            result.explanation = "Văn bản chứa nhiều từ ngữ khen ngợi và hài lòng.";
        } else if (negCount > posCount) {
            result.sentiment = "Tiêu cực";
            result.score = 30 - (negCount * 5);
            result.explanation = "Văn bản chứa các từ ngữ thể hiện sự không hài lòng.";
        }

        if (result.score > 100) result.score = 100;
        if (result.score < 0) result.score = 5;

        displayResult(result);
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
