function getTotalHeight(element) {
  var style = window.getComputedStyle(element);

  var height = element.clientHeight; // 基础高度（包括padding但不包括border和horizontal scrollbar）
  var borderTopWidth = parseFloat(style.borderTopWidth);
  var borderBottomWidth = parseFloat(style.borderBottomWidth);
  var marginTop = parseFloat(style.marginTop);
  var marginBottom = parseFloat(style.marginBottom);

  // 如果box-sizing为content-box，则需要加上border的值
  if (style.boxSizing === "content-box") {
    height += borderTopWidth + borderBottomWidth;
  }

  // 总高度包括margin的值
  var totalHeight = height + marginTop + marginBottom;
  return totalHeight;
}

function setHeightWithoutAnimation(element, height) {
  // 保存原来的 transition 属性
  const originalTransition = element.style.transition;

  // 禁用动画
  element.style.transition = "none";

  // 设置高度
  element.style.height = height;

  // 强制浏览器立即应用上面的样式更改
  void element.offsetHeight;

  // 恢复原来的 transition 属性
  element.style.transition = originalTransition;
}

document.addEventListener("DOMContentLoaded", function (event) {
  var mydetailsElements = document.querySelectorAll("mydetails");
  // 获取所有<mydetails>标签

  // 为每个<mydetails>标签处理子元素
  mydetailsElements.forEach((mydetails) => {
    // 为mydetails添加“notOpened”属性
    mydetails.setAttribute("hasNotOpened", "hasNotOpened");

    ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((tag, index) => {
      // 获取特定标签的所有实例
      var headers = mydetails.getElementsByTagName(tag);
      var i = headers.length;
      while (i--) {
        var header = headers[i];
        // 创建新的自定义标签元素
        var customTag = `my${tag}`;
        var customElement = document.createElement(customTag);
        // 复制原来标签的所有子节点到新的自定义标签
        while (header.firstChild) {
          customElement.appendChild(header.firstChild);
        }
        // 替换标签
        header.parentNode.replaceChild(customElement, header);
      }
    });
    console.log("[DEBUG] Finished the element replacement.");
  });

  // // When scroll to the mydetails element, add ".disable-lazyload-mathjax" class to it.
  // mydetailsElements.forEach(function (mydetails) {
  //   var observer = new IntersectionObserver(
  //     function (entries) {
  //       entries.forEach(function (entry) {
  //         if (entry.isIntersecting) {
  //           // 为所有子类添加 “.disable-lazyload-mathjax” 类
  //           mydetails.querySelectorAll("*").forEach((element) => {
  //             element.classList.add("disable-lazyload-mathjax");
  //           });
  //           observer.unobserve(entry.target);
  //         }
  //       });
  //     },
  //     {
  //       rootMargin: "0px 0px 200% 0px",
  //     }
  //   );
  //   observer.observe(mydetails);
  // });

  mydetailsElements.forEach(function (mydetails) {
    // 初始化内容高度为0
    let summary = mydetails.querySelector("summary");
    if (!summary) {
      summary = document.createElement("summary");
      summary.textContent = "默认摘要";
      mydetails.prepend(summary);
    }
    mydetails.style.height = getTotalHeight(summary) + "px";
    // 观察summary元素的变化
    function adjustMyDetailsSize(summary, mydetails) {
      let isOpen = mydetails.hasAttribute("open");
      if (isOpen) {
        setHeightWithoutAnimation(mydetails, mydetails.scrollHeight + "px");
      } else {
        setHeightWithoutAnimation(mydetails, getTotalHeight(summary) + "px");
      }
    }
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        adjustMyDetailsSize(entry.target, mydetails);
      }
    });
    resizeObserver.observe(summary);
    summary.addEventListener("click", function () {
      let isOpen = mydetails.hasAttribute("open");
      if (isOpen) {
        mydetails.removeAttribute("open");
        mydetails.style.height = getTotalHeight(summary) + "px";
      } else {
        mydetails.setAttribute("open", "open");
        mydetails.style.height = mydetails.scrollHeight + "px";
        // 需要等待内部的mathjax公式渲染完成后再次调整高度
        // if (mydetails.hasAttribute("hasNotOpened")) {
        //   mydetails.removeAttribute("hasNotOpened");
        //   setTimeout(function () {
        //     let isOpen = mydetails.hasAttribute("open");
        //     if (isOpen) {
        //       mydetails.style.height = mydetails.scrollHeight + "px";
        //     } else {
        //       mydetails.style.height = getTotalHeight(summary) + "px";
        //     }
        //   }, 300);
        // }
      }
    });
  });
});
