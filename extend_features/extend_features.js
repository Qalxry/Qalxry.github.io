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
        }
        else if (this.status === true && this.configs.enable === false) {
            this.code_blocks.forEach((item) => {
                item.style.fontFamily = this.default_font_family;
                item.style.fontWeight = this.default_font_weight;
                item.style.fontSize = this.default_font_size;
            });
            this.status = false;
        }
        else if (this.status === false && this.configs.enable === false) {
            // do nothing
        }
        else {
            this.code_blocks.forEach((item) => {
                item.style.fontFamily = this.configs.font_family;
                item.style.fontWeight = this.configs.font_weight;
                item.style.fontSize = this.configs.font_size;
            });
        }
    }
    observer() {
        document.extend_features.code_font = new Proxy(document.extend_features.code_font, {
            set: (target, key, value) => {
                console.log(`[Code Font] Set ${target}.${key} to ${value}`);
                target[key] = value;
                this.update();
                return true;
            }
        });
    }
    begin() {
        this.code_blocks = document.querySelectorAll("code");
        console.log('[Code Font] Begin');
        if (this.code_blocks.length === 0) {
            console.log('[Code Font] Code blocks not found.');
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
        this.status = 'null'
        this.mask_list = [];
        this.wrapper_list = [];
        this.mask_bg_color_list = [];
    }
    hidden_web_bg() {
        this.web_bg.setAttribute("style", "background-image: url();");
        this.banner.setAttribute("style", `background-image: ${this.bg_img};`);
        this.banner_mask.setAttribute("style", `background-color: ${this.banner_mask_bg_color}`);
    }
    hidden_mask() {
        this.mask_bg_color_list = [];
        this.mask_list.forEach((item) => {
            this.mask_bg_color_list.push(item.style.backgroundColor || this.banner_mask_bg_color || "rgba(0,0,0,0)");
            item.setAttribute("style", "rgba(0,0,0,0)");
        });
        this.wrapper_list.forEach((item) => {
            item.setAttribute("style", "background-image: url();");
        });
    }
    show_web_bg() {
        this.web_bg.setAttribute("style", `background-image: ${this.bg_img};`);
        this.banner.setAttribute("style", "background-image: url();");
        this.banner_mask.setAttribute("style", "background-color: rgba(0,0,0,0);");
    }
    show_mask() {
        this.mask_list.forEach((item, index) => {
            item.setAttribute("style", `background-color: ${this.mask_bg_color_list[index]}`);
        });
        this.wrapper_list.forEach((item) => {
            item.setAttribute("style", `background-image: ${this.bg_img};`);
        });
    }
    create_web_bg() {
        this.banner = document.querySelector("#banner");
        this.banner_mask = this.banner.querySelector(".mask");
        this.bg_img = banner.style.backgroundImage;
        this.web_bg = document.createElement("div");
        this.web_bg.id = "web_bg";
        this.web_bg.setAttribute("style", `
            background-image: ${this.bg_img};
            background-color: rgba(0,0,0,0);
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: -1;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        `);
        this.web_bg_mask = document.createElement("div");
        this.web_bg_mask.id = "web_bg_mask";


        this.web_bg_mask.setAttribute("style", `
            ${() => {
                if (!this.configs.mask.enable) {
                    return `background-color: rgba(0,0,0,0);`;
                }
                this.configs.mask.list.forEach((item) => {
                    if (item.selector === "#web_bg") {
                        return item.style;
                    }
                });
                return `background-color: rgba(0,0,0,0);`;
            }}
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: -1;
        `);
        this.web_bg.appendChild(this.web_bg_mask);

        document.body.insertBefore(this.web_bg, document.body.firstChild);
        // 去除banner原本的mask和背景图
        this.banner_mask_bg_color = this.banner_mask.style.backgroundColor || "rgba(0,0,0,0)";
        this.banner_mask.setAttribute("style", "background-color:rgba(0,0,0,0)");
        this.banner.setAttribute("style", "background-image: url()");
    }
    create_mask() {
        this.configs.mask.list.forEach((item) => {
            let itemElements = document.querySelectorAll(item.selector); // 选择所有要包裹的元素
            // itemElem 是被包裹的元素其中的一个
            // item 是被包裹的元素的配置
            itemElements.forEach((itemElem) => {
                let wrapper = document.createElement("div");
                let mask = document.createElement("div");
                wrapper.id = itemElem.id + "_wrapper";
                mask.id = itemElem.id + "_mask";
                // 设置wrapper的样式，它用于提供背景图
                // 设置mask的样式
                // 计算被包裹元素的border-radius，防止外面的wrapper的背景图溢出
                if (itemElem.id == 'web_bg') {
                    mask.setAttribute("style", `
                        ${item.style}
                        width: 100%;
                        height: 100%;
                        border-radius: 0;
                    `);
                    wrapper.setAttribute(
                        "style", `
                        border-radius: ${mask.style.borderRadius || 0};
                        background-image: ${this.bg_img || 'url()'};
                        background-color: rgba(0,0,0,0);
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                        background-attachment: fixed;
                        position: fixed;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        border-radius: 0;
                    `);
                }
                else {
                    mask.setAttribute("style", `
                        width: 100%;
                        height: 100%;
                        ${item.style}
                    `);
                    wrapper.setAttribute(
                        "style", `
                        border-radius: ${mask.style.borderRadius || 0};
                        background-image: ${this.bg_img || 'url()'};
                        background-color: rgba(0,0,0,0);
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                        background-attachment: fixed;
                    `);
                }
                // 将itemElem的父元素替换为wrapper
                itemElem.parentNode.replaceChild(wrapper, itemElem);
                wrapper.appendChild(mask);
                mask.appendChild(itemElem);
                // 将wrapper的父元素替换为mask
                // 将mask的父元素替换为itemElem
                this.wrapper_list.push(wrapper);
                this.mask_list.push(mask);
            });
        });
    }
    update() {
        console.log('[Fix Background] Update');
        if (this.status === 'null' && this.configs.enable) {
            this.status = 'web_bg';
            this.create_web_bg();
            if (this.configs.mask.enable) {
                this.status = 'all';
                this.create_mask();
            }
        }
        else if (this.status === 'web_bg') {
            if (this.configs.enable && this.configs.mask.enable) {
                this.create_mask();
                this.status = 'all';
            }
            else {
                this.status = 'null';
                this.hidden_web_bg();
            }
        }
        else if (this.status === 'all') {
            if (!this.configs.enable) {
                this.status = 'hidden_all';
                this.hidden_mask();
                this.hidden_web_bg();
            }
            else if (!this.configs.mask.enable) {
                this.status = 'hidden_mask';
                this.hidden_mask();
            }
        }
        else if (this.status === 'hidden_all') {
            if (this.configs.enable) {
                this.status = 'web_bg';
                this.show_web_bg();
                if (this.configs.mask.enable) {
                    this.status = 'all';
                    this.show_mask();
                }
            }
        }
        else if (this.status === 'hidden_mask') {
            if (this.configs.enable) {
                if (this.configs.mask.enable) {
                    this.status = 'all';
                    this.show_mask();
                }
            }
            else {
                this.status = 'hidden_all';
                this.hidden_web_bg();
            }
        }
        else {
            console.log('[Fix Background] Error status: ' + this.status);
        }
    }
    observer() {
        document.extend_features.fixed_background = new Proxy(document.extend_features.fixed_background, {
            set: (target, key, value) => {
                console.log(`[Fix Background] Set ${target}.${key} to ${value}.`);
                target[key] = value;
                this.update();
                return true;
            }
        });
    }
    begin() {
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
            fixed_background: new FixedBackground()
        }
        this.features_status = {};
    }
    disable() {
        for (const feature in extend_features) {
            if (extend_features.hasOwnProperty(feature) &&
                typeof extend_features[feature] === 'object' &&
                feature !== 'enable') {
                this.features_status[feature] = extend_features[feature].enable;
                extend_features[feature].enable = false;
            }
        }
        extend_features.enable = false;
    }
    enable() {
        for (const feature in this.features_status) {
            if (this.features_status.hasOwnProperty(feature) &&
                extend_features.hasOwnProperty(feature)) {
                extend_features[feature].enable = this.features_status[feature];
            }
        }
        this.features_status = {};
        extend_features.enable = true;
    }
    update() {
        if (this.status === false && this.configs.enable === true) {
            this.enable();
            this.status = true;
        }
        else if (this.status === true && this.configs.enable === false) {
            this.disable();
            this.status = false;
        }
    }
    begin() {
        for (const feature in this.features) {
            if (this.features.hasOwnProperty(feature)) {
                this.features[feature].begin();
            }
        }
        if (this.configs.enable === false) {
            this.disable();
        }
        this.update();
        this.observer();
        console.log('[Extend Features Manager] Begin.');
    }
    observer() {
        document.extend_features = new Proxy(document.extend_features, {
            set: (target, key, value) => {
                console.log(`[Extend Features Manager] Set ${target}.${key} to ${value}.`);
                target[key] = value;
                this.update();
                return true;
            }
        });
    }
}

const extend_features_manager = new ExtendFeatures();
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
        extend_features_manager.begin();
    });
}
else {
    extend_features_manager.begin();
}
