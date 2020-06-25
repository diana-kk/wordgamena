var SVG = Snap('#my-svg');

// 최상위 그룹
var Paper = SVG.g();

// 이미지
var bi = Paper.image('img/bi.jpg', 0, 0, 220, 36).toDefs();
var start = Paper.image('img/start.png', 0, 0, 170, 170).toDefs();

// SVG 외곽선
Paper.rect(0, 0, 360, 640, 6).attr({
  'stroke': 'gray',
  'fill': 'none'
});

// 상단 바 부분
var topArea = Paper.g();

bi.use().transform('t70, 40').appendTo(topArea);

var title = topArea.text(180, 175, ['한 자', '어 휘 게 임']).attr({
  'font-size': 40,
  'text-anchor': 'middle'
});
title.selectAll('tspan')[1].attr({
  x: 180,
  y: 230
});

start.use().transform('t100, 270').appendTo(topArea).attr({
  'cursor': 'pointer'
});

var greenB = topArea.rect(100, 500, 160, 50).attr({
  'fill': '#D6EFC7',
  'rx': 8,
  'ry': 8
});
var greenBT = topArea.text(159, 532, '시 작').attr({
  'font-size': 20
});
var green = topArea.g(greenB, greenBT).click(handler01).attr({
  'cursor': 'pointer'
});

function handler01() {
  location.replace('GAME02.html');
}
