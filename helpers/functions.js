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
 
export {
    getNextTwoSemesters,
    getSeasonByMonth
};

