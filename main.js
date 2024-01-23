const toRead = [
  [
    "Introduction to Information Retrieval",
    "https://nlp.stanford.edu/IR-book/pdf/irbookonlinereading.pdf",
  ],
  [
    "Designing Data-Intensive Applications",
    "https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321",
  ],
  [
    "Linkedin dev articles (todo break this up)",
    "https://www.linkedin.com/posts/ryanlpeterman_19-vetted-company-engineering-blog-posts-activity-7138557807481475072-FX9U",
  ],
  [
    "Database Internals",
    "https://www.oreilly.com/library/view/database-internals/9781492040330/",
  ],
  [
    "Machine Learning Engineering Open Book",
    "https://github.com/stas00/ml-engineering",
  ],
];

const toWatch = [
  ["CMU Database Group", "https://www.youtube.com/@CMUDatabaseGroup/videos"],
  [
    "MIT 6.824 Distributed Systems (Spring 2020)",
    "https://www.youtube.com/playlist?list=PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB",
  ],
  [
    "Fullstack React GraphQL TypeScript Tutorial",
    "https://www.youtube.com/watch?v=I6ypD7qv3Z8",
  ],
  [
    "Lessons from building GitHub code search by Luke Francl (Strange Loop 2023)",
    "https://www.youtube.com/watch?v=CqZA_KmygKw",
  ],
  [
    "Building Secure and Reliable Systems",
    "https://google.github.io/building-secure-and-reliable-systems/raw/toc.html",
  ],
  ["Practical Deep Learning", "https://course.fast.ai/"],
];

const readSlot = document.getElementById("to-read");
const watchSlot = document.getElementById("to-watch");

const createLink = (title, url) => {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.innerText = title;
  return link;
};

const createList = (list) => {
  const ul = document.createElement("ul");
  list.forEach(([title, url]) => {
    const li = document.createElement("li");
    li.appendChild(createLink(title, url));
    ul.appendChild(li);
  });
  return ul;
};

readSlot.appendChild(createList(toRead));
watchSlot.appendChild(createList(toWatch));
