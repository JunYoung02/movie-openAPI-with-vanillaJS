const $navUl = document.getElementById("navCategory"); // nav ul
const $navLi = $navUl.querySelectorAll("li"); // nav ul li
const $Logo = document.getElementById("logo"); // main logo
const $concertUl = document.getElementById("concertContainer");
const $pageCon = document.getElementById("pageCon"); // pagination button container
const $pageNumCon = document.getElementById("pageNumCon"); // pagination number container
const $modalBg = document.getElementById("backdrop");
const $modalCloseBtn = document.getElementById("close"); // 모달 닫기 버튼
const $modalInfo = document.createElement("div"); // 모달 내부 정보
const $inputText = document.getElementById("inputText"); // 검색 input

let category = "toprated"; // 기본 nav li 카테고리 설정
let currentPage = 1; // 현재 페이지
let totalPage; // 전체 페이지

// ** 검색
const searchApiCall = (searchValue) => {
  // 검색 input이 비워진 경우 현재 category의 1페이지로 이동
  if (!searchValue) {
    currentPage = 1;
    getData(category);
    return;
  }
  fetch(
    `http://localhost:3000/api/search/?title=${searchValue}&page=${currentPage}`
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      postData(data);
      pagination();
    })
    .catch((error) => console.error("Error fetching movies:", error));
};
const debounce = (fn, delay = 1000) => {
  let timerId = null;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
};
const onInput = debounce(searchApiCall, 500);
$inputText.addEventListener("input", (e) => {
  // search debounce 적용
  onInput(e.target.value);
});

