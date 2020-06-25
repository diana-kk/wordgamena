var SVG = Snap('#my-svg');

// 최상위 그룹
var Paper = SVG.g();

// 이미지
var home = Paper.image('img/home.png', 0, 0, 30, 30).toDefs();

var Library = {
  //SVG 외곽선
  drawLayout: function() {
    Paper.rect(0, 0, 360, 640, 6).attr({
      //'stroke': 'gray',
      'fill': '#D6EFC7'
    });

    // 상단 박스
    var topBox = Paper.g();

    topBox.path('M1 40 L359 40 L359 0 Q358 1 358 1 L1 1').attr({
      'fill': '#D6EFC7'
    });

    home.use().transform('t12, 10').appendTo(topBox).click(handlerHome).attr({
      'cursor': 'pointer'
    });

    function handlerHome() {
      location.replace('GAME.html');
    }
  },

  Generate: function(params) {
    var condition = params.condition;
    var choiceCount = params.choiceCount;
    var type = params.type;

    this.answer = '';
    this.question = '';
    this.mean = '';
    this.choiceInfo = {};

    var conData = data.slice();

    this.generate = function() {
      conData = conData.filter(function(el) {
        if (el.jei_set.indexOf(condition.grade) === -1) return false;
        var setNum = Number(el.jei_set.slice(1, 3));
        if (setNum < condition.setRange[0] || condition.setRange[1] < setNum) return false;
        return true;
      });
      conData = shuffle(conData);

      this.answer = conData[0].answer;
      this.question = conData[0].question;
      this.mean = conData[0].mean;
      var que = type === 0 ? this.answer : this.question;
      this.choiceInfo = makeChoice(que);

      conData.shift();
    };

    // 전체 보기
    function makeChoice(que) {

      var choiceData = getChoiceData(que);
      var answerIndex = getAnswerIndex(que);

      var answer = type === 0 ? data[answerIndex].question : data[answerIndex].answer;
      var wholeChoice = choiceData.concat([answer]);

      return {
        choices: shuffle(wholeChoice),
        rightAnswer: shuffle(wholeChoice).indexOf(answer)
      };
    }

    // 정답 인덱스
    function getAnswerIndex(que) {
      var index;
      data.forEach(function(el, i) {
        if (type === 0) {
          if (el.answer === que) {
            index = i;
          }
        } else {
          if (el.question === que) {
            index = i;
          }
        }
      });
      return index;
    }

    // 오답 보기
    function getChoiceData(que) {

      var answerIndex = getAnswerIndex(que);
      var copyData = data.slice();
      var newData = [];

      for (var i = 0; i < copyData.length; i++) {
        if (type === 0) {
          if (i !== answerIndex) {
            newData.push(copyData[i].question);
          }
        } else {
          if (i !== answerIndex) {
            newData.push(copyData[i].answer);
          }
        }
      }
      var choiceData = shuffle(newData).slice(0, choiceCount - 1);
      return choiceData;
    }

    function shuffle(arr) {
      return arr.sort(function() {
        return Math.random() - 0.5;
      });
    }
  },

  Progress: function(totCount) {
    var paper = Paper.g();
    var count = 1;
    var countText = count + ' / ' + totCount;

    var text = paper.text(180, 35, countText).attr({
      'fill': 'gray',
      'font-size': 20,
      'text-anchor': 'middle'
    });

    this.countUp = function(bool) {
      count += 1;
      text.attr({
        'text': count + ' / ' + totCount,
      });
    };

    this.remove = function() {
      paper.remove();
    };
  },

  // 문제 만들기 함수
  drawQuestion: function(params) {
    var paper = params.paper.g();
    var type = params.type;
    var questionInfo = params.questionInfo;
    var helping = params.helping;
    var endCallback = params.endCallback;

    if (type === 0) {
      paper.text(180, 195, questionInfo).attr({
        'font-size': 90,
        'letter-spacing': -1,
        'text-anchor': 'middle'
      });
    } else {
      paper.rect(15, 80, 330, 250, 5, 5).attr({
        'fill': 'white'
      });
      var isTooLong = questionInfo.length > 5;
      paper.text(180, 210, questionInfo).attr({
        'font-size': (isTooLong ? 80 : 100),
        'text-anchor': 'middle',
        'letter-spacing': 5
      });
console.log(helping);
      paper.text(180, 295, helping).attr({
        'font-size': 40,
        'letter-spacing': 3,
        'text-anchor': 'middle',
        'fill': '#8B3D58'
      });
    }
    return paper;
  },

  // 보기 만들기 함수
  drawChoice: function(params) {
    var paper = params.paper.g();
    var exampleInfo = params.exampleInfo;
    var choices = [];
    if (type === 0) {

      for (var i = 0; i < exampleInfo.choices.length; i++) {
        choices[i] = paper.g();
        choices[i].attr({
          'cursor': 'pointer'
        });

        choices[i].rect(15, (i * 90) + 265, 330, 75).attr({
          'fill': '#eff5f5',
          'rx': 8,
          'ry': 8
        });

        choices[i].text(180, (i * 90) + 315, exampleInfo.choices[i]).attr({
          'font-size': 42,
          'fill': '#777777',
          'text-anchor': 'middle'
        });
      }
    } else {
      // paper.rect(30, 245, 300, 350).attr({
      //   'fill': '#ffe6cc'
      // });

      for (var k = 0; k < exampleInfo.choices.length; k++) {
        choices[k] = paper.g();
        choices[k].attr({
          'cursor': 'pointer'
        });

        choices[k].rect(15 + (k % 2) * 173, 350 + Math.floor(k / 2) * 130, 156, 110, 3).attr({
          'fill': '#FAF9F7'
        });

        choices[k].text(93 + (k % 2) * 173, 430 + Math.floor(k / 2) * 130, exampleInfo.choices[k]).attr({
          'font-size': 68,
          'fill': '#777777',
          'text-anchor': 'middle'
        });
      }
    }
    return choices;
  },

  // 정답 체크 함수
  choiceCheck: function(params) {
    var choices = params.choices;
    var rightAnswer = params.exampleInfo.rightAnswer;
    var callback = params.callback;
    var mean = params.mean;

    // 이벤트 설정
    for (var i = 0; i < choices.length; i++) {
      choices[i].data('i', i).click(handler);
    }

    function handler() {
      choices.forEach(function(el) {
        el.attr({
          'pointer-events': 'none'
        });
      });

      handler2(this, '#FCF0E5');
      //#ffe6cc
      var userChoice = this.data('i');
      var check = userChoice === rightAnswer;
      var fdEl;
      if (check) {
        fdEl = Paper.image('img/right.png', 15, 235, 70, 91);

        var code01 = new Audio('aud/code01.mp3');
        code01.play();
      } else {
        fdEl = Paper.image('img/onemore.png', 275, 235, 70, 91);
        // var fdEl2 = Paper.rect(145, 63, 130, 45, 5).attr({
        //   'fill': '#F6F6F6'
        // });
        // var fdEl3 = Paper.text(158, 96, mean).attr({
        //   'font-size': 30,
        // });
        // fdEl = Paper.g(fdEl1, fdEl2, fdEl3);

        var code02 = new Audio('aud/code02.mp3');
        code02.play();

        // 틀렸을 때, 정답 버튼 효과
        handler2(choices[rightAnswer], '#F8CB00');
      }

      // 다음 문제
      setTimeout(function() {
        fdEl.remove();
        callback(check, userChoice);
      }, 1000);
    }

    function handler2(el, color) {
      var text = el.select('text');
      text.attr({
        'fill': 'black'
      });
      if (type === 0) {
        var rect = el.select('rect');
        rect.attr({
          'fill': color
        });
      } else {
        var cir = el.select('rect');
        cir.attr({
          'fill': color
        });
      }
    }
  },
};

Library.drawLayout();
