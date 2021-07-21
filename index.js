let prev = -1;
let index = -2;
setInterval(() => {
  do {
    index = Math.floor(Math.random() * 4);
  } while (index === prev);
  prev = index;
  const links = document.querySelectorAll("a");
  const curr = links[index];
  curr.style.animationPlayState = "running";
  setTimeout(() => {
    curr.style.animationPlayState = "paused";
  }, 3000);
}, 3000);
