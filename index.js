var allPosData = [];
var xBounds = 150;
var yBounds = 100;
var nextId = 0;

const currentDate = new Date();
document.getElementById("dateTask").setAttribute("min",currentDate.toISOString().slice(0,10));

allPosData = JSON.parse(localStorage.getItem("CircleData"));

if ((allPosData !== null) &&(allPosData !== "")){
    nextId = allPosData.length;
}else{
    allPosData = [];
}

for (var i = 0; i < allPosData.length; i++){
    var objectDate = new Date(allPosData[i].date);
    allPosData[i].date = objectDate;
    allPosData[i].size = giveSize(allPosData[i].date);
    var newCircle = allPosData[i];
    var node = document.createElement("div");
    node.setAttribute("id",newCircle.id);
    document.querySelector("#bubbleCanvas").appendChild(node);
    document.getElementById(newCircle.id).innerHTML = '<h4></h4><p></p><p></p><p></p>';
    document.getElementById(newCircle.id).childNodes[0].textContent = newCircle.name;
    document.getElementById(newCircle.id).childNodes[1].textContent = newCircle.description;
    var date = newCircle.date;
    document.getElementById(newCircle.id).childNodes[2].textContent = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    document.getElementById(newCircle.id).childNodes[3].textContent = newCircle.time;
    document.getElementById(newCircle.id).classList.add("size"+newCircle.size);
    document.getElementById(newCircle.id).classList.add("circle");
    document.getElementById(newCircle.id).classList.add("circle:hover");
    document.getElementById(newCircle.id).style.backgroundColor = newCircle.color;
    attachListeners(newCircle.id);
    shiftPos(newCircle);
}

function shiftPos(circle){
    var radius = getRadius(circle.size);
    var xShift = (circle.x - radius) + "px";
    var yShift = (circle.y - radius) + "px";
    document.getElementById(circle.id).style.top = yShift;
    document.getElementById(circle.id).style.left = xShift;
}

class Circle {

    constructor(name, date, time, color, id, description = "") {
        this.id = id;
        this.name = name;
        this.date = date;
        this.color = color;
        this.time = time;
        this.description = description;
        this.size = giveSize(this.date);
        this.x = 0;
        this.y = 0;
    }
}
function giveSize(date){
    var dayDiff = Math.abs((date - currentDate)/(1000 * 60 * 60 * 24));
    console.log(dayDiff);
    if(dayDiff > 7){
        console.log(4);
        return 4;
    }else if((dayDiff <= 7)&&(dayDiff >= 5)){
        console.log(3);
        return 3;
    }else if((dayDiff < 5)&&(dayDiff >= 2)){
        console.log(2);
        return 2;
    }else{
        console.log(1);
        return 1;
    }
}
function giveId(){
    var oldId = nextId;
    nextId++;
    return oldId;
}
function decrementId(){
    nextId--;
}
function getNextId(){
    return nextId;
}

function getRadius(size){
    switch(size){
        case 1:
            return 120;//60
        case 2:
            return 80;//40
        case 3:
            return 60;//30
        case 4:
            return 40;//20
        default:
            break;
    }
}

document.getElementById("submitBtn").addEventListener("click",function(e){
    var name = document.getElementById("nameTask").value;               //string type
    var description = document.getElementById("descriptionTask").value; //string type
    var date = document.getElementById("dateTask").valueAsDate;  
    var time = document.getElementById("timeTask").value;                                
    var newCircle = new Circle(name,date,time,colorSelected(),giveId(),description);
    var node = document.createElement("div");
    node.setAttribute("id",newCircle.id);
    document.querySelector("#bubbleCanvas").appendChild(node);
    document.getElementById(newCircle.id).innerHTML = '<h4></h4><p></p><p></p><p></p>';
    document.getElementById(newCircle.id).childNodes[0].textContent = newCircle.name;
    document.getElementById(newCircle.id).childNodes[1].textContent = newCircle.description;
    var date = newCircle.date;
    document.getElementById(newCircle.id).childNodes[2].textContent = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    document.getElementById(newCircle.id).childNodes[3].textContent = newCircle.time;
    document.getElementById(newCircle.id).classList.add("size"+newCircle.size);
    document.getElementById(newCircle.id).classList.add("circle");
    document.getElementById(newCircle.id).classList.add("circle:hover");
    document.getElementById(newCircle.id).style.backgroundColor = newCircle.color;
    var posData = shift(newCircle.id,newCircle.size);
    newCircle.x = posData[0];
    newCircle.y = posData[1];
    attachListeners(newCircle.id);
    allPosData.push(newCircle);
    console.log(allPosData)
    var updatedData = JSON.stringify(allPosData);
    localStorage.setItem("CircleData",updatedData);
    document.getElementById("nameTask").value = "";
    document.getElementById("descriptionTask").value = "";
    document.getElementById("timeTask").value = "";
    document.getElementById("closeBtn").click();
});
/*
Colors:
1: #DB5657 (Red)
2: #67BB6D (Green)
3: #3DC7C7 (Sky blue)
4: #D4DC6C (Yellow)
5: #9292C8 (Purple)
6: #60DAAC (Florescent Green)
*/
function colorSelected(){
    if (document.getElementById("colorTask1").checked){
        return "#DB5657";
    }else if(document.getElementById("colorTask2").checked){
        return "#67BB6D";
    }else if(document.getElementById("colorTask3").checked){
        return "#3DC7C7";
    }else if(document.getElementById("colorTask4").checked){
        return "#D4DC6C";
    }else if(document.getElementById("colorTask5").checked){
        return "#9292C8";
    }else{
        return "#DB5657";
    }
}
function shift(id,size){
    var tries = 0;
    while(true){
        var randomData = randomPos();
        var x = randomData[0];
        var y = randomData[1];
        var overlap = checkOverlap(x,y,size)
        if(overlap===false){
            break;
        }
        if(tries === 100){
            increaseBounds();
            tries = 0;
        }
        tries++;
    }
    var xShift = x - getRadius(size);
    var yShift = y - getRadius(size);
    console.log(getRadius(size));
    var circle = document.getElementById(id);
    xShift = xShift + "px";
    yShift = yShift + "px"; 
    circle.style.left = xShift;
    circle.style.top = yShift;
    var posData = [x,y];
    console.log(posData);
    return posData;
}

