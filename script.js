// Функція для обчислення відсотка Левенштейна
function calculateLevenshteinPercentage(str1, str2) {
    const len1 = str1.length + 1;
    const len2 = str2.length + 1;
    const edits = Array.from({ length: len2 }, (_, i) => [i]);

    for (let i = 1; i < len1; i++) {
        edits[0][i] = i;
    }

    for (let i = 1; i < len2; i++) {
        for (let j = 1; j < len1; j++) {
            const cost = str1[j - 1] === str2[i - 1] ? 0 : 1;
            edits[i][j] = Math.min(
                edits[i - 1][j] + 1,
                edits[i][j - 1] + 1,
                edits[i - 1][j - 1] + cost
            );
        }
    }

    const levenshteinDistance = edits[len2 - 1][len1 - 1];
    const maxLength = Math.max(str1.length, str2.length);
    const percentage = ((maxLength - levenshteinDistance) / maxLength) * 100;

    // Отримати різницю між двома рядками
    const differences = [];
    let i = len2 - 1;
    let j = len1 - 1;

    while (i > 0 || j > 0) {
        const cost = str1[j - 1] === str2[i - 1] ? 0 : 1;

        if (i > 0 && edits[i][j] === edits[i - 1][j] + 1) {
            differences.unshift({ index: j, added: str2[i - 1] });
            i--;
        } else if (j > 0 && edits[i][j] === edits[i][j - 1] + 1) {
            differences.unshift({ index: j - 1, removed: str1[j - 1] });
            j--;
        } else {
            i--;
            j--;
        }
    }

    return { percentage: percentage.toFixed(2), differences };
}

checkButton.addEventListener('click', function () {
    const userInput = inputText.value;
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const fileContent = e.target.result;
            const { percentage, differences } = calculateLevenshteinPercentage(userInput, fileContent);


            // Оновлення кольору тексту відповідно до відсотка плагіату
            if (percentage >= 75) {
                plagiarismPercentage.style.color = 'red';
            } else if (percentage >= 30) {
                plagiarismPercentage.style.color = 'darkorange';
            } else {
                plagiarismPercentage.style.color = 'green';
            }

            plagiarismPercentage.textContent = `${percentage}%`;
           
        };

        if (
            file.type === 'text/plain' ||
            file.type === 'application/pdf' ||
            file.type === 'application/msword' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            reader.readAsText(file);
        } else {
            alert('Непідтримуваний формат файлу. Будь ласка, виберіть файл у форматах TXT, PDF, DOC або DOCX.');
        }
    } else {
        alert('Будь ласка, виберіть файл для порівняння.');
    }
});
