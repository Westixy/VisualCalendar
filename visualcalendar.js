Number.prototype.toStringN=function(num){
  let str = this.toString();
  let diff=num-Math.floor(this).toString().length;
  for(let i=0 ; i<diff ; i++){
    str='0'+str;
  }
  return str;
}

class VisualCalendar{
  constructor(config,display=true){
    this.config=null;
    this.builded=null;
    if(config!==undefined){
      this.hydrate(config);
      this.build();
      if(display){
        this.display();
      }
    }
  }
  hydrate(config){
    if(typeof config == 'string') config=JSON.parse(config);
    if(config.params === undefined) config.params={};
    if(config.hours === undefined) config.hours={};
    this.config={
      anchor:config.anchor||'body',
      params:{
        readonly:config.params.readonly||true,
        multiple:config.params.multiple||false
      },
      dates:config.dates||[],
      hours:{
        ranges: config.hours.ranges||[],
        period: config.hours.period||'01:00'
      },
      planified:config.planified||[]
    }
  }
  build(){
    // faut que je trouve un truc pour fixer les nombres
    // ex : 800 -> 0800 // 15 -> 0015
    //      1 -> 01
    this.builded={
      dates:null,
      hours:null
    }
    var dates = [];
    this.config.dates.forEach((date)=>{
      if(typeof date == 'object' && date[0]!==undefined) {
        var r1 = new Date(date[0]);
        var r2 = new Date(date[1]);
        while(r1<=r2){
          dates.push(
            Number.parseInt(r1.getFullYear()).toStringN(4)+'-'+
            Number.parseInt(r1.getMonth()).toStringN(2)+'-'+
            Number.parseInt(r1.getDay()).toStringN(2));
          r1 = new Date(r1.getTime()+new Date('1970-01-02').getTime())
        }
      }else dates.push(date);
    });
    this.builded.dates=dates;
    var hours = [];
    this.config.hours.ranges.forEach((range)=>{
      var r1 = range[0].replace(':','');
      var r2 = Number.parseInt(range[1].replace(':',''));
      var period = Number.parseInt(this.config.hours.period.replace(':',''));
      while(r1<r2){
        r1=Number.parseInt(r1).toStringN(4);
        hours.push(r1[0]+r1[1]+':'+r1[2]+r1[3]) // <- ça va planter
        r1=Number.parseInt(r1)+period;                          // EDIT : peut etre polus
      }
      let htos=r1.toStringN(4).match(/\d{2}/);
      hours.push(htos[0]+':'+htos[1]);
    });
    this.builded.hours=hours;
    // TODO Vérifier le code la dessus pour pas qu'il confonde string et int
    //      sans oublier ce qui est marqué au début là ;) Good luck moi-meme
  }
  generate(){
    // TODO génération du html avec comme base config.params et builded
    if(this.config===null) throw new Error('You need to hydrate VisualCalendar');
    if(this.builded===null) throw new Error('You need to build VisualCalendar');

  }
}
