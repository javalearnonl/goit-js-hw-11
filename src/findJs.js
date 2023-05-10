import Notiflix from 'notiflix';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '36274489-574cd7b2e6e5eaf2239dbc903';

export default class ImageFinder {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    let data;
    try {
      const response = await axios.get(
        `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
      );
      data = response.data;
    } catch (error) {
      this.notifyQueryError(error);
      console.log(error);
      return null;
    }

    if (data.hits.length === 0) {
      this.notifyIncorrectQuery();
    }

    if (this.page * 40 >= data.totalHits && data.hits.length !== 0) {
      this.notifyEndOfGallery();
    }

    if (this.page === 1 && data.totalHits !== 0) {
      this.showAmountOfHits(data.totalHits);
    }

    this.incrementPage();
    return data;
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }

  notifyIncorrectQuery() {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      {
        position: 'right-top',
      }
    );
  }

  notifyEndOfGallery() {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results.",
      {
        position: 'right-top',
      }
    );
  }

  showAmountOfHits(totalHits) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`, {
      position: 'right-top',
    });
  }

  notifyQueryError(error) {
    Notiflix.Notify.failure(
      `Oops! Something went wrong. You caught the following error: ${error.message}.`,
      {
        position: 'right-top',
      }
    );
  }
}
