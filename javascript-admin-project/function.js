document.addEventListener("DOMContentLoaded", () => {
  const product_data = [
    { category: "상의", brand: "Supreme", product: "슈프림 박스로고 후드티", price: "390,000", gender: "남성" },
    { category: "하의", brand: "DIESEL", product: "디젤 트랙 팬츠", price: "188,000", gender: "남성" },
    { category: "신발", brand: "Nike", product: "에어포스 1", price: "137,000", gender: "여성" },
    { category: "패션잡화", brand: "Music&Goods", product: "빵빵이 키링", price: "29,000", gender: "여성" },
    { category: "상의", brand: "ADER", product: "아더에러 맨투맨", price: "210,000", gender: "남성" },
    { category: "신발", brand: "Adidas", product: "슈퍼스타 화이트", price: "119,000", gender: "여성" }
  ];

  let currentPage = 1;
  const itemsPerPage = 3;
  let filteredData = [...product_data];

  const product_data_Table = document.getElementById("product_data_Table");
  const pagination = document.getElementById("pagination");
  const darkModeBtn = document.getElementById("darkModeBtn");

  function renderTable(data) {
    product_data_Table.innerHTML = "";
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = data.slice(startIndex, endIndex);

    if (pageItems.length === 0) {
      const row = product_data_Table.insertRow();
      const cell = row.insertCell(0);
      cell.colSpan = 4;
      cell.className = "text-center text-muted";
      cell.textContent = "검색 결과가 없습니다.";
      return;
    }

    pageItems.forEach(item => {
      const row = product_data_Table.insertRow();
      row.insertCell(0).innerText = item.category;
      row.insertCell(1).innerText = item.brand;
      row.insertCell(2).innerText = item.product;
      row.insertCell(3).innerText = item.price;
    });
  }

  function renderPagination(dataLength) {
    pagination.innerHTML = "";
    const pageCount = Math.ceil(dataLength / itemsPerPage);

    for (let i = 1; i <= pageCount; i++) {
      const li = document.createElement("li");
      li.className = "page-item" + (i === currentPage ? " active" : "");
      const a = document.createElement("a");
      a.className = "page-link";
      a.href = "#";
      a.textContent = i;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = i;
        renderTable(filteredData);
        renderPagination(filteredData.length);
      });
      li.appendChild(a);
      pagination.appendChild(li);
    }
  }

  function applyFilters() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const keyword = document.getElementById("keywordInput").value.toLowerCase().trim();
    const selectedGender = document.getElementById("genderFilter").value;

    filteredData = product_data.filter(item => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesKeyword =
        !keyword ||
        item.product.toLowerCase().includes(keyword) ||
        item.brand.toLowerCase().includes(keyword) ||
        item.product.includes(keyword) ||
        item.brand.includes(keyword);
      const matchesGender = selectedGender === "all" || item.gender === selectedGender;

      return matchesCategory && matchesKeyword && matchesGender;
    });

    currentPage = 1;
    renderTable(filteredData);
    renderPagination(filteredData.length);
  }

  function updateTime() {
    const now = new Date();
    document.getElementById("timeDisplay").textContent = now.toLocaleString();
  }

  setInterval(updateTime, 1000);
  updateTime();

  document.getElementById("filterBtn").addEventListener("click", applyFilters);

  darkModeBtn.addEventListener("click", () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-bs-theme");
    const nextTheme = current === "light" ? "dark" : "light";
    html.setAttribute("data-bs-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    darkModeBtn.textContent = nextTheme === "light" ? "🌙 다크모드" : "☀️ 라이트모드";

    // 다크모드 토글 시 테이블/페이지네이션 다시 그리기 (필요하면)
    renderTable(filteredData);
    renderPagination(filteredData.length);
  });

  // 로컬스토리지에서 다크모드 상태 불러오기
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-bs-theme", savedTheme);
    darkModeBtn.textContent = savedTheme === "light" ? "🌙 다크모드" : "☀️ 라이트모드";
  }

  // 페이지 처음 렌더링
  renderTable(filteredData);
  renderPagination(filteredData.length);
});
