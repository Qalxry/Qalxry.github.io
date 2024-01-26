const extend_features = document.extend_features;

class CodeFont {
    constructor() {
        this.configs = extend_features.code_font;
        this.status = false;
    }
    update() {
        // console.log('[Code Font] Update');
        if (this.status === false && this.configs.enable === true) {
            this.code_blocks.forEach((item) => {
                item.style.fontFamily = this.configs.font_family;
                item.style.fontWeight = this.configs.font_weight;
                item.style.fontSize = this.configs.font_size;
            });
            this.status = true;
        } else if (this.status === true && this.configs.enable === false) {
            this.code_blocks.forEach((item) => {
                item.style.fontFamily = this.default_font_family;
                item.style.fontWeight = this.default_font_weight;
                item.style.fontSize = this.default_font_size;
            });
            this.status = false;
        } else if (this.status === false && this.configs.enable === false) {
            // do nothing
        } else {
            this.code_blocks.forEach((item) => {
                item.style.fontFamily = this.configs.font_family;
                item.style.fontWeight = this.configs.font_weight;
                item.style.fontSize = this.configs.font_size;
            });
        }
    }
    observer() {
        // document.extend_features.code_font = new Proxy(document.extend_features.code_font, {
        //     set: (target, key, value) => {
        //         console.log(`[Code Font] Set ${target}.${key} to ${value}`);
        //         target[key] = value;
        //         this.update();
        //         return true;
        //     },
        // });
        document.extend_features_signal.code_font = new Proxy(document.extend_features_signal.code_font, {
            set: (target, key, value) => {
                console.log(`[Code Font] Set ${target}.${key} to ${value}`);
                target[key] = value;
                this.update();
                return true;
            },
        });
    }
    begin() {
        this.code_blocks = document.querySelectorAll("code");
        console.log("[Code Font] Begin");
        if (this.code_blocks.length === 0) {
            console.log("[Code Font] Code blocks not found.");
            return;
        }
        this.default_font_family = document.querySelector("code").style.fontFamily;
        this.default_font_weight = document.querySelector("code").style.fontWeight;
        this.default_font_size = document.querySelector("code").style.fontSize;
        this.update();
        this.observer();
    }
}


