import './css/styles.css';
import ImageFinder from './findJs.js';
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormElement = document.getElementById('search-form');
const imageGalleryElement = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const sloganElements = document.querySelector('.app-slogan');

const imageFinder = new ImageFinder();

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});

searchFormElement.addEventListener('submit', handleSearchSubmit);
loadMoreButton.addEventListener('click', handleLoadMoreClick);

async function handleSearchSubmit(event) {
  event.preventDefault();

  resetMarkup();

  const searchName = event.currentTarget.elements.searchQuery.value.trim();
  imageFinder.searchQuery = searchName;

  if (searchName !== '') {
    imageFinder.resetPage();
    const imgDataSet = await imageFinder.fetchImages();

    if (imgDataSet.hits.length > 0) {
      hideSlogan();
    }

    renderImgGallery(imgDataSet);

    if (imgDataSet.hits.length < imgDataSet.totalHits) {
      showLoadBtn();
    }
  }

  if (searchName === '') {
    notifySearchNameAbsence();
    showSlogan();
  }
}

async function handleLoadMoreClick() {
  const nextImgDataSet = await imageFinder.fetchImages();
  renderImgGallery(nextImgDataSet);

  if ((imageFinder.page - 1) * 40 >= nextImgDataSet.totalHits) {
    hideLoadBtn();
  }
}

function renderImgGallery(data) {
  const imgCards = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
 <a class="photo-card__item" href="${largeImageURL}"> 
 <div class="photo-card__tumb">
 <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
  </div>
  <div class="info">
  <p class="info-item"> <b class="info-item__param">👍</b> <span class="info-item__num">${likes} |</span> </p> 
  <p class="info-item"> <b class="info-item__param">👀</b> <span class="info-item__num">${views} | </span> </p>
   <p class="info-item"> <b class="info-item__param">✍️</b> <span class="info-item__num">${comments} | </span> 
   </p> <p class="info-item"> <b class="info-item__param">💾</b> <span class="info-item__num">${downloads}</span> </p>
    </div> </a> </div>`
    )
    .join('');

  imageGalleryElement.insertAdjacentHTML('beforeend', imgCards);

  lightbox.refresh();

  makeSmoothScroll();
}

function resetMarkup() {
  if (imageGalleryElement.childNodes.length !== 0) {
    imageGalleryElement.innerHTML = '';
    hideLoadBtn();
    showSlogan();
  }
}

function hideLoadBtn() {
  loadMoreButton.classList.add('js-hidden');
}

function showLoadBtn() {
  loadMoreButton.classList.remove('js-hidden');
}

function hideSlogan() {
  sloganElements.classList.add('js-hidden');
}

function showSlogan() {
  sloganElements.classList.remove('js-hidden');
}

function notifySearchNameAbsence() {
  Notiflix.Notify.failure('For begin searching u need to input text', {
    position: 'right-top',
  });
}

function makeSmoothScroll() {
  if (imageFinder.page - 1 > 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 1.72,
      behavior: 'smooth',
    });
  }
}
