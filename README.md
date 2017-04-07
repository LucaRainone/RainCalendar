# RainCalendar

A minmimalist and hackable calendar in **pure Javascript**. 

**In dist folder you have different version based on your needs.**

Choose your favorite:

## Target

### window
 
 `RainCalendar.min.js` if you want to use it as simple function
 ```javascript
 // example
 RainCalendar('#calendar', {
    startDate: new Date()
 });
 ```
### jQuery
 
 `RainCalendar.jquery.min.js` if you want to use it as jQuery plugin named `rainCalendar`
  ```javascript
  // example
 $('#calendar').rainCalendar({
    startDate: new Date()
 });
  ```
### AMD
  
 `RainCalendar.AMD.min.js` if you want to use it as AMD module
  
   ```javascript
   // example
  define(["path/your/lib/RainCalendar-AMD.min"], function(calendar) {
    calendar('#calendar', {
        startDate: new Date()
    });
  });
   ```
   
### Named AMD
 
`RainCalendar.AMD-named.min.js` if you want to use it as AMD module with fixed name "RainCalendar"
 
  ```javascript
  // example
 define(["RainCalendar"], function(calendar) {
   calendar('#calendar', {
       startDate: new Date()
   });
 });
  ```
   