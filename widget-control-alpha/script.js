
define(['jquery'], function($){
    var list = [];
    var editingId = null;
    var widgetContext = null; // will hold 'this' from Kommo callbacks

    function renderList(){
        var html="";
        list.forEach(function(e,i){
            html += "<div class='list-item'>"+
                        e.name+
                        "<div>"+
                            "<button class='btn' onclick='newAdjust_edit("+i+")'>Editar</button>"+
                            "<button class='btn' onclick='removeAdj("+i+")'>Excluir</button>"+
                        "</div>"+
                    "</div>";
        });
        var el = document.getElementById("adjustList");
        if(el) el.innerHTML = html;
    }

    function _newAdjust(){
        editingId=null;
        var s1 = document.getElementById("screen1");
        var s2 = document.getElementById("screen2");
        if(s1) s1.style.display="none";
        if(s2) s2.style.display="block";
        var adjName = document.getElementById("adjName");
        var cssCode = document.getElementById("cssCode");
        var jsCode = document.getElementById("jsCode");
        if(adjName) adjName.value="";
        if(cssCode) cssCode.value="";
        if(jsCode) jsCode.value="";
    }

    function _edit(i){
        editingId=i;
        var s1 = document.getElementById("screen1");
        var s2 = document.getElementById("screen2");
        if(s1) s1.style.display="none";
        if(s2) s2.style.display="block";

        var adjName = document.getElementById("adjName");
        var cssCode = document.getElementById("cssCode");
        var jsCode = document.getElementById("jsCode");
        if(list[i]){
            if(adjName) adjName.value = list[i].name || '';
            if(cssCode) cssCode.value = list[i].css || '';
            if(jsCode) jsCode.value = list[i].js || '';
        }
    }

    function removeAdj(i){
        list.splice(i,1);
        saveToStorage();
        renderList();
    }

    function cancelEdit(){
        var s1 = document.getElementById("screen1");
        var s2 = document.getElementById("screen2");
        if(s1) s1.style.display="block";
        if(s2) s2.style.display="none";
    }

    function saveEdit(){
        var obj = {
            name: (document.getElementById("adjName") && document.getElementById("adjName").value) || '',
            css: (document.getElementById("cssCode") && document.getElementById("cssCode").value) || '',
            js: (document.getElementById("jsCode") && document.getElementById("jsCode").value) || ''
        };
        if(editingId===null) list.push(obj);
        else list[editingId]=obj;
        saveToStorage();
        cancelEdit();
        renderList();
    }

    function saveToStorage(){
        try{
            localStorage.setItem('alpha_dc_adjusts', JSON.stringify(list));
        }catch(e){
            console.warn('Não foi possível salvar em localStorage:', e);
        }
    }

    function loadFromStorage(){
        try{
            var raw = localStorage.getItem('alpha_dc_adjusts');
            if(raw){
                list = JSON.parse(raw) || [];
            }else{
                list = [];
            }
        }catch(e){
            list = [];
            console.warn('Erro ao carregar localStorage:', e);
        }
    }

    // Expose functions to global scope to keep inline onclick handlers working (Option A)
    window.newAdjust = function(){ _newAdjust(); };
    // Use different name for edit to avoid name clash with module-scope edit
    window.newAdjust_edit = function(i){ _edit(i); };
    window.removeAdj = function(i){ removeAdj(i); };
    window.cancelEdit = function(){ cancelEdit(); };
    window.saveEdit = function(){ saveEdit(); };

    // Public widget callbacks
    return {
        init: function(){ /* inicialização, executado uma vez */ },
        render: function(){
            // save context
            widgetContext = this;
            // render template (index.html from manifest templates)
            this.render_template({ body: './index.html' });
            // after template is rendered into DOM, restore UI state and hooks
            // using setTimeout to wait template injection
            setTimeout(function(){
                // Load stored adjusts and render list
                loadFromStorage();
                renderList();
                // Ensure buttons that were in the original HTML still call the global functions
                // (they already use onclick inline so no extra binding required)
            }, 50);
        },
        bind_actions: function(){
            // Called when actions should be bound (optional for settings page)
            // We keep this minimal because we're exposing globals and using inline onclicks
            // but if needed, we could attach more sophisticated handlers here.
        },
        settings: function(){ /* when widget settings are requested */ },
        dpSettings: function(){ /* delivery point settings if used */ }
    };
});