function randomPos(){
    var x = Math.random();
    var y = Math.random();
    x *= xBounds;
    x += 120;
    y *= yBounds;
    y += 120;
    x = Math.floor(x);
    y = Math.floor(y);
    var randomData = [x,y];
    return randomData;
}
//x -> center of circle
//y -> center of circle

function increaseBounds(){
    xBounds += 30;
    yBounds += 10;
}

function checkOverlap(x,y,size){
    for (var id = 0; id < allPosData.length; id++){
        console.log(allPosData)
        var xDiffSqr = Math.pow((allPosData[id].x - x),2);
        var yDiffSqr = Math.pow((allPosData[id].y - y),2);
        var distanceBtwCentres = Math.sqrt((xDiffSqr + yDiffSqr));
        if (distanceBtwCentres <= (getRadius(size) + getRadius(allPosData[id].size) + 5)){
            return true; //overlap
        }
    }
    return false; //Does not overalp
}

document.getElementById("addBtn").addEventListener("click",switchToAddScreen);

document.getElementById("closeBtn").addEventListener("click",switchToCanvas);

function switchToAddScreen(){
    //console.log("switchToAddScreen");
    document.getElementById("dateTask").value = currentDate.toISOString().slice(0,10);
    document.getElementById("addMenu").style.display = "block";
    document.getElementById("bubbleCanvas").style.display = "none";
}

function switchToCanvas(){
    //console.log("switchToCanvas");
    document.getElementById("addMenu").style.display = "none";
    document.getElementById("bubbleCanvas").style.display = "block";
}

function attachListeners(id){

    document.getElementById(id).addEventListener("mouseenter",function(e){
        showDetails(this.id);
    });
    document.getElementById(id).addEventListener("mouseleave",function(e){
        hideDetails(this.id);
    });
    document.getElementById(id).addEventListener("click",function(e){
        if (e.timeStamp > 3000){
            deleteBubble(id);
            popSound.play();
            popSound.volume="1";
        }
    });
}

function showDetails(id){
    //console.log("showing details");
    document.getElementById(id).childNodes[1].style.display = "block";
    document.getElementById(id).childNodes[2].style.display = "block";
    document.getElementById(id).childNodes[3].style.display = "block";
    var x = allPosData[id].x;
    var y = allPosData[id].y;
    var xShift = x - 120;
    var yShift = y - 120;
    var circle = document.getElementById(id);
    xShift = xShift + "px";
    yShift = yShift + "px";
    console.log(x);
    console.log(y);  
    circle.style.left = xShift;
    circle.style.top = yShift;
    
}

function hideDetails(id){
    //console.log("hiding details");
    document.getElementById(id).childNodes[1].style.display = "none";
    document.getElementById(id).childNodes[2].style.display = "none";
    document.getElementById(id).childNodes[3].style.display = "none";
    var x = allPosData[id].x;
    var y = allPosData[id].y;
    var size = allPosData[id].size;
    var xShift = x - getRadius(size);
    var yShift = y - getRadius(size);
    var circle = document.getElementById(id);
    xShift = xShift + "px";
    yShift = yShift + "px"; 
    console.log(x); 
    console.log(y); 
    circle.style.left = xShift;
    circle.style.top = yShift;
}

var popSound = new Audio("assets/pop.mp3");

function deleteBubble(id){
    var nodeToRemove = document.getElementById(id);
    console.log(nodeToRemove);
    document.getElementById("bubbleCanvas").removeChild(nodeToRemove);
    if (id === allPosData.length-1){
        allPosData.pop();
    }else{
        var lastElement = allPosData.pop();
        document.getElementById(lastElement.id).setAttribute("id",id);
        attachListeners(id);
        lastElement.id = id;
        allPosData[id] = lastElement;  
    }
    decrementId();
    var updatedData = JSON.stringify(allPosData);
    localStorage.setItem("CircleData",updatedData);
}

function resetData(){
    localStorage.setItem("CircleData","[]");
}

/*
Colors:
1: #DB5657 (Red)
2: #67BB6D (Green)
3: #3DC7C7 (Sky blue)
4: #D4DC6C (Yellow)
5: #9292C8 (Purple)
6: #60DAAC (Florescent Green)
*/
