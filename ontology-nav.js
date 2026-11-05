/* 아트앤데이터 온톨로지 — 움직이는(드래그 가능한) 다이어그램. D3 force layout 사용.
   메인 페이지에서만 AAD_NAV.render('#ont-mount') 형태로 호출한다.
   이 파일보다 먼저 d3.min.js가 로드되어 있어야 한다.
   ※ 더 이상 메뉴 역할을 하지 않는다 — 클릭해도 페이지 이동이 없는, 순수 설명용 다이어그램.
     실제 페이지 이동은 site-menu.js가 그리는 상단 텍스트 메뉴로 한다.
*/
(function (global) {
  var W = 1000, H = 600;

  var NODE_DEFS = [
    { key: "main",     w: 190, h: 86, label: "아트앤데이터", prop: "aad:ArtAndData", dark: true },
    { key: "activity", w: 158, h: 64, label: "활동",         prop: "aad:did" },
    { key: "webzine",  w: 172, h: 80, label: "데이터를 서술하기", prop: "aad:describes" },
    { key: "haruki",   w: 172, h: 68, label: "하루키 네트워크",   prop: "aad:explores", accentBorder: true },
    { key: "actor",    w: 172, h: 68, label: "배우 아카이브", sub: "설경구부터", accentBorder: true },
    { key: "person",   w: 162, h: 86, label: "정주영",       prop: "aad:Person", accentBorder: true },
    { key: "person-research", w: 122, h: 62, label: "연구",  prop: "aad:studied" },
    { key: "person-theatre",  w: 122, h: 62, label: "극장",  prop: "aad:made" },
    { key: "person-yoga",     w: 122, h: 62, label: "요가",  prop: "aad:loves" }
  ];

  var LINK_DEFS = [
    { source: "main", target: "activity",        prop: "aad:did" },
    { source: "main", target: "webzine",          prop: "aad:describes" },
    { source: "main", target: "haruki",           prop: "aad:explores" },
    { source: "main", target: "actor",            prop: "aad:archives" },
    { source: "person", target: "actor",          prop: "aad:curates" },
    { source: "main", target: "person",           prop: "aad:foundedBy", accent: true },
    { source: "person", target: "person-research",prop: "aad:studied" },
    { source: "person", target: "person-theatre", prop: "aad:made" },
    { source: "person", target: "person-yoga",    prop: "aad:loves" }
  ];

  function esc(s){ return (s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

  function nodeInnerHTML(n){
    return "<b>" + n.label + "</b>" +
      (n.prop ? "<br><span class=\"ont-prop mono\">" + esc(n.prop) + "</span>" : "") +
      (n.sub ? "<br><span class=\"ont-sub\">" + esc(n.sub) + "</span>" : "");
  }

  function render(mountSel){
    var mount = typeof mountSel === "string" ? document.querySelector(mountSel) : mountSel;
    if (!mount) return;

    if (!global.d3){
      // d3 로드 실패 시 조용히 빈 자리로 둔다 (더 이상 메뉴 역할이 아니므로 대체 목록이 필요 없다)
      mount.innerHTML = '';
      return;
    }

    var nodes = NODE_DEFS.map(function (d) { return Object.assign({}, d); });
    var links = LINK_DEFS.map(function (d) { return Object.assign({}, d); });

    mount.innerHTML =
      '<div class="ont-wrap">' +
        '<svg class="ont-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="아트앤데이터 온톨로지 다이어그램. 아트앤데이터가 생각하는 개념 구조를 보여줍니다. 드래그하면 위치를 옮길 수 있습니다.">' +
          '<defs>' +
            '<marker id="ont-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#B9B6AC"/></marker>' +
            '<marker id="ont-arrow-accent" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#7A2320"/></marker>' +
          '</defs>' +
          '<g class="ont-links"></g>' +
          '<g class="ont-edge-labels"></g>' +
          '<g class="ont-nodes"></g>' +
        '</svg>' +
      '</div>';

    var svg = d3.select(mount).select("svg.ont-svg");
    var linkSel = svg.select(".ont-links").selectAll("line").data(links).join("line")
      .attr("stroke", function (d) { return d.accent ? "#7A2320" : "#B9B6AC"; })
      .attr("stroke-width", 1.6)
      .attr("marker-end", function (d) { return "url(#" + (d.accent ? "ont-arrow-accent" : "ont-arrow") + ")"; });

    var labelSel = svg.select(".ont-edge-labels").selectAll("text").data(links).join("text")
      .attr("class", "ont-edge-text mono")
      .attr("font-size", 10.5)
      .attr("fill", function (d) { return d.accent ? "#7A2320" : "#8C897F"; })
      .attr("font-weight", function (d) { return d.accent ? 700 : 400; })
      .attr("text-anchor", "middle")
      .text(function (d) { return d.prop; });

    var nodeSel = svg.select(".ont-nodes").selectAll("foreignObject").data(nodes).join("foreignObject")
      .attr("width", function (d) { return d.w; })
      .attr("height", function (d) { return d.h; })
      .style("overflow", "visible")
      .html(function (d) {
        var cls = "ont-node" + (d.dark ? " ont-node-dark" : "") + (d.accentBorder ? " ont-node-accent" : "");
        return '<div xmlns="http://www.w3.org/1999/xhtml" class="' + cls + '" style="width:' + d.w + 'px;height:' + d.h + 'px;">' +
          '<span class="ont-node-inner">' + nodeInnerHTML(d) + '</span></div>';
      });

    // 노드가 폭이 넓고 낮은 직사각형이라, 반경을 "긴 변 / 2"로만 잡으면
    // 대각선 방향에서는 실제 모서리까지 못 미쳐 박스끼리 겹쳐 보인다.
    // 대각선 절반 길이(모서리까지의 실제 거리)를 반경으로 써야 어느 방향으로도 안 겹친다.
    function cornerRadius(d){
      return Math.sqrt((d.w / 2) * (d.w / 2) + (d.h / 2) * (d.h / 2));
    }

    // 노드 크기에 비례해 링크 길이를 정해서, 박스끼리 너무 붙어 선/라벨이
    // 묻히는 일이 없도록 한다 (고정값 하나로는 큰 노드와 작은 노드 사이 간격이 들쭉날쭉했다).
    function linkDistance(d){
      return cornerRadius(d.source) + cornerRadius(d.target) + 110;
    }

    var simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(function (d) { return d.key; }).distance(linkDistance).strength(0.95))
      .force("charge", d3.forceManyBody().strength(-1500))
      .force("x", d3.forceX(W / 2).strength(0.05))
      .force("y", d3.forceY(H / 2).strength(0.05))
      .force("collide", d3.forceCollide(function (d) { return cornerRadius(d) + 18; }).iterations(3))
      .alpha(1)
      .alphaDecay(0.025);

    nodes.find(function (d) { return d.key === "main"; }).fx = W / 2;
    nodes.find(function (d) { return d.key === "main"; }).fy = H / 2;

    function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }

    function clampAll(){
      nodes.forEach(function (d) {
        d.x = clamp(d.x, d.w / 2 + 4, W - d.w / 2 - 4);
        d.y = clamp(d.y, d.h / 2 + 4, H - d.h / 2 - 4);
      });
    }

    function updatePositions(){
      linkSel
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });
      labelSel
        .attr("x", function (d) { return (d.source.x + d.target.x) / 2; })
        .attr("y", function (d) { return (d.source.y + d.target.y) / 2 - 4; });
      nodeSel
        .attr("x", function (d) { return d.x - d.w / 2; })
        .attr("y", function (d) { return d.y - d.h / 2; });
    }

    // 처음 페이지를 열었을 때부터 이미 정돈된 모습이 보이도록, 화면에 그리기 전에
    // 시뮬레이션을 미리 충분히 돌려서 자리를 잡아둔다 (드래그 가능한 건 그대로 유지).
    simulation.stop();
    for (var i = 0; i < 400; i++) { simulation.tick(); clampAll(); }
    updatePositions();

    simulation.on("tick", function () {
      clampAll();
      updatePositions();
    });

    var drag = d3.drag()
      .clickDistance(5)
      .on("start", function (event, d) {
        if (!event.active) simulation.alphaTarget(0.25).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on("drag", function (event, d) {
        d.fx = clamp(event.x, d.w / 2 + 4, W - d.w / 2 - 4);
        d.fy = clamp(event.y, d.h / 2 + 4, H - d.h / 2 - 4);
      })
      .on("end", function (event, d) {
        if (!event.active) simulation.alphaTarget(0);
        // 메인 노드는 항상 중앙에 고정, 나머지는 놓은 자리에 고정되어 유지된다.
        if (d.key === "main"){ d.fx = W / 2; d.fy = H / 2; }
      });

    nodeSel.call(drag);
  }

  global.AAD_NAV = { render: render };
})(window);
