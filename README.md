# VisualCalendar

Visual calendar that have day column and hours like

| hours | 22.02.2017 | 23.02.2017 | 27.02.2017 |
|:-----:|:----------:|:----------:|:----------:|
| 08:00 |            |            |            |
| 10:00 |            |   cours    |            |
| 14:00 |  occuped   |            |            |
| 16:00 |  occuped   |            |            |
| 18:00 |  occuped   |            |   event    |

## Getting started

include js file

```html
<script src="VisualCalendar.js"></script>
```

```js
 var vc = new VisualCalendar();

 vc.config={ // default config is displayed
   anchor:'body', // the css rule to the container
   params:{
     readonly:true, // if the calendar is readonly (true/false)
     multiple:false // you can select multiple periods (true/false/nb of multiples)
   },
   dates:[], // what days to have (`['yyyy-mm-dd']`)
   hours:{
     ranges:[],// from what hours to what hours (`[['HH:ii'],['HH:ii']]` `[from,to]`)
     period:'01:00' // time for one bloc
   },
   planified:[], // list of planified reservation

   onPlanifClick:function(){}, // action that is launched when you click on a planif
   onSelect:function(){}, // action when you click on a reserv with a multiple select
   onUnselect:function(){}, // action when you unclick on a reserv with a multiple select
 }

 vc.build(); // build the calendar

 vc.generate(); // generate the dom of the calendar

```

## planified object

it looks like :
```js
var onePlanifiedReserv = {
   datetime:'Y-m-d H:i', // the date of the reservation
   type:'string type', // used in the class of DOM Element
   title:'string title', // what is displayed in the case
   description:'string', // used in data-verification
   clickable:false // used to define if the reserv is clickable
}
```

## callbacks

### onPlanifClick

action that is triggered when you click on a planif (if is clickable and not readonly)

```js
function actionOnPlanifClick(elem,me){
   // elem is the html element of the planif that is clicked
   // me is the planif object
}
```

### onSelect

action when you click on a reserv with a multiple select

```js
function actionOnSelect(elem,datetime){
   // elem is the html element of the planif that is clicked
   // datetime is the planif datetime
}
```

### onUnselect

action when you unclick on a reserv with a multiple select

```js
function actionOnUnselect(elem,datetime){
   // elem is the html element of the planif that is clicked
   // datetime is the planif datetime
}
```
