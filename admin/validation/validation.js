class Validation{
    //Method
    checkNull(value, spanId, mess){
        if(value === ""){
            document.getElementById(spanId).innerHTML = mess
            return false
        } else{
            getEle(spanId).innerHTML = ""
            return true
        }
    }
    checkNeg(value, spanId, mess){
        if(value<0){
            document.getElementById(spanId).innerHTML = mess
            return false
        } else{
            getEle(spanId).innerHTML = ""
            return true
        }
    }
    checkImg(value, spanId, mess){
        if(!value){
            document.getElementById(spanId).innerHTML = mess
            return false
        } else{
            getEle(spanId).innerHTML = ""
            return true
        }
    }
}