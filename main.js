/* ============================================================
   GA ISTOVIA — main.js v2.0 (vanilla, zero dependencies)
   ============================================================ */
(function(){

  var SALES_NUMBER = "255625794188";
  var SUPPORT_NUMBER = "255797701372";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------- loader with percentage ---------- */
  (function(){
    var pct = document.getElementById("loader-pct");
    if(!pct){ return; }
    var n = 0;
    var iv = setInterval(function(){
      n += Math.random() * 18;
      if(n >= 100){ n = 100; clearInterval(iv); }
      pct.textContent = Math.floor(n) + "%";
    }, 140);
  })();
  window.addEventListener("load", function(){
    setTimeout(function(){
      var l = document.getElementById("loader");
      if(l){ l.classList.add("hide"); setTimeout(function(){ l.style.display = "none"; }, 700); }
    }, 1600);
  });

  /* ---------- scroll progress ---------- */
  (function(){
    var bar = document.getElementById("progress-bar");
    if(!bar) return;
    window.addEventListener("scroll", function(){
      var st = document.documentElement.scrollTop;
      var sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (sh > 0 ? (st / sh * 100) : 0) + "%";
    }, {passive:true});
  })();

  /* ---------- nav scroll state ---------- */
  (function(){
    var nav = document.getElementById("site-nav");
    if(!nav) return;
    window.addEventListener("scroll", function(){
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }, {passive:true});
  })();

  /* ---------- mobile nav ---------- */
  (function(){
    var burger = document.getElementById("nav-burger");
    var mnav = document.getElementById("mobile-nav");
    if(!burger || !mnav) return;
    function toggle(){
      burger.classList.toggle("open");
      mnav.classList.toggle("open");
      document.body.classList.toggle("no-scroll", mnav.classList.contains("open"));
    }
    burger.addEventListener("click", toggle);
    mnav.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){
        burger.classList.remove("open");
        mnav.classList.remove("open");
        document.body.classList.remove("no-scroll");
      });
    });
  })();

  /* ---------- custom cursor ---------- */
  (function(){
    if(isTouch) return;
    var dot = document.getElementById("cursor-dot");
    var ring = document.getElementById("cursor-ring");
    if(!dot || !ring) return;
    var mx=0,my=0,rx=0,ry=0;
    document.addEventListener("mousemove", function(e){
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
    }, {passive:true});
    function loop(){
      rx += (mx-rx)*.16; ry += (my-ry)*.16;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll("a,button,.tilt,.svc-card,.demo-card,.pkg-card,.test-card").forEach(function(el){
      el.addEventListener("mouseenter", function(){
        document.body.classList.add("cursor-hover");
        if(el.classList.contains("btn-support") || el.classList.contains("nav-support") || el.closest(".support")){
          document.body.classList.add("cursor-support");
        }
      });
      el.addEventListener("mouseleave", function(){
        document.body.classList.remove("cursor-hover");
        document.body.classList.remove("cursor-support");
      });
    });
  })();

  /* ---------- reveal on scroll ---------- */
  (function(){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add("on"); }
      });
    }, {threshold:.12, rootMargin:"0px 0px -60px 0px"});
    document.querySelectorAll(".reveal,.reveal-l,.reveal-r,.stagger,.kinetic").forEach(function(el){ io.observe(el); });
  })();

  /* ---------- kinetic headline: split text into animated word spans ---------- */
  (function(){
    document.querySelectorAll(".kinetic").forEach(function(el){
      var text = el.textContent;
      el.textContent = "";
      text.split(" ").forEach(function(word, i){
        var span = document.createElement("span");
        span.className = "kinetic-word";
        span.style.transitionDelay = (i * 0.05) + "s";
        span.textContent = word + "\u00A0";
        el.appendChild(span);
      });
    });
  })();

  /* ---------- hero typewriter ---------- */
  (function(){
    var el = document.getElementById("hero-type");
    if(!el) return;
    var words = ["Digital Experiences","Luxury Websites","Ecommerce Systems","Brand Identities","Growth Engines"];
    var wi = 0, ci = 0, deleting = false;
    function tick(){
      var w = words[wi];
      if(!deleting){
        el.textContent = w.substring(0, ci+1); ci++;
        if(ci === w.length){ deleting = true; setTimeout(tick, 1900); return; }
      } else {
        el.textContent = w.substring(0, ci-1); ci--;
        if(ci === 0){ deleting = false; wi = (wi+1) % words.length; }
      }
      setTimeout(tick, deleting ? 45 : 85);
    }
    setTimeout(tick, 1300);
  })();

  /* ---------- signature: animated WhatsApp conversation ---------- */
  (function(){
    var body = document.getElementById("phone-body");
    if(!body) return;
    var script = [
      {side:"in", text:"Habari! Karibu GA Istovia \u2014 unahitaji Sales au Support leo?"},
      {side:"out", text:"Sales \u2014 nataka website ya duka langu la nguo."},
      {side:"in", text:"Poa sana! Business Package \u2014 TZS 250,000, delivery siku 7\u201310."},
      {side:"out", text:"Na baada ya kukamilika, msaada wa kiufundi je?"},
      {side:"in", text:"Hapo unaongea na Support line yetu \u2014 namba tofauti, timu ya kiufundi moja kwa moja."},
      {side:"out", text:"Naomba tuanze leo \ud83d\ude4c"}
    ];
    var io = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(en){
        if(en.isIntersecting){ playScript(); obs.disconnect(); }
      });
    }, {threshold:.4});
    io.observe(body);

    function playScript(){
      var i = 0;
      function next(){
        if(i >= script.length) { setTimeout(function(){ body.innerHTML = ""; i = 0; setTimeout(next, 1000); }, 3400); return; }
        var m = script[i];
        var b = document.createElement("div");
        b.className = "bubble " + m.side;
        b.textContent = m.text;
        body.appendChild(b);
        body.scrollTop = body.scrollHeight;
        i++;
        setTimeout(next, 1450);
      }
      next();
    }
  })();

  /* ---------- hero parallax (mouse-driven layered depth) ---------- */
  (function(){
    var hero = document.getElementById("hero");
    var stack = document.querySelector(".hero-parallax");
    var phone = document.querySelector(".phone-shell");
    if(!hero || !stack || isTouch || reduceMotion) return;
    hero.addEventListener("mousemove", function(e){
      var r = hero.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - .5;
      var py = (e.clientY - r.top) / r.height - .5;
      stack.style.transform = "translate(" + (px*14) + "px," + (py*14) + "px)";
      if(phone){
        phone.style.transform = "rotateY(" + (px*10) + "deg) rotateX(" + (py*-10) + "deg)";
      }
      document.querySelectorAll(".float-chip").forEach(function(chip, i){
        var depth = (i+1) * 6;
        chip.style.transform = (chip.style.transform || "") ;
        chip.style.setProperty("--px", (px*depth) + "px");
      });
    });
    hero.addEventListener("mouseleave", function(){
      stack.style.transform = "translate(0,0)";
      if(phone) phone.style.transform = "rotateY(0) rotateX(0)";
    });
  })();

  /* ---------- scroll parallax for aurora blobs ---------- */
  (function(){
    if(reduceMotion) return;
    var auroras = document.querySelectorAll(".aurora");
    if(!auroras.length) return;
    var ticking = false;
    window.addEventListener("scroll", function(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        var y = window.scrollY;
        auroras.forEach(function(el, i){
          var speed = 0.04 + i*0.02;
          el.style.marginTop = (y * speed) + "px";
        });
        ticking = false;
      });
    }, {passive:true});
  })();

  /* ---------- 3D tilt for cards ---------- */
  (function(){
    if(isTouch || reduceMotion) return;
    document.querySelectorAll(".tilt").forEach(function(card){
      card.addEventListener("mousemove", function(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (py - .5) * -8;
        var ry = (px - .5) * 10;
        card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-6px)";
        card.style.setProperty("--mx", (px*100) + "%");
        card.style.setProperty("--my", (py*100) + "%");
      });
      card.addEventListener("mouseleave", function(){
        card.style.transform = "";
      });
    });
  })();

  /* ---------- image reveal wipe on scroll ---------- */
  (function(){
    var screens = document.querySelectorAll(".demo-screen");
    if(!screens.length) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en, idx){
        if(en.isIntersecting){
          setTimeout(function(){ en.target.classList.add("revealed"); }, idx * 120);
        }
      });
    }, {threshold:.35});
    screens.forEach(function(el){ io.observe(el); });
  })();

  /* ---------- animated counters ---------- */
  (function(){
    var done = [];
    function animate(el){
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var start = performance.now(), dur = 1700;
      function step(now){
        var p = Math.min((now-start)/dur, 1);
        var eased = 1 - Math.pow(1-p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if(p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting && done.indexOf(en.target) === -1){
          done.push(en.target);
          animate(en.target);
        }
      });
    }, {threshold:.6});
    document.querySelectorAll("[data-count]").forEach(function(el){ io.observe(el); });
  })();

  /* ---------- back to top ---------- */
  (function(){
    var btn = document.getElementById("back-top");
    if(!btn) return;
    window.addEventListener("scroll", function(){
      btn.classList.toggle("show", window.scrollY > 500);
    }, {passive:true});
    btn.addEventListener("click", function(e){
      e.preventDefault();
      window.scrollTo({top:0, behavior:"smooth"});
    });
  })();

  /* ---------- dual contact dock intro bubble ---------- */
  (function(){
    var bubble = document.getElementById("dock-bubble");
    var fbtn = document.getElementById("dock-sales-btn");
    if(!bubble) return;
    setTimeout(function(){ bubble.classList.add("show"); }, 3200);
    setTimeout(function(){ bubble.classList.remove("show"); }, 8500);
    if(fbtn){
      fbtn.addEventListener("mouseenter", function(){ bubble.classList.add("show"); });
      fbtn.addEventListener("mouseleave", function(){ bubble.classList.remove("show"); });
    }
  })();

  /* ---------- FAQ accordion ---------- */
  (function(){
    document.querySelectorAll(".faq-item").forEach(function(item){
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      q.addEventListener("click", function(){
        var isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach(function(other){
          if(other !== item){
            other.classList.remove("open");
            other.querySelector(".faq-a").style.maxHeight = null;
            other.querySelector(".faq-q").setAttribute("aria-expanded","false");
          }
        });
        if(isOpen){
          item.classList.remove("open");
          a.style.maxHeight = null;
          q.setAttribute("aria-expanded","false");
        } else {
          item.classList.add("open");
          a.style.maxHeight = a.scrollHeight + "px";
          q.setAttribute("aria-expanded","true");
        }
      });
    });
  })();

  /* ---------- magnetic buttons ---------- */
  (function(){
    if(isTouch || reduceMotion) return;
    document.querySelectorAll(".magnetic").forEach(function(btn){
      btn.addEventListener("mousemove", function(e){
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width/2;
        var y = e.clientY - r.top - r.height/2;
        btn.style.transform = "translate(" + (x*.14) + "px," + (y*.2-3) + "px)";
      });
      btn.addEventListener("mouseleave", function(){ btn.style.transform = ""; });
    });
  })();

  /* ---------- contact form -> routes to Sales or Support WhatsApp ---------- */
  (function(){
    var form = document.getElementById("contact-form");
    if(!form) return;
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var name = document.getElementById("c-name").value.trim();
      var email = document.getElementById("c-email").value.trim();
      var service = document.getElementById("c-service").value;
      var msg = document.getElementById("c-msg").value.trim();
      var team = (form.querySelector('input[name="team"]:checked') || {}).value || "sales";
      if(!name || !msg){ showToast("Tafadhali jaza jina na ujumbe.", true); return; }
      var number = team === "support" ? SUPPORT_NUMBER : SALES_NUMBER;
      var text = "Habari GA Istovia!%0A%0AJina: " + encodeURIComponent(name) +
        "%0AEmail: " + encodeURIComponent(email) +
        "%0AHuduma: " + encodeURIComponent(service) +
        "%0AUjumbe: " + encodeURIComponent(msg);
      window.open("https://wa.me/" + number + "?text=" + text, "_blank");
      showToast("Inafungua WhatsApp \u2014 " + (team === "support" ? "Support" : "Sales") + "\u2026 asante!", false);
      form.reset();
    });
  })();

  function showToast(text, isError){
    var t = document.getElementById("toast");
    if(!t) return;
    t.innerHTML = '<i class="fas ' + (isError ? "fa-triangle-exclamation" : "fa-circle-check") + '"></i> ' + text;
    t.classList.add("show");
    setTimeout(function(){ t.classList.remove("show"); }, 3400);
  }

  /* ---------- floating decorative particles in hero ---------- */
  (function(){
    var host = document.getElementById("hero-particles");
    if(!host || reduceMotion) return;
    for(var i=0;i<16;i++){
      var p = document.createElement("span");
      var s = Math.random()*3+1.5;
      p.style.cssText = "position:absolute;left:" + (Math.random()*100) + "%;top:" + (Math.random()*100) + "%;width:" + s + "px;height:" + s + "px;border-radius:50%;background:rgba(75,227,165,.55);animation:auroraDrift " + (Math.random()*9+9) + "s ease-in-out infinite;animation-delay:" + (Math.random()*4) + "s;pointer-events:none;";
      host.appendChild(p);
    }
  })();

})();
