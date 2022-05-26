let mainContent,
  articlePerPageInput,
  articlesNumber,
  totalNumber,
  fetchThrottled;
let articlesPerPageValue = 5;
const URL = "https://api.spaceflightnewsapi.net/v3/articles";

const main = () => {
  prepareDomElements();
  prepareDomEvents();
  fetchArticles();
  fetchNumberOfArticles();
};

const prepareDomElements = () => {
  mainContent = document.querySelector(".main-content");
  articlePerPageInput = document.querySelector(".pagination-input");
  articlesNumber = document.querySelector(".articles-number");
  totalNumber = document.querySelector(".total-number");
};

const prepareDomEvents = () => {
  articlePerPageInput.addEventListener("change", changeArticlePerPageValue);
  window.addEventListener("scroll", applyInfiniteScroll);
};

const fetchArticles = () => {
  fetch(`${URL}/?_limit=${articlesPerPageValue}`)
    .then((res) => res.json())
    .then((data) => {
      data.map((article) => {
        const newArticle = createArticleCard(article);
        mainContent.append(newArticle);
      });
      articlesNumber.textContent =
        parseInt(articlesNumber.textContent) + articlesPerPageValue;
    })
    .catch((err) => console.error(err));
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
      fetchArticles();
      fetchThrottled = true;
      setTimeout(() => {
        fetchThrottled = false;
      }, 1500);
    }
  }
};

document.addEventListener("DOMContentLoaded", main);
