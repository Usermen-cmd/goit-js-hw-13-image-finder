import templateFunction from '../templates/image-list.hbs';

class Render {
  constructor(gallryRef) {
    this.gallryRef = gallryRef;
  }

  render(images) {
    const markup = templateFunction(images.hits);
    this.gallryRef.insertAdjacentHTML('beforeend', markup);
  }
}

export default Render;
