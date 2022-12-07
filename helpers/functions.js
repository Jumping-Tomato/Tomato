/*
* get the date in MM/DD/YYYY from a date object 
*/
function getDateFromDate(date){
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    return month + "/" + day + "/" + year;
}

function getTimeFromDate(date){
    let hour = date.getHours() > 9 ? date.getHours() :  ('0' + date.getHours());
    let minute = date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes());
    return hour + ":" + minute;
}

function getTomorrowDate(){
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}

function getNextTwoSemesters(){
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentSeason = getSeasonByMonth(currentMonth);
    let futureMonth = currentMonth + 3;
    let futureYear = currentYear;
    if(futureMonth > 12){
        futureMonth = (currentMonth + 3) % 12;
        futureYear = currentYear + 1;
    }
    let futureSeason = getSeasonByMonth(futureMonth);
    return [currentSeason + " " + currentYear, futureSeason + " " + futureYear]
}

function getSeasonByMonth(month){
    if([12,1,2].includes(month)){
        return "Winter";
    }
    if(month >= 3 && month <= 5){
        return "Spring";
    }
    if(month >= 6 && month <= 8){
        return "Summer";
    }
    if(month >= 9 && month <= 11){
        return "Fall";
    }
    return "Invalid Month";
}

/**
 * Remove all items that has the value from an array.
 *
 * @param {array} arr The array in which you are removing the items
 * @param {number/string} value The value of the items you are removing.
 * @return {array} x the array after you remove the items
 */
function removeItemsFromArrayByValue(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
}
 
export {
    getDateFromDate,
    getTimeFromDate,
    getTomorrowDate,
    getNextTwoSemesters,
    getSeasonByMonth,
    removeItemsFromArrayByValue
};

