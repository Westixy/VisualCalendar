Number.prototype.toStringN=function(num){
  let str = this.toString();
  let diff=num-Math.floor(this).toString().length;
  for(let i=0 ; i<diff ; i++){
    str='0'+str;
  }
  return str;
}

Element.parseHTML=function(a,b){if(a instanceof Element)return a;var c=document.createElement('div');if('string'==typeof a){if('<'==a.trim()[0])return c.innerHTML=a,doc=c.children,b?doc:1==doc.length?doc[0]:doc;c.textContent=a;var d=c.firstChild;return b?[d]:d}return c.innerHTML='<![CDATA['+JSON.stringify(a)+']]>',b?[c.firstChild]:c.firstChild},Element.prototype.select=function(a){return this.querySelector(a)},Element.prototype.selects=function(a){return this.querySelectorAll(a)},Element.prototype.parent=function(){return this.parentNode},Element.prototype.prev=function(){return this.previousSibling},Element.prototype.next=function(){return this.nextSibling},Element.prototype.prependx=function(a,b){b||(a=this.constructor.parseHTML(a,!0));var c=a.length,d=this.firstChild;null===d&&this.appendChild(a[0]);for(var e=0;e<c;e++)this.insertBefore(a[0],this.firstChild);return this.firstChild},Element.prototype.appendx=function(a,b){b||(a=this.constructor.parseHTML(a,!0));for(var c=a.length,d=0;d<c;d++)this.appendChild(a[0]);return this.lastChild},Element.prototype.addBefore=function(a,b){b||(a=this.constructor.parseHTML(a,!0));for(var c=this.parentNode,d=a.length,e=0;e<d;e++)c.insertBefore(a[0],this);return this.previousSibling},Element.prototype.addAfter=function(a,b){b||(a=this.constructor.parseHTML(a,!0));var c=this.nextSibling,d=this.parentNode;null===c&&(d.appendChild(a[0]),c=this.nextSibling);for(var e=a.length,f=0;f<e;f++)d.insertBefore(a[0],c);return this.nextSibling},Element.prototype.remove=function(){return this.parentNode.removeChild(this),this},Element.prototype.on=function(a,b){return this.addEventListener(a,b)},Element.prototype.off=function(a,b){return this.removeEventListener(a,b),this};

class VisualCalendar{
  constructor(config,display=true){
    this.config=null;
    this.builded=null;
    this.selected=[];
    this.ev={};
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
    if(config.ev!==undefined){
      this.ev.onSelect=config.ev.onSelect||()=>{};
      this.ev.onUnselect=config.ev.onUnselect||()=>{};
      this.ev.onMultiple=config.ev.onMultiple||()=>{};
    }
  }
  build(){
    if(this.config===null) throw new Error('You need to hydrate VisualCalendar');
    this.builded={
      dates:null,
      hours:null
    }
    var dates = [];
    this.config.dates.forEach((date)=>{
      if(typeof date == 'object' && date[0]!==undefined) {
        var r1 = new Date(date[0]);
        var r2 = new Date(date[1]);
        while(r1<=r2){ // TODO verifier que ça fonctionner
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
        hours.push(r1[0]+r1[1]+':'+r1[2]+r1[3]);
        r1=Number.parseInt(r1)+period;
      }
      let htos=r1.toStringN(4).match(/\d{2}/);
      hours.push(htos[0]+':'+htos[1]);
    });
    this.builded.hours=hours;
  }
  dateHasEvent(datetime){
    if(!(datetime instanceof Date)) datetime=new Date(datetime);
    for(let i=0;i<this.config.planified.length;i++){
      var planif=this.config.planified[i];
      var planifDate=new Date(planif.datetime);
      var hourMax =(Number.parseInt(planifDate.getHours().toString()+planifDate.getMinutes().toStringN(2))+Number.parseInt(this.config.hours.period.replace(':',''))).toString(4);
      hourMax=hourMax[0]+hourMax[1]+':'+hourMax[2]+hourMax[3]
      var planifMax=new Date(datetime.trim().split(' ')[0]+' '+hourMax)
    }
  }
  generate(){
 // TODO DEBUG
    if(this.builded===null) throw new Error('You need to build VisualCalendar');

    let cnt=Element.parseHTML('<div class="vc-cnt"></div>');
    cnt.appendx('<table></table>');

    let header=Element.parseHTML('<tr></tr>');
    header.appendx('<th>hours</th>');
    for(let i=0; i<this.builded.dates.length;i++){
      header.appendx('<th>'+this.builded.dates[i]+'</th>');
    }
    let table = cnt.select('table');
    table.appendx(header);
    for(let i=0; i<this.builded.hours.length; i++){
      let row=Element.parseHTML('<tr></tr>');
      row.appendx('<td>'+this.builded.hours[i]+'</td>');
      for(let j=0; j<this.builded.dates.length;j++){
        var currentTimeDate=this.builded.dates[j]+' '+this.builded.hours[i];
        let me = this.dateHasEvent(new Date(currentTimeDate));
        let selectable =(this.config.params.readonly)?'':'selectable ';
        let className=((me)?selectable+me.type:((this.config.params.readonly)?'':'clickable'));
        var elem = row.appendx('<td class="'+className+'">'+me.text+'</td>');
        if(!this.config.params.readonly)
        elem.on('click',(ev)=>{
          let index=this.selected.indexOf(currentTimeDate);
          if(index==-1){
            if(this.selected.length==0||this.config.params.multiple==true || this.config.params.multiple<=this.selected.length ){
              this.selected.push(currentTimeDate);
              elem.className+=' vc-selected';
              this.ev.onSelect(elem,currentTimeDate);
            }
          }
          if(index!=-1){
            this.selected.splice(index,1);
            elem.className.replace(' vc-selected','');
            this.ev.onUnselect(elem,currentTimeDate);
          }

        });

      }
      table.appendx(row);
    }
  }
}
