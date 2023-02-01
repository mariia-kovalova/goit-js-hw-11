import axios from 'axios';

export default class ImagesApiService {
  constructor() {
    this._query = '';
    this._page = 1;
    this._per_page = 40;
    this._loadedImages = 0;
  }

  async fetchImages() {
    const URL = `https://pixabay.com/api/?q=${this._query}`;

    const options = {
      params: {
        key: '32612520-8855a8bf59320f9a880e30168',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        pretty: 'true',
        page: this._page,
        per_page: this._per_page,
      },
    };

    try {
      const response = await axios.get(URL, options);
      this.incrementPageCount();
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPageCount() {
    this._page += 1;
  }

  resetPageCount() {
    this._page = 1;
  }

  reseLoadedImagesCount() {
    this._loadedImages = 0;
  }

  get query() {
    return this._query;
  }
  set query(newQuery) {
    this._query = newQuery;
  }

  get per_page() {
    return this._per_page;
  }
  set per_page(newPerPage) {
    this._per_page = newPerPage;
  }

  get loadedImages() {
    return this._loadedImages;
  }
  set loadedImages(num) {
    this._loadedImages += num;
  }
}
