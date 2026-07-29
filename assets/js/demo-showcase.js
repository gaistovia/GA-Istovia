/* ============================================================
   demo-showcase.js
   Renders the infinite right-to-left "Check Our Demos" carousel.
   To add a new demo later: add ONE object to the DEMOS array below.
   Nothing else needs to change — layout, looping, spacing and the
   entrance/exit edge treatment all adapt automatically.
   ============================================================ */
(function(){

  var DEMOS = [
    {
      name: "Olea — Restaurant Demo",
      industry: "Restaurant / Food & Dining",
      tag: "Restaurant",
      icon: "utensils",
      description: "Mfano wa website ya kifahari ya mkahawa — menu ya kidijitali, mazingira ya kuvutia, na uzoefu wa hali ya juu kwa wageni.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=75",
      liveUrl: "https://gaistovia.github.io/olea/"
    }
    // Add the next demo here, e.g.:
    // {
    //   name: "Business Name — Category Demo",
    //   industry: "Industry label",
    //   tag: "Short Tag",
    //   icon: "font-awesome-icon-name (without fa- prefix)",
    //   description: "Maelezo mafupi ya demo hii.",
    //   image: "assets/images/demo-xxx-cover.png",
    //   liveUrl: "https://gaistovia.github.io/xxx/"
    // }
  ];

  var track = document.getElementById("demo-track");
  var showcase = document.getElementById("demo-showcase");
  if(!track || !showcase) return;

  function cardHTML(d){
    return (
      '<article class="demo-card" role="listitem">' +
        '<div class="dc-shine" aria-hidden="true"></div>' +
        '<div class="dc-media">' +
          '<span class="dc-tag"><i class="fas fa-' + (d.icon || 'star') + '" aria-hidden="true"></i> ' + d.tag + '</span>' +
          '<img src="' + d.image + '" alt="' + d.name + '" loading="lazy" width="' + (d.imgW||700) + '" height="' + (d.imgH||394) + '">' +
        '</div>' +
        '<div class="dc-body">' +
          '<span class="dc-industry">' + d.industry + '</span>' +
          '<h3 class="dc-title">' + d.name + '</h3>' +
          '<p class="dc-desc">' + d.description + '</p>' +
          '<div class="dc-actions">' +
            '<a class="btn btn-sales btn-sm" href="' + d.liveUrl + '" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i> View Demo</a>' +
            '<button type="button" class="btn-soon" disabled title="Maelezo kamili yanakuja hivi karibuni"><i class="fas fa-lock" aria-hidden="true"></i> Details Soon</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  // Repeat the demo set enough times to fill the track comfortably and
  // loop seamlessly (translateX(-50%) requires exactly two equal halves).
  var MIN_CARDS_PER_HALF = 5;
  var repeats = Math.max(1, Math.ceil(MIN_CARDS_PER_HALF / DEMOS.length));
  var half = [];
  for(var r = 0; r < repeats; r++){ half = half.concat(DEMOS); }

  var html = half.map(cardHTML).join("") + half.map(cardHTML).join("");
  track.innerHTML = html;

  // Cinematic, unhurried pace: slower with more cards so speed feels constant.
  var totalCards = half.length * 2;
  var duration = Math.max(28, totalCards * 6.5);
  track.style.animationDuration = duration + "s";

  // Pause the whole marquee while any card is hovered so it can be read.
  showcase.addEventListener("mouseenter", function(){ showcase.classList.add("paused"); });
  showcase.addEventListener("mouseleave", function(){ showcase.classList.remove("paused"); });
  showcase.addEventListener("focusin", function(){ showcase.classList.add("paused"); });
  showcase.addEventListener("focusout", function(){ showcase.classList.remove("paused"); });

  // Cursor-follow light per card (cheap: only active while pointer is over it).
  var isTouch = window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if(!isTouch){
    track.addEventListener("mousemove", function(e){
      var card = e.target.closest && e.target.closest(".demo-card");
      if(!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
    });
  }

  // Soft glowing particles drifting behind the showcase.
  var bgHost = showcase.querySelector(".demo-showcase-bg");
  if(bgHost && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)){
    for(var i=0;i<10;i++){
      var p = document.createElement("span");
      var s = Math.random()*4+2;
      p.className = "dust";
      p.style.cssText = "left:" + (Math.random()*100) + "%;top:" + (Math.random()*100) + "%;width:" + s + "px;height:" + s + "px;animation-duration:" + (Math.random()*10+10) + "s;animation-delay:" + (Math.random()*5) + "s;";
      bgHost.appendChild(p);
    }
  }

})();
