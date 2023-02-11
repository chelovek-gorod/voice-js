'use strict';
/*
// самый приметивный код для озвучки текста
const speak = (text) => speechSynthesis.speak(new SpeechSynthesisUtterance(text));
document.body.onclick = function() { speak("Я - говорящий браузер!"); };
*/

const textarea = document.getElementById('textarea');
const charsNumbersSpan = document.getElementById('charsNumbersSpan');
const selectVoice = document.getElementById('selectVoice');
const rateIn = document.getElementById('rateIn');
const rateSize = document.getElementById('rateSize');
const pitchIn = document.getElementById('pitchIn');
const pitchSize = document.getElementById('pitchSize');
const seyBtn = document.getElementById('seyBtn');
const pauseBtn = document.getElementById('pauseBtn');

let isVoicesLoad = false;
let currentVoice = 0;

let pause = false;

rateIn.onchange = function(){ rateSize.innerHTML = rateIn.value; };
pitchIn.onchange = function(){ pitchSize.innerHTML = pitchIn.value; };

selectVoice.onchange = function(){ currentVoice = selectVoice.value; };

seyBtn.onclick = function() {
    // проверяем готовли объект озвучки к работе
    if (!isVoicesLoad) return;

    // проверяем проговаривается ли сейчас текст
    if (synth.speaking) {
        synth.cancel();
        seyBtn.innerHTML = 'ГОВОРИ';
        return;
    } 
    
    // проверяем есть ли текст для озвучки
    if (textarea.value) {
        speak(textarea.value, voices[currentVoice], pitchIn.value, rateIn.value);
        seyBtn.innerHTML = ' СТОП ';
    } 
}

pauseBtn.onclick = function() {
    // проверяем проговаривается ли сейчас текст
    if (!synth.speaking) return;

    if (pause) {
        synth.resume();
        pause = false;
        pauseBtn.innerHTML = 'ПАУЗА';
    } else {
        synth.pause();
        pause = true;
        pauseBtn.innerHTML = 'ДАЛЕЕ';
    } 
}

// Speech synthesis
const synth = speechSynthesis;

let voices = [];

function getVoicesList() {
    voices = speechSynthesis.getVoices();
    if (!voices.length) setTimeout(getVoicesList, 10);
    else speechReady();
}
getVoicesList();

function speechReady() {
    isVoicesLoad = true;
    voices.forEach( (el, i) => {
        selectVoice.innerHTML += `<option value="${i}">${el.name}</option>`
    });
}
  
function speak(text, voice, pitch, rate) {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = voice;
    utterThis.pitch = pitch; // 0...2 (1 - normal)
    utterThis.rate = rate; // 0.1...10 (1 - normal)
    synth.speak(utterThis);

    utterThis.onstart = () => seyBtn.innerHTML = ' СТОП ';
    utterThis.onend = () => seyBtn.innerHTML = 'ГОВОРИ';

    //utterThis.onerror = (err) => console.error(err);
}

// обновление числа введенных символов для озвучки
setInterval( () => charsNumbersSpan.innerHTML = textarea.value.length, 500);