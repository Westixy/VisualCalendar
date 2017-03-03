# What is expected

- Visual calendar that have day column and hours like

| hours | 22.02.2017 | 23.02.2017 | 27.02.2017 |
|:-----:|:----------:|:----------:|:----------:|
| 08:00 |            |            |            |
| 10:00 |            |   cours    |            |
| 14:00 |  occuped   |            |            |
| 16:00 |  occuped   |            |            |
| 18:00 |  occuped   |            |   event    |

- Define it by a json or js object like

```js
{
  anchor:'div#vc-anchor',
  params:{
    readonly:false,
    multiple:3 // max number for multiple select or true for unlimited or false
  },
  dates:[['2017-02-22','2017-02-23'],'2017-02-27'],
  hours:{
    ranges:[['08:00','12:00'],['14:00','20:00']],
    period:'02:00'
  },
  planified:[
    {
      datetime:'2017-02-22 14:00',
      type:'simple', // that's going to the class of the box
      title:'occuped',
      description:'Something to popover'
    },{
      datetime:'2017-02-22 16:00',
      type:'simple', // that's going to the class of the box
      title:'occuped',
      description:'Something to popover',
    }, ...
  ]
}
```


- When you click on a box, throw a callback defined by the user like

```js
datestart = '2017-02-22 14:00'

VisualCalendar.onSelect = function(datestart){ console.log(datestart) }
VisualCalendar.onUnselect = function(datestart){ console.log(datestart) }
```

- When a multiple select is done, throw a callback defined by the user like

```js
datestarts = ['2017-02-22 14:00','2017-02-22 16:00','2017-02-23 14:00']

VisualCalendar.onMultiple = function(datestarts){ console.log(datestarts) }
```
