$(document).ready(function ()
{
    $('.collapsible').collapsible({
        accordion : true 
    });
});
$(document).ready(function () 
{
    $('#relays').submit(function () 
    {
        $(this).find(':input').filter(function () 
        {
            return !this.value;
        }).attr('disabled', 'disabled');
        return true;
    });
});
function systemTime() 
{
    var today = new Date();
    var h = today.getHours();
    if (h < 10) {
        h = "0" + h;
    };
    var m = today.getMinutes();
    if (m < 10) {
        m = "0" + m;
    };
    document.getElementById('SystemTime').value = h + ":" + m;
    var t = setTimeout(systemTime, 1000);
}
var timercounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
function loadLabel(divId)
{
    try {
        document.getElementById(divId).value = obj.Labels[divId];
    }
    catch (e) {
        //console.log(e);
    }
}
function loadIntervals(divId)
{
    var divNum = divId.replace(/\D/g, '');
    if (["Relay" + divNum] in obj["Intervals"]) {
        typeInterval(divId);
    }
}
function typeInterval(divId) 
{
    var divNum = divId.replace(/\D/g, '');
    var myNode = document.getElementById(divId);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    var onlabel = document.createElement('label');
    onlabel.innerHTML = "On interval (minutes)";
    var offlabel = document.createElement('label');
    offlabel.innerHTML = "Off interval (minutes)";
    var newon = document.createElement('input');
    newon.name = "[Intervals]" + "Relay" + divNum + "[On]";
    newon.type = 'number';
    newon.min = '1';
    newon.max = '1440';
    try {
        newon.value = obj["Intervals"]["Relay" + divNum]["On"];
    }
    catch (e) {
        //console.log(e);
    }
    var newoff = document.createElement('input');
    newoff.name = "[Intervals]" + "Relay" + divNum + "[Off]";
    newoff.type = 'number';
    newoff.min = '1';
    newoff.max = '1440';
    try {
        newoff.value = obj["Intervals"]["Relay" + divNum]["Off"];
    }
    catch (e) {
        //console.log(e);
    }
    timercounter[divNum] = 0;
    document.getElementById("btnIntervals" + divNum).className = "btn disabled";
    document.getElementById("btnTimes" + divNum).className = "btn";
    document.getElementById(divId).appendChild(newon);
    document.getElementById(divId).appendChild(onlabel);
    document.getElementById(divId).appendChild(newoff);
    document.getElementById(divId).appendChild(offlabel);
}
function loadTimes(divId)
{
    var divNum = divId.replace(/\D/g, '');
    var myNode = document.getElementById(divId);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    var addButton = document.createElement('input');
    addButton.id = "add" + divNum;
    addButton.type = 'button';
    addButton.value = "+";
    addButton.className = 'btn-floating btn-large green';
    addButton.setAttribute("onclick", "addInput('" + divId + "')");
    document.getElementById("btnTimes" + divNum).className = "btn disabled";
    document.getElementById("btnIntervals" + divNum).className = "btn";
    document.getElementById(divId).appendChild(addButton);
    timercounter[divNum] = 0;
    typeTime(divId);
}
function typeTime(divId)
{
    var divNum = divId.replace(/\D/g, '');
    var newdiv = document.createElement('div');
    newdiv.id = divId + "onoff" + timercounter[divNum];
    var newline = document.createElement('h6');
    newline.id = divId + "onoff" + timercounter[divNum];
    newline.className = "divider";
    var onlabel = document.createElement('label');
    onlabel.innerHTML = "On time " + (timercounter[divNum] + 1) + ": ";
    onlabel.id = divId + "onoff" + timercounter[divNum];
    var offlabel = document.createElement('label');
    offlabel.innerHTML = "Off time " + (timercounter[divNum] + 1) + ": ";
    offlabel.id = divId + "onoff" + timercounter[divNum];
    var newon = document.createElement('input');
    newon.id = divId + "onoff" + timercounter[divNum];
    newon.name = "[Times]" + "Relay" + divNum + "[On]" + "[]";
    newon.type = 'time';
    try {
        newon.value = obj["Times"]["Relay" + divNum]["On"][timercounter[divNum]];
    }
    catch (e) {
        //console.log(e);
    }
    var newoff = document.createElement('input');
    newoff.id = divId + "onoff" + timercounter[divNum];
    newoff.name = "[Times]" + "Relay" + divNum + "[Off]" + "[]";
    newoff.type = 'time';
    try {
        newoff.value = obj["Times"]["Relay" + divNum]["Off"][timercounter[divNum]];
    }
    catch (e) {
        //console.log(e);
    }
    var a = "removeInput('";
    var c = "')";
    var remove = document.createElement('input');
    remove.id = divId + "onoff" + timercounter[divNum];
    remove.className = "btn red";
    remove.setAttribute("type", "button");
    remove.setAttribute("value", "Delete");
    remove.setAttribute("onclick", a + divId + "onoff" + timercounter[divNum] + c);
    try 
    {
        if (timercounter[divNum] in obj["Times"]["Relay" + divNum]["On"]) 
        {
            document.getElementById("btnTimes" + divNum).className = "btn disabled";
            document.getElementById("btnIntervals" + divNum).className = "btn";
            $(newon).insertBefore('#' + 'add' + divNum);
            $(onlabel).insertBefore('#' + 'add' + divNum);
            $(newoff).insertBefore('#' + 'add' + divNum);
            $(offlabel).insertBefore('#' + 'add' + divNum);
            $(newdiv).insertBefore('#' + 'add' + divNum);
            $(remove).insertBefore('#' + 'add' + divNum);
            $(newline).insertBefore('#' + 'add' + divNum);
            timercounter[divNum]++;
            typeTime(divId);
        }
    }
    catch (e) {
        //console.log(e);
    }
}
function addInput(divId)
{
    var divNum = divId.replace(/\D/g, '');
    var newdiv = document.createElement('div');
    newdiv.id = divId + "onoff" + timercounter[divNum];
    var newline = document.createElement('h6');
    newline.id = divId + "onoff" + timercounter[divNum];
    newline.className = "divider";
    var onlabel = document.createElement('label');
    onlabel.innerHTML = "On time " + (timercounter[divNum] + 1) + ": ";
    onlabel.id = divId + "onoff" + timercounter[divNum];
    onlabel.setAttribute("for", divId + "onoff" + timercounter[divNum]);
    var offlabel = document.createElement('label');
    offlabel.innerHTML = "Off time " + (timercounter[divNum] + 1) + ": ";
    offlabel.id = divId + "onoff" + timercounter[divNum];
    offlabel.setAttribute("for", divId + "onoff" + timercounter[divNum]);
    var newon = document.createElement('input');
    newon.name = "[Times]" + "Relay" + divNum + "[On]" + "[]";
    newon.id = divId + "onoff" + timercounter[divNum];
    newon.type = 'time';
    var newoff = document.createElement('input');
    newoff.name = "[Times]" + "Relay" + divNum + "[Off]" + "[]";
    newoff.id = divId + "onoff" + timercounter[divNum];
    newoff.type = 'time';
    var a = "removeInput('";
    var c = "')";
    var remove = document.createElement('input');
    remove.id = divId + "onoff" + timercounter[divNum];
    remove.className = "btn red";
    remove.setAttribute("type", "button");
    remove.setAttribute("value", "Delete");
    remove.setAttribute("onclick", a + divId + "onoff" + timercounter[divNum] + c);
    $(newon).insertBefore('#' + 'add' + divNum);
    $(onlabel).insertBefore('#' + 'add' + divNum);
    $(newoff).insertBefore('#' + 'add' + divNum);
    $(offlabel).insertBefore('#' + 'add' + divNum);
    $(newdiv).insertBefore('#' + 'add' + divNum);
    $(remove).insertBefore('#' + 'add' + divNum);
    $(newline).insertBefore('#' + 'add' + divNum);
    timercounter[divNum]++;
}
function removeInput(divId)
{
    var divNum = divId.split("]")[0];
    divNum = divNum.replace(/\D/g, '');
    document.getElementById(divId).remove();
    document.getElementById(divId).remove();
    document.getElementById(divId).remove();
    document.getElementById(divId).remove();
    document.getElementById(divId).remove();
    document.getElementById(divId).remove();
    document.getElementById(divId).remove();
    timercounter[divNum]--;
}
