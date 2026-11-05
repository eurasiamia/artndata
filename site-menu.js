/* 아트앤데이터 — 상단 텍스트 메뉴 (사이트 제목 왼쪽에 둔다).
   각 페이지 헤더에서 AAD_MENU.render('#menu-mount', '현재페이지키') 형태로 호출.
   페이지 키: main | about | person-research | person-theatre | person-yoga | webzine | elsewhere
   온톨로지 다이어그램(ontology-nav.js)과는 별개로, 이 메뉴만으로 모든 페이지 이동이 가능해야 한다.
*/
(function (global) {

  function esc(s){ return (s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

  // 현재 페이지 키가 주어진 그룹에 속하는지 확인 (하위 메뉴 열림/강조 처리용)
  function belongsTo(current, keys){
    return keys.indexOf(current) !== -1;
  }

  function render(mountSel, current){
    var mount = typeof mountSel === "string" ? document.querySelector(mountSel) : mountSel;
    if (!mount) return;

    var personKeys = ["person-research", "person-theatre", "person-yoga"];
    var introCurrent = current === "about" || belongsTo(current, personKeys);
    var personCurrent = belongsTo(current, personKeys);

    // 드롭다운은 펼쳐진 상태로 시작하지 않는다(펼치면 아래 본문과 겹쳐 보임) — 현재 위치는 색으로만 표시.
    mount.innerHTML =
      '<ul class="site-menu-list">' +
        '<li>' +
          '<details class="menu-item">' +
            '<summary' + (introCurrent ? ' class="is-current"' : '') + '>소개</summary>' +
            '<div class="submenu">' +
              '<a href="about.html"' + (current === "about" ? ' class="is-current"' : '') + '>아트앤데이터</a>' +
              '<details class="menu-item sub">' +
                '<summary' + (personCurrent ? ' class="is-current"' : '') + '>정주영</summary>' +
                '<div class="submenu">' +
                  '<a href="person.html#research"' + (current === "person-research" ? ' class="is-current"' : '') + '>연구</a>' +
                  '<a href="person.html#theatre"' + (current === "person-theatre" ? ' class="is-current"' : '') + '>극장</a>' +
                  '<a href="person.html#yoga"' + (current === "person-yoga" ? ' class="is-current"' : '') + '>요가</a>' +
                '</div>' +
              '</details>' +
            '</div>' +
          '</details>' +
        '</li>' +
        '<li><a class="menu-link' + (current === "webzine" ? ' is-current' : '') + '" href="webzine.html">데이터를 서술하기</a></li>' +
        '<li><a class="menu-link' + (current === "elsewhere" ? ' is-current' : '') + '" href="elsewhere.html">일에서 그 어딘가로</a></li>' +
      '</ul>';

    // 메뉴 하나를 열면 같은 레벨의 다른 메뉴는 닫히게 (데스크톱에서 깔끔하게 보이도록)
    var topDetails = mount.querySelectorAll('.site-menu-list > li > details.menu-item');
    topDetails.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) {
          topDetails.forEach(function (other) { if (other !== d) other.open = false; });
        }
      });
    });
  }

  global.AAD_MENU = { render: render };
})(window);
