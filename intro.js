(() => {
  const families = [
    { end: 'ak', starts: ['z', 'p', 'd', 't', 'b', 'sl'] },
    { end: 'oot', starts: ['b', 'n', 'p', 'gr', 'sch'] },
    { end: 'iet', starts: ['p', 'n', 'z', 'r', 'sch'] },
    { end: 'oek', starts: ['b', 'k', 'd', 'h', 'br'] },
    { end: 'oen', starts: ['sch', 'z', 'gr', 'd', 't'] },
    { end: 'af', starts: ['st', 'm', 'l', 'gr'] }
  ];
  const get = id => document.getElementById(id);
  const dialog = get('intro-dialog');
  let familyIndex = 0, wordIndex = 0;
  const viewed = families.map(() => new Set([0]));
  function render(changeFamily = false) {
    const family = families[familyIndex];
    get('rhyme-start').textContent = family.starts[wordIndex];
    // The ending's DOM node is left untouched when turning the beginning.
    if (changeFamily) get('rhyme-end').textContent = family.end;
    get('rhyme-word').textContent = family.starts[wordIndex] + family.end;
    get('rhyme-position').textContent = `Woord ${wordIndex + 1} van ${family.starts.length}`;
    get('rhyme-prev').disabled = wordIndex === 0;
    get('rhyme-next').textContent = wordIndex === family.starts.length - 1 ? 'Opnieuw beginnen' : 'Verander het begin';
    [...get('rhyme-families').children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === familyIndex)));
    get('rhyme-examples').replaceChildren();
    [...viewed[familyIndex]].sort((a, b) => a - b).forEach(i => {
      const word = document.createElement('span');
      word.append(document.createTextNode(family.starts[i]));
      const ending = document.createElement('strong');
      ending.textContent = family.end;
      word.append(ending);
      get('rhyme-examples').append(word);
    });
  }
  families.forEach((family, i) => {
    const button = document.createElement('button');
    button.textContent = `-${family.end}`;
    button.setAttribute('aria-label', `Rijmen op ${family.starts[0]}${family.end}`);
    button.onclick = () => { familyIndex = i; wordIndex = 0; render(true); };
    get('rhyme-families').append(button);
  });
  function turn(direction) {
    const family = families[familyIndex];
    wordIndex = direction > 0 ? (wordIndex + 1) % family.starts.length : Math.max(0, wordIndex - 1);
    viewed[familyIndex].add(wordIndex);
    render();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      get('rhyme-start').animate?.([{ transform: 'rotateX(-75deg)', opacity: .2 }, { transform: 'rotateX(0)', opacity: 1 }], { duration: 300 });
    }
  }
  get('intro').onclick = () => { if (busy) return; render(true); dialog.showModal(); };
  get('intro-back').onclick = () => dialog.close();
  dialog.addEventListener('close', () => get('intro').focus());
  get('rhyme-prev').onclick = () => turn(-1);
  get('rhyme-next').onclick = () => turn(1);
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      turn(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  render(true);
})();
