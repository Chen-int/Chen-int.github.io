// universe.js 星空+流星特效
window.addEventListener('load', function () {
  function dark() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    let w, h, starCount, ctx, speed = 0.05;
    const canvas = document.getElementById("universe");
    let firstLoad = true;
    const starColor = "180,184,240";
    const meteorColor = "226,225,224";
    const normalStar = "255,255,255";
    let stars = [];

    function resizeCanvas() {
      w = window.innerWidth;
      h = window.innerHeight;
      starCount = parseInt(0.216 * w);
      canvas.width = w;
      canvas.height = h;
    }

    function Star(isMeteor) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.r = Math.random() * 1.2;
      this.opacity = Math.random();
      this.giant = !Math.round(Math.random() * 9);
      this.meteor = !!isMeteor;
      this.dx = Math.random() * 2;
      this.dy = Math.random() * 2;
      this.fadingOut = false;
      this.do = 0.005 + Math.random() * 0.008;

      this.reset = function () {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.opacity = 0;
        this.fadingOut = false;
      };

      this.draw = function () {
        ctx.beginPath();
        if (this.giant) {
          ctx.fillStyle = `rgba(${starColor},${this.opacity})`;
          ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        } else if (this.meteor) {
          ctx.fillStyle = `rgba(${meteorColor},${this.opacity})`;
          ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI);
          // 流星拖尾
          for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(${meteorColor},${this.opacity - this.opacity / 20 * i})`;
            ctx.rect(this.x - this.dx / 4 * i, this.y - this.dy / 4 * i - 2, 2, 2);
          }
        } else {
          ctx.fillStyle = `rgba(${normalStar},${this.opacity})`;
          ctx.rect(this.x, this.y, this.r, this.r);
        }
        ctx.closePath();
        ctx.fill();
      };

      this.move = function () {
        this.x += this.dx;
        this.y += this.dy;
        if (!this.fadingOut) {
          this.opacity += this.do;
        } else {
          this.opacity -= this.do / 2;
          if (this.opacity < 0) {
            this.fadingOut = false;
            this.reset();
          }
        }
        // 流星飞出屏幕重置
        if ((this.x > w - w / 4 || this.y < 0) && !this.fadingOut) {
          this.fadingOut = true;
        }
      };
    }

    function initStars() {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star(false));
      }
      // 定时生成流星
      setInterval(() => {
        stars.push(new Star(true));
        setTimeout(() => {
          stars.splice(0, 1);
        }, 6000);
      }, 4000);
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < stars.length; i++) {
        stars[i].move();
        stars[i].draw();
      }
      window.requestAnimationFrame(animate);
    }

    resizeCanvas();
    ctx = canvas.getContext("2d");
    initStars();
    animate();
    window.addEventListener("resize", resizeCanvas);
  }
  // 判断是否开启深色模式才渲染星空（可选，推荐开启）
  function checkDarkMode() {
    if (document.documentElement.classList.contains('dark')) {
      if (!document.getElementById('universe')) return;
      dark();
    }
  }
  // 监听明暗切换
  checkDarkMode();
  const observer = new MutationObserver(checkDarkMode);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});
