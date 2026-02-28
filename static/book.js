document.addEventListener('DOMContentLoaded', function () {
    const viewIcons = document.querySelectorAll('.view-icon');
    const booksGrid = document.querySelector('.books-grid');

    if (viewIcons && booksGrid) {
        viewIcons.forEach(icon => {
            icon.addEventListener('click', function () {
                viewIcons.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                const cols = parseInt(this.getAttribute('data-cols'), 10) || 3;
                booksGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(180px, 1fr))`;
            });
        });
    }

    // Placeholder actions for Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const card = this.closest('.book-card');
            const title = card ? (card.querySelector('h3')?.textContent || 'Book') : 'Book';
            alert(`${title} added to cart (placeholder)`);
        });
    });

    // SORT dropdown (FEATURED)
    const sortDropdown = document.querySelector('.sort-dropdown');
    if (sortDropdown) {
        const sortBtn = sortDropdown.querySelector('.sort-btn');
        const sortMenu = sortDropdown.querySelector('.dropdown-menu');

        const openSort = () => {
            sortDropdown.classList.add('open');
            sortBtn.setAttribute('aria-expanded', 'true');
            sortMenu.setAttribute('aria-hidden', 'false');
        };

        const closeSort = () => {
            sortDropdown.classList.remove('open');
            sortBtn.setAttribute('aria-expanded', 'false');
            sortMenu.setAttribute('aria-hidden', 'true');
        };

        sortBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (sortDropdown.classList.contains('open')) closeSort(); else openSort();
        });

        sortMenu.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', function (e) {
                e.stopPropagation();
                const sortKey = this.getAttribute('data-sort');
                const label = this.textContent.trim();
                sortBtn.childNodes[0].nodeValue = label + ' ';
                closeSort();
                performSort(sortKey);
            });
        });

        document.addEventListener('click', function (e) {
            if (!sortDropdown.contains(e.target)) closeSort();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeSort();
        });
    }

    // Sorting implementation: reorders .book-card elements inside .books-grid
    function performSort(key) {
        const grid = document.querySelector('.books-grid');
        if (!grid) return;
        const cards = Array.from(grid.querySelectorAll('.book-card'));

        const getTitle = card => (card.querySelector('h3')?.textContent || '').trim().toLowerCase();
        const getPrice = card => {
            const p = card.querySelector('p')?.textContent || '';
            const num = p.replace(/[^0-9.]/g, '');
            return parseFloat(num) || 0;
        };
        // Placeholder date/popularity: read data-date or fallback to 0
        const getDate = card => {
            const d = card.getAttribute('data-date');
            if (d) return new Date(d).getTime() || 0;
            return 0;
        };

        let sorted = cards.slice();
        switch (key) {
            case 'az':
                sorted.sort((a, b) => getTitle(a).localeCompare(getTitle(b)));
                break;
            case 'za':
                sorted.sort((a, b) => getTitle(b).localeCompare(getTitle(a)));
                break;
            case 'price-asc':
                sorted.sort((a, b) => getPrice(a) - getPrice(b));
                break;
            case 'price-desc':
                sorted.sort((a, b) => getPrice(b) - getPrice(a));
                break;
            case 'date-old':
                sorted.sort((a, b) => getDate(a) - getDate(b));
                break;
            case 'date-new':
                sorted.sort((a, b) => getDate(b) - getDate(a));
                break;
            case 'best':
            case 'featured':
            default:
                // leave as-is (original document order)
                sorted = cards;
                break;
        }

        // Re-append elements in new order
        sorted.forEach(card => grid.appendChild(card));
    }

    // CATEGORY dropdown (BOOKS)
    const categoryDropdown = document.querySelector('.category-dropdown');
    if (categoryDropdown) {
        const catBtn = categoryDropdown.querySelector('.category-btn');
        const catMenu = categoryDropdown.querySelector('.category-menu');

        const openCat = () => {
            categoryDropdown.classList.add('open');
            catBtn.setAttribute('aria-expanded', 'true');
            catMenu.setAttribute('aria-hidden', 'false');
        };

        const closeCat = () => {
            categoryDropdown.classList.remove('open');
            catBtn.setAttribute('aria-expanded', 'false');
            catMenu.setAttribute('aria-hidden', 'true');
        };

        catBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (categoryDropdown.classList.contains('open')) closeCat(); else openCat();
        });

        catMenu.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', function (e) {
                e.stopPropagation();
                const cat = this.getAttribute('data-cat');
                const label = this.textContent.trim();
                catBtn.childNodes[0].nodeValue = label + ' ';
                closeCat();
                console.log('Category selected:', cat);
            });
        });

        document.addEventListener('click', function (e) {
            if (!categoryDropdown.contains(e.target)) closeCat();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeCat();
        });
    }

});
