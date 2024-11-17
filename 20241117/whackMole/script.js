//宣告全域變數，使用利於整個js都能讀取到
const btnStart = document.querySelector('button');
const timeNode = document.querySelector('#time');
const countNode = document.querySelector('#combo');
const animals = document.querySelectorAll('img');

let time, count;
const redToYellow = [];

//規劃功能函數
const gameStart = () => {
  //step1:一開始讓btnStart失去作用，沒有click事件也被disable
  btnStart.removeEventListener('click', gameStart);
  btnStart.disabled = true;



  //step2:校正歸零
  time = 60;
  count = 0;
  timeNode.textContent = time;
  countNode.textContent = count;

  //step3:開始計時
  const timer = setInterval(() => {
    time--;
    timeNode.textContent = time;

    if (time === 0) {
      clearInterval(timer);
      //讓btnStart恢復，可以再玩
      btnStart.addEventListener('click', gameStart);
      btnStart.disabled = false;
    }
  }, 1000)


  //step4:產生100個red事件，然後指定到9宮格內某個state.png位置，包出現時間點，曝光多久
  for (let i = 0; i < 100; i++) {
    //const atSpace = Math.floor(Math.random() * 9);  //0~8
    //const atTime = Math.floor(Math.random() * 56000);  //0~60sec=>rand0~55999ms(後面4秒緩和)
    //const atShow = Math.floor(Math.random() * 3) + 2;  //2~4sec=>0~2+2

    const showObj = {
      space: Math.floor(Math.random() * 9),
      show: Math.floor(Math.random() * 3) + 2,
      id: i
    }

    //在單一red事件下，試圖觸發到畫面上，每一個都要延遲觸發 atTime
    setTimeout(() => {
      //showIt(atTime, i, atTime,atSpace);
      showIt(showObj);
      //}, atTime);
    }, Math.floor(Math.random() * 56000));
  }
};


//const showIt = (atTime, idx) => {
//負責將紅色顯示在畫面上
//console.log(`Show #${idx}`,atTime);
//}

const showIt = (obj) => {
  //負責將紅色顯示在畫面上
  //console.log(obj);

  //試圖找到指定圖片，替換為red，並控制幾秒後消失返回yellow，
  //如果當下space位置已經是紅色不要覆蓋，想辦法換位置重新安排出場
  if (animals[obj.space].classList.length > 0) {
    //因為有class，所以不是黃色代表正在實行某個任務，所以得改個位置
    obj.space = Math.floor(Math.random() * 9);  //再重新決定0~8
    //如果畫面都是red，大家都找不到空間，大家都馬上去找新位置
    //當下會發生無窮迴圈不斷找新位置，效能變差
    //解決方式:稍微空窗0.1秒，不讓這麼頻繁馬上找
    setTimeout(() => {
      showIt(obj);
    }, 100);
    return;

  } else {
    animals[obj.space].classList.add('red');
    animals[obj.space].src = 'img/on.png';
    animals[obj.space].dataset.playerId = obj.id;

    //記下當時timeout的定時器id，利於某時機可以清除
    redToYellow[obj.id] = setTimeout(() => {  //回傳，定時器的序號，把它當作value，存入~~~
      animals[obj.space].classList.remove('red');
      animals[obj.space].src = 'img/state.png';
      delete animals[obj.space].dataset.playerId;
    }, obj.show * 1000)
  }
}

const getCombo = (space) => {
  if (animals[space].classList.contains('red')) {
    //如果是red，計分+1，並讓red to green
    count++;
    countNode.textContent = count;

    animals[space].classList.remove('red');
    animals[space].classList.add('green');
    animals[space].src = 'img/off.png';

    //因為計分red to green了，原本這個red to yellow的定時器要清除
    //const playerId = animals[space].dataset.playerId;
    //const BombSN = redToYellow[playerId];
    //clearTimeout(BombSN);

    clearTimeout(redToYellow[animals[space].dataset.playerId]);

    setTimeout(() => {
      animals[space].classList.remove('green');
      animals[space].src = 'img/state.png';
    }, 1000)
  }
}


//初始執行區域
btnStart.addEventListener('click', gameStart);
document.onkeydown = function (event) {
  console.log(event);
  switch (event.keyCode) {
    case 103: getCombo(0); break;
    case 104: getCombo(1); break;
    case 105: getCombo(2); break;
    case 100: getCombo(3); break;
    case 101: getCombo(4); break;
    case 102: getCombo(5); break;
    case 97: getCombo(6); break;
    case 98: getCombo(7); break;
    case 99: getCombo(8); break;

  }
}