/* 데이터를 서술하기 — 글 목록을 구글 시트(CSV로 공개 게시)에서 불러오는 모듈.
   사용법:
   1) 구글 시트에 아래 열을 만든다: no, category, title, summary, date, url, tags, body
      - body: 글 본문 전체 텍스트(선택). 이 칸에 내용을 채우면 webzine.html?post=해당no
        페이지에서 본문 전체가 자동으로 보인다. 한 셀 안에서 줄을 바꾸려면(Alt+Enter)
        그 줄바꿈이 문단 구분으로 그대로 쓰인다. body를 비워두면 카드만 보이고
        본문 페이지는 뜨지 않는다.
      - url: 본문을 사이트가 아니라 외부 링크(노션 등)로 연결하고 싶을 때만 채운다.
        채워져 있으면 body보다 url이 우선된다.
   2) 파일 > 공유 > 웹에 게시 > 쉼표로 구분된 값(.csv) 선택 후 생성된 링크를 복사
   3) 아래 AAD_CONFIG.sheetCsvUrl 에 그 링크를 붙여넣는다 (지금은 비워둔 상태 = 안내용 예시 글만 보임)
*/
window.AAD_CONFIG = window.AAD_CONFIG || {
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTaHt7mrCFp-Kl9EUYHXPQfG7dBxk7lu6pICObGt_C_ZXwaofkDpYDBsZCeDpBJYXBZKBc7KNWaXxAc/pub?gid=0&single=true&output=csv"
};

(function (global) {
  var FALLBACK_POSTS = [
    {
      no: "01", category: "실험 노트",
      title: "구술채록 데이터로 대답하는 챗봇을 만들어 보았다",
      summary: "RAG 테스트 기록. 데이터에 없는 질문엔 “없다”고 답하는가.",
      date: "", url: "webzine.html", tags: "구술채록,RAG,관계 데이터"
    },
    {
      no: "02", category: "설계 노트",
      title: "관계에 출처를 다는 법: 누가, 어느 일화에서 말했나",
      summary: "서울시립대 특강을 정리한 글. [준비 중]",
      date: "", url: "", tags: ""
    },
    {
      no: "03", category: "배우 아카이브 연재",
      title: "설경구, 무대에서 스크린까지의 기록을 데이터로",
      summary: "배우 아카이브 첫 번째 인물. [준비 중]",
      date: "", url: "actor.html", tags: ""
    },
    {
      no: "04", category: "실험 노트",
      title: "하루키의 등장인물, 세계관을 네트워크로",
      summary: "무라카미 하루키 소설 속 인물과 세계관 데이터를 네트워크로 그려보는 연재. [준비 중]",
      date: "", url: "", tags: ""
    }
  ];

  function parseCSV(text){
    var rows = [], row = [], field = "", inQuotes = false;
    for (var i = 0; i < text.length; i++){
      var c = text[i], next = text[i + 1];
      if (inQuotes){
        if (c === '"' && next === '"'){ field += '"'; i++; }
        else if (c === '"'){ inQuotes = false; }
        else field += c;
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ','){ row.push(field); field = ""; }
        else if (c === '\n' || c === '\r'){
          if (field.length || row.length){ row.push(field); rows.push(row); row = []; field = ""; }
          if (c === '\r' && next === '\n') i++;
        } else field += c;
      }
    }
    if (field.length || row.length){ row.push(field); rows.push(row); }
    return rows;
  }

  function rowsToPosts(rows){
    if (!rows.length) return [];
    var header = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    return rows.slice(1).filter(function (r) { return r.some(function (c) { return c && c.trim(); }); }).map(function (r) {
      var o = {};
      header.forEach(function (h, i) { o[h] = (r[i] || "").trim(); });
      return o;
    });
  }

  function fetchPosts(done){
    var url = (global.AAD_CONFIG && global.AAD_CONFIG.sheetCsvUrl) || "";
    if (!url){ done(FALLBACK_POSTS, false); return; }
    fetch(url).then(function (res) {
      if (!res.ok) throw new Error("sheet fetch failed");
      return res.text();
    }).then(function (text) {
      var posts = rowsToPosts(parseCSV(text));
      done(posts.length ? posts : FALLBACK_POSTS, posts.length > 0);
    }).catch(function () {
      done(FALLBACK_POSTS, false);
    });
  }

  global.AAD_WEBZINE = { fetchPosts: fetchPosts, FALLBACK_POSTS: FALLBACK_POSTS };
})(window);
