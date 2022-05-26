const URL = "https://api.spaceflightnewsapi.net/v3/articles/";

fetch(URL)
  .then((res) => res.json())
  .then((data) => {
    data.map((article) => {
      console.log(article);
    });
  })
  .catch((err) => console.error(err));

const createArticleCard = (article) => {
  const articleCard = document.createElement("article");
  articleCard.classList.add("article");
  article.append(articleCard);

  const articleImage = document.createElement("img");
  articleImage.classList.add("article-image");
  articleImage.setAttribute("src", article.imageURL);

  const articleDetails = document.createElement("div");
  articleDetails.add("article-details");

  const newsSite = document.createElement("p");
  newsSite.textContent = article.newsSite;

  const publicationDate = document.createElement("p");
  publicationDate.textContent = article.publishedAt;

  const articleTitle = document.createElement("h3");
  articleTitle.classList.add("article-title");
  articleTitle.textContent = article.title;

  const articleSummary = document.createElement("p");
  articleSummary.classList.add("article-summary");
  articleSummary.textContent = article.summary;

  const articleLink = document.createElement("a");
  articleLink.classList.add("article-link");
  articleLink.setAttribute("href", article.url);

  articleDetails.append(newsSite, publicationDate);
  articleCard.append(
    articleImage,
    articleDetails,
    articleTitle,
    articleSummary,
    articleLink
  );
};
