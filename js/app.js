let homepage,
  articlePerPageInput,
  articlesNumber,
  totalNumber,
  articles,
  fetchThrottled;
articles;
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
      break;
  }
  // fetchArticlesForLibrary();
};

const prepareDomElements = () => {
  articles = document.querySelector(".main-content");
  let page = document.body.id;
  switch (page) {
    case "index":
      totalNumber = document.querySelector(".total-number");
      articlesNumber = document.querySelector(".articles-number");
      homepage = document.querySelector(".homepage");
      articlePerPageInput = document.querySelector(".pagination-input");
      break;
    case "library":
      break;
  }
};

const prepareDomEvents = () => {
  let page = document.body.id;
  switch (page) {
    case "index":
      articlePerPageInput.addEventListener("change", changeArticlePerPageValue);
      window.addEventListener("scroll", applyInfiniteScroll);
      articles.addEventListener("click", handleButtonClick);
      break;
    // case "library":
    //   break;
  }
};

const fetchArticlesForHomepage = () => {
  fetch(
    `${URL}/?_limit=${articlesPerPageValue}&_start=${articlesNumber.textContent}`
  )
    .then((res) => res.json())
    .then((data) => {
      data.map((article) => {
        const newArticle = createArticleCard(article);
        homepage.append(newArticle);
      });
      articlesNumber.textContent =
        parseInt(articlesNumber.textContent) + articlesPerPageValue;
    })
    .catch((err) => console.error(err));
};

const fetchArticlesForLibrary = () => {
  const storedIds = JSON.parse(localStorage.getItem("likedArticles"));
  console.log(storedIds);
};

const fetchNumberOfArticles = () => {
  fetch(`${URL}/count`)
    .then((res) => res.json())
    .then((data) => {
      totalNumber.textContent = data;
    })
    .catch((err) => console.error(err));
};

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
  likeButton.classList.add("active");

  const dislikeButton = document.createElement("img");
  dislikeButton.setAttribute("src", "../icons/dislike.png");
  dislikeButton.classList.add("heart-button");
  dislikeButton.classList.add("dislike");

  const articleLink = document.createElement("a");
  articleLink.classList.add("article-link");
  articleLink.setAttribute("href", article.url);
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

const reduceSummaryLength = (str) => {
  if (str.length > 200) {
    let reducedStr = str.slice(0, 200).split(" ");
    reducedStr.pop();
    return reducedStr.join(" ") + "...";
  } else {
    return str;
  }
};

const changeArticlePerPageValue = (e) => {
  articlesPerPageValue = parseInt(articlePerPageInput.value);
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

const handleButtonClick = (e) => {
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
};

document.addEventListener("DOMContentLoaded", main);
