//  북마크
function BookmarkBtn() {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  
  if (bookmarks.includes(currentMovieId)) {
      bookmarkBtn.style.display = 'none';
      removeBookmarkBtn.style.display = 'block';
  } else {
      bookmarkBtn.style.display = 'block';
      removeBookmarkBtn.style.display = 'none';
  }
}