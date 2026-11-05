/* 아트앤데이터 온톨로지 — 다이어그램 메뉴
   각 페이지 헤더에서 AAD_NAV.render('#nav-mount', '현재페이지키') 형태로 호출.
   페이지 키: main | activity | webzine | actor | person-research | person-theatre | person-yoga
*/
(function (global) {
  var W = 920, H = 380;

  var NODES = [
    { key: "main",            x: 318, y: 158, w: 170, h: 78, href: "index.html",
      label: "아트앤데이터", prop: "aad:ArtAndData", dark: true },
    { key: "activity",        x: 16,  y: 30,  w: 150, h: 62, href: "activity.html",
      label: "활동", prop: "aad:did" },
    { key: "webzine",         x: 16,  y: 258, w: 150, h: 76, href: "webzine.html",
      label: "데이터를 서술하기", prop: "aad:describes" },
    { key: "haruki",          x: 218, y: 286, w: 158, h: 64, href: "webzine.html?post=04",
      label: "하루키 네트워크", prop: "aad:explores", accentBorder: true },
    { key: "actor",           x: 414, y: 286, w: 158, h: 64, href: "actor.html",
      label: "배우 아카이브", sub: "설경구부터", accentBorder: true },
    { key: "person",          x: 628, y: 158, w: 150, h: 78, href: "person.html",
      label: "정주영", prop: "aad:Person", accentBorder: true },
    { key: "person-research", x: 814, y: 28,  w: 106, h: 58, href: "person.html#research",
      label: "연구", prop: "aad:studied" },
    { key: "person-theatre",  x: 814, y: 146, w: 106, h: 58, href: "person.html#theatre",
      label: "극장", prop: "aad:made" },
    { key: "person-yoga",     x: 814, y: 264, w: 106, h: 58, href: "person.html#yoga",
      label: "요가", prop: "aad:loves" }
  ];

  var EDGES = [
    { from: [318, 205], to: [166, 58],  prop: "aad:did",       pos: [210, 122] },
    { from: [318, 262], to: [166, 285], prop: "aad:describes", pos: [210, 280] },
    { from: [332, 228], to: [296, 286], prop: "aad:explores",  pos: [315, 258], small: true, noLabel: true },
    { from: [404, 228], to: [472, 286], prop: "aad:archives",  pos: [412, 258], small: true },
    { from: [668, 236], to: [562, 286], prop: "aad:curates",   pos: [622, 268], small: true },
    { from: [488, 197], to: [628, 197], prop: "aad:foundedBy", pos: [500, 180], accent: true },
    { from: [703, 158], to: [814, 57],  prop: "aad:studied",   pos: [750, 100], small: true },
    { from: [778, 183], to: [814, 175], prop: "aad:made",      pos: [782, 160], small: true },
    { from: [693, 236], to: [814, 290], prop: "aad:loves",     pos: [750, 268], small: true }
  ];

  function esc(s){ return (s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

  function nodeHTML(n, current){
    var isCurrent = current === n.key || (current || "").indexOf(n.key) === 0;
    var cls = "ont-node" + (n.dark ? " ont-node-dark" : "") + (n.accentBorder ? " ont-node-accent" : "") + (isCurrent ? " ont-node-current" : "");
    var style = "left:" + n.x + "px;top:" + n.y + "px;width:" + n.w + "px;height:" + n.h + "px;";
    var inner = "<b>" + n.label + "</b>" + (n.prop ? "<br><span class=\"ont-prop mono\">" + esc(n.prop) + "</span>" : "") +
      (n.sub ? "<br><span class=\"ont-sub\">" + esc(n.sub) + "</span>" : "");
    return '<a class="' + cls + '" style="' + style + '" href="' + n.href + '"><span class="ont-node-inner">' + inner + "</span></a>";
  }

  function edgeSVG(e){
    var stroke = e.accent ? "var(--accent-line, #7A2320)" : "var(--edge-line, #B9B6AC)";
    var markerId = "ont-arrow" + (e.accent ? "-accent" : "");
    return '<line x1="' + e.from[0] + '" y1="' + e.from[1] + '" x2="' + e.to[0] + '" y2="' + e.to[1] +
      '" stroke="' + stroke + '" stroke-width="1.6" marker-end="url(#' + markerId + ')" />';
  }

  function labelHTML(e){
    if (!e.prop || e.noLabel) return "";
    return '<div class="ont-edge-label mono" style="left:' + e.pos[0] + 'px;top:' + e.pos[1] + 'px;' +
      (e.accent ? "color:var(--accent-line,#7A2320);font-weight:700;" : "") + '">' + esc(e.prop) + '</div>';
  }

  function render(mountSel, current){
    var mount = typeof mountSel === "string" ? document.querySelector(mountSel) : mountSel;
    if (!mount) return;

    var svgLines = EDGES.map(edgeSVG).join("");
    var edgeLabels = EDGES.map(labelHTML).join("");
    var nodes = NODES.map(function (n) { return nodeHTML(n, current); }).join("");

    mount.innerHTML =
      '<div class="ont-wrap">' +
        '<div class="ont-canvas" style="width:' + W + 'px;height:' + H + 'px;">' +
          '<svg class="ont-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' +
            '<defs>' +
              '<marker id="ont-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--edge-line, #B9B6AC)"/></marker>' +
              '<marker id="ont-arrow-accent" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--accent-line, #7A2320)"/></marker>' +
            '</defs>' +
            svgLines +
          '</svg>' +
          edgeLabels +
          nodes +
        '</div>' +
        '<nav class="ont-mobile-nav" aria-label="주 메뉴">' +
          '<a href="index.html">메인</a>' +
          '<a href="activity.html">활동</a>' +
          '<a href="webzine.html">데이터를 서술하기</a>' +
          '<a href="webzine.html?post=04">하루키 네트워크</a>' +
          '<a href="actor.html">배우 아카이브</a>' +
          '<a href="person.html">정주영</a>' +
        '</nav>' +
      '</div>';

    fitScale(mount);
    window.addEventListener("resize", function () { fitScale(mount); });
  }

  function fitScale(mount){
    var canvas = mount.querySelector(".ont-canvas");
    var wrapEl = mount.querySelector(".ont-wrap");
    if (!canvas || !wrapEl) return;
    var avail = wrapEl.clientWidth;
    if (avail <= 0) return;
    var scale = Math.min(1, avail / W);
    canvas.style.transform = "scale(" + scale + ")";
    canvas.style.transformOrigin = "top left";
    wrapEl.style.height = (H * scale) + "px";
  }

  global.AAD_NAV = { render: render };
})(window);
