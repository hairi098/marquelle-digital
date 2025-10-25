document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form');
    if (!form) return;

    const input = form.querySelector('input[name="search"]');
    const cards = document.querySelectorAll("article");
    const pagination = document.getElementById('custom-pagination');
    let currentFilter = "all"; // default filter

    // simpan filter saat tombol kategori diklik
    const filterLinks = document.querySelectorAll('#filter-buttons a');
    filterLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            currentFilter = link.getAttribute("data-filter") || "all";
        });
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const keyword = input.value.trim().toLowerCase();
        let matchedCards = [];

        cards.forEach(card => {
            const title = card.querySelector("h2").innerText.toLowerCase();
            const category = card.getAttribute("data-category") || "";

            const matchKeyword = title.includes(keyword);
            const matchCategory = (currentFilter === "all") || category.split(" ").includes(currentFilter);

            if (matchKeyword && matchCategory) {
                card.style.display = "block";
                matchedCards.push(card);
            } else {
                card.style.display = "none";
            }
        });

        // Jika ada keyword → matikan pagination
        if (keyword) {
            pagination.innerHTML = "";
            pagination.style.display = "none";
        } else {
            // Kalau keyword kosong → balikin pagination normal
            if (currentFilter === "all") {
                showPage(1, Array.from(cards));
            } else {
                pagination.innerHTML = "";
                pagination.style.display = "none";
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get("theme");

    if (theme) {
        document.querySelectorAll('.card-footer a.btn').forEach(link => {
            link.href = link.href + "?theme=" + encodeURIComponent(theme);
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const waNumber = "62882020411497";
    const params = new URLSearchParams(window.location.search);
    const theme = params.get("theme");

    document.querySelectorAll(".wa-button").forEach(btn => {
        const paketName = btn.dataset.paket || "Tanpa Nama";
        const message = `Saya mau order paket *${paketName}*${theme ? `, Tema *${theme}*` : ""}`;
        btn.href = `https://api.whatsapp.com/send/?phone=${waNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const filterLinks = document.querySelectorAll('#filter-buttons a');
    const allArticles = Array.from(document.querySelectorAll("article[data-category]"));
    const pagination = document.getElementById('custom-pagination');
    const itemsPerPage = 88;
    let currentPage = 1;

    window.showPage = function (page, articles) {
        currentPage = page;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        allArticles.forEach(article => article.style.display = 'none');

        articles.forEach((article, index) => {
            if (index >= start && index < end) {
                article.style.display = '';
            }
        });

        articles[start]?.scrollIntoView({ behavior: 'smooth' });

        renderPagination(articles);
    }

    function renderPagination(articles) {
        pagination.innerHTML = '';

        const totalPages = Math.ceil(articles.length / itemsPerPage);

        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';

        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '&lt;';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => showPage(currentPage - 1, articles);
        pagination.appendChild(prevBtn);

        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + 4);
        if (end - start < 4) start = Math.max(1, end - 4);

        for (let i = start; i <= end; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === currentPage) btn.classList.add('active');
            btn.onclick = () => showPage(i, articles);
            pagination.appendChild(btn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '&gt;';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => showPage(currentPage + 1, articles);
        pagination.appendChild(nextBtn);
    }

    filterLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const filter = link.getAttribute("data-filter");

            filterLinks.forEach(btn => btn.classList.add("btn-secondary"));
            filterLinks.forEach(btn => btn.classList.remove("btn-active"));
            link.classList.remove("btn-secondary");
            link.classList.add("btn-active");

            const filteredArticles = allArticles.filter(card => {
                const category = card.getAttribute("data-category") || "";
                return filter === "all" || category.split(" ").includes(filter);
            });

            if (filter === "all") {
                showPage(1, filteredArticles);
            } else {
                pagination.innerHTML = '';
                pagination.style.display = 'none';

                allArticles.forEach(card => {
                    const category = card.getAttribute("data-category") || "";
                    card.style.display = category.split(" ").includes(filter) ? "" : "none";
                });
            }
        });
    });

    // Initial Load
    showPage(1, allArticles);
});
