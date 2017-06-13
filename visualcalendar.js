if(Number.parseInt == undefined) Number.parseInt=function(mixed){return parseInt(mixed)};
Number.prototype.toStringN=function(a){for(var b=this.toString(),c=a-Math.floor(this).toString().length,d=0;d<c;d++)b='0'+b;return b};
Element.parseHTML=function(a,b){if(a instanceof Element)return a;var c=document.createElement('div');if('string'==typeof a){if('<'==a.trim()[0])return c.innerHTML=a,doc=c.children,b?doc:1==doc.length?doc[0]:doc;c.textContent=a;var d=c.firstChild;return b?[d]:d}return c.innerHTML='<![CDATA['+JSON.stringify(a)+']]>',b?[c.firstChild]:c.firstChild},Element.prototype.select=function(a){return this.querySelector(a)},Element.prototype.selects=function(a){return this.querySelectorAll(a)},Element.prototype.parent=function(){return this.parentNode},Element.prototype.prev=function(){return this.previousSibling},Element.prototype.next=function(){return this.nextSibling},Element.prototype.prependx=function(a,b){b||(a=this.constructor.parseHTML(a,!0));var c=a.length,d=this.firstChild;null===d&&this.appendChild(a[0]);for(var e=0;e<c;e++)this.insertBefore(a[0],this.firstChild);return this.firstChild},Element.prototype.appendx=function(a,b){b||(a=this.constructor.parseHTML(a,!0));for(var c=a.length,d=0;d<c;d++)this.appendChild(a[0]);return this.lastChild},Element.prototype.addBefore=function(a,b){b||(a=this.constructor.parseHTML(a,!0));for(var c=this.parentNode,d=a.length,e=0;e<d;e++)c.insertBefore(a[0],this);return this.previousSibling},Element.prototype.addAfter=function(a,b){b||(a=this.constructor.parseHTML(a,!0));var c=this.nextSibling,d=this.parentNode;null===c&&(d.appendChild(a[0]),c=this.nextSibling);for(var e=a.length,f=0;f<e;f++)d.insertBefore(a[0],c);return this.nextSibling},Element.prototype.remove=function(){return this.parentNode.removeChild(this),this},Element.prototype.on=function(a,b){return this.addEventListener(a,b)},Element.prototype.off=function(a,b){return this.removeEventListener(a,b),this};
HTMLTableElement.parseHTML=Element.parseHTML;HTMLTableRowElement.parseHTML=Element.parseHTML;
if(Array.prototype.forEach==undefined) Array.prototype.forEach=function(cb){for(var i=0;i<this.length;i++){cb(this[i],i);}}
if(NodeList.prototype.forEach==undefined) NodeList.prototype.forEach=Array.prototype.forEach;
function parseDate(datetime){datetime=datetime.trim().replace(' ','T');if(datetime.match(/^\d{4}-\d{2}-\d{2}$/)) datetime+='T00:00:00';if(datetime.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) datetime+=':00';var b = datetime.split(/\D/);return new Date(b[0], b[1]-1, b[2], b[3], b[4],b[5]);}
// Requirements ^^^^^^^^^^
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VisualCalendar = function () {
  _createClass(VisualCalendar, [{
    key: 'version',
    get: function get() {
      return '0.0.1';
    }
  }]);

  function VisualCalendar(config) {
    var display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    _classCallCheck(this, VisualCalendar);

    this.config = null;
    this.builded = null;
    this.selected = [];
    this.ev = {
      onSelect: function onSelect() {},
      onUnselect: function onUnselect() {},
      onPlanifClick: function onPlanifClick() {}
    };
    if (config !== undefined) {
      this.hydrate(config);
      this.build();
      if (display) {
        this.display();
      }
    }
  }

  _createClass(VisualCalendar, [{
    key: 'hydrate',
    value: function hydrate(config) {
      if (typeof config == 'string') config = JSON.parse(config);
      if (config.params === undefined) config.params = {};
      if (config.hours === undefined) config.hours = {};
      this.last='';
      this.config = {
        anchor: config.anchor || 'body',
        params: {
          readonly: config.params.readonly || true,
          multiple: config.params.multiple || false
        },
        dates: config.dates || [],
        hours: {
          ranges: config.hours.ranges || [],
          period: config.hours.period || '01:00'
        },
        planified: config.planified || []
      };
      if (config.ev !== undefined) {
        this.ev.onSelect = config.ev.onSelect || function () {};
        this.ev.onUnselect = config.ev.onUnselect || function () {};
        this.ev.onPlanifClick =  config.ev.onUnselect || function () {};
      }
    }
  }, {
    key: 'addPlanif',
    value: function addPlanif(elem, datetime, className, title, desc) {
      elem.className = className;
      elem.innerHTML = title;
      this.config.planified.push({
        datetime: datetime,
        type: className,
        title: title,
        description: desc
      });
    }
  }, {
    key: 'build',
    value: function build() {
      var _this = this;

      if (this.config === null) throw new Error('You need to hydrate VisualCalendar');
      this.builded = {
        dates: null,
        hours: null
      };
      var dates = [];
      this.config.dates.forEach(function (date) {
        if ((typeof date === 'undefined' ? 'undefined' : _typeof(date)) == 'object' && date[0] !== undefined) {
          var r1 = new Date(date[0]);
          var r2 = new Date(date[1]);
          while (r1 <= r2) {
            dates.push(Number.parseInt(r1.getFullYear()).toStringN(4) + '-' + Number.parseInt(r1.getMonth() + 1).toStringN(2) + '-' + Number.parseInt(r1.getUTCDate()).toStringN(2));
            r1 = new Date(r1.getTime() + new Date('1970-01-02').getTime());
          }
        } else dates.push(date);
      });
      this.builded.dates = dates;
      var hours = [];
      this.config.hours.ranges.forEach(function (range) {
        var r1 = range[0].replace(':', '');
        var r2 = Number.parseInt(range[1].replace(':', ''));
        var period = Number.parseInt(_this.config.hours.period.replace(':', ''));
        while (r1 < r2) {
          r1 = Number.parseInt(r1).toStringN(4);
          hours.push(r1[0] + r1[1] + ':' + r1[2] + r1[3]);
          r1 = Number.parseInt(r1) + period;
        }
        var htos = r1.toStringN(4).match(/\d{2}/);
      });
      this.builded.hours = hours;
    }
  }, {
    key: 'dateHasEvent',
    value: function dateHasEvent(datetime) {
      if (!(datetime instanceof Date)) datetime = parseDate(datetime);
      for (var i = 0; i < this.config.planified.length; i++) {
        var planif = this.config.planified[i];
        var planifDate = parseDate(planif.datetime);
        var hourMax = (Number.parseInt(planifDate.getHours().toString() + planifDate.getMinutes().toStringN(2)) + Number.parseInt(this.config.hours.period.replace(':', ''))).toStringN(4);
        var planifMax = parseDate(planifDate.getFullYear() + '-' + (planifDate.getMonth() + 1).toStringN(2) + '-' + planifDate.getUTCDate().toStringN(2) + ' ' + hourMax[0] + hourMax[1] + ':' + hourMax[2] + hourMax[3]);
        if (datetime.getTime() >= planifDate.getTime() && datetime.getTime() < planifMax.getTime()){
          return planif;
        }
      }
      return null;
    }
  }, {
    key: 'generate',
    value: function generate() {
      var _this2 = this;

      if (this.builded === null) throw new Error('You need to build VisualCalendar');
      var cnt = Element.parseHTML('<div class="vc-cnt"></div>');
      var table = document.createElement('table');
      var header = table.createTHead();
      header = header.insertRow(0);
      var heh = header.insertCell(0);
      heh.textContent = 'Heures';
      heh.className = 'vc-table-head';
      for (var i = 0; i < this.builded.dates.length; i++) {
        var he = header.insertCell(i + 1);
        var date=new Date(this.builded.dates[i]);
        he.textContent=date.getUTCDate().toStringN(2)+'.'+(date.getMonth()+1).toStringN(2)+'.'+date.getFullYear();
        he.className = 'vc-table-head';
      }
      table.appendx(header);

      var _loop = function _loop(_i) {
        var row = table.insertRow(_i + 1);
        var head = row.insertCell(0);
        head.textContent = _this2.builded.hours[_i];
        row.appendx('<td>' + _this2.builded.hours[_i] + '</td>');

        var _loop2 = function _loop2(j) {
          CTD = _this2.builded.dates[j] + ' ' + _this2.builded.hours[_i];

          var me = _this2.dateHasEvent(CTD);
          var ev_clickable= me?me.clickable:false;
          var selectable = _this2.config.params.readonly ? '' : ev_clickable ?' vc-clickable' : '';
          var className = me ? selectable + " " + me.type : _this2.config.params.readonly ? '' : ' vc-clickable';
          elem = row.insertCell(j + 1);

          elem.className = className;
          if(me) elem.setAttribute('data-description',me.description);
          elem.innerHTML = me ? me.title : '';
          row.appendx(elem);
          if (!_this2.config.params.readonly){ elem.on('click', function (ev) {
            if (!me) {
              var el = ev.target;
              var curdate = _this2.builded.dates[j] + ' ' + _this2.builded.hours[_i];
              var index = ev.target.className.indexOf(' vc-selected');
              if( _this2.config.params.multiple == false){
                _this2.ev.onSelect(ev.target, curdate);
              }else if (index == -1) {
                if (_this2.selected.length == 0 || _this2.config.params.multiple == true || _this2.config.params.multiple > _this2.selected.length) {

                  _this2.selected.push(curdate);
                  ev.target.className += ' vc-selected';
                  _this2.ev.onSelect(ev.target, curdate);
                }
              }
              if (index != -1) {
                _this2.selected.splice(_this2.selected.indexOf(curdate), 1);
                ev.target.className = ev.target.className.replace(' vc-selected', '');
                _this2.ev.onUnselect(ev.target, curdate);
              }
              if (typeof _this2.config.params.multiple != 'boolean') if (_this2.config.params.multiple <= _this2.selected.length) {
                cnt.className.indexOf(' vc-nomoreselect');
                if (cnt.className.indexOf(' vc-nomoreselect') == -1) {
                  cnt.className += ' vc-nomoreselect';
                }
              } else {
                if (cnt.className.indexOf(' vc-nomoreselect') != -1) {
                  cnt.className = cnt.className.replace(' vc-nomoreselect', '');
                }
              }
            }else if(me.clickable){
              _this2.ev.onPlanifClick(ev.target, me);
            }
          });} else if(ev_clickable){
            elem.className+=' vc-clickable';
            elem.on('click', function (ev) {_this2.ev.onPlanifClick(ev.target, me);});
          }
        };

        for (var j = 0; j < _this2.builded.dates.length; j++) {
          _loop2(j);
        }
        table.appendx(row);
      };

      for (var _i = 0; _i < this.builded.hours.length; _i++) {
        var CTD;
        var elem;

        _loop(_i);
      }
      cnt.appendChild(table);
      document.body.select(this.config.anchor).appendChild(cnt);
    }
  }]);

  return VisualCalendar;
}();