class FixedBackground {
    constructor() {
        this.configs = extend_features.fixed_background;
        this.bg_img = "url()";
        this.maskedElems = {};
        // this.maskedElems = {
        //      "selector": {
        //          "enable": true,
        //          "wrapper": [wrapper],
        //          "mask": [mask],
        //          "mask_bg_color": mask_bg_color
        //          "priority": 0
        //      }
        // }
    }
    init() {
        /*
            We have :
            <div id="banner">
                ...
                    <div class="mask">
                        <div class="banner-text"></div>
                    </div>
                ...
            </div>
            in the beginning of the body.
            This is the banner.
        */
        this.maskedElems[".banner-text"] = {
            enable: true,
            wrapper: [document.querySelector("#banner")],
            mask: [document.querySelector(".mask.flex-center")],
            mask_bg_color: document.querySelector(".mask.flex-center").style.backgroundColor || "rgba(0,0,0,0)",
            priority: 0,
        };
        this.bg_img = document.querySelector("#banner").style.backgroundImage;
        /*
            We create this :
            <div id="web_bg_wrapper">
                <div id="web_bg_mask">
                    <div id="web_bg"></div>
                </div>
            </div>
            in the beginning of the body.
            Just a background.
            And maybe the #web_bg tag is not exist in the config mask list,
            so we need to create it manually.
        */
        let web_bg = document.createElement("div");
        web_bg.id = "web_bg";
        web_bg.setAttribute(
            "style", `
            display: none;
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: -1;
        `);
        document.body.insertBefore(web_bg, document.body.firstChild);
        this.maskedElems["#web_bg"] = {
            enable: true,
            wrapper: [this.create_wrapper(web_bg)],
            mask: [this.create_mask(web_bg)],
            mask_bg_color: "rgba(0,0,0,0)",
            priority: 0,
        };
        this.maskedElems["#web_bg"].wrapper[0].style.position = "fixed";
        /* 
            We create this :
            <div id="XXX_wrapper">
                <div id="XXX_bg_mask">
                    <div prop="XXX"></div>
                </div>
            </div>
        */
        this.create();
    }
    parse_bg_color(style) {
        // 匹配 background-color: rgba(0,0,0,0);
        // let reg = /background-color: *rgba\([0-9]+,[0-9]+,[0-9]+,[0-9.]+\);/g;
        // let bg_color = "";
        // let match = reg.exec(style);
        // if (match) {
        //     bg_color = match[0];
        //     return bg_color;
        // }
        // return null;
        let bg_color = style.substring(
            style.indexOf('rgba', style.indexOf("background-color")),
            style.indexOf(')', style.indexOf("background-color")) + 1
        );
        if (bg_color == -1) {
            return null;
        }
        return bg_color
    }
    parse_item_name(item) {
        // id class tag
        let item_name = "";
        if (item.id) {
            item_name = item.id;
        } else if (item.class) {
            item_name = item.class;
        } else if (item.tag) {
            item_name = item.tag;
        }
        return item_name;
    }
    create_wrapper(itemElem) {
        let wrapper = document.createElement("div");
        wrapper.id = this.parse_item_name(itemElem) + "_wrapper";
        wrapper.setAttribute("style", `
            border-radius: 0;
            background-image: ${this.bg_img || "url()"};
            background-color: rgba(0,0,0,0);
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            width: 100%;
            height: 100%;
        `);
        itemElem.parentNode.replaceChild(wrapper, itemElem);
        wrapper.appendChild(itemElem);
        return wrapper;
    }
    create_mask(itemElem) {
        let mask = document.createElement("div");
        mask.id = this.parse_item_name(itemElem) + "_mask";
        mask.setAttribute("style", `
            border-radius: 0;
            background-color: rgba(0,0,0,0);
            width: 100%;
            height: 100%;
        `);
        itemElem.parentNode.replaceChild(mask, itemElem);
        mask.appendChild(itemElem);
        return mask;
    }
    create() {
        this.configs.mask.list.forEach((item) => {
            if (this.maskedElems.hasOwnProperty(item.selector)) {
                return;
            }
            console.log(`[Fixed Background] Create ${item.selector}`);
            this.maskedElems[item.selector] = {
                enable: false,
                wrapper: [],
                mask: [],
                mask_bg_color: "rgba(0,0,0,0)",
                priority: 0,
            };
            let itemElements = document.querySelectorAll(item.selector); // 选择所有要包裹的元素
            itemElements.forEach((itemElem) => {
                let item_wrapper = this.create_wrapper(itemElem);
                let item_mask = this.create_mask(itemElem);
                this.maskedElems[item.selector].wrapper.push(item_wrapper);
                this.maskedElems[item.selector].mask.push(item_mask);
            });
        });
    }
    hidden(item_selector) {
        this.maskedElems[item_selector].enable = false;
        this.maskedElems[item_selector].wrapper.forEach((item) => {
            item.style.backgroundImage = "url()";
        });
        this.maskedElems[item_selector].mask.forEach((item) => {
            item.style.backgroundColor = "rgba(0,0,0,0)";
        });
    }
    show(item_selector) {
        this.maskedElems[item_selector].enable = true;
        this.maskedElems[item_selector].wrapper.forEach((item) => {
            item.style.backgroundImage = this.bg_img;
        });
        this.maskedElems[item_selector].mask.forEach((item) => {
            item.style.backgroundColor = this.maskedElems[item_selector].mask_bg_color;
        });
    }
    apply() {
        // 将config中mask的style配置到[mask]上，但先隐藏所有的mask（设置为透明）
        // 记录mask的背景色到[mask_bg_color]上，可供后续决定是否显示
        this.configs.mask.list.forEach((item) => {
            console.log(`[Fixed Background] Apply ${item.selector}`);
            this.maskedElems[item.selector].enable = item.enable;
            this.maskedElems[item.selector].mask_bg_color = this.parse_bg_color(item.style) || "rgba(0,0,0,0)";
            this.maskedElems[item.selector].priority = item.priority;
            for (let i = 0; i < this.maskedElems[item.selector].wrapper.length; i++) {
                this.maskedElems[item.selector].mask[i].setAttribute("style", `
                    border-radius: 0;
                    width: 100%;
                    height: 100%;
                    ${item.style}
                    background-color: rgba(0,0,0,0);
                `);
                this.maskedElems[item.selector].wrapper[i].style.borderRadius = this.maskedElems[item.selector].mask[i].style.borderRadius;
            }
        });
        if (this.configs.enable === false) {
            for (const item_selector in this.maskedElems) {
                this.maskedElems[item_selector].enable = (item_selector === '.banner-text');
            }
        }
        else {
            for (const item_selector in this.maskedElems) {
                if (item_selector === '.banner-text') {
                    this.maskedElems[item_selector].enable = false;
                }
                else if (item_selector === '#web_bg') {
                    this.maskedElems[item_selector].enable = true;
                }
                else {
                    this.maskedElems[item_selector].enable = this.configs.mask.enable && this.maskedElems[item_selector].enable
                }
            }
        }
    }
    update() {
        console.log(`[Fixed Background] Apply this config: ${JSON.stringify(this.configs, null, 2)}`);
        this.create();
        this.apply();
        for (const item_selector in this.maskedElems) {
            if (this.maskedElems.hasOwnProperty(item_selector)) {
                if (this.maskedElems[item_selector].enable) {
                    this.show(item_selector);
                }
                else {
                    this.hidden(item_selector);
                }
            }
        }
    }
    observer() {
        // document.extend_features.fixed_background = new Proxy(
        //     document.extend_features.fixed_background, {
        //     set: (target, key, value) => {
        //         console.log(`[Fix Background] Set ${target}.${key} to ${value}.`);
        //         target[key] = value;
        //         this.update();
        //         return true;
        //     }
        // });
        document.extend_features_signal.fixed_background = new Proxy(
            document.extend_features_signal.fixed_background, {
            set: (target, key, value) => {
                console.log(`[Fix Background] Set ${target}.${key} to ${value}.`);
                target[key] = value;
                this.update();
                return true;
            }
        });
    }
    begin() {
        this.init();
        this.update();
        this.observer();
    }
}

