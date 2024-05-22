const prevNextNavigation = () => {
  const prevBtn = document.getElementById('header-btn-prev');
  const nextBtn = document.getElementById('header-btn-next');
  const lessons = document.querySelectorAll('.lesson');

  let current = 1;
  prevBtn.addEventListener('click', () => {
    if (current - 1 > 0) {
      current -= 1;
      lessons.forEach((lesson) => lesson.classList.remove('lesson-active'));
      document.getElementById(`lesson-${current}`).classList.add('lesson-active');
    }
  });

  nextBtn.addEventListener('click', () => {
    if (current + 1 <= lessons.length) {
      current += 1;
      lessons.forEach((lesson) => lesson.classList.remove('lesson-active'));
      document.getElementById(`lesson-${current}`).classList.add('lesson-active');
    }
  });

  const sliderBtns = document.querySelectorAll('.lesson-slider__btn');
  sliderBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      lessons.forEach((lesson) => lesson.classList.remove('lesson-active'));
      document.getElementById(`lesson-${btn.dataset.lesson}`).classList.add('lesson-active');
    });
  });
};

prevNextNavigation();
