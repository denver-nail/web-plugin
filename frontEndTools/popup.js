// 标签页切换功能
document.getElementById("pathTab").addEventListener("click", function () {
  document.getElementById("pathPanel").classList.remove("hidden");
  document.getElementById("namingPanel").classList.add("hidden");
  this.classList.add("active");
  document.getElementById("namingTab").classList.remove("active");
});

document.getElementById("namingTab").addEventListener("click", function () {
  document.getElementById("namingPanel").classList.remove("hidden");
  document.getElementById("pathPanel").classList.add("hidden");
  this.classList.add("active");
  document.getElementById("pathTab").classList.remove("active");
});

// 路径转换功能
document
  .getElementById("convertPathBtn")
  .addEventListener("click", function () {
    const input = document.getElementById("pathInput").value;
    const output = input.replace(/\\/g, "/");
    document.getElementById("pathOutput").value = output;

    // 添加动画效果
    const outputEl = document.getElementById("pathOutput");
    outputEl.classList.add("success-highlight");
    setTimeout(() => {
      outputEl.classList.remove("success-highlight");
    }, 500);
  });

// 复制路径结果
document.getElementById("copyPathBtn").addEventListener("click", function () {
  const output = document.getElementById("pathOutput");
  output.select();
  document.execCommand("copy");

  // 显示复制成功提示
  const status = document.getElementById("pathCopyStatus");
  status.style.opacity = "1";
  setTimeout(() => {
    status.style.opacity = "0";
  }, 2000);
});

// 命名转换功能
document
  .getElementById("convertNameBtn")
  .addEventListener("click", function () {
    const input = document.getElementById("nameInput").value;

    // 处理输入：移除特殊字符，分割为单词
    const words = input
      .replace(/[^\w\s]/gi, "") // 移除标点符号
      .replace(/\s+/g, " ") // 合并多个空格
      .trim() // 去除首尾空格
      .split(" ") // 分割为单词数组
      .filter((word) => word); // 过滤空字符串

    if (words.length === 0) return;

    // 转换为各种命名格式
    const camelCase =
      words[0].toLowerCase() +
      words
        .slice(1)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("");

    const pascalCase = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");

    const snakeCase = words.map((word) => word.toLowerCase()).join("_");
    const upperSnakeCase = snakeCase.toUpperCase();
    const kebabCase = words.map((word) => word.toLowerCase()).join("-");
    const underscoreCase = words.join("_");

    // 更新输出字段
    document.getElementById("camelCaseOutput").value = camelCase;
    document.getElementById("pascalCaseOutput").value = pascalCase;
    document.getElementById("snakeCaseOutput").value = snakeCase;
    document.getElementById("upperSnakeCaseOutput").value = upperSnakeCase;
    document.getElementById("kebabCaseOutput").value = kebabCase;
    document.getElementById("underscoreOutput").value = underscoreCase;

    // 添加动画效果
    const outputs = document.querySelectorAll(
      '#namingPanel input[type="text"]'
    );
    outputs.forEach((output) => {
      output.classList.add("success-highlight");
    });

    setTimeout(() => {
      outputs.forEach((output) => {
        output.classList.remove("success-highlight");
      });
    }, 500);
  });

// 命名转换结果复制功能
document.querySelectorAll(".inline-copy-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const targetId = this.getAttribute("data-target");
    const target = document.getElementById(targetId);
    target.select();
    document.execCommand("copy");

    // 显示复制成功反馈
    const originalIcon = this.innerHTML;
    this.innerHTML = '<i class="fa fa-check"></i>';
    this.classList.add("copy-success");

    setTimeout(() => {
      this.innerHTML = originalIcon;
      this.classList.remove("copy-success");
    }, 2000);
  });
});

// 输入框回车键触发转换
document.getElementById("pathInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    document.getElementById("convertPathBtn").click();
  }
});

document.getElementById("nameInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    document.getElementById("convertNameBtn").click();
  }
});
