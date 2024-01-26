// 改为这种方式
function fixed_background() {
  let banner = document.querySelector("#banner");
  let banner_mask = banner.querySelector(".mask");
  let web_bg = document.querySelector("#web_bg");
  let web_bg_mask = web_bg.querySelector(".web_bg_mask");
  web_bg.setAttribute(
    "style",
    `background-image: ${banner.style.backgroundImage};
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;`
  );
  // 透明化原来的遮罩，把遮罩复制一个到web_bg里面(记得继承原来的样式，注意不要把它子元素也搞过来了)
  web_bg_mask.setAttribute(
    "style",
    `${banner_mask.getAttribute("style")};width:100%;height:100%;`
  );

  // // 步骤1: 选择要包裹的元素
  // var board = document.getElementById("board");
  // var wrapper = document.createElement("div");
  // wrapper.id = "board_wrapper"; // 可以给 wrapper 添加一个 ID 或者类
  // // 步骤2: 把 wrapper 插入到 board 的父元素中
  // board.parentNode.insertBefore(wrapper, board);
  // // 步骤3: 把 board 移动到 wrapper 中
  // wrapper.appendChild(board);
  // // 把原来的banner的背景图复制到board上面
  // wrapper.setAttribute(
  //   "style",
  //   `
  //   border-radius: 0.5rem;
  //   background-image: ${banner.style.backgroundImage};
  //   background-size: cover;
  //   background-position: center;
  //   background-repeat: no-repeat;
  //   background-attachment: fixed;
  // `
  // );

  banner.setAttribute("style", "background-image: url()");
  banner_mask.setAttribute("style", "background-color:rgba(0,0,0,0)");
}

