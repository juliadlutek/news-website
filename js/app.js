let articlesOnHomepage,
  articlesOnLibrary,
  articlePerPageInput,
  loadedArticlesNumber,
  totalNumberOfArticles,
  sortMethod,
  fetchThrottled,
  loadingInfo,
  backToTopButton;
let articlesPerPageValue = 15;
const URL = "https://api.spaceflightnewsapi.net/v3/articles";

const main = () => {
  prepareDomElements();
  prepareDomEvents();
  let page = document.body.id;
  switch (page) {
    case "index":
      fetchArticlesForHomepage();
      fetchNumberOfArticles();
      break;
    case "library":
      fetchArticlesForLibrary();
      break;
  }
};

const prepareDomElements = () => {
  backToTopButton = document.querySelector(".back-to-top");
  loadingInfo = document.querySelector(".loading");
  let page = document.body.id;
  switch (page) {
    case "index":
      totalNumberOfArticles = document.querySelector(".total-number");
      loadedArticlesNumber = document.querySelector(".articles-number");
      articlesOnHomepage = document.querySelector(".homepage");
      articlePerPageInput = document.querySelector(".pagination-input");
      break;
    case "library":
      articlesOnLibrary = document.querySelector(".library");
      sortMethod = document.querySelector(".sort-method");

      break;
  }
};

const prepareDomEvents = () => {
  backToTopButton.addEventListener("click", scrollBackToTop);
  window.addEventListener("scroll", toggleBackToTopButton);
  let page = document.body.id;
  switch (page) {
    case "index":
      articlesOnHomepage.addEventListener("click", handleLikeButtonClick);
      articlePerPageInput.addEventListener("change", changeArticlePerPageValue);
      window.addEventListener("scroll", applyInfiniteScroll);
      break;
    case "library":
      articlesOnLibrary.addEventListener("click", handleLikeButtonClick);

      sortMethod.addEventListener("change", handleSortMethodChange);
      break;
  }
};

// FUNCTIONS FOR API REQUESTS

const fetchArticlesForHomepage = () => {
  loadingInfo.classList.remove("hidden");
  fetch(
    `${URL}/?_limit=${articlesPerPageValue}&_start=${loadedArticlesNumber.textContent}`
  )
    .then((res) => res.json())
    .then((data) => {
      data.map((article) => {
        const newArticle = createArticleCard(article);
        articlesOnHomepage.append(newArticle);
      });
      loadingInfo.classList.add("hidden");
      loadedArticlesNumber.textContent =
        parseInt(loadedArticlesNumber.textContent) + articlesPerPageValue;
    })
    .catch((err) => console.error(err));
};

const fetchArticlesForLibrary = () => {
  loadingInfo.classList.remove("hidden");
  const storedIds = JSON.parse(localStorage.getItem("likedArticles"));
  if (storedIds != null) {
    storedIds.map((id) => {
      fetch(`${URL}/${id}`)
        .then((res) => res.json())
        .then((data) => {
          const newArticle = createArticleCard(data);
          articlesOnLibrary.append(newArticle);
        })
        .catch((err) => console.error(err));
    });
  } else {
    const emptyLibraryInfo = document.createElement("p");
    emptyLibraryInfo.classList.add("empty-library");
    emptyLibraryInfo.textContent =
      "Your library is empty, go to the home page and look for articles you like... 🔎";
    articlesOnLibrary.appendChild(emptyLibraryInfo);
  }
  loadingInfo.classList.add("hidden");
};

const fetchNumberOfArticles = () => {
  fetch(`${URL}/count`)
    .then((res) => res.json())
    .then((data) => {
      totalNumberOfArticles.textContent = data;
    })
    .catch((err) => console.error(err));
};

// FUNCTIONS FOR HANDLING EVENTS

const changeArticlePerPageValue = (e) => {
  articlesPerPageValue = parseInt(articlePerPageInput.value);
  loadedArticlesNumber.textContent = 0;
  articlesOnHomepage.innerHTML = "";
  fetchArticlesForHomepage();
};

const applyInfiniteScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollHeight - 5 <= clientHeight + scrollTop) {
    if (!fetchThrottled) {
      fetchArticlesForHomepage();
      fetchThrottled = true;
      setTimeout(() => {
        fetchThrottled = false;
      }, 1000);
    }
  }
};