class ExtendFeatures {
    constructor() {
        this.configs = extend_features;
        this.status = extend_features.enable;
        this.features = {
            code_font: new CodeFont(),
            fixed_background: new FixedBackground(),
        };
        this.features_status = {};
        document.extend_features_signal = {};
        for (const feature_name in this.features) {
            if (this.features.hasOwnProperty(feature_name)) {
                document.extend_features_signal[feature_name] = {changed: false};
            }
        }
        document.extend_features_signal.enable = {changed: false};
    } 
    begin() {
        for (const feature_name in this.features) {
            if (this.features.hasOwnProperty(feature_name)) {
                this.features[feature_name].begin();
            }
        }
        this.observer();
        console.log("[Extend Features Manager] Begin.");
    }
    observer() {
        // document.extend_features = new Proxy(document.extend_features, {
        //     set: (target, key, value) => {
        //         console.log(
        //             `[Extend Features Manager] Set ${target}.${key} to ${value}.`
        //         );
        //         target[key] = value;
        //         this.update();
        //         return true;
        //     },
        // });
        document.extend_features_signal.enable = new Proxy(document.extend_features_signal.enable, {
            set: (target, key, value) => {
                console.log(
                    `[Extend Features Manager] Set ${target}.${key} to ${value}.`
                );
                target[key] = value;
                return true;
            },
        });
    }
}

const extend_features_manager = new ExtendFeatures();
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
        extend_features_manager.begin();
    });
} else {
    extend_features_manager.begin();
}
