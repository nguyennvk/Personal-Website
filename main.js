/* ============================================================
   main.js — one job: the project filter.
   No dependencies, no build step. Edit and refresh.
   ============================================================ */

/* footer year */
document.getElementById('yr').textContent = new Date().getFullYear();


/* ============================================================
   PROJECT FILTER
   Each .card carries data-tags="data quant". Clicking a filter
   hides every card whose tags don't include it.
   ============================================================ */
(function () {
  var buttons = document.querySelectorAll('.filter');
  var cards   = document.querySelectorAll('.card');

  function apply(want) {
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.filter === want));
    });
    cards.forEach(function (card) {
      var tags = (card.dataset.tags || '').split(' ');
      var show = want === 'all' || tags.indexOf(want) !== -1;
      card.classList.toggle('hide', !show);
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      apply(btn.dataset.filter);
    });
  });

  /* Jumping from the hero index to a card that a filter is
     currently hiding would land nowhere — so reset to All first. */
  document.querySelectorAll('.index a').forEach(function (link) {
    link.addEventListener('click', function () {
      apply('all');
    });
  });
})();
