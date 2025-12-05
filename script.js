AmoWidget.init(async () => {
    // Funções de storage
    async function getStorage(key) {
        return await AmoWidget.storage.get(key);
    }
    async function setStorage(key, value) {
        return await AmoWidget.storage.set(key, value);
    }

    // Bloqueio de menus
    function blockMenus() {
        const interval = setInterval(() => {
            const menu = document.querySelector('.sidebar__menu');
            if (!menu) return;

            const items = menu.querySelectorAll('li');

            items.forEach(item => {
                const text = item.innerText.toLowerCase();

                if (text.includes("início") || text.includes("inicio")) {
                    item.style.display = "none";
                }

                if (text.includes("whatsapp")) {
                    item.style.display = "none";
                }
            });

            clearInterval(interval);
        }, 800);
    }

    // Aplicação de CSS / JS personalizados
    function applyCustomCode(css, js) {
        // CSS
        let cssTag = document.getElementById("alphaCustomCSS");
        if (!cssTag) {
            cssTag = document.createElement("style");
            cssTag.id = "alphaCustomCSS";
            document.head.appendChild(cssTag);
        }
        cssTag.innerHTML = css || "";

        // JS
        let jsTag = document.getElementById("alphaCustomJS");
        if (!jsTag) {
            jsTag = document.createElement("script");
            jsTag.id = "alphaCustomJS";
            document.body.appendChild(jsTag);
        }
        jsTag.innerHTML = js || "";
    }

    // Carregar valores salvos
    const savedCss = await getStorage("alpha_css");
    const savedJs = await getStorage("alpha_js");

    if (savedCss || savedJs) {
        applyCustomCode(savedCss, savedJs);
    }

    // Bloquear menus
    blockMenus();

    // Setup do editor se estiver no painel de configurações
    if (document.getElementById("customCss")) {
        document.getElementById("customCss").value = savedCss || "";
        document.getElementById("customJs").value = savedJs || "";

        document.getElementById("saveBtn").onclick = async () => {
            const css = document.getElementById("customCss").value;
            const js = document.getElementById("customJs").value;
            await setStorage("alpha_css", css);
            await setStorage("alpha_js", js);
            alert("Configurações salvas!");
        };

        document.getElementById("applyBtn").onclick = () => {
            const css = document.getElementById("customCss").value;
            const js = document.getElementById("customJs").value;
            applyCustomCode(css, js);
            alert("Aplicado!");
        };
    }
});
