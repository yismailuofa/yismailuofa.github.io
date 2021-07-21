var prev = -1;
var index = -2;

window.addEventListener('DOMContentLoaded', () => {
  const anchors = document.querySelectorAll("a")
  anchors.forEach(a => {
    a.addEventListener("animationend", () => {
      a.style.animationName = ""
    })
  })
  setInterval(() => {
    do {
      index = Math.floor(Math.random() * 4);
    } while (index === prev);
    prev = index;
    anchors[index].style.animationName = "pulse";
  }, 3000);
});


