define(['jquery'], function ($) {
    return function Widget() {
        const self = this;

        self.callbacks = {
            init: function () {
                const w = self.get_settings();

                const blocked = (w.blocked_users || "").split(",").map(id => id.trim());
                const currentUser = AMOCRM.data.current_user.id;

                if (blocked.includes(String(currentUser))) {
                    const hideMenu = () => {
                        $("[data-item='dashboard']").hide();
                        $(".menu-item__whatsapp").hide();
                    };

                    hideMenu();
                    setTimeout(hideMenu, 1500);
                    setInterval(hideMenu, 3000);
                }

                if (w.custom_css) {
                    $("<style>").text(w.custom_css).appendTo("head");
                }

                if (w.custom_js) {
                    try {
                        eval(w.custom_js);
                    } catch (err) {
                        console.error("Erro no JS customizado", err);
                    }
                }

                return true;
            },
            render: function () { return true; },
            settings: function () { return true; }
        };

        return self;
    };
});
