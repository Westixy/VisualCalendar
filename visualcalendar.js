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
    this.ev={
      onSelect:console.log,
      onUnselect:function(){},
    };
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
      this.ev.onSelect=config.ev.onSelect||function(){};
      this.ev.onUnselect=config.ev.onUnselect||function(){};
      this.ev.onMultiple=config.ev.onMultiple||function(){};
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
            Number.parseInt(r1.getMonth()+1).toStringN(2)+'-'+
            Number.parseInt(r1.getUTCDate()).toStringN(2));
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
      //hours.push(htos[0]+':'+htos[1]);
    });
    this.builded.hours=hours;
  }
  dateHasEvent(datetime){
    if(!(datetime instanceof Date)) datetime=new Date(datetime);
    for(let i=0;i<this.config.planified.length;i++){
      var planif=this.config.planified[i];
      var planifDate=new Date(planif.datetime);
      var hourMax =(Number.parseInt(planifDate.getHours().toString()+planifDate.getMinutes().toStringN(2))+Number.parseInt(this.config.hours.period.replace(':',''))).toStringN(4);
      hourMax=hourMax[0]+hourMax[1]+':'+hourMax[2]+hourMax[3];
      var planifMax=new Date(datetime.getFullYear()+'-'+(datetime.getMonth()+1).toStringN(2)+'-'+datetime.getUTCDate().toStringN(2)+' '+hourMax);
      console.log(planifDate,datetime,planifMax,datetime.getTime()>=planifDate.getTime() && datetime.getTime()<planifMax.getTime());
      if(
          datetime.getFullYear()==planifDate.getFullYear() &&
          datetime.getMonth()==planifDate.getMonth()&&
          datetime.getUTCDate()==planifDate.getUTCDate()&&
          datetime.getTime()>=planifDate.getTime() && datetime.getTime()<planifMax.getTime()
        ) return planif;
    }
    return null;
  }
  generate(){
    if(this.builded===null) throw new Error('You need to build VisualCalendar');
    let cnt=Element.parseHTML('<div class="vc-cnt"></div>');
    let table =document.createElement('table');
    let header=table.createTHead();
    header=header.insertRow(0);
    let heh = header.insertCell(0);
    heh.textContent='hours';
    heh.className='vc-table-head';
    for(let i=0; i<this.builded.dates.length;i++){
      let he = header.insertCell(i+1);
      he.textContent=this.builded.dates[i];
      he.className='vc-table-head';
    }
    table.appendx(header);
    for(let i=0; i<this.builded.hours.length; i++){
      let row=table.insertRow(i+1);
      let head=row.insertCell(0);
      head.textContent=this.builded.hours[i];
      row.appendx('<td>'+this.builded.hours[i]+'</td>');
      for(let j=0; j<this.builded.dates.length;j++){
        var CTD=this.builded.dates[j]+' '+this.builded.hours[i];
        let me = this.dateHasEvent(CTD);
        let selectable =(this.config.params.readonly)?'':' vc-selectable';
        let className=((me)?selectable+" "+me.type:((this.config.params.readonly)?'':' vc-clickable'));
        var elem = row.insertCell(j+1);
        elem.className=className;
        elem.innerHTML=((me)?me.title:'');
        row.appendx(elem);
        if(!this.config.params.readonly)
        elem.on('click',(ev)=>{
          if(!(me)){
            let el=ev.target;
            let curdate=this.builded.dates[j]+' '+this.builded.hours[i];
            let index=ev.target.className.indexOf(' vc-selected');

            if(index==-1){
              if(this.selected.length==0||this.config.params.multiple==true || this.config.params.multiple>this.selected.length ){

                this.selected.push(curdate);
                ev.target.className+=' vc-selected';
                this.ev.onSelect(ev.target,curdate);
              }
            }
            if(index!=-1){
              this.selected.splice(this.selected.indexOf(curdate),1);
              ev.target.className=ev.target.className.replace(' vc-selected','');
              this.ev.onUnselect(ev.target,curdate);
            }
            if(typeof this.config.params.multiple!='boolean')if(this.config.params.multiple<=this.selected.length){
              cnt.className.indexOf(' vc-nomoreselect')
              if(cnt.className.indexOf(' vc-nomoreselect')==-1){
                cnt.className += ' vc-nomoreselect';
              }
            }else{
              if(cnt.className.indexOf(' vc-nomoreselect')!=-1){
                cnt.className=cnt.className.replace(' vc-nomoreselect','')
              }
            }
          }
        });

      }
      table.appendx(row);
    }
    cnt.appendChild(table);
    document.body.select(this.config.anchor).appendChild(cnt);
  }
}
