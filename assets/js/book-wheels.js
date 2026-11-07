const wrap = (value, length) => ((value % length) + length) % length;

for (const wheel of document.querySelectorAll('.book-wheel')) {
  const books = [...wheel.children];
  if (!books.length) continue;

  const links = books.map(book => [...book.querySelectorAll('a')]);
  const titles = books.map(book => book.querySelector('strong'));
  const supportsFind = 'onbeforematch' in document.documentElement;
  if (supportsFind) {
    wheel.classList.add('supports-find');
    for (const [index, book] of books.entries()) {
      book.firstElementChild.dataset.title = titles[index].textContent.trim().replace(/\s+/g, ' ');
    }
  }
  const stage = document.createElement('div');
  stage.className = 'wheel-stage';
  stage.append(...books);
  wheel.replaceChildren(stage);
  wheel.classList.add('is-cylinder');

  const details = document.createElement('div');
  details.className = 'wheel-entries';
  wheel.after(details);

  let position = 0;
  let velocity = 0;
  let frame;
  let timer;
  let drag;
  let rowHeight;
  let selected;
  let detailsAnimation;
  let suppressClick = false;
  const step = Math.PI / 9;
  const keyMoves = { ArrowDown: 1, ArrowUp: -1, PageDown: 3, PageUp: -3 };

  function distanceTo(index) {
    return wrap(index - position + books.length / 2, books.length) - books.length / 2;
  }

  function currentIndex() {
    return wrap(Math.round(position), books.length);
  }

  function showDetails() {
    const book = books[currentIndex()];
    if (selected === book) return;

    const previousHeight = selected ? details.getBoundingClientRect().height : 0;
    detailsAnimation?.cancel();
    selected = book;

    const title = document.createElement('p');
    title.className = 'wheel-book-title';
    title.append(...[...book.querySelector('strong').childNodes].map(node => node.cloneNode(true)));
    const author = book.querySelector('.book-author').cloneNode(true);
    details.replaceChildren(title, author);

    const parts = [...book.children].slice(1);
    if (parts.length) {
      const series = document.createElement('div');
      series.className = 'wheel-series';
      series.append(...parts.map(part => part.cloneNode(true)));
      details.append(series);
    }

    if (previousHeight) {
      const height = details.getBoundingClientRect().height;
      details.style.overflow = 'clip';
      detailsAnimation = details.animate(
        [
          { height: `${previousHeight}px`, opacity: 0.4, filter: 'blur(3px)' },
          { height: `${height}px`, opacity: 1, filter: 'blur(0px)' },
        ],
        { duration: 500, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      );
      detailsAnimation.onfinish = () => {
        details.style.overflow = '';
      };
    }
  }

  function draw() {
    const radius = rowHeight / Math.sin(step);
    const current = currentIndex();

    for (const [index, book] of books.entries()) {
      const distance = distanceTo(index);
      const angle = distance * step;
      const visible = Math.abs(angle) < Math.PI / 2;

      book.style.visibility = supportsFind || visible ? 'visible' : 'hidden';
      book.style.pointerEvents = visible ? '' : 'none';
      book.style.transform = `translateZ(${-radius}px) rotateX(${-angle}rad) translateZ(${radius}px)`;
      book.style.opacity = visible ? Math.cos(angle) ** 2 : '0';
      book.classList.toggle('is-current', index === current);
      if (supportsFind) {
        if (index === current) titles[index].removeAttribute('hidden');
        else titles[index].setAttribute('hidden', 'until-found');
      }

      for (const link of links[index]) {
        link.tabIndex = index === current ? 0 : -1;
      }
    }
  }

  function stop() {
    cancelAnimationFrame(frame);
    clearTimeout(timer);
  }

  wheel.addEventListener('beforematch', event => {
    const index = books.indexOf(event.target.closest('.book'));
    if (index < 0) return;

    // Reveal synchronously so browser Find can highlight and scroll to the real title.
    stop();
    drag = null;
    velocity = 0;
    wheel.classList.remove('is-dragging');
    position = index;
    draw();
    showDetails();
  });

  function settle(momentum = 0, destination) {
    stop();

    const omega = Math.sqrt(120);
    const target = destination ?? Math.round(position + momentum / omega);
    const offset = position - target;
    const speed = momentum + omega * offset;
    const start = performance.now();

    function tick(now) {
      const time = (now - start) / 1000;
      const decay = Math.exp(-omega * time);
      const remaining = (offset + speed * time) * decay;

      position = target + remaining;
      velocity = (speed - omega * (offset + speed * time)) * decay;

      if (Math.abs(remaining) < 0.001 && Math.abs(velocity) < 0.01) {
        position = wrap(target, books.length);
        velocity = 0;
        draw();
        showDetails();
        return;
      }

      draw();
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
  }

  wheel.addEventListener('wheel', event => {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

    event.preventDefault();
    stop();

    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? wheel.clientHeight : 1;
    position += event.deltaY * unit / rowHeight;
    velocity = 0;
    draw();

    timer = setTimeout(() => settle(), 120);
  }, { passive: false });

  wheel.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;

    stop();
    velocity = 0;
    suppressClick = false;
    drag = { id: event.pointerId, y: event.clientY, start: event.clientY, time: event.timeStamp };
  });

  wheel.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;

    if (Math.abs(event.clientY - drag.start) > 4) {
      suppressClick = true;
      wheel.setPointerCapture(event.pointerId);
      wheel.classList.add('is-dragging');
    }

    const delta = (drag.y - event.clientY) / rowHeight;
    const elapsed = Math.max(1, event.timeStamp - drag.time) / 1000;
    velocity = Math.max(-40, Math.min(40, velocity * 0.6 + delta / elapsed * 0.4));
    position += delta;
    drag.y = event.clientY;
    drag.time = event.timeStamp;
    draw();
  });

  function release(event) {
    if (drag?.id !== event.pointerId) return;

    const momentum = event.type === 'pointerup' && event.timeStamp - drag.time < 100 ? velocity : 0;
    drag = null;
    wheel.classList.remove('is-dragging');
    settle(momentum);
  }

  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  wheel.addEventListener('lostpointercapture', release);

  wheel.addEventListener('click', event => {
    if (suppressClick) {
      event.preventDefault();
      suppressClick = false;
      return;
    }

    const index = books.indexOf(event.target.closest('.book'));
    if (index < 0) return;
    if (index === currentIndex() && event.target.closest('a')) return;

    event.preventDefault();
    settle(0, position + distanceTo(index));
  });

  wheel.addEventListener('keydown', event => {
    if (!(event.key in keyMoves) && event.key !== 'Home' && event.key !== 'End') return;

    event.preventDefault();
    stop();

    if (event.key === 'Home') position = 0;
    else if (event.key === 'End') position = books.length - 1;
    else position = wrap(Math.round(position) + keyMoves[event.key], books.length);

    draw();
    showDetails();
  });

  function resize() {
    rowHeight = books[0].offsetHeight;
    stage.style.perspective = `${rowHeight / Math.sin(step) * 6}px`;
    draw();
  }

  new ResizeObserver(resize).observe(wheel);
  resize();
  showDetails();
}
