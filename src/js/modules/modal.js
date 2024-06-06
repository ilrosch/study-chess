const fadeIn = (el, timeout, display) => {
  el.style.opacity = 0;
  el.style.display = display || 'block';
  el.style.transition = `opacity ${timeout}ms`;
  setTimeout(() => {
    el.style.opacity = 1;
  }, 10);
};

const fadeOut = (el, timeout) => {
  el.style.opacity = 1;
  el.style.transition = `opacity ${timeout}ms`;
  el.style.opacity = 0;

  setTimeout(() => {
    el.style.display = 'none';
  }, timeout);
};

const modalOpenOrClose = (id) => {
  const overlay = document.getElementById('overlay');
  let modal;

  if (id === 'finish') {
    modal = overlay.querySelector('#modal-finish');

    const linkNext = modal.querySelector('#modal-next');
    const current = Number(window.location.hash.slice(1));
    linkNext.href = `#${(current === 0 ? 1 : current) + 1}`;
  } else {
    modal = overlay.querySelector('#modal-reset');
  }

  document.body.classList.add('lock');
  fadeIn(overlay, 1000, 'flex');
  fadeIn(modal, 1500);

  overlay.addEventListener('click', (e) => {
    if (e.target.id === 'modal-next' || e.target.hasAttribute('data-close') || e.target.className === 'overlay') {
      document.body.classList.remove('lock');
      fadeOut(modal, 1000);
      fadeOut(overlay, 1500);
    }
  });
};

const changeLang = () => {
  const box = document.querySelector('.lang');
  const list = box.querySelector('.lang-list');

  document.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-lang') && !list.classList.contains('open-list')) {
      list.classList.add('open-list');
      fadeIn(list, 500, 'flex');
    } else {
      list.classList.remove('open-list');
      fadeOut(list, 500);
    }
  });
};

changeLang();

export default modalOpenOrClose;
