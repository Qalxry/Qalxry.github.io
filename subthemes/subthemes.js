function setLS(k, v) {
    try {
        localStorage.setItem(k, v);
    } catch (e) {
        console.log(`[SubThemes] Failed to set localStorage: ${k} = ${v}`);
    }
}

function removeLS(k) {
    try {
        localStorage.removeItem(k);
    } catch (e) {
        console.log(`[SubThemes] Failed to remove localStorage: ${k}`);
    }
}

function getLS(k) {
    try {
        return localStorage.getItem(k);
    } catch (e) {
        console.log(`[SubThemes] Failed to get localStorage: ${k}`);
        return null;
    }
}

(function () {
    let root = undefined;
    const NONE_SUBTHEME = "none";
    const SUBTHEMES_LS_KEY = "SUBTHEMES_LS_KEY";

    function indexOfSubTheme(subtheme_name) {
        if (subtheme_name === null) return -1;
        for (let i = 0; i < document.subthemes.list.length; i++) {
            if (document.subthemes.list[i].name === subtheme_name) {
                return i;
            }
        }
        return -1;
    }

    function initSubTheme() {
        let subtheme = getLS(SUBTHEMES_LS_KEY) || document.subthemes.default;
        let subtheme_index = indexOfSubTheme(subtheme);
        if (subtheme_index === -1) {
            root.removeAttribute("subtheme");
        }
        else {
            root.setAttribute("subtheme", document.subthemes.list[subtheme_index].name);
            overwriteThemeConfig(document.subthemes.list[subtheme_index].name);
        }
    }

    // ------------------------------------------------
    // @function toggleSubTheme     - 切换主题
    // @param {string} nextSubtheme - 下一个主题的名称
    // @return void - 无返回值
    // @description
    //      未指定 nextSubtheme，则默认切换到下一个主题
    //      指定 nextSubtheme，则切换到指定主题
    //      若指定的主题不存在，则不切换，并抛出异常
    // ------------------------------------------------
    function toggleSubTheme(nextSubtheme = null) {
        let nowSubtheme = root.getAttribute("subtheme") || getLS(SUBTHEMES_LS_KEY) || document.subthemes.default || NONE_SUBTHEME;
        let nowSubtheme_index = indexOfSubTheme(nowSubtheme);
        let nextSubtheme_index = -1;
        if (nowSubtheme_index === -1) {
            throw new Error(`[SubThemes] Now subtheme name '${nowSubtheme}' is invalid.`);
        }
        if (nextSubtheme !== null) {
            nextSubtheme_index = indexOfSubTheme(nextSubtheme);
            if (nextSubtheme_index === -1) {
                throw new Error(`[SubThemes] The specified subtheme name '${nowSubtheme}' is invalid`);
            }
        }
        else {
            nextSubtheme_index = (nowSubtheme_index + 1) % document.subthemes.list.length;
        }
        root.setAttribute("subtheme", document.subthemes.list[nextSubtheme_index].name);
        setLS(SUBTHEMES_LS_KEY, document.subthemes.list[nextSubtheme_index].name);
        overwriteThemeConfig(document.subthemes.list[nextSubtheme_index].name);
    }

    function addSubThemeToggleBtn() {
        //  为导航栏添加theme-icon
        let nav = document.querySelector("#navbarSupportedContent");
        let nav_ul = nav.querySelector("ul");
        let nav_li = document.createElement("li");
        nav_li.innerHTML = `
            <li class="nav-item" id="theme-toggle-btn">
                <a id="theme-btn-a" class="nav-link" target="_self" href="javascript:;" aria-label="theme">
                    <svg t="1706015278189" class="theme-toggle-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8372" width="20" height="20" style="margin-bottom: 2px;"><path class="icon-border" d="M725.333333 85.333333H298.666667a213.333333 213.333333 0 0 0-213.333334 213.333334v426.666666a213.333333 213.333333 0 0 0 213.333334 213.333334h426.666666a213.333333 213.333333 0 0 0 213.333334-213.333334V298.666667a213.333333 213.333333 0 0 0-213.333334-213.333334z m128 640a128 128 0 0 1-128 128H298.666667a128 128 0 0 1-128-128V298.666667a128 128 0 0 1 128-128h426.666666a128 128 0 0 1 128 128v426.666666z" p-id="8373"></path><path class="icon-inner" d="M367.786667 603.562667a46.933333 46.933333 0 1 0 68.096 64.597333l234.837333-247.68a46.933333 46.933333 0 1 0-68.096-64.597333l-234.88 247.68z m158.378666-219.264a46.933333 46.933333 0 1 0-68.138666-64.554667L325.973333 459.050667a46.933333 46.933333 0 0 0 68.138667 64.597333l132.096-139.349333z m163.754667 199.381333a46.933333 46.933333 0 1 0-68.138667-64.597333l-110.08 116.096a46.933333 46.933333 0 1 0 68.138667 64.597333l110.08-116.096z" p-id="8374"></path></svg>
                </a>
            </li>
         `;
        nav_li.addEventListener("click", function () {
            toggleSubTheme();
        });
        nav_ul.appendChild(nav_li);
    }

    function overwriteThemeConfig(newThemeName) {
        // throw new Error("[SubThemes] Overwriting theme config is not implemented yet.");
        let newConfig = document.subthemes_config[newThemeName].extend_features;
        let baseConfig = JSON.parse(JSON.stringify(document.subthemes_config[NONE_SUBTHEME].extend_features));
        let pageConfig = document.extend_features;
        console.log(`[SubThemes] Basic theme config '${NONE_SUBTHEME}' (Only Extend) : ${JSON.stringify(baseConfig, null, 2)}`);
        
        function isObject(item) {
            return (item && typeof item === 'object' && !Array.isArray(item));
        }
        function mergeFeatures(source, target) {
            for (let key in target) {
                if (target.hasOwnProperty(key)) {
                    if (isObject(target[key])) {
                        if (!source[key]) source[key] = {};
                        mergeFeatures(source[key], target[key]);
                    } else if (Array.isArray(target[key])) {
                        source[key] = [...target[key]];
                    } else {
                        source[key] = target[key];
                    }
                }
            }
        }
        
        if (newConfig === undefined) {
            console.info(`[SubThemes] No extend features found for theme '${newThemeName}'`);
        }
        else if (newThemeName === NONE_SUBTHEME) {
            console.info(`[SubThemes] Go back to the basic theme '${NONE_SUBTHEME}'`);
        } 
        else {
            console.log(`[SubThemes] New theme config '${newThemeName}' (Only Extend) : ${JSON.stringify(newConfig, null, 2)}`);
            mergeFeatures(baseConfig, newConfig);
        }
        
        mergeFeatures(pageConfig, baseConfig);

        console.log(`[SubThemes] The merge result (Page Config) of '${newThemeName}' (Only Extend) : ${JSON.stringify(pageConfig, null, 2)}`);

        // 重写 document.theme_config
        // ... (TODO)
    }
    
    if (document.readyState === "loading") {
        // 此时加载尚未完成
        document.addEventListener("DOMContentLoaded", function () {
            root = document.querySelector(":root");
            initSubTheme();
            addSubThemeToggleBtn();
        });
    } else {
        root = document.querySelector(":root");
        initSubTheme();
        addSubThemeToggleBtn();
    }
})();