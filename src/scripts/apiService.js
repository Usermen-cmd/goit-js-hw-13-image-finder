import URL from './fetchOptions.js';
import Render from './classRender.js';
import options from './observOptions.js';
import templateBtn from '../templates/modal.hbs';
import * as PNotify from '@pnotify/core/dist/PNotify.js';
const basicLightbox = require('basiclightbox');
const debounce = require('lodash.debounce');

const gallryRef = document.querySelector('.gallery');
const formRef = document.querySelector('.search-form');

const renderGallery = new Render(gallryRef);
const observer = new IntersectionObserver(toScroll, options);

formRef.addEventListener('input', debounce(onInputHandler, 500));

let page = 1;
let query = '';

async function fetchImages(pageNumber, searchQuery) {
  try {
    const response = await fetch(`${URL}&q=${searchQuery}&page=${pageNumber}`);
    const images = await response.json();
    renderImages(images);
  } catch {
    PNotify.error({
      type: 'error',
      title: 'Некорректный запрос',
      text: 'позвоните президенту',
      delay: 2000,
      remove: true,
    });
  }
}

function renderImages(obj) {
  renderGallery.render(obj);
  observer.observe(gallryRef.lastElementChild);
}

function onInputHandler(e) {
  query = e.target.value.trim();
  gallryRef.innerHTML = '';
  fetchImages(1, query);
}

function toScroll(entries, observer) {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      page += 1;
      fetchImages(page, query);
      observer.unobserve(gallryRef.lastElementChild);
    }
  });
}

gallryRef.addEventListener('click', onImageClick);

function onImageClick(e) {
  const src = e.target.dataset.src;
  const alt = e.target.getAttribute('alt');
  const markupImg = templateBtn({ src, alt });
  const instance = basicLightbox.create(markupImg);
  instance.show();
  document.querySelector('.close-btn').addEventListener('click', () => {
    console.log('qwe');
    instance.close();
  });
}
