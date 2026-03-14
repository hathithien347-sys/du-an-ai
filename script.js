const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');

// DÁN LINK BẠN VỪA COPY Ở BƯỚC 1 VÀO ĐÂY (PHẢI CÓ ĐUÔI /exec)
const sheetURL = 'https://script.google.com/macros/s/AKfycbwqh3vld40F0CmjGdsj5q7UiaOVqz0BrYX2Dkj-TMD4u2Ff4GNncLEl1PWUIRZILNLe/exec';

const keywords = {
    positive: ['ngon', 'tốt', 'đẹp', 'tuyệt', 'vời', 'thích', 'yêu', 'rẻ', 'nhanh', 'hài lòng'],
    negative: ['tệ', 'dở', 'xấu', 'kém', 'đắt', 'chậm', 'thất vọng', 'ghét', 'bẩn', 'lâu']
};

analyzeBtn.addEventListener('click', () => {
    const text = document.getElementById('userInput').value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    loader.classList.remove('hidden');
    resultSection.classList.add('hidden');

    setTimeout(() => {
        let lowerText = text.toLowerCase();
        let posCount = 0, negCount = 0;

        keywords.positive.forEach(word => { if (lowerText.includes(word)) posCount++; });
        keywords.negative.forEach(word => { if (lowerText.includes(word)) negCount++; });

        let res = { sentiment: "Trung lập", score: 50 };
        if (posCount > negCount) res = { sentiment: "Tích cực", score: 85 };
        else if (negCount > posCount) res = { sentiment: "Tiêu cực", score: 15 };

        displayResult(res);

        // --- ĐOẠN LỆNH QUAN TRỌNG ĐỂ GỬI DỮ LIỆU VỀ GOOGLE SHEET ---
        fetch(sheetURL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                text: text,
                sentiment: res.sentiment,
                score: res.score
            })
        }).then(() => {
            console.log("Đã gửi dữ liệu thành công!");
        });
        // -------------------------------------------------------

        loader.classList.add('hidden');
    }, 500);
});

function displayResult(res) {
    document.getElementById('sentimentLabel').innerText = res.sentiment;
    document.getElementById('scoreFill').style.width = res.score + '%';
    resultSection.classList.remove('hidden');
}