// ** modal 나타내기
// * 모달 내용 나타내기
const postModal = (data, credits, videos) => {
  const $modal = document.getElementById("modal");

  let genres = []; // 장르 저장
  let actors = []; // credits 배우들 일부 저장
  let videoKey = videos.results.length != 0 ? videos.results[0].key : undefined; // 비디오 키가 없을 경우 에러 방지
  // console.log(videoKey);
  data.genres.map((item) => {
    genres.push(item.name);
  });
  for (let i = 0; i < 3; i++) {
    actors.push({
      original_name: credits.cast[i].original_name,
      name: credits.cast[i].name,
      profileImg: credits.cast[i].profile_path,
      character: credits.cast[i].character,
    });
  }
  // console.log(actors);

  // console.log(`https://www.youtube.com/watch?v=${videos.results[0].key}`);
  $modalInfo.style.cssText = `
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  overflow-y:auto;
  `;
  $modalInfo.innerHTML = `
  <div class="infoCon">
    <div class="imgCon">
      <img
      src=https://image.tmdb.org/t/p/original${data.poster_path}
        alt="포스터"
      />
    </div>
    <div class="rightSide">
      <div class="detailCon">
        <div class="detailOptions">
          <span class="detailText title">제목</span>
          <span class="detailText title">장르</span>
          <span class="detailText title">개봉일자</span>
        </div>
        <div class="detailOptions">
          <span class="detailText">${data.title}</span>
          <span class="detailText">${genres}</span>
          <span class="detailText">${data.release_date}</span>
        </div>
      </div>

      <p class="titleActor">등장인물</p>
      <div class="actorCon">
        <div class="actorInfo">
          <div class="actorImg">
            <img src=https://image.tmdb.org/t/p/original${actors[0].profileImg} alt="배우 이미지"/>
          </div>
          <p class="characterName">${actors[0].character}</p>
          <p class="actorName">${actors[0].original_name}</p>
        </div>
        
        <div class="actorInfo">
          <div class="actorImg">
            <img src=https://image.tmdb.org/t/p/original${actors[1].profileImg} alt="배우 이미지"/>
          </div>
        <p class="characterName">${actors[1].character}</p>
          <p class="actorName">${actors[1].original_name}</p>
        </div>

        <div class="actorInfo">
          <div class="actorImg">
            <img src=https://image.tmdb.org/t/p/original${actors[2].profileImg} alt="배우 이미지"/>
          </div>
          <p class="characterName">${actors[2].character}</p>
          <p class="actorName">${actors[2].original_name}</p>
        </div>
      </div>


      <div class="story">
      <span class="option" id="storyText">줄거리</span>
      <p class="toggleOff" id="overview">${data.overview}</p>
      </div>
      
      <div class="movie">
        <p id="storyMovie" class="storyMovie">예고편</p>
        <iframe id="video" width:500px height:'300px' class="toggleOff" src="https://www.youtube.com/embed/${videoKey}" controls ></iframe>
      </div>
    </div>
  </div>
  `;
  $modal.appendChild($modalInfo);
};
// * 모달 열기
const openModal = () => {
  $modalBg.style.cssText = `
  visibility: visible;
  opacity:1;
  transition: 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  `;
};
// * 모달 닫기
const closeModal = () => {
  $modalBg.style.cssText = `
  visibility: hidden;
`;
  $modalInfo.innerHTML = ``;
};
// * 모달 닫기 버튼 클릭
$modalCloseBtn.addEventListener("click", () => {
  // console.log("모달 닫기 클릭");
  closeModal();
});
// * 모달을 열기 위한 li card 클릭
$concertUl.addEventListener("click", async (e) => {
  const selectCard = e.target.closest("li.card");
  // console.log(e);
  // console.log(selectCard);

  // selectCard가 null이 아닐 경우
  if (selectCard) {
    let detail, credits, videos;
    // console.log(selectCard.id);
    // details
    await fetch(`http://localhost:3000/api/details/?id=${selectCard.id}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        detail = data;
      })
      .catch((error) => console.error("Error fetching movies:", error));

    // credits
    await fetch(`http://localhost:3000/api/credits/?id=${selectCard.id}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        credits = data;
      })
      .catch((error) => console.error("Error fetching movies:", error));

    // videos
    await fetch(`http://localhost:3000/api/videos/?id=${selectCard.id}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        videos = data;
      })
      .catch((error) => console.error("Error fetching movies:", error));

    openModal(); // 모달 열기
    // console.log(detail, credits, videos);
    postModal(detail, credits, videos); // 모달 내용(detail) 전송
  }
});

// logo 클릭 시 메인화면 전환
$Logo.addEventListener("click", () => {
  $navLi.forEach((item) => {
    item.className = "";
  });
  $navLi[0].classList.add("on");
  currentPage = 1;
  getData("toprated");
});

// nav 클릭 시 li id 가져와서 post
const getData = (id) => {
  $inputText.value = ""; // input value 초기화
  fetch(`http://localhost:3000/api/${id}/?page=${currentPage}`)
    .then((response) => response.json())
    .then((data) => {
      postData(data);
      pagination();
    })
    .catch((error) => console.error("Error fetching movies:", error));
};

// nav 요소 클릭
$navUl.addEventListener("click", (e) => {
  // console.log(e.target);

  // li 요소를 클릭하지 않은 경우
  if (e.target == $navUl) return;

  $navLi.forEach((item) => {
    item.className = "";
  });
  // console.log(e.target);  // li

  e.target.classList.add("on");
  category = e.target.id;
  currentPage = 1;
  getData(category);
});

// 데이터 화면에 나타내기
const postData = (data) => {
  // console.log("postData", data);
  totalPage = data.total_pages;

  $concertUl.innerHTML = ``;

  // console.log(data);

  data.results.forEach((data) => {
    const $concertLi = document.createElement("li");
    $concertLi.classList.add("card");
    $concertLi.setAttribute("id", `${data.id}`);
    // console.log(data);
    $concertLi.innerHTML = `
    <div class="imgCon">
    <img
      src=https://image.tmdb.org/t/p/original${data.poster_path}
      alt="대표 이미지"
    />
  </div>
  <div class="infoCon">
  <p class='title'>${data.title}</p>
  <div class='rating'>
    <div>
      <img src="./img/Star.png" alt="별" />
    </div>
    ${data.vote_average}
  </div>
  <p class='date'>${data.release_date}</p>
  </div>
    `;
    $concertUl.appendChild($concertLi);
  });
};

// * 페이지네이션
// 페이지네이션 내부 버튼 클릭
$pageCon.addEventListener("click", (e) => {
  if (e.target == $pageCon || e.target == $pageNumCon) return;
  // console.log(e.target);

  // 검색 후 페이지 이동을 하면 category 정보를 넘겨줘서, 검색 결과로 페이지네이션을 할 수 없는 이슈 해결 코드
  if ($inputText.value) {
    if (!isNaN(e.target.id)) {
      $pageNumCon.childNodes.forEach((item) => {
        item.className = "";
      });
      // console.log(e.target.id);
      currentPage = e.target.id;
      e.target.classList.add("on");
      getData(category);
    } else {
      switch (e.target.id) {
        case "firstPage":
          // console.log("firstpage");
          currentPage = 1;
          break;
        case "prevPage":
          // console.log("prevPage");
          if (currentPage == 1) return;
          currentPage = currentPage - 1;
          break;
        case "nextPage":
          // console.log("nextPage");
          // if (currentPage == lastNumber) return;
          currentPage = currentPage + 1;
          break;
        case "lastPage":
          // console.log("lastPage");
          if (currentPage == totalPage) return;
          currentPage = totalPage;
          break;
        default:
          return;
      }
    }
    // console.log(currentPage);
    fetch(
      `http://localhost:3000/api/search/?title=${$inputText.value}&page=${currentPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data, currentPage);
        postData(data);
        pagination();
      })
      .catch((error) => console.error("Error fetching movies:", error));
    // console.log("검색 페이지네이션");

    return;
  }

  // 숫자 페이지 버튼 클릭했을 경우
  if (!isNaN(e.target.id)) {
    $pageNumCon.childNodes.forEach((item) => {
      item.className = "";
    });
    // console.log(e.target.id);
    currentPage = e.target.id;
    e.target.classList.add("on");
    getData(category);
  } else {
    // 맨 앞, 이전, 다음, 맨 뒤 버튼을 클릭한 경우
    switch (e.target.id) {
      case "firstPage":
        // console.log("firstpage");
        currentPage = 1;
        break;
      case "prevPage":
        // console.log("prevPage");
        if (currentPage == 1) return;
        currentPage = currentPage - 1;
        break;
      case "nextPage":
        // console.log("nextPage");
        // if (currentPage == lastNumber) return;
        currentPage = currentPage + 1;
        break;
      case "lastPage":
        // console.log("lastPage");
        if (currentPage == totalPage) return;
        currentPage = totalPage;
        break;
      default:
        return;
    }
    getData(category);
  }
});
// 현재 페이지에 맞게 버튼들 렌더링
const pagination = () => {
  let pageCount = 5; // 페이지 버튼을 보여줄 갯수
  let pageGroup = Math.ceil(currentPage / pageCount);
  let lastNumber = pageGroup * pageCount; // 페이지 그룹에서의 마지막 숫자
  if (lastNumber > totalPage) {
    lastNumber = totalPage;
  }
  let firstNumber = lastNumber - (pageCount - 1); // 페이지 그룹에서의 첫 번째 숫자
  // console.log("pagination 함수 실행", firstNumber, lastNumber, currentPage);
  $pageNumCon.innerHTML = "";
  for (let i = firstNumber; i <= lastNumber; i++) {
    const $pageBtnCon = document.createElement("button");
    if (i == currentPage) {
      $pageBtnCon.classList.add("on");
    }
    // if (i == firstNumber) {
    // }
    $pageBtnCon.id = `${i}`;
    $pageBtnCon.textContent = i;
    // $pageBtnCon.appendChild(button);
    $pageNumCon.appendChild($pageBtnCon);
  }
};

// HTML 읽고, DOM 트리 완성하는 순간 실행 (기본 값 top rated)
document.addEventListener("DOMContentLoaded", () => {
  fetch(`/api/${category}/?page=${currentPage}`)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      postData(data);
      pagination();
    })
    .catch((error) => console.error("Error fetching movies:", error));
});
