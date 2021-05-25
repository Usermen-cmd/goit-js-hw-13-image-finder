class Fetch {
  constructor(url) {
    this.URL = url;
  }
  async fetch(pageNumber, searchQuery) {
    const response = await fetch(
      `${this.URL}&q=${searchQuery}&page=${pageNumber}`,
    );
    const images = await response.json();
    return images;
  }
}
export default Fetch;
