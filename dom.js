$(() => {
  const generateRandomSha = () => {
    const chars = "0123456789abcdef";
    let result = "";
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const cyclingInterval = setInterval(() => {
    $("#last-modified").text(generateRandomSha());
  }, 10);

  fetch(
    "https://api.github.com/repos/yismailuofa/yismailuofa.github.io/commits"
  )
    .then((response) => response.json())
    .then(
      (data) => new Promise((resolve) => setTimeout(() => resolve(data), 400))
    )
    .then(([latestCommit]) => {
      clearInterval(cyclingInterval);

      $("#last-modified").text(latestCommit.sha.slice(0, 7));
      $("#last-modified").attr("href", latestCommit.html_url);
    });

  const createEntry = (title, author, entries) =>
    $("<li>")
      .text(title)
      .append($("<span>", { class: "author" }).text(author))
      .append(
        entries &&
          $("<ul>").append(entries.map((entry) => $("<li>").text(entry)))
      );

  const readingList = books.filter((book) => book.status === "inProgress");
  const completed = books.filter((book) => book.status === "completed");

  readingList.reverse().forEach(({ title, author, entries }) => {
    $("#reading-list").after(createEntry(title, author, entries));
  });
  completed.reverse().forEach(({ title, author, entries }) => {
    $("#completed").after(createEntry(title, author, entries));
  });
});
