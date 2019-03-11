class Scrap {
  constructor () {
    this.canvas = document.getElementsByTagName ('canvas')[0];
    this.offsetX = this.canvas.getBoundingClientRect ().left;
    this.offsetY = this.canvas.getBoundingClientRect ().top;
    this.ctx = this.canvas.getContext ('2d'); // 拿起画笔
    this.width = this.canvas.getAttribute ('width');
    this.height = this.canvas.getAttribute ('height');
    this.initScrap ();
  }
  initScrap () {
    this.ctx.beginPath ();
    this.ctx.fillStyle = '#ddd';
    this.ctx.fillRect (0, 0, this.width, this.height);
    this.ctx.font = '48px 微软雅黑';
    this.ctx.fillStyle = '#fff';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText ('刮开有奖', this.width / 2, this.height / 2);
    this.ctx.globalCompositeOperation = 'destination-out'; // 将canvas变透明,清除画布的时候可以显示下面的背景图
    this.ctx.closePath ();
    this.initMouseEvent ();
  }
  initMouseEvent () {
    // Pc端
    this.canvas.onmousedown = e => {
      this.canvas.onmousemove = e => {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect (
          e.clientX - this.offsetX - 10,
          e.clientY - this.offsetY - 10,
          30,
          30
        );
        this.judgeIsEnd ();
      };
    };
    window.onmouseup = e => {
      this.canvas.onmousemove = null;
    };

    // 适配移动端
    this.canvas.ontouchstart = e => {
      this.canvas.ontouchmove = e => {
        e = e.touches[0]
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect (
          e.clientX - this.offsetX - 10,
          e.clientY - this.offsetY - 10,
          30,
          30
        );
        this.judgeIsEnd ();
      };
    };
    window.ontouchend = e => {
      this.canvas.onmousemove = null;
    };
  }
  judgeIsEnd () {
    const image = this.ctx.getImageData(0, 0, this.width, this.height) // 转换为base64进制
    const prvData = image.data // 获取像素点， prv[n]代表r, prv[n + 1]代表g, prv[n + 2]代表b, prv[3 + n]代表a 
    const length = prvData.length //
    let i = 0
    let count = 0
    while(i < length) {
      const alpha = prvData[i + 3] // 收集透明点
      if (alpha < 10) {
        count++
      }
      i += 4
    }
    if ((count / (length / 4)) > .8) { // 如果透明点个数高于.8,代表刮奖结束
      this.ctx.clearRect(0, 0, this.width, this.height)
      console.log('刮奖结束')
    }
  }
}

const scrap = new Scrap ();
