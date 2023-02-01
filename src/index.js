import ImagesApiService from './js/images-service';
import PageInterface from './js/page-interface';
import NotifyApi from './js/notify-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'material-icons/iconfont/material-icons.css';
import './sass/index.scss';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.lds-ellipsis'),
  end: document.querySelector('.infinite-scroll-last'),
};

const observerOptions = {
  threshold: 1,
};

const imagesApiService = new ImagesApiService();
const pageInterface = new PageInterface();
const notifyApi = new NotifyApi();
const infinitObserver = new IntersectionObserver(onObserver, observerOptions);
let lightbox = new SimpleLightbox('.gallery .gallery__item');

refs.searchForm.addEventListener('submit', onSearchFormSubmit);

function onSearchFormSubmit(e) {
  e.preventDefault();
  pageInterface.reset(refs.gallery);
  pageInterface.hide(refs.end);
  pageInterface.show(refs.loader);

  imagesApiService.query = e.currentTarget.elements.searchQuery.value;
  imagesApiService.resetPageCount();
  imagesApiService.reseLoadedImagesCount();
  imagesApiService.fetchImages().then(loadInterface);
}

function loadInterface({ data: { hits, totalHits } }) {
  pageInterface.hide(refs.loader);
  const numberOfImages = hits.length;

  if (numberOfImages === 0) {
    notifyApi.failure();
    return;
  }
  const perPage = imagesApiService.per_page;
  imagesApiService.loadedImages = numberOfImages;
  const numberOfLoadedImages = imagesApiService.loadedImages;

  if (numberOfLoadedImages <= perPage) {
    notifyApi.success(totalHits);
  }

  pageInterface.renderCards(hits, refs.gallery);
  lightbox.refresh();

  if (numberOfLoadedImages > perPage) {
    smoothScroll(refs.gallery);
  }

  if (numberOfLoadedImages >= totalHits) {
    notifyApi.info();
    pageInterface.show(refs.end);
    return;
  }

  const lastChild = document.querySelector('.gallery__item:last-child');
  infinitObserver.observe(lastChild);
}

function smoothScroll(element) {
  const { height: cardHeight } =
    element.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onObserver([entry], observer) {
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);

    pageInterface.show(refs.loader);
    imagesApiService.fetchImages().then(loadInterface);
  }
}
