import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

import modal from './modal.js';
import getAvailableMoves from './chessMove.js';

const config = {
  // configure Swiper to use modules
  modules: [Navigation],

  direction: 'horizontal',
  slidesPerView: 'auto',
  spaceBetween: 10,

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
};

const lessons = window.Storage;

const finishCourse = () => {
  const result = lessons.every(({ id }) => localStorage.getItem(`lesson-${id}-finish`));
  if (result) {
    modal('all');

    const anew = document.querySelector('[data-anew]');
    anew.addEventListener('click', () => {
      localStorage.clear();
      render(1);
    });

    return true;
  }

  return false;
};

finishCourse();

const imgHeight = () => {
  const chess = document.querySelector('.chess');
  const box = document.querySelector('.lesson-block');
  const slider = document.querySelector('.lesson-slider');

  const img = document.querySelector('.lesson-image');
  const height = chess.clientHeight - box.clientHeight - slider.clientHeight - 65;
  if (height < 250) {
    img.style.height = 0;
  } else {
    img.style.height = `${height}px`;
  }
};

const madeMoves = (id, lesson) => {
  const chess = document.getElementById('chess');
  const cells = chess.querySelectorAll('.chess-item');
  const { answer } = lesson;

  const result = [];
  const check = (cell) => {
    if (answer === true) { return 'finish'; }

    const sizes = answer.map((arr) => arr.length - 1);
    result.push(Number(cell));

    const checkPrefix = (p) => p.slice(1, result.length + 1).every((el, i) => el === result[i]);

    if (answer.some(checkPrefix)) {
      if (sizes.includes(result.length)) {
        return 'finish';
      }

      return true;
    }

    return false;
  };

  // Функции для обработки ходов
  const makePawnPromotion = (picture) => (
    new Promise((r) => {
      const box = document.createElement('div');
      box.classList.add('chess-promotion');

      const figures = ['wn', 'wb', 'wr', 'wq'];
      figures.forEach((f) => {
        const img = document.createElement('img');
        img.classList.add('chess-promotion__img');
        img.src = `../common_files/img/chess-themes/${f}.png`;

        box.append(img);
      });

      chess.parentNode.prepend(box);
      box.addEventListener('click', (e) => {
        if (e.target.classList.contains('chess-promotion__img')) {
          picture.children[0].src = e.target.src;
          box.remove();
          r();
        }
      });
    })
  );

  const makeCastling = (cell) => {
    if (cell === 62) {
      const currentNode = chess.querySelector('[data-cell="64"]');
      const newNode = chess.querySelector('[data-cell="61"]');
      [newNode.innerHTML, currentNode.innerHTML] = [currentNode.innerHTML, newNode.innerHTML];
    } else {
      const currentNode = chess.querySelector('[data-cell="57"]');
      const newNode = chess.querySelector('[data-cell="60"]');
      [newNode.innerHTML, currentNode.innerHTML] = [currentNode.innerHTML, newNode.innerHTML];
    }
  };

  const makeTakedown = (to, from) => {
    if (to - 9 === from) {
      const p = chess.querySelector(`[data-cell="${from + 8}"]`);
      p.innerHTML = '';
    }
  };

  async function fn() {
    if (this.dataset.active) {
      const picture = this.querySelector('.chess-item__image');

      const name = picture.dataset.name.slice(1);
      const cell = Number(this.dataset.cell);
      const moves = getAvailableMoves(name, cell)
        .map((m) => chess.querySelector(`[data-cell='${m}']`));

      if (picture.classList.contains('chess-item__image--active')) {
        picture.classList.remove('chess-item__image--active');
        moves.forEach((m) => m.classList.remove('chess-item--active'));

        // Проверка для рокировки
        if (lesson.move === 'castling') {
          chess.querySelector('[data-cell="59"]').classList.remove('chess-item--active');
        }

        // Проверка для взятия на проходе
        if (lesson.move === 'takedown') {
          chess.querySelector(`[data-cell="${this.dataset.cell - 9}"]`).classList.remove('chess-item--active');
        }
      } else {
        picture.classList.add('chess-item__image--active');
        moves.forEach((m) => m.classList.add('chess-item--active'));

        // Проверка для рокировки
        if (lesson.move === 'castling') {
          chess.querySelector('[data-cell="59"]').classList.add('chess-item--active');
        }

        // Проверка для взятия на проходе
        if (lesson.move === 'takedown') {
          chess.querySelector(`[data-cell="${this.dataset.cell - 9}"]`).classList.add('chess-item--active');
        }
      }
    } else if (this.classList.contains('chess-item--active')) {
      const picture = chess.querySelector('.chess-item__image--active');

      const currentPicture = this.children.namedItem('picture');
      if (currentPicture) {
        currentPicture.remove();
      }

      picture.classList.remove('chess-item__image--active');
      const moves = chess.querySelectorAll('.chess-item--active')
        .forEach((m) => m.classList.remove('chess-item--active'));

      const parent = picture.parentNode;
      delete parent.dataset.active;

      this.append(picture);
      this.dataset.active = true;

      const prefix = check(this.dataset.cell);

      if (lesson.move === 'pawnPromotion') {
        await makePawnPromotion(picture);
      }

      if (lesson.move === 'castling') {
        makeCastling(Number(this.dataset.cell));
      }

      if (lesson.move === 'takedown') {
        makeTakedown(Number(parent.dataset.cell), Number(this.dataset.cell));
      }

      if (prefix === 'finish') {
        localStorage.setItem(`lesson-${id}-finish`, true);
        if (!finishCourse()) {
          modal('finish');
        }

        removeEvents();
      }

      if (!prefix) {
        modal('reset');
        render(id);
      }
    }
  }

  // Очистка обработчиков
  cells.forEach((c) => {
    const el = c.cloneNode(true);
    c.parentNode.replaceChild(el, c);
  });

  const updatedCells = chess.querySelectorAll('.chess-item');
  updatedCells.forEach((c) => { c.addEventListener('click', fn); });

  // Удаление обработчиков, чтобы игрок не взаимодействовал после завершения
  const removeEvents = () => {
    updatedCells.forEach((c) => { c.removeEventListener('click', fn); });
  };
};

