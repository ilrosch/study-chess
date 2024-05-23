import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

const swiper = new Swiper('.swiper', {
  // configure Swiper to use modules
  modules: [Navigation],

  direction: 'horizontal',
  slidesPerView: 'auto',

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
