const EmployeeSchedule = require("./EmployeeScheduleModel");
const CONFIG = require("../NetinConfig");

exports.find = (callback) => {
    EmployeeSchedule.find((error,result) => {
        if (error) throw error;
            
        return callback(result);
    })
};

exports.findById = (id, callback) => {
    EmployeeSchedule.findOne({_id:id}, (error, result)=>{
        if (error) throw error;

        return callback(result);
    })
};

exports.findByUserId = (id, callback) => {
    EmployeeSchedule.find({idUser:id}, (error, result)=>{
        if (error) throw error;
        
        return callback(result);
    })
};

exports.findByUserYear = (idUser, year, callback) => {
    EmployeeSchedule.find({idUser:idUser, year:year}, (error, result)=>{
        if (error) throw error;

        return callback(result);
    })
};

exports.findByUserYearMonth = (idUser, year, month, callback) => {
    EmployeeSchedule.find({idUser:idUser, year:year, month:month}, (error, result)=>{
        if (error) throw error;

        return callback(result);
    })
};

exports.save = (idUser, year, month, days, callback) => {
    
    for (let i = 0; i < days.length; i++){
        let dayOfWeek = getDayOfWeek(year, month, days[i].day);
        if(dayOfWeek < 0) return callback({code:400});
        days[i].day_of_week = dayOfWeek;
    };

    const Schedule = new EmployeeSchedule({
        idUser: idUser,
        year: year,
        month: month,
        days: days
    });

    Schedule.save((error, result) => {
        if(error) throw error;

        return callback(result);
    })
};

exports.putDay = (id, year, month, days, callback) => {
    
    for (let i = 0; i < days.length; i++){
        let dayOfWeek = getDayOfWeek(year, month, days[i].day);
        if(dayOfWeek < 0) return callback({code:400});
        days[i].day_of_week = dayOfWeek;
    };

    EmployeeSchedule.updateMany({_id: id}, { $push: {days: days}}, (error, success) => {
        if (error) throw error;
            
        return callback(success);
    });
}

exports.removeDay = (id, idDay, callback) => {

    EmployeeSchedule.updateMany({_id: id}, {$pull: {days: {_id: idDay}}}, (error, success) => {
        if (error) throw error;
            
        return callback(success);
    });
}

let getDayOfWeek = (year, month, day) => {
    monthZero = addZero(month);
    dayZero = addZero(day);
    
    let date = new Date(year+"-"+monthZero+"-"+dayZero);
    
    if(date.getMonth()+1 != month) return -1;
    
    return date.getDay();
}

let addZero = (number) => {
    if(number < 10) return "0"+number;

    return number;
}