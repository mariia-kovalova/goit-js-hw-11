export default class PageInterface {
  renderCards(hits, element) {
    const markup = hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags: alt,
          likes,
          views,
          comments,
          downloads,
        }) => `<a class="gallery__item" href="${largeImageURL}">
    <div class="photo-card">
      <div class="thumb">
        <img src="${webformatURL}" alt="${alt}" loading="lazy" />
      </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${downloads}
        </p>
      </div>
    </div>
  </a>`
      )
      .join('');

    element.insertAdjacentHTML('beforeend', markup);
  }

  reset(element) {
    element.innerHTML = '';
  }

  hide(element) {
    element.classList.add('visually-hidden');
  }

  show(element) {
    element.classList.remove('visually-hidden');
  }
}
