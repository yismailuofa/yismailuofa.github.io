let prev = -1;
let index = -2;
setInterval(() => {
  do {
    index = Math.floor(Math.random() * 4);
  } while (index === prev);
  prev = index;
  const curr = document.querySelectorAll("a")[index]
  curr.style.animationName = "pulse"
  curr.addEventListener("animationend",() => {
    curr.style.animationName = ""
  })
}, 3000);
