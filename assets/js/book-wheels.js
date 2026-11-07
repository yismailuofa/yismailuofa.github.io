const wrap = (value, length) => ((value % length) + length) % length;

function createBookWheel(wheel) {
  const books = [...wheel.children];
  if (!books.length) return;

  const links = books.map(book => [...book.querySelectorAll('a')]);
  const titles = books.map(book => book.querySelector('strong'));
  const supportsFind = 'onbeforematch' in document.documentElement;
  const visibility = [];
  const step = Math.PI / 9;
  const keyMoves = { ArrowDown: 1, ArrowUp: -1 };

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
  let wheelTime = -Infinity;
  let wheelTarget = null;
  let frame;

  let rowHeight;
  let drawFrame;
  let drawnIndex;
  let selected;

  let drag;
  let pressTarget;
  let suppressClick = false;

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
    for (const animation of details.getAnimations()) animation.cancel();
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

    if (previousHeight && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const timing = { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' };
      details.animate(
        [{ height: `${previousHeight}px` }, { height: `${details.offsetHeight}px` }],
        timing,
      );
      for (const child of details.children) {
        child.animate(
          [{ filter: 'blur(3px)', opacity: 0.4 }, { filter: 'blur(0px)', opacity: 1 }],
          timing,
        );
      }
    }
  }

  function draw() {
    cancelAnimationFrame(drawFrame);
    drawFrame = null;
    const radius = rowHeight / Math.sin(step);
    const current = currentIndex();

    for (const [index, book] of books.entries()) {
      const distance = distanceTo(index);
      const angle = distance * step;
      const visible = Math.abs(angle) < Math.PI / 2;

      if (visibility[index] !== visible) {
        book.style.visibility = supportsFind || visible ? 'visible' : 'hidden';
        book.style.pointerEvents = visible ? '' : 'none';
        if (!visible) book.style.opacity = '0';
        visibility[index] = visible;
      }
      if (visible) {
        book.style.transform = `translateZ(${-radius}px) rotateX(${-angle}rad) translateZ(${radius}px)`;
        book.style.opacity = Math.cos(angle) ** 2;
      }

      if (drawnIndex !== current && (drawnIndex === undefined || index === drawnIndex || index === current)) {
        book.classList.toggle('is-current', index === current);
        if (supportsFind) {
          if (index === current) titles[index].removeAttribute('hidden');
          else titles[index].setAttribute('hidden', 'until-found');
        }
        for (const link of links[index]) link.tabIndex = index === current ? 0 : -1;
      }
    }
    drawnIndex = current;
  }

  function stop() {
    for (const child of details.children) {
      for (const animation of child.getAnimations()) animation.cancel();
    }
    cancelAnimationFrame(frame);
    cancelAnimationFrame(drawFrame);
    drawFrame = null;
    wheelTarget = null;
  }

  function select(target) {
    stop();
    position = wrap(target, books.length);
    draw();
    showDetails();
  }

  function animate(update) {
    const start = performance.now();
    let previous = start;

    function tick(now) {
      const finished = update((now - start) / 1000, (now - previous) / 1000, now);
      previous = now;
      if (finished) return;
      draw();
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
  }

  function settle(target = Math.round(position), momentum = 0) {
    stop();

    const offset = position - target;
    const frequency = 2 * Math.PI / 0.25;
    const coefficient = momentum + frequency * offset;

    animate(elapsed => {
      const decay = Math.exp(-frequency * elapsed);
      position = target + (offset + coefficient * elapsed) * decay;
      const velocity = (momentum - frequency * coefficient * elapsed) * decay;

      if (Math.abs(position - target) < 0.001 && Math.abs(velocity) < 0.01) {
        select(target);
        return true;
      }
    });
  }

  function coast(momentum) {
    stop();
    if (Math.abs(momentum) < 4) {
      settle(Math.round(position + momentum * 0.12), momentum);
      return;
    }

    const origin = position;
    // Apple's scroll projection: (velocity / 1000) * rate / (1 - rate).
    const rate = 0.99875;
    const decayTime = rate / (1000 * (1 - rate));
    const target = Math.round(origin + momentum * decayTime);
    const distance = target - origin;
    if (distance * momentum <= 0) {
      settle(target, momentum);
      return;
    }
    // Match the release velocity, then hand off to the snap near the selected row.
    const duration = 3 * distance / momentum;

    animate(elapsed => {
      const progress = Math.min(1, elapsed / duration);
      position = target - distance * (1 - progress) ** 3;
      const velocity = momentum * (1 - progress) ** 2;

      if (Math.abs(target - position) < 0.5) {
        draw();
        settle(target, velocity);
        return true;
      }
    });
  }

  function followWheel() {
    animate((_elapsed, delta, now) => {
      const response = 0.12;
      const remaining = (wheelTarget - position) * Math.exp(-delta / response);
      position = wheelTarget - remaining;
      const velocity = remaining / response;

      if (now - wheelTime >= 120 && Math.abs(wheelTarget - position) < 0.5) {
        draw();
        settle(Math.round(wheelTarget), velocity);
        return true;
      }
    });
  }

  function onWheel(event) {
    if (drag || event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

    event.preventDefault();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? wheel.clientHeight : 1;
    const delta = event.deltaY * unit / rowHeight * 1.5;
    wheelTime = performance.now();

    if (wheelTarget === null) {
      stop();
      wheelTarget = position;
      followWheel();
    }
    // Native wheel events already include momentum; accumulate distance, not another fling.
    if (Math.sign(delta) !== Math.sign(wheelTarget - position)) wheelTarget = position;
    wheelTarget += delta;
  }

  function onPointerDown(event) {
    if (!event.isPrimary || event.button !== 0) return;

    stop();
    suppressClick = false;
    pressTarget = event.target;
    drag = {
      id: event.pointerId,
      y: event.clientY,
      start: event.clientY,
      samples: [{ y: event.clientY, time: event.timeStamp }],
    };
    wheel.setPointerCapture(event.pointerId);
  }

  function moveDrag(event) {
    if (!suppressClick && Math.abs(event.clientY - drag.start) > 4) {
      suppressClick = true;
      wheel.classList.add('is-dragging');
    }

    const delta = (drag.y - event.clientY) / rowHeight;
    if (delta) {
      const direction = Math.sign(delta);
      if (drag.direction && direction !== drag.direction) drag.samples = drag.samples.slice(-1);
      drag.direction = direction;
    }
    position += delta;
    drag.y = event.clientY;
    drag.samples.push({ y: event.clientY, time: event.timeStamp });
    while (drag.samples.length > 2 && drag.samples[1].time <= event.timeStamp - 80) {
      drag.samples.shift();
    }
  }

  function onPointerMove(event) {
    if (drag?.id !== event.pointerId) return;
    for (const sample of event.getCoalescedEvents?.() || []) moveDrag(sample);
    moveDrag(event);
    if (drawFrame == null) drawFrame = requestAnimationFrame(draw);
  }

  function onPointerUp(event) {
    if (drag?.id !== event.pointerId) return;
    if (event.type === 'lostpointercapture' && event.target !== wheel) return;

    let momentum = 0;
    if (event.type === 'pointerup' && suppressClick) {
      const paused = event.timeStamp - drag.samples.at(-1).time >= 80;
      moveDrag(event);
      const first = drag.samples[0];
      const last = drag.samples.at(-1);
      const elapsed = last.time - first.time;
      if (!paused && elapsed > 0) momentum = (first.y - last.y) / rowHeight / (elapsed / 1000);
    }
    drag = null;
    wheel.classList.remove('is-dragging');
    draw();
    coast(momentum);
  }

  function onClick(event) {
    if (suppressClick) {
      event.preventDefault();
      suppressClick = false;
      return;
    }

    const target = event.target === wheel ? pressTarget : event.target;
    const index = books.indexOf(target?.closest('.book'));
    if (index < 0) return;
    const link = target.closest('a');
    if (index === currentIndex() && link) {
      if (event.target === wheel) link.click();
      return;
    }

    event.preventDefault();
    settle(position + distanceTo(index));
  }

  function onKeyDown(event) {
    if (!(event.key in keyMoves)) return;
    event.preventDefault();
    select(Math.round(position) + keyMoves[event.key]);
  }

  function onFind(event) {
    const index = books.indexOf(event.target.closest('.book'));
    if (index < 0) return;

    // Reveal synchronously so browser Find can highlight and scroll to the real title.
    drag = null;
    wheel.classList.remove('is-dragging');
    select(index);
  }

  function resize([entry]) {
    const height = entry.borderBoxSize[0].blockSize;
    if (height === rowHeight) return;
    rowHeight = height;
    stage.style.perspective = `${rowHeight / Math.sin(step) * 6}px`;
    draw();
  }

  wheel.addEventListener('wheel', onWheel, { passive: false });
  wheel.addEventListener('pointerdown', onPointerDown);
  wheel.addEventListener('lostpointercapture', onPointerUp);
  wheel.addEventListener('click', onClick);
  wheel.addEventListener('keydown', onKeyDown);
  wheel.addEventListener('beforematch', onFind);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  new ResizeObserver(resize).observe(books[0], { box: 'border-box' });
  showDetails();
}

for (const wheel of document.querySelectorAll('.book-wheel')) createBookWheel(wheel);