const handleLikeButtonClick = (e) => {
  if (!e.target.classList.contains("empty-library")) {
    const thisArticleId = e.target.closest("article").getAttribute("id");
    const thisButton = e.target.closest(".heart-button");
    let storedIds = JSON.parse(localStorage.getItem("likedArticles"));
    if (thisButton.classList.contains("like")) {
      if (storedIds === null) {
        storedIds = [thisArticleId];
      } else {
        storedIds.push(thisArticleId);
      }
      thisButton.classList.remove("active");
      thisButton.nextElementSibling.classList.add("active");
    }
    if (thisButton.classList.contains("dislike")) {
      if (storedIds === null) {
        storedIds = [];
      } else {
        storedIds.pop(thisArticleId);
      }
      thisButton.classList.remove("active");
      thisButton.previousSibling.classList.add("active");
    }
    localStorage.setItem("likedArticles", JSON.stringify(storedIds));
  }
};

const handleSortMethodChange = (e) => {
  const value = e.target.value;
  let articles = Array.from(articlesOnLibrary.children);
  switch (value) {
    case "title asc":
      articles.sort((a, b) => {
        let titleA = a.querySelector(".article-title").textContent;
        let titleB = b.querySelector(".article-title").textContent;
        return titleA > titleB ? 1 : -1;
      });
      break;
    case "title desc":
      articles.sort((a, b) => {
        let titleA = a.querySelector(".article-title").textContent;
        let titleB = b.querySelector(".article-title").textContent;
        return titleA < titleB ? 1 : -1;
      });
      break;
    case "date asc":
      articles.sort((a, b) => {
        let dateA = new Date(a.querySelector(".publication-date").textContent);
        let dateB = new Date(b.querySelector(".publication-date").textContent);
        return dateA > dateB ? 1 : -1;
      });
      break;
    case "date desc":
      articles.sort((a, b) => {
        let dateA = new Date(a.querySelector(".publication-date").textContent);
        let dateB = new Date(b.querySelector(".publication-date").textContent);
        return dateA < dateB ? 1 : -1;
      });
      break;
  }
  articles.map((article) => {
    articlesOnLibrary.append(article);
  });
};

const toggleBackToTopButton = (e) => {
  const scrollTop = document.documentElement.scrollTop;
  if (scrollTop === 0) {
    backToTopButton.classList.add("hidden");
  } else {
    backToTopButton.classList.remove("hidden");
  }
};

// FUNCTION FOR CREATING ELEMENTS

const createArticleCard = (article) => {
  const articleCard = document.createElement("article");
  articleCard.classList.add("article");
  articleCard.setAttribute("id", article.id);

  const articleImage = document.createElement("img");
  articleImage.classList.add("article-image");
  articleImage.setAttribute("src", article.imageUrl);
  articleImage.setAttribute("alt", "article image");

  const articleDetails = document.createElement("div");
  articleDetails.classList.add("article-details");

  const newsSite = document.createElement("p");
  newsSite.textContent = article.newsSite;

  const publicationDate = document.createElement("p");
  publicationDate.textContent = article.publishedAt.substring(0, 10);
  publicationDate.classList.add("publication-date");

  const articleTitle = document.createElement("h3");
  articleTitle.classList.add("article-title");
  articleTitle.textContent = article.title;

  const articleSummary = document.createElement("p");
  articleSummary.classList.add("article-summary");
  articleSummary.textContent = reduceSummaryLength(article.summary);

  const likeButton = document.createElement("img");
  likeButton.setAttribute("src", "../icons/like.png");
  likeButton.classList.add("heart-button");
  likeButton.classList.add("like");

  const dislikeButton = document.createElement("img");
  dislikeButton.setAttribute("src", "../icons/dislike.png");
  dislikeButton.classList.add("heart-button");
  dislikeButton.classList.add("dislike");

  const storedIds = JSON.parse(localStorage.getItem("likedArticles"));
  if (storedIds != null && storedIds.includes(JSON.stringify(article.id))) {
    dislikeButton.classList.add("active");
  } else {
    likeButton.classList.add("active");
  }

  const articleLink = document.createElement("a");
  articleLink.classList.add("article-link");
  articleLink.setAttribute("href", article.url);
  articleLink.setAttribute("target", "_blank");
  articleLink.textContent = "Read article";

  articleDetails.append(newsSite, publicationDate);
  articleCard.append(
    articleImage,
    articleDetails,
    articleTitle,
    articleSummary,
    likeButton,
    dislikeButton,
    articleLink
  );

  return articleCard;
};

// OTHER FUNCTIONS

const scrollBackToTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

const reduceSummaryLength = (str) => {
  if (str.length > 200) {
    let reducedStr = str.slice(0, 200).split(" ");
    reducedStr.pop();
    return reducedStr.join(" ") + "...";
  } else {
    return str;
  }
};

document.addEventListener("DOMContentLoaded", main);
