/* トラップス 公式サイト */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- メニュー（スマホ・タブレット） ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('global-nav');

  if (menuToggle && nav) {
    const setMenu = (open, returnFocus = false) => {
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      document.documentElement.classList.toggle('is-menu-open', open);
      if (!open && returnFocus) menuToggle.focus();
    };

    menuToggle.addEventListener('click', () => {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false, true);
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
      if (event.matches) setMenu(false);
    });
  }

  /* ---------- 遊び方デモ ---------- */
  const demo = document.querySelector('[data-demo]');
  if (demo) initDemo(demo);

  function initDemo(root) {
    const board = root.querySelector('[data-board]');
    const token = root.querySelector('[data-token]');
    const pop = root.querySelector('[data-pop]');
    const chip = root.querySelector('[data-demo-chip]');
    const text = root.querySelector('[data-demo-text]');
    const toggleBtn = root.querySelector('[data-demo-toggle]');
    const replayBtn = root.querySelector('[data-demo-replay]');
    const stepItems = document.querySelectorAll('.step[data-step]');

    const COLS = 7;
    const ROWS = 5;
    const START = [3, 2];   // クマチのスタート位置（列, 行）
    const AFTER = [1, 1];   // 「天使のスズ」で進んだあとの位置
    const IMG_DIR = 'assets/img/';
    const CARDS = {
      p1: 'card-plus1.webp',
      p2: 'card-plus2.webp',
      p4: 'card-plus4.webp',
      m1: 'card-minus1.webp',
      m2: 'card-minus2.webp',
    };

    // 盤面のマスをつくる
    const cells = [];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COLS * ROWS; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.innerHTML = '<div class="tile"><div class="tile__face tile__back"></div><div class="tile__face tile__front"></div></div>';
      frag.appendChild(cell);
      cells.push(cell);
    }
    board.insertBefore(frag, token);

    // めくったときに画像が遅れないよう先に読み込む
    Object.values(CARDS).forEach((file) => {
      const img = new Image();
      img.src = IMG_DIR + file;
    });

    const cellAt = (c, r) => cells[r * COLS + c];
    const tileAt = (c, r) => cellAt(c, r).firstElementChild;
    const around = ([c, r]) => [[c, r - 1], [c + 1, r], [c, r + 1], [c - 1, r]];

    const place = (el, [c, r]) => {
      el.style.setProperty('--col', c);
      el.style.setProperty('--row', r);
    };

    const setCaption = (tone, label, message) => {
      chip.textContent = label;
      chip.dataset.tone = tone;
      text.textContent = message;
      const active = tone === 'move' ? '1' : tone === 'set' ? '2' : '';
      stepItems.forEach((item) => item.classList.toggle('is-active', item.dataset.step === active));
    };

    const mark = (list, className) => {
      list.forEach(([c, r]) => cellAt(c, r).classList.add(className));
    };

    const clearMarks = () => {
      cells.forEach((cell) => cell.classList.remove('is-option', 'is-mystery', 'is-lifted'));
    };

    const reveal = ([c, r], key) => {
      const tile = tileAt(c, r);
      tile.lastElementChild.innerHTML = `<img src="${IMG_DIR}${CARDS[key]}" alt="">`;
      tile.classList.add('is-up');
    };

    const zoom = ([c, r], on) => {
      cellAt(c, r).classList.toggle('is-lifted', on);
      tileAt(c, r).classList.toggle('is-zoom', on);
    };

    const popAt = (pos, label) => {
      place(pop, pos);
      pop.textContent = label;
      pop.classList.remove('is-show');
      void pop.offsetWidth; // アニメーションを最初から再生させる
      pop.classList.add('is-show');
    };

    const shiftTiles = (list, toCenter) => {
      const tilts = [-14, 10, -6, 16];
      list.forEach(([c, r], i) => {
        const tile = tileAt(c, r);
        tile.style.setProperty('--dx', toCenter ? AFTER[0] - c : 0);
        tile.style.setProperty('--dy', toCenter ? AFTER[1] - r : 0);
        tile.style.setProperty('--rot', `${toCenter ? tilts[i] : 0}deg`);
      });
    };

    const reset = () => {
      board.classList.add('is-instant');
      clearMarks();
      cells.forEach((cell) => {
        const tile = cell.firstElementChild;
        tile.classList.remove('is-up', 'is-zoom');
        tile.style.removeProperty('--dx');
        tile.style.removeProperty('--dy');
        tile.style.removeProperty('--rot');
        tile.lastElementChild.innerHTML = '';
      });
      pop.classList.remove('is-show');
      place(token, START);
      void board.offsetWidth; // 位置を一瞬で戻してからトランジションを有効に戻す
      board.classList.remove('is-instant');
    };

    // [次の場面までの待ち時間(ms), 場面の処理]
    const scenes = [
      [2400, () => {
        reset();
        setCaption('move', 'STEP 1', 'あなたのターン！ クマチを上下左右に1マス動かそう');
        mark(around(START), 'is-option');
      }],
      [1000, () => {
        clearMarks();
        place(token, [3, 1]);
        setCaption('move', 'STEP 1', '上に1マス動かして、トラップをめくると…');
      }],
      [1900, () => {
        reveal([3, 1], 'p2');
        zoom([3, 1], true);
        popAt([3, 0], '+2');
        setCaption('move', 'STEP 1', '「天使のスズ（+2）」だ！');
      }],
      [2400, () => {
        zoom([3, 1], false);
        place(token, AFTER);
        setCaption('move', 'STEP 1', 'クマチが相手の村のほうへ2マス進んだ！');
      }],
      [2800, () => {
        setCaption('set', 'STEP 2', 'まわりのトラップを表にして、おたがいに確認');
        const [up, right, down, left] = around(AFTER);
        reveal(up, 'm1');
        reveal(right, 'm2');
        reveal(down, 'p1');
        reveal(left, 'p4');
      }],
      [900, () => {
        setCaption('set', 'STEP 2', '相手に見えないように並び替えて…');
        around(AFTER).forEach(([c, r]) => tileAt(c, r).classList.remove('is-up'));
      }],
      [800, () => {
        mark(around(AFTER), 'is-lifted');
        shiftTiles(around(AFTER), true);
      }],
      [1300, () => {
        shiftTiles(around(AFTER), false);
        setCaption('set', 'STEP 2', '…裏向きに置きなおす！');
      }],
      [3600, () => {
        clearMarks();
        mark(around(AFTER), 'is-mystery');
        setCaption('rival', 'NEXT', '次は相手のターン。どこに何がある…？');
      }],
    ];

    let index = 0;
    let timer = 0;
    let playing = false;
    let userPaused = false;

    const runScene = () => {
      const [wait, scene] = scenes[index];
      scene();
      index = (index + 1) % scenes.length;
      timer = window.setTimeout(runScene, wait);
    };

    const play = () => {
      if (playing) return;
      playing = true;
      toggleBtn.textContent = '一時停止';
      runScene();
    };

    const pause = () => {
      playing = false;
      window.clearTimeout(timer);
      toggleBtn.textContent = '再生';
    };

    toggleBtn.addEventListener('click', () => {
      if (playing) {
        userPaused = true;
        pause();
      } else {
        userPaused = false;
        play();
      }
    });

    replayBtn.addEventListener('click', () => {
      pause();
      index = 0;
      userPaused = false;
      play();
    });

    // 画面に入ったら自動再生、外れたら停止（「視差効果を減らす」設定のときは自動再生しない）
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        const visible = entries[entries.length - 1].isIntersecting;
        if (visible && !userPaused && !reduceMotion.matches) play();
        else if (!visible) pause();
      }, { threshold: 0.35 }).observe(root);
    }

    // 初期表示
    reset();
    mark(around(START), 'is-option');
    setCaption('move', 'STEP 1', 'あなたのターン！ クマチを上下左右に1マス動かそう');
  }
})();
