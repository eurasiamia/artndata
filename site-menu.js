/* 아트앤데이터 — 왼쪽 세로 사이드바 메뉴.
   각 페이지 헤더에서 AAD_MENU.render('#menu-mount', '현재페이지키') 형태로 호출.
   페이지 키: main | about | person-research | person-theatre | person-yoga | webzine | elsewhere
   온톨로지 다이어그램(ontology-nav.js)과는 별개로, 이 메뉴만으로 모든 페이지 이동이 가능해야 한다.
*/
(function (global) {

  function belongsTo(current, keys){
    return keys.indexOf(current) !== -1;
  }

  function render(mountSel, current){
    var mount = typeof mountSel === "string" ? document.querySelector(mountSel) : mountSel;
    if (!mount) return;

    var personKeys = ["person-research", "person-theatre", "person-yoga"];
    var introCurrent = current === "about" || belongsTo(current, personKeys);
    var personCurrent = belongsTo(current, personKeys);

    // "소개"는 클릭하면 펼쳐지는 드롭다운으로 — 지금 보고 있는 섹션이면 처음부터 펼쳐둔다.
    mount.innerHTML =
      '<details class="nav-group"' + (introCurrent ? ' open' : '') + '>' +
        '<summary class="nav-group-label' + (introCurrent ? ' is-current' : '') + '">소개</summary>' +
        '<div class="nav-group-body">' +
          '<a href="about.html"' + (current === "about" ? ' class="is-current"' : '') + '>아트앤데이터</a>' +
          '<details class="nav-subgroup"' + (personCurrent ? ' open' : '') + '>' +
            '<summary class="nav-sub-label' + (personCurrent ? ' is-current' : '') + '">정주영</summary>' +
            '<div class="nav-subgroup-body">' +
              '<a href="person.html#research"' + (current === "person-research" ? ' class="is-current"' : '') + '>연구</a>' +
              '<a href="person.html#theatre"' + (current === "person-theatre" ? ' class="is-current"' : '') + '>극장</a>' +
              '<a href="person.html#yoga"' + (current === "person-yoga" ? ' class="is-current"' : '') + '>요가</a>' +
            '</div>' +
          '</details>' +
        '</div>' +
      '</details>' +
      '<a class="nav-top-link' + (current === "webzine" ? ' is-current' : '') + '" href="webzine.html">데이터를 서술하기</a>' +
      '<a class="nav-top-link' + (current === "elsewhere" ? ' is-current' : '') + '" href="elsewhere.html">일에서 그 어딘가로</a>';
  }

  global.AAD_MENU = { render: render };
})(window);
