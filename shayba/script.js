/* ============================================================
   Birthday — Miss Shayba
   Scene controller, candles, confetti
============================================================ */

(function(){
  "use strict";

  // ---------- helpers ----------
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function toast(msg){
    let el = $(".toast");
    if(!el){
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(()=> el.classList.remove("show"), 2400);
  }

  function showScene(id){
    $$(".scene").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add("active");
      window.scrollTo({top:0, behavior:"smooth"});
    }
  }

  // ============================================================
  // SCENE 1 — gift box opening
  // ============================================================
  const gift = $("#giftbox");
  function openGift(){
    if (gift.classList.contains("opening")) return;
    gift.classList.add("opening");
    burstConfetti(40, 1600);
    setTimeout(()=>{
      showScene("scene-3");
      burstConfetti(60, 2400);
    }, 1100);
  }
  gift.addEventListener("click", openGift);
  gift.addEventListener("keydown", (e)=>{
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGift(); }
  });

  // ============================================================
  // SCENE 2 — Candles
  // ============================================================
  const candles = $$(".candle");
  let candlesOut = 0;

  candles.forEach(c => {
    const blow = (e)=>{
      if (e) e.preventDefault();
      if (c.classList.contains("out")) return;
      c.classList.add("out");
      candlesOut++;
      // tiny puff confetti at candle position
      const rect = c.getBoundingClientRect();
      burstConfettiAt(rect.left + rect.width/2, rect.top + rect.height/2, 12);
      if (candlesOut === candles.length){
        $("#celSub").textContent = "Now make a wish 🌟";
        setTimeout(revealFinalMessage, 700);
      }
    };
    c.addEventListener("click", blow);
    c.addEventListener("keydown", (e)=>{
      if (e.key === "Enter" || e.key === " ") blow(e);
    });
  });

  function revealFinalMessage(){
    $("#finalMessage").classList.add("show");
    burstConfetti(140, 4000);
    // reveal the dua a beat after the message — feels more intentional
    setTimeout(()=>{
      const dua = $("#duaCard");
      if (dua) dua.classList.add("show");
      // gently scroll the dua into view on mobile after it appears
      setTimeout(()=>{
        if (window.innerWidth <= 720 && dua){
          dua.scrollIntoView({behavior:"smooth", block:"start"});
        }
      }, 700);
    }, 900);
  }

  // replay
  const replayBtn = $("#replayBtn");
  if (replayBtn) replayBtn.addEventListener("click", ()=>{
    candles.forEach(c => c.classList.remove("out"));
    candlesOut = 0;
    const sub = $("#celSub");
    if (sub) sub.textContent = "Tap each candle to blow it out…";
    const fm = $("#finalMessage");
    if (fm) fm.classList.remove("show");
    const dua = $("#duaCard");
    if (dua) dua.classList.remove("show");
    window.scrollTo({top:0, behavior:"smooth"});
  });

  // share
  const shareBtn = $("#shareBtn");
  if (shareBtn) shareBtn.addEventListener("click", async ()=>{
    const url = window.location.href;
    try {
      if (navigator.share){
        await navigator.share({
          title: "A surprise for Miss Shayba 💖",
          text: "Open this — it's just for you.",
          url
        });
      } else if (navigator.clipboard){
        await navigator.clipboard.writeText(url);
        toast("Link copied! Send it to her 💌");
      } else {
        prompt("Copy this link:", url);
      }
    } catch(_){ /* user dismissed */ }
  });

  // ============================================================
  // CONFETTI
  // ============================================================
  const COLORS = ["#ff8fc0", "#ffd86b", "#c8a2ff", "#9be7ff", "#b6f0a8", "#ff5da2", "#ffffff"];
  const layer = $("#confettiLayer");

  function makePiece(x, y, dx, life){
    const p = document.createElement("span");
    p.className = "confetti-piece";
    p.style.left = x + "px";
    p.style.top  = y + "px";
    p.style.background = COLORS[(Math.random()*COLORS.length)|0];
    p.style.setProperty("--dx", (dx) + "px");
    p.style.animationDuration = life + "ms";
    p.style.animationTimingFunction = "cubic-bezier(.2,.7,.2,1)";
    p.style.transform = `rotate(${(Math.random()*360)|0}deg)`;
    p.style.width  = (6 + Math.random()*8) + "px";
    p.style.height = (8 + Math.random()*10) + "px";
    p.style.borderRadius = (Math.random() < 0.3) ? "50%" : "2px";
    layer.appendChild(p);
    setTimeout(()=> p.remove(), life + 200);
  }

  function burstConfetti(count, life){
    const w = window.innerWidth;
    for (let i = 0; i < count; i++){
      const x = Math.random() * w;
      const dx = (Math.random() - 0.5) * 200;
      const lf = life + (Math.random()*1200 - 400);
      setTimeout(()=> makePiece(x, -20, dx, lf), Math.random()*400);
    }
  }

  function burstConfettiAt(x, y, count){
    for (let i = 0; i < count; i++){
      const dx = (Math.random() - 0.5) * 220;
      const lf = 1400 + Math.random()*600;
      makePiece(x, y, dx, lf);
    }
  }

  // ============================================================
  // Subtle entrance polish
  // ============================================================
  document.documentElement.style.scrollBehavior = "smooth";

})();
