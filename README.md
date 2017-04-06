# RainCalendar

A minmimalist calendar in pure Javascript. 

## Target
 ### window
 loading `RainCalendar.min.js` you have available the RainCalendar function as `window` property
 ```javascript
 // example
 RainCalendar('#calendar', {
    startDate: new Date()
 });
 ```
 ### jQuery
 loading `RainCalendar.jquery.min.js` you have available the object as jQuery plugin `rainCalendar`
  ```javascript
  // example
 $('#calendar').rainCalendar({
    startDate: new Date()
 });
  ```
  ### AMD
  loading `RainCalendar.AMD.min.js`you have available the object as AMD module
  
   ```javascript
   // example
  define(["path/your/lib/RainCalendar-AMD.min"], function(calendar) {
    calendar('#calendar', {
        startDate: new Date()
    });
  });
   ```
   
 ### Named AMD
 loading `RainCalendar.AMD-named.min.js`you have available the object as AMD module with name "RainCalendar"
 
  ```javascript
  // example
 define(["RainCalendar"], function(calendar) {
   calendar('#calendar', {
       startDate: new Date()
   });
 });
  ```
   