/**
 * Создаёт медиатеги в документе для предзагрузки
 * @param imgPath string путь к картинкам
 * @param images array of string имена картинок
 * @param audioPath string путь к аудио
 * @param audio array of string имена аудио
 * @param callback функция, получает аргумент - процент загруженных медиа
 * @returns object url audio, названия полей объекта - из имен файлов без расширения
 */
function loadMedia(imgPath, images, audioPath, audio, callback) {
    let result = {};
    let mediaCount, mediaLoaded = 0, i, len;
    for(i = 0, mediaCount = images.length; i < mediaCount; i++) {
        let img = document.createElement('img');
        let div = document.createElement('div');
        div.style.overflow = "hidden";
        div.style.height = '1px';
        div.appendChild(img);
        document.body.appendChild(div);
        img.onload = onMediaLoad;
        img.src = imgPath + images[i];
    }
    for(i=0, mediaCount += len = audio.length; i<len; i++) {
        let audioElem = document.createElement("audio");
        audioElem.oncanplaythrough = onMediaLoad;
        document.body.appendChild(audioElem);
        audioElem.src = audioPath+audio[i];
        result[audio[i].split('.')[0]] = audioElem.src;
    }
    return result;

    function onMediaLoad() {
        callback(Math.round(++mediaLoaded/mediaCount*100));
    }
}