document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".site-nav-toggle");
    const close = document.querySelector(".site-nav-close");
    const backdrop = document.querySelector(".site-nav-backdrop");
    const panel = document.querySelector(".site-nav-panel");
    if (!toggle || !close || !backdrop || !panel) return;

    const setOpen = (open) => {
        document.body.classList.toggle("site-nav-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        panel.setAttribute("aria-hidden", String(!open));
        if (open) close.focus();
        else toggle.focus();
    };

    toggle.addEventListener("click", () => setOpen(true));
    close.addEventListener("click", () => setOpen(false));
    backdrop.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && document.body.classList.contains("site-nav-open")) setOpen(false);
    });
});
