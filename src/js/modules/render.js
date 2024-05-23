import lessons from './lessons.js';

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
      a.classList.add('lesson-slider__btn--active');
    }

    levels.append(a);
  }

  // Шахматная доска
  cells.forEach((cell) => { cell.innerHTML = ''; });
  lesson.chess.forEach(({ cell: id, element: el }) => {
    const cell = [...cells].find((item) => item.dataset.cell === id.toString());
    const img = document.createElement('img');
    img.classList.add('chess-item__image');
    img.src = `img/chess-themes/${el}.png`;

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
  const nextBtn = document.getElementById('header-btn-next');

  prevBtn.addEventListener('click', () => {
    const current = Number(window.location.hash.slice(1));
    const idLevel = (current < 2 ? 2 : current) - 1;
    window.location.href = `http://${window.location.host}/#${idLevel}`;
    render(idLevel);
  });

  nextBtn.addEventListener('click', () => {
    const current = Number(window.location.hash.slice(1));
    const idLevel = (current < lessons.length ? current : lessons.length - 1) + 1;
    window.location.href = `http://${window.location.host}/#${idLevel}`;
    render(idLevel);
  });
};

prevNextNavigation();

const id = Number(window.location.hash.slice(1)) || 1;
render(id);
