import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

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
    const p = document.createElement('p');
    p.classList.add('lesson-block__text', 'dark');
    p.textContent = text;

    descr.append(p);
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

  // Картинка
  imgHeight();

  // Шахматная доска
  cells.forEach((cell) => { cell.innerHTML = ''; });
  lesson.chess.forEach(({ cell: id, element: el }) => {
    const cell = [...cells].find((item) => item.dataset.cell === id.toString());
    const img = document.createElement('img');
    img.classList.add('chess-item__image');
    img.src = `/common_files/img/chess-themes/${el}.png`;

    cell.append(img);
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
