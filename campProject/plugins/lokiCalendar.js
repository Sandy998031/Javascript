//宣告全域變數區
let
  apiPath = './db.json',
  booked = [],
  nationalHoliday = [],
  pallet = {};

//初始化作業
const init = () => {
  fetch('./db.json', { method: 'GET' })
    .then(res => res.json())
    .then(json => {
      //booked = json.booked;
      //pallet = json.pallet;
      //nationalHoliday = json.nationalHoliday;
      ({booked,pallet,nationalHoliday}=json);
      runCalendarService();
    });
}


const runCalendarService=()=>{
  console.log('start design calendar');
}



init();

