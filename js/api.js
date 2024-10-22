//  TMDB에서 가져올 정보 정리
const API_KEY = "26210aab61f4aae375801820bae82a65";
const DISCOVER_API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko&page=1`;
const NOW_PLAYING_API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1'`;
const POPULAR_API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
const TOP_RATED_API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
const UPCOMING_API_URL = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`;
const IMAGE_URL = "https://image.tmdb.org/t/p/w220_and_h330_face";

//  HTML 요소 정리
const movieCardArea = document.getElementById("movieCardArea");
const movieCard = document.getElementById("movieCard");
const movieSearchInput = document.getElementById("movieSearchInput");
const topMenu = document.getElementById("topMenu");

// -------------------------------------------------------------------

//  1. fetch로 api(discovery) 연동하기
async function fetchMovies(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("영화 데이터를 불러오는 중 오류가 발생했습니다:", error);
  }
}

function displayMovies(movies) {
  // 추가 전 영화 목록 삭제
  movieCardArea.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");

    movieCard.innerHTML = `
      <div class="movie-card" id="movieCard">
        <div class="movie-card-inner">
          <img class="movie-image" src="${
            IMAGE_URL + movie.poster_path
          }" alt="${movie.title}">
          <h3 class="movie-title">${movie.title}</h3>          
        <p class="movie-score">평점: ${
          Math.round(movie.vote_average * 10) / 10
        }</p>
        </div>
      </div>        
      `;
    movieCardArea.appendChild(movieCard);
  });
}

// -------------------------------------------------------------------

// 2. 검색기능 고도화
movieSearchInput.addEventListener("input", () => {
  const searchTerm = movieSearchInput.value.toLowerCase();
  const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&language=ko`;

  if (searchTerm) {
    fetchMovies(searchURL);
  } else {
    // 검색어가 없으면 Display 영화 표시
    fetchMovies(DISCOVER_API_URL);
  }
});
fetchMovies(DISCOVER_API_URL);

// -------------------------------------------------------------------

//  3. 주제에 맞게 API_URL 변경
document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll("#topMenu li a");
  menuItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      // 기본 동작 방지
      event.preventDefault();
      // 클릭하는 메뉴에 해당하는 api 주소로 변경
      if (item.textContent === "Playing") {
        fetchMovies(NOW_PLAYING_API_URL);
      } else if (item.textContent === "TopRated") {
        fetchMovies(TOP_RATED_API_URL);
      } else if (item.textContent === "Upcoming") {
        fetchMovies(UPCOMING_API_URL);
      } else {
        fetchMovies(DISCOVER_API_URL);
      }
    });
  });
});

// -------------------------------------------------------------------

//  4. 모달창

// -------------------------------------------------------------------

//  5. 북마크