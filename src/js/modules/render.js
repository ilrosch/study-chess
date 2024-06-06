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

const render = (idLesson) => {
  const section = document.querySelector('.lesson');
  const title = section.querySelector('.lesson-block__title');
  const descr = section.querySelector('.lesson-block__descr');
  const levels = section.querySelector('.lesson-slider__wrapper');
  const cells = section.querySelectorAll('.chess-item');

  const lesson = lessons.find(({ id }) => id === idLesson);

  // Заголовок урока
  title.textContent = lesson.title;

  // Описание урока
  descr.innerHTML = '';
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

  // Уровни
  levels.innerHTML = '';
  for (let i = 1; i <= lessons.length; i += 1) {
    const a = document.createElement('a');
    a.href = `#${i}`;
    a.classList.add('lesson-slider__btn', 'swiper-slide', 'br-3');
    a.dataset.lesson = i;
    a.title = `Перейти к уроку ${i}`;
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

  // Картинка
  imgHeight();

  // Шахматная доска
  cells.forEach((cell) => {
    if (cell.children.namedItem('picture')) {
      cell.children.namedItem('picture').remove();
    }
  });
  lesson.chess.forEach(({ cell: id, element: el, active }) => {
    const cell = [...cells].find((item) => item.dataset.cell === id.toString());
    const picture = document.createElement('picture');
    picture.classList.add('chess-item__image');
    picture.setAttribute('data-name', el);
    picture.setAttribute('name', 'picture');
    const img = document.createElement('img');
    img.src = `/common_files/img/chess-themes/${el}.png`;

    if (active) {
      picture.setAttribute('data-active', active);
    }

    picture.append(img);
    cell.append(picture);
  });

  // Проверка
  const result = [];
  const check = (cell) => {
    const sizes = lesson.answer.map((arr) => arr.length - 1);

    const checkPrefix = (prefix) => (
      prefix.slice(1, result.length).every((el, i) => el === result[i])
    );

    result.push(Number(cell));

    if (lesson.answer.some(checkPrefix)) {
      if (sizes.includes(result.length)) {
        return 'finish';
      }

      return true;
    }

    return false;
  };

  const clean = (figure) => {
    figure.classList.remove('chess-item__image--active');
    cells.forEach((c) => c.classList.remove('chess-item--active'));
  };

  // Доступные ходы фигурой
  const activeFigures = section.querySelectorAll('[data-active=true]');
  activeFigures.forEach((figure) => {
    figure.addEventListener('click', (e) => {
      if (e.currentTarget.classList.contains('chess-item__image--active')) {
        clean(figure);
      } else {
        const name = e.currentTarget.dataset.name.slice(1);
        const { cell } = e.currentTarget.parentNode.dataset;
        const availableMoves = getAvailableMoves(name, cell); // [35, 47, 43]
        const moves = availableMoves.map((m) => section.querySelector(`[data-cell='${m}']`));
        figure.classList.add('chess-item__image--active');
        moves.forEach((m) => {
          m.classList.add('chess-item--active');

          m.addEventListener('click', (event) => {
            figure.classList.remove('chess-item__image--active');
            m.append(figure);

            const prefix = check(event.currentTarget.dataset.cell);

            if (prefix === 'finish') {
              localStorage.setItem(`lesson-${idLesson}-finish`, true);
              modal('finish');
              clean(figure);
            }

            if (!prefix) {
              render(idLesson);
              modal('reset');
            }
          }, { once: true });
        });
      }
    });
  });
};

const levels = document.querySelector('.lesson-slider__wrapper');
levels.addEventListener('click', (e) => {
  if (e.target.classList.contains('lesson-slider__btn')) {
    const idLesson = Number(e.target.dataset.lesson);
    render(idLesson);
  }
});

const prevNextNavigation = () => {
  const prevBtn = document.getElementById('header-btn-prev');
  const nextBtns = document.querySelectorAll('[data-next]');

  prevBtn.addEventListener('click', () => {
    const current = Number(window.location.hash.slice(1));
    const idLevel = (current < 2 ? 2 : current) - 1;
    window.location.href = `#${idLevel}`;
    render(idLevel);
  });

  nextBtns.forEach((nextBtn) => {
    nextBtn.addEventListener('click', () => {
      const hash = Number(window.location.hash.slice(1));
      const current = (hash === 0) ? 1 : hash;
      const idLevel = (current < lessons.length ? current : lessons.length - 1) + 1;
      window.location.href = `#${idLevel}`;
      render(idLevel);
    });
  });
};

prevNextNavigation();

const id = Number(window.location.hash.slice(1)) || 1;
render(id);

window.addEventListener('resize', () => imgHeight());
