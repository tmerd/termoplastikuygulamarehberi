const data = [
  {
    problem: "Enjeksiyon sonrası çarpılma",
    category: "Otomotiv",
    cause: "Dengesiz soğutma ve kalıp sıcaklığında lokal farklar.",
    solution: "Kalıp sıcaklık dağılımını dengele, soğutma kanallarını optimize et ve tutma basıncını kademeli ayarla."
  },
  {
    problem: "Yüzeyde gümüş izleri",
    category: "Ambalaj",
    cause: "Nemli hammadde ve yetersiz kurutma.",
    solution: "Granülü üretici tavsiyesine uygun sıcaklık/süre ile kurut, nem ölçümü yaparak prosesi doğrula."
  },
  {
    problem: "Kaynak çizgisi zayıflığı",
    category: "Beyaz Eşya",
    cause: "Akış cephelerinin düşük sıcaklıkta birleşmesi.",
    solution: "Ergitme sıcaklığını artır, gate tasarımını iyileştir ve dolum hızını yükselterek birleşme kalitesini artır."
  },
  {
    problem: "Kırılganlık artışı",
    category: "Medikal",
    cause: "Aşırı geri dönüşüm oranı veya termal bozunma.",
    solution: "Bakir hammadde oranını artır, vida devrini düşürerek kesme ısısını azalt ve proses sıcaklık profilini gözden geçir."
  },
  {
    problem: "Büzülme boşlukları",
    category: "İnşaat",
    cause: "Yetersiz tutma basıncı/tutma süresi.",
    solution: "Tutma basıncı ve süresini artır, mümkünse gate donma zamanını ölç ve parametreyi buna göre ayarla."
  }
];

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cards = document.getElementById("cards");
const resultCount = document.getElementById("resultCount");
const previewCard = document.getElementById("previewCard");

let selectedProblem = "";

const categories = [...new Set(data.map((item) => item.category))].sort();
categories.forEach((category) => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  categoryFilter.append(option);
});

const setPreview = (item) => {
  if (!item) {
    previewCard.className = "card preview-card empty";
    previewCard.innerHTML = "<h3>Ön izleme için kayıt bulunamadı</h3><p>Arama ve filtreleri değiştirerek tekrar deneyin.</p>";
    return;
  }

  previewCard.className = "card preview-card";
  previewCard.innerHTML = `
    <span class="tag">${item.category}</span>
    <h3>${item.problem}</h3>
    <p><strong>Muhtemel neden:</strong> ${item.cause}</p>
    <p><strong>Önerilen çözüm:</strong> ${item.solution}</p>
  `;
};

const render = () => {
  const query = searchInput.value.trim().toLocaleLowerCase("tr");
  const selectedCategory = categoryFilter.value;

  const filtered = data.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const corpus = `${item.problem} ${item.cause} ${item.solution}`.toLocaleLowerCase("tr");
    const matchesSearch = corpus.includes(query);
    return matchesCategory && matchesSearch;
  });

  resultCount.textContent = `${filtered.length} kayıt listeleniyor.`;
  cards.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("article");
    empty.className = "card empty";
    empty.innerHTML = "<h3>Sonuç bulunamadı</h3><p>Arama ifadenizi sadeleştirip tekrar deneyin.</p>";
    cards.append(empty);
    setPreview(null);
    selectedProblem = "";
    return;
  }

  const selectedItem = filtered.find((item) => item.problem === selectedProblem) || filtered[0];
  selectedProblem = selectedItem.problem;

  filtered.forEach((item) => {
    const article = document.createElement("article");
    article.className = `card selectable ${item.problem === selectedProblem ? "active" : ""}`;
    article.setAttribute("role", "listitem");
    article.innerHTML = `
      <span class="tag">${item.category}</span>
      <h3>${item.problem}</h3>
      <p><strong>Muhtemel neden:</strong> ${item.cause}</p>
      <p><strong>Önerilen çözüm:</strong> ${item.solution}</p>
    `;

    article.addEventListener("click", () => {
      selectedProblem = item.problem;
      render();
    });

    cards.append(article);
  });

  setPreview(selectedItem);
};

searchInput.addEventListener("input", render);
categoryFilter.addEventListener("change", render);

render();
