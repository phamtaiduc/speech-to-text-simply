let recognition;
let transcriptText = '';

// Kiểm tra xem trình duyệt có hỗ trợ SpeechRecognition không
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'vi-VN'; // Thiết lập ngôn ngữ

    recognition.onresult = (event) => {
        transcriptText = event.results[0][0].transcript;
        document.getElementById('textOutput').innerText = transcriptText;
    };

    recognition.onend = () => {
        console.log("Nhận diện giọng nói đã kết thúc.");
    };

    recognition.onerror = (event) => {
        console.error("Có lỗi xảy ra trong quá trình nhận diện giọng nói:", event.error);
    };
} else {
    console.error("Trình duyệt không hỗ trợ Speech Recognition.");
}

// Hàm bắt đầu ghi âm
function startRecording() {
    if (recognition) {
        recognition.start();
    }
}

// Hàm dừng ghi âm
function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
}

// Gắn sự kiện cho nút Dịch
document.getElementById('translateButton').addEventListener('click', function() {
    const form = new FormData();
    form.append('q', transcriptText); // Văn bản cần dịch lấy từ giọng nói đã chuyển đổi
    form.append('target', document.getElementById('languageSelect').value); // Ngôn ngữ đích từ dropdown
    form.append('source', 'vi'); // Ngôn ngữ gốc (Tiếng Việt trong trường hợp này)

    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
        method: 'POST',
        headers: {
            'x-rapidapi-key': 'fdfc9bc3b4mshb42b39aff7e97f7p17803cjsn3b3a98357e6c',
            'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
            'Accept-Encoding': 'application/gzip'
        },
        processData: false,
        contentType: false,
        mimeType: 'multipart/form-data',
        data: form
    };

    $.ajax(settings).done(function (response) {
        const jsonResponse = JSON.parse(response);
        const translatedText = jsonResponse.data.translations[0].translatedText;
        console.log("Văn bản đã dịch:", translatedText);

        // Hiển thị kết quả lên trang web
        document.getElementById('translatedOutput').innerText = `Văn bản đã dịch: ${translatedText}`;
    }).fail(function (error) {
        console.error("Lỗi:", error);
    });
});
