(function () {
  "use strict";

  var PAD = 8;
  var GAP = 14;
  var LABELS = ["No", "Are you sure?", "Pretty please?", "Nope 🙈", "Try again!", "Not this one"];

  var card = document.getElementById("card");
  var yes = document.getElementById("yes");
  var no = document.getElementById("no");
  var placeholder = document.getElementById("noPlaceholder");
  var modal = document.getElementById("modal");
  var closeBtn = document.getElementById("close");
  var doneBtn = document.getElementById("done");

  /* ---------- floating hearts ---------- */
  function spawnHearts(container, count) {
    var NS = "http://www.w3.org/2000/svg";
    for (var i = 0; i < count; i++) {
      var size = 10 + Math.random() * 20;
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("class", "icon");
      var use = document.createElementNS(NS, "use");
      use.setAttribute("href", "#i-heart");
      svg.appendChild(use);
      svg.style.left = Math.random() * 100 + "%";
      svg.style.width = svg.style.height = size + "px";
      svg.style.setProperty("--d", 9 + Math.random() * 10 + "s");
      svg.style.setProperty("--delay", -Math.random() * 18 + "s");
      svg.style.setProperty("--o", 0.25 + Math.random() * 0.4);
      container.appendChild(svg);
    }
  }
  spawnHearts(document.getElementById("hearts"), 14);
  spawnHearts(document.getElementById("modalHearts"), 22);

  /* ---------- runaway "No" button ---------- */
  var pos = null;
  var tries = 0;
  var lastMove = 0;

  function render() {
    if (pos) {
      placeholder.hidden = false;
      no.style.position = "absolute";
      no.style.left = pos.x + "px";
      no.style.top = pos.y + "px";
    } else {
      placeholder.hidden = true;
      no.style.position = "";
      no.style.left = "";
      no.style.top = "";
    }
    no.textContent = LABELS[tries % LABELS.length];
  }

  function escape() {
    var now = Date.now();
    if (now - lastMove < 120) return;
    lastMove = now;

    var a = card.getBoundingClientRect();
    var y = yes.getBoundingClientRect();
    var n = no.getBoundingClientRect();
    var maxX = a.width - n.width - PAD;
    var maxY = a.height - n.height - PAD;
    var box = {
      l: y.left - a.left - GAP,
      t: y.top - a.top - GAP,
      r: y.right - a.left + GAP,
      b: y.bottom - a.top + GAP,
    };
    var cur = { x: n.left - a.left, y: n.top - a.top };
    var best = { x: PAD, y: PAD };
    var bestD = -1;

    for (var i = 0; i < 40; i++) {
      var x = PAD + Math.random() * Math.max(0, maxX - PAD);
      var yy = PAD + Math.random() * Math.max(0, maxY - PAD);
      var overlap = x < box.r && x + n.width > box.l && yy < box.b && yy + n.height > box.t;
      if (overlap) continue;
      var d = Math.hypot(x - cur.x, yy - cur.y);
      if (d > 80) { best = { x: x, y: yy }; bestD = d; break; }
      if (d > bestD) { best = { x: x, y: yy }; bestD = d; }
    }
    pos = best;
    tries++;
    render();
  }

  no.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") escape(); });
  no.addEventListener("pointerdown", function (e) { e.preventDefault(); escape(); });
  no.addEventListener("click", function (e) { e.preventDefault(); escape(); });
  no.addEventListener("focus", function () { if (tries > 0) escape(); });
  window.addEventListener("resize", function () { pos = null; render(); });

  /* ---------- forgive modal ---------- */
  function openModal() {
    modal.hidden = false;
    closeBtn.focus();
  }
  function closeModal() {
    modal.hidden = true;
    yes.focus();
  }
  yes.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  doneBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
})();
