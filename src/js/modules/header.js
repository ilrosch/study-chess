const scrollHeader = () => {
  const header = document.getElementById('header');
  let scrollPrev = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = Math.round(window.scrollY);

    if (currentScroll > 100 && currentScroll > scrollPrev) {
      header.classList.add('out');
    } else {
      header.classList.remove('out');
    }

    scrollPrev = currentScroll;
  });
};

scrollHeader();
