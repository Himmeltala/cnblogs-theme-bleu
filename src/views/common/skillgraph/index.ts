import $ from "jquery";

let fillColor = "",
  strokeColor = "";

function drawPolygon(j: any, x: any, y: any, sides: any, radius: any, coords: any, ctx: any) {
  ctx.beginPath();
  let averageAngle = (Math.PI * 2) / sides;
  let increaseAngle = 0;
  let lengthX, lengthY, targetX, targetY;
  coords.push({ layer: j, coords: [] });
  for (let i = 0; i < sides; i++) {
    lengthX = radius * Math.cos(increaseAngle);
    targetX = x + lengthX;
    lengthY = radius * Math.sin(increaseAngle);
    targetY = y - lengthY;
    ctx.lineTo(targetX, targetY);
    increaseAngle += averageAngle;
    coords[j].coords.push({ x: targetX, y: targetY });
  }
  ctx.closePath();
  ctx.stroke();
}

/**
 * 绘制多边形
 *
 * @param config 配置项
 * @param x 多边形最里层的圆心 x 轴
 * @param y 多边形最里层的圆心 y 轴
 * @param ctx canvas 上下文
 */
function drawRadarMap(config: any, x: any, y: any, ctx: any) {
  let coords = <any>[];
  let step = x / config.layer - 2;
  let radius = step - step;
  ctx.strokeStyle = config.lineColor;
  ctx.lineWidth = config.lineWidth;
  for (let j = 0; j < config.layer; j++) {
    drawPolygon(j, x, y, config.sides, radius, coords, ctx);
    radius = radius + step;
  }
  drawStria(coords, x, y, config, ctx);
  drawDataArea(radius, coords, x, y, config, ctx);
}

/**
 * 连接里层以及外层之间所有多边形
 *
 * @param axis 所有多边形（层）的坐标轴
 * @param x 多边形最里层的圆心 x 轴
 * @param y 多边形最里层的圆心 y 轴
 * @param config 配置项
 * @param ctx canvas 上下文
 */
function drawStria(axis: any, x: any, y: any, config: any, ctx: any) {
  let coords = axis[axis.length - 1].coords;

  for (let i = 0; i < config.sides; i++) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(coords[i].x, coords[i].y);
    ctx.closePath();
    ctx.stroke();
  }
}

/**
 * 绘制多边形每一面对应的数据，即数据覆盖区域
 *
 * @param radius 每一层多边形的半径
 * @param coords 所有多边形（层）的坐标轴
 * @param x 多边形最里层的圆心 x 轴
 * @param y 多边形最里层的圆心 y 轴
 * @param config 配置项
 * @param ctx canvas 上下文
 */
function drawDataArea(radius: any, coords: any, x: any, y: any, config: any, ctx: any) {
  let axis = [];
  let maxLayer = coords[coords.length - 1].coords;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.font = `${config.textSize}rem Helvetica Neue`;

  for (let i = 0; i < config.sides; i++) {
    ctx.fillStyle = config.textColor;
    if (maxLayer[i].x <= x) {
      ctx.textAlign = "right";
    } else {
      ctx.textAlign = "left";
    }
    ctx.fillText(config.data[i].title, maxLayer[i].x, maxLayer[i].y);
    let currLayer = config.data[i].star - 1;
    let _x, _y;
    if (currLayer < 0) {
      _x = x;
      _y = y;
    } else {
      _x = coords[currLayer].coords[i].x;
      _y = coords[currLayer].coords[i].y;
    }
    if (i === 0) {
      ctx.moveTo(_x, _y);
    } else {
      ctx.lineTo(_x, _y);
    }
    axis.push({ title: config.data[i].title, star: config.data[i].star, x: _x, y: _y });
  }

  ctx.closePath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = strokeColor;
  ctx.stroke();
  ctx.globalAlpha = config.alpha;
  ctx.fillStyle = fillColor;
  ctx.fill();

  drawDataAreaTop(axis, ctx);
  drawFloatingPanel(axis);
}

/**
 * 绘制可移动的面板，显示详细信息
 *
 * @param axis 所有多边形（层）的坐标轴
 */
function drawFloatingPanel(axis: any) {
  let cnp = $("#floating");
  let timeout: any = null;
  $("#graph").on({
    mousemove: function (e) {
      if (timeout != null) clearTimeout(timeout);
      timeout = setTimeout(() => {
        axis.forEach((v: any) => {
          if (v.x >= e.offsetX - 5 && v.x < e.offsetX + 5 && v.y >= e.offsetY - 5 && v.y < e.offsetY + 5) {
            $(cnp).css({
              display: "block",
              left: `${e.offsetX}px`,
              top: `${e.offsetY}px`
            });
            $(cnp).empty().append(`
              <div class="tech">技术栈：${v.title}</div>
              <div class="star">掌握程度：${v.star}</div>
            `);
          }
        });
      }, 50);
    },
    mouseleave: () => {
      $(cnp).css({ display: "none" });
    }
  });
}

/**
 * 绘制数据覆盖区域峰值的点
 *
 * @param axis 所有多边形（层）的坐标轴
 * @param ctx canvas 上下文
 */
function drawDataAreaTop(axis: any, ctx: any) {
  ctx.strokeStyle = "white";

  for (let i = 0; i < axis.length; i++) {
    ctx.beginPath();
    ctx.arc(axis[i].x, axis[i].y, 1, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.fill();
  }
}

export function calcSize(sideWidthVw: number) {
  return (sideWidthVw / 100) * window.innerWidth;
}

export function useSkillGraph(vw: number, color: string, config: any) {
  if (config) {
    fillColor = color;
    strokeColor = config.strokeColor || "#a7a7a7";
    config.textColor = config.textColor || "#a7a7a7";
    config.lineColor = config.textColor || "#a7a7a7";
    // @ts-ignore
    const ctx = document.getElementById("graph").getContext("2d");
    drawRadarMap(config, vw, vw, ctx);
  }
  return vw;
}
