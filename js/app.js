const URL = "https://api.spaceflightnewsapi.net/v3/articles/";
let mainContent;

const main = () => {
  prepareDomElements();
  prepareDomEvents();
  fetchArticles();
};

const prepareDomElements = () => {
  mainContent = document.querySelector(".main-content");
};

const prepareDomEvents = () => {};

const fetchArticles = () => {
  fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      data.map((article) => {
        const newArticle = createArticleCard(article);
        mainContent.append(newArticle);
      });
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
  articleSummary.textContent = article.summary;

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

document.addEventListener("DOMContentLoaded", main);
