import Render from './classRender.js';
import Fetch from './classFetch.js';
import URL from './fetchOptions.js';
import observerOptions from './observOptions.js';
import pnotifyOptions from './pnotify';
import templateBtn from '../templates/modal.hbs';
import * as PNotify from '@pnotify/core/dist/PNotify.js';

const basicLightbox = require('basiclightbox');
const debounce = require('lodash.debounce');

const gallryRef = document.querySelector('.gallery');
const formRef = document.querySelector('.search-form');

const RenderGallery = new Render(gallryRef);
const FetchImages = new Fetch(URL);
const observer = new IntersectionObserver(toScroll, observerOptions);

formRef.addEventListener('input', debounce(onInputHandler, 500));
gallryRef.addEventListener('click', onImageClick);

let page = 1;
let query = '';

async function fetchImages(pageNumber, searchQuery) {
  try {
    const images = await FetchImages.fetch(pageNumber, searchQuery);
    renderImages(images);
  } catch {
    PNotify.error(pnotifyOptions);
  }
}

function renderImages(obj) {
  RenderGallery.render(obj);
  if (page === 1) {
    setTimeout(() => {
      observer.observe(gallryRef.lastElementChild);
    }, 300);
  }
  observer.observe(gallryRef.lastElementChild);
}

function onInputHandler(e) {
  query = e.target.value.trim();
  if (!query) {
    PNotify.error(pnotifyOptions);
    e.target.value = '';
    return;
  }
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

function onImageClick(e) {
  const src = e.target.dataset.src;
  const alt = e.target.getAttribute('alt');
  const markupImg = templateBtn({ src, alt });
  const instance = basicLightbox.create(markupImg);
  instance.show();
  document.querySelector('.close-btn').addEventListener('click', () => {
    instance.close();
  });
}
