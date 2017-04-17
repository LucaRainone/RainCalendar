# RainCalendar

[![Build Status](https://travis-ci.org/LucaRainone/RainCalendar.svg?branch=master)](https://travis-ci.org/LucaRainone/RainCalendar)
[![Coverage Status](https://coveralls.io/repos/github/LucaRainone/RainCalendar/badge.svg?branch=master)](https://coveralls.io/github/LucaRainone/RainCalendar?branch=master)

A minimalist and hackable calendar in **pure Javascript**. 

**``dist`` folder contains different versions. Pick the one you need!**

## Available versions (targets):

### Standard javascript function
 
Including `RainCalendar.min.js` allows you to access RainCalendar as a standard javascript object.
 
Example:
 ```javascript
 RainCalendar('#calendar', {
    startDate: new Date()
 });
 ```
### jQuery plugin
 
Including `RainCalendar.jquery.min.js` makes a jQuery plugin named `rainCalendar` available.
 
Example:
  ```javascript
 $('#calendar').rainCalendar({
    startDate: new Date()
 });
  ```
### AMD module
  
Including `RainCalendar.AMD.min.js` makes an AMD module available.

Example:
   ```javascript
  require(["path/your/lib/RainCalendar-AMD.min"], function(calendar) {
    calendar('#calendar', {
        startDate: new Date()
    });
  });
   ```
   
### Named AMD module
 
Including `RainCalendar.AMD-named.min.js` allows the usage as AMD module with fixed name "RainCalendar".

Example:
  ```javascript
 require(["RainCalendar"], function(calendar) {
   calendar('#calendar', {
       startDate: new Date()
   });
 });
  ```
   