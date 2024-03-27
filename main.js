const links = {
  "To Read 📖": [
    {
      title: "Introduction to Information Retrieval",
      url: "https://nlp.stanford.edu/IR-book/pdf/irbookonlinereading.pdf",
      author: "Stanford NLP",
    },
    {
      title: "Designing Data-Intensive Applications",
      url: "https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321",
      author: "Martin Kleppmann",
    },
    {
      title: "Curated Engineering Blog Posts",
      url: "https://www.linkedin.com/posts/ryanlpeterman_19-vetted-company-engineering-blog-posts-activity-7138557807481475072-FX9U",
      author: "Ryan Peterman",
    },
    {
      title: "Database Internals",
      url: "https://www.oreilly.com/library/view/database-internals/9781492040330/",
      author: "Alex Petrov",
    },
    {
      title: "Machine Learning Engineering Open Book",
      url: "https://github.com/stas00/ml-engineering",
      author: "Stas Bekman",
    },
    {
      title: "Engineering MLOps",
      url: "https://www.oreilly.com/library/view/engineering-mlops/9781800562882/",
      author: "Emmanuel Raj",
    },
    {
      title: "Professional Programming",
      url: "https://github.com/charlax/professional-programming",
      author: "Charlax",
    },
    {
      title: "Eugene Yan: ML Ops",
      url: "https://eugeneyan.com/start-here/",
      author: "Eugene Yan",
    },
    {
      title: "Explaining The Postgres Meme",
      url: "https://avestura.dev/blog/explaining-the-postgres-meme",
      author: "Aryan Ebrahimpour",
    },
  ],
  "To Watch 🎞️": [
    {
      title: "CMU Database Group",
      url: "https://www.youtube.com/@CMUDatabaseGroup/videos",
      author: "CMU Database Group",
    },
    {
      title: "MIT 6.824 Distributed Systems (Spring 2020)",
      url: "https://www.youtube.com/playlist?list=PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB",
      author: "MIT",
    },
    {
      title: "Fullstack React GraphQL TypeScript Tutorial",
      url: "https://www.youtube.com/watch?v=I6ypD7qv3Z8",
      author: "Ben Awad",
    },
    {
      title: "Lessons from building GitHub code search",
      url: "https://www.youtube.com/watch?v=CqZA_KmygKw",
      author: "GitHub",
    },
    {
      title: "Building Secure and Reliable Systems",
      url: "https://google.github.io/building-secure-and-reliable-systems/raw/toc.html",
      author: "Google",
    },
    {
      title: "Practical Deep Learning",
      url: "https://course.fast.ai/",
      author: "Jeremy Howard",
    },
  ],
};

const root = document.getElementById("content");

const createRows = (items) => {
  const tbody = document.createElement("tbody");

  items.forEach(({ title, url, author }) => {
    const tr = document.createElement("tr");
    const tdTitle = document.createElement("td");
    const tdAuthor = document.createElement("td");

    tdTitle.innerHTML = `<a href="${url}" target="_blank">${title}</a>`;
    tdAuthor.innerText = author;

    tr.appendChild(tdTitle);
    tr.appendChild(tdAuthor);

    tbody.appendChild(tr);
  });

  return tbody;
};

const createHeader = () => {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const thTitle = document.createElement("th");
  const thAuthor = document.createElement("th");

  thTitle.innerText = "Title";
  thTitle.style.width = "70%";
  thAuthor.innerText = "Author";

  tr.appendChild(thTitle);
  tr.appendChild(thAuthor);

  thead.appendChild(tr);

  return thead;
};

const createTable = (name, items) => {
  const table = document.createElement("table");
  const caption = document.createElement("caption");
  const thead = createHeader();
  const tbody = createRows(items);

  caption.innerText = name;

  table.appendChild(caption);
  table.appendChild(thead);
  table.appendChild(tbody);

  root.appendChild(table);
};

Object.entries(links).forEach(([name, items]) => {
  createTable(name, items);
});