const render = (idLesson) => {
  const section = document.querySelector('.lesson');
  const title = section.querySelector('.lesson-block__title');
  const descr = section.querySelector('.lesson-block__descr');
  const levels = section.querySelector('.lesson-slider__wrapper');
  const cells = section.querySelectorAll('.chess-item');

  // Очистка
  const cleanedLesson = () => {
    title.textContent = '';
    descr.textContent = '';
    levels.textContent = '';
    cells.forEach((c) => {
      if (c.children.namedItem('picture')) {
        c.children.namedItem('picture').remove();
      }

      c.classList.remove('chess-item--active');
      delete c.dataset.active;
    });
  };

  cleanedLesson();

  // Получаем нужный урок
  const lesson = lessons.find(({ id }) => id === idLesson);
  if (!lesson) { return; }

  // Заполнение урока данными
  const fillInLesson = () => {
    // Заголовок урока
    title.textContent = lesson.title;
    // Описание урока
    lesson.content.forEach((text) => {
      if (typeof text === 'object') {
        const box = document.createElement('div');
        box.classList.add('lesson-block__box');

        const subtitle = document.createElement('p');
        subtitle.classList.add('lesson-block__subtitle', 'dark');
        subtitle.innerHTML = text.title;

        const ul = document.createElement('ul');
        ul.classList.add('lesson-block-list');

        text.items.forEach((item) => {
          const li = document.createElement('li');
          li.classList.add('lesson-block-list__item', 'dark');
          li.innerHTML = item;
          ul.append(li);
        });

        box.append(subtitle, ul);
        descr.append(box);
      } else {
        const p = document.createElement('p');
        p.classList.add('lesson-block__text', 'dark');
        p.innerHTML = text;
        descr.append(p);
      }
    });
    // Слайдер с уровнями
    for (let i = 1; i <= lessons.length; i += 1) {
      const a = document.createElement('a');
      a.href = `#${i}`;
      a.classList.add('lesson-slider__btn', 'swiper-slide', 'br-3');
      a.dataset.lesson = i;
      a.title = (window.location.pathname === '/ru/') ? `Перейти к уроку ${i}` : `Go to lesson ${i}`;
      a.textContent = i;

      if (localStorage.getItem(`lesson-${i}-finish`)) {
        a.classList.add('lesson-slider__btn--finish');
      }

      if (i === idLesson) {
        a.classList.add('lesson-slider__btn--active', 'swiper-slide-active');
      }

      levels.append(a);
    }

    config.initialSlide = idLesson - 1;
    new Swiper('.swiper', config);

    if (lesson.answer === 'ok') {
      localStorage.setItem(`lesson-${idLesson}-finish`, true);
    }
    // Подгоняем размер картинки
    imgHeight();
    // Заполнеине шахматной доски
    lesson.chess.forEach(({ cell: id, element: el, active }) => {
      const cell = [...cells].find((item) => item.dataset.cell === id.toString());
      const picture = document.createElement('picture');
      picture.classList.add('chess-item__image');
      picture.setAttribute('data-name', el);
      picture.setAttribute('name', 'picture');
      const img = document.createElement('img');
      img.src = `../common_files/img/chess-themes/${el}.png`;

      if (active) {
        cell.setAttribute('data-active', active);
      }

      picture.append(img);
      cell.append(picture);
    });
  };

  fillInLesson();

  // Обрабатываем доступные ходы
  madeMoves(idLesson, lesson);
};

const initialisationLevel = () => {
  const levels = document.querySelector('.lesson-slider__wrapper');
  levels.addEventListener('click', (e) => {
    if (e.target.classList.contains('lesson-slider__btn')) {
      const idLesson = Number(e.target.dataset.lesson);
      render(idLesson);
    }
  });
};

initialisationLevel();

const btnsNavigation = () => {
  const prev = document.getElementById('header-btn-prev');
  const nexts = document.querySelectorAll('[data-next]');

  const current = Number(window.location.hash.slice(1) || 1);
  const idPrev = (current === 1 ? 2 : current) - 1;
  const idNext = (current < lessons.length ? current : lessons.length - 1) + 1;

  prev.href = `#${idPrev}`;
  nexts.forEach((n) => { n.href = `#${idNext}`; });
};

btnsNavigation();

const prevNextNavigation = () => {
  const prev = document.getElementById('header-btn-prev');
  const nexts = document.querySelectorAll('[data-next]');

  prev.addEventListener('click', (e) => {
    btnsNavigation();
    const id = Number(new URL(prev.href).hash.slice(1));
    render(id);
  });
  nexts.forEach((n) => {
    n.addEventListener('click', (e) => {
      btnsNavigation();
      const id = Number(new URL(n.href).hash.slice(1));
      render(id);
    });
  });
};

prevNextNavigation();

const initialLevel = () => {
  const id = Number(window.location.hash.slice(1)) || 1;
  render(id);
};

initialLevel();

window.addEventListener('resize', () => imgHeight());
