document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("site-search");
    const input = document.getElementById("site-search-input");
    const results = document.getElementById("site-search-results");
    if (!form || !input || !results) return;

    const pages = [
        { title: "Home", href: "index.html" },
        { title: "Xbox", href: "xbox.html" },
        { title: "PlayStation", href: "playstation.html" },
        { title: "Nintendo", href: "nintendo.html" },
        { title: "Steam", href: "steam.html" },
        { title: "Store", href: "store.html" },
        { title: "Sources", href: "sources.html" },
        { title: "About Me", href: "about.html" },
        { title: "Contact", href: "contact.html" },
        { title: "Xbox — Article 1", href: "xbox-article-1.html" },
        { title: "Xbox — Article 2", href: "xbox-article-2.html" },
        { title: "Xbox — Article 3", href: "xbox-article-3.html" },
        { title: "PlayStation — Article 1", href: "playstation-article-1.html" },
        { title: "PlayStation — Article 2", href: "playstation-article-2.html" },
        { title: "PlayStation — Article 3", href: "playstation-article-3.html" },
        { title: "Nintendo — Article 1", href: "nintendo-article-1.html" },
        { title: "Nintendo — Article 2", href: "nintendo-article-2.html" },
        { title: "Nintendo — Article 3", href: "nintendo-article-3.html" },
        { title: "Steam — Article 1", href: "steam-article-1.html" },
        { title: "Steam — Article 2", href: "steam-article-2.html" },
        { title: "Steam — Article 3", href: "steam-article-3.html" }
    ];

    let pageIndexPromise;
    let searchNumber = 0;

    const showMessage = (message) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = message;
        results.replaceChildren(paragraph);
    };

    const loadPageIndex = () => {
        if (!pageIndexPromise) {
            pageIndexPromise = Promise.all(pages.map(async (page) => {
                const response = await fetch(page.href);
                if (!response.ok) throw new Error(`Could not load ${page.href}`);
                const html = await response.text();
                const parsed = new DOMParser().parseFromString(html, "text/html");
                parsed.querySelectorAll("script, style, nav, .site-nav-toggle, .site-nav-backdrop, .site-home-button").forEach((element) => element.remove());
                const content = (parsed.body.innerText || parsed.body.textContent || "").replace(/\s+/g, " ").trim();
                return { ...page, content, normalized: content.toLocaleLowerCase() };
            }));
        }
        return pageIndexPromise;
    };

    const makeExcerpt = (content, query) => {
        const lowerContent = content.toLocaleLowerCase();
        const firstWord = query.split(/\s+/).find(Boolean) || query;
        const matchAt = Math.max(0, lowerContent.indexOf(firstWord));
        const start = Math.max(0, matchAt - 55);
        const end = Math.min(content.length, matchAt + 130);
        return `${start > 0 ? "…" : ""}${content.slice(start, end)}${end < content.length ? "…" : ""}`;
    };

    const appendHighlightedText = (element, text, words) => {
        const escapedWords = [...new Set(words)]
            .sort((a, b) => b.length - a.length)
            .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        if (!escapedWords.length) {
            element.textContent = text;
            return;
        }

        const pattern = new RegExp(`(${escapedWords.join("|")})`, "gi");
        let lastIndex = 0;
        for (const match of text.matchAll(pattern)) {
            if (match.index > lastIndex) {
                element.append(document.createTextNode(text.slice(lastIndex, match.index)));
            }
            const highlight = document.createElement("strong");
            highlight.textContent = match[0];
            element.append(highlight);
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < text.length) {
            element.append(document.createTextNode(text.slice(lastIndex)));
        }
    };

    const renderResults = async () => {
        const query = input.value.trim().toLocaleLowerCase();
        const thisSearch = ++searchNumber;
        results.replaceChildren();
        if (!query) {
            results.hidden = true;
            return;
        }

        results.hidden = false;
        showMessage("Searching page text…");
        try {
            const indexedPages = await loadPageIndex();
            if (thisSearch !== searchNumber) return;
            const words = query.split(/\s+/).filter(Boolean);
            const matches = indexedPages.filter((page) => words.every((word) => page.normalized.includes(word)));
            results.replaceChildren();
            if (!matches.length) {
                showMessage(`No page text found for “${query}”.`);
                return;
            }

            const list = document.createElement("ul");
            matches.forEach((page) => {
                const item = document.createElement("li");
                const link = document.createElement("a");
                const excerpt = document.createElement("span");
                link.href = page.href;
                link.textContent = page.title;
                excerpt.className = "home-search-excerpt";
                appendHighlightedText(excerpt, makeExcerpt(page.content, query), words);
                item.append(link, excerpt);
                list.append(item);
            });
            results.append(list);
        } catch (error) {
            if (thisSearch !== searchNumber) return;
            showMessage("Page text search needs the site to be opened through a local web server or its hosted URL.");
        }
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        renderResults();
    });
    input.addEventListener("input", renderResults);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Escape") results.hidden = true;
    });
});
