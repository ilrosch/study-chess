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

const modalOpenOrClose = () => {
  // const btnOpen = document.querySelector('.open-modal');

  const overlay = document.getElementById('overlay');
  const modal = overlay.querySelector('#modal-finish');

  // btnOpen.addEventListener('click', () => {
  //   const linkNext = modal.querySelector('#modal-next');

  //   const current = Number(window.location.hash.slice(1));
  //   linkNext.href = `#${(current === 0 ? 1 : current) + 1}`;

  //   document.body.classList.add('lock');
  //   fadeIn(overlay, 1000, 'flex');
  //   fadeIn(modal, 1500);
  // });

  overlay.addEventListener('click', (e) => {
    console.log(e.target.dataset);
    if (e.target.id === 'modal-next' || e.target.hasAttribute('data-close') || e.target.className === 'overlay') {
      document.body.classList.remove('lock');
      fadeOut(modal, 1000);
      fadeOut(overlay, 1500);
    }
  });
};

modalOpenOrClose();
