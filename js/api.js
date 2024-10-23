//  TMDB에서 가져올 정보 정리
const API_KEY = "26210aab61f4aae375801820bae82a65";
const NOW_PLAYING_API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko&page=1'`;
const POPULAR_API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko&page=1`;
const TOP_RATED_API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ko&page=1`;
const UPCOMING_API_URL = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=ko&page=1`;
const IMAGE_URL = "https://image.tmdb.org/t/p/w220_and_h330_face";
let selectMovieId;

//  HTML 요소 정리
const movieCardArea = document.getElementById("movieCardArea");
const movieCard = document.getElementById("movieCard");
const movieSearchInput = document.getElementById("movieSearchInput");
const topMenu = document.getElementById("topMenu");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeModal");
const movieImage = document.getElementById("movieImage");
const movieTitle = document.getElementById("movieTitle");
const ReleaseDate = document.getElementById("ReleaseDate");
const movieScore = document.getElementById("movieScore");
const movieOutline = document.getElementById("movieOutline");
const wishListBtn = document.getElementById("wishListBtn");
const addWishListBtn = document.getElementById("addWishListBtn");
const removeWishListBtn = document.getElementById("removeWishListBtn");

//-------------------------------------------------------------------

//  1. fetch로 api(popular) 연동하기
async function fetchMovies(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    displayMovies(data.results);
  } catch (error) {
    console.error("영화 데이터를 불러오는 중 오류가 발생했습니다:", error);
  }
}

//  가져온 api data를 html에 그리기
function displayMovies(movies) {
  // 추가 전 영화 목록 삭제
  movieCardArea.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");

    movieCard.innerHTML = `
      <div class="movie-card" id="${movie.id}">
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

//  2. 검색기능 고도화
movieSearchInput.addEventListener("input", () => {
  const searchTerm = movieSearchInput.value.toLowerCase();
  const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&language=ko`;

  if (searchTerm) {
    fetchMovies(searchURL);
  } else {
    // 검색어가 없으면 Popular 영화 표시
    fetchMovies(POPULAR_API_URL);
  }
});
fetchMovies(POPULAR_API_URL);

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
        fetchMovies(POPULAR_API_URL);
      }
    });
  });
});

// -------------------------------------------------------------------

//  4. 모달창
//  movie-card 클릭시 모달창 생성
movieCardArea.addEventListener("click", function (event) {
  const closestCard = event.target.closest(".movie-card");
  const movieId = closestCard.id;
  selectMovieId = movieId;

  //  modal창에 data 표시하기
  async function lookMoviesDetail(movieId) {
    const movieDetailURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko`;
    const response = await fetch(movieDetailURL);
    const movie = await response.json();

    movieImage.src = IMAGE_URL + movie.poster_path;

    movieTitle.textContent = movie.title;

    movieOutline.textContent = movie.overview;
    ReleaseDate.textContent = movie.release_date;
    movieScore.textContent = Math.round(movie.vote_average * 10) / 10;
  }
  lookMoviesDetail(movieId);

  if (closestCard) {
    modal.classList.remove("hide"); // 클래스 제거
  }
});
//  x표시 누르면 모달창 닫기
closeBtn.addEventListener("click", function (event) {
  if (event.target === closeBtn) {
    modal.classList.add("hide");
  }
});
// 외부 클릭 시 모달창 닫기
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.classList.add("hide");
  }
});

// -------------------------------------------------------------------

//  5. 북마크
//  1) 찜목록에 추가하기
addWishListBtn.addEventListener("click", () => {
  let wishMovieList = JSON.parse(localStorage.getItem("wishMovie")) || [];

  if (!wishMovieList.includes(selectMovieId)) {
    wishMovieList.push(selectMovieId);
    localStorage.setItem("wishMovie", JSON.stringify(wishMovieList));
    alert("선택하신 영화가 찜목록에 추가되었습니다.")
  } else {
    alert(
      "이미 찜목록에 추가된 영화입니다. 해당 영화를 찜목록에서 제거하고 싶으시다면 아래 찜목록 취소 버튼을 눌러주세요."
    );
  }
});

//  2) 찜목록에서 제거하기
removeWishListBtn.addEventListener("click", () => {
  let wishMovieList = JSON.parse(localStorage.getItem("wishMovie")) || [];

  if (wishMovieList.includes(selectMovieId)) {
    wishMovieList = wishMovieList.filter((id) => id !== selectMovieId);

    localStorage.setItem("wishMovie", JSON.stringify(wishMovieList));
    alert("선택하신 영화가 찜목록에서 제거되었습니다.");
  } else {
    alert(
      "찜목록에 추가되지 않은 영화입니다. 해당 영화를 찜목록에 추가하고 싶으시다면 위에 찜목록 추가 버튼을 눌러주세요."
    );
  }
});

//  3) 찜목록만 보기
wishListBtn.addEventListener("click", () => {

  //  카드영역 초기화 작업
  movieCardArea.innerHTML = "";

  //  = [movieId1, movieId2, movieId3, ...]
  const wishMovieData = JSON.parse(localStorage.getItem("wishMovie"));
  
  wishMovieData.forEach( async (id) => {
    const movieDetailURL = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ko`;
    const response = await fetch(movieDetailURL);
    const movie = await response.json();

    console.log(movie);

      const movieCard = document.createElement("div");

      movieCard.innerHTML = `
      <div class="movie-card" id="${movie.id}">
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
  });
//