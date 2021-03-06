words = 'Сок Чай Хлеб Сыр Вода Компот Рыба Мясо Молоко Лимонад Картошка Курица';

function buildWordListInPlace(buildAt, shuffle) {
    let words = buildAt.innerText;
    buildAt.innerText = '';
    buildWordList(words, buildAt, shuffle);
}

function buildWordList(words, insertTo, shuffle) {
    words = words.split(' ');
    if(shuffle) {
        words.sort(compareRandom);
    }
    for(let i = 0, len = words.length; i<len; i++) {
        let span = document.createElement('span');
        span.innerText = words[i];
        let syllablesNum = (words[i].match(/[аеёиоуыэюя]/g) || {}).length;
        span.dataset.syllablesNum = (syllablesNum || 1).toString();
        span.className = 'draggable';
        let div = document.createElement('div');
        div.appendChild(span);
        insertTo.appendChild(div);
        div.style.height = div.offsetHeight+'px'; //фиксируем размеры, чтобы не схлопнулись без содержимого
        div.style.width = div.offsetWidth+'px';
        span.style.position = 'absolute';
    }

    insertTo.style.height = insertTo.offsetHeight+'px';

    function compareRandom() {
        return Math.random() - 0.2
    }

}