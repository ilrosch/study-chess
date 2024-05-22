import * as flsFunctions from './modules/functions.js';

import './modules/slider.js';
// Прочие функции и скрипты
flsFunctions.isWebp();
// Прочие функции и скрипты

const chess = document.querySelector('.chess');
const box = document.querySelector('.lesson-block');
const slider = document.querySelector('.lesson-slider');

const img = document.querySelector('.lesson-image');
img.style.height = `${chess.clientHeight - box.clientHeight - slider.clientHeight - 65}px`;

console.log(chess.clientHeight);
