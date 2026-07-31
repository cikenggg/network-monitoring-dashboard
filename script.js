let cpuHistory = [];
let timeHistory = [];

let cpuChart;

let currentFilter = "ALL";
let currentKeyword = "";

const ctx = document.getElementById('cpuChart');


cpuChart = new Chart(ctx, {

type:'line',

data:{

labels:timeHistory,

datasets:[{

label:'Average CPU %',

data:cpuHistory

}]

},

options:{

responsive:true

}

});

let devices = [];

function updateDashboard(filter="ALL", keyword=""){

let alertBox = document.getElementById("alerts");

alertBox.innerHTML = "";

let table = document.getElementById("deviceTable");

table.innerHTML="";


let online = 0;

let critical = 0;
let warning = 0;


devices.filter(device => {


if(filter=="ONLINE" && device.status!="UP"){
return false;
}


if(filter=="OFFLINE" && device.status!="DOWN"){
return false;
}


if(keyword && !device.name.toLowerCase().includes(keyword.toLowerCase())){
return false;
}


return true;


}).forEach(device=>{


// random CPU simulation

if(device.status=="UP" && device.name!="Core-Router-KL"){
device.cpu = Math.floor(Math.random()*71)+30;
}


// count online

if(device.status=="UP"){
online++;
}



let row = `

<tr onclick="showDevice('${device.name}')">

<td>${device.name}</td>

<td>${device.ip}</td>

<td>

<span class="${device.status=='UP'?'status-up':'status-down'}">

${device.status=="UP"?"🟢 UP":"🔴 DOWN"}

</span>

</td>

<td>${device.cpu}%</td>
<td>${device.last_check}</td>

</tr>

`;


table.innerHTML += row;

if(device.status=="DOWN"){
   
 critical++;

alertBox.innerHTML += `

<div class="alert">

🚨 ALERT: ${device.name}
<br>
Status: DOWN
<br>
IP: ${device.ip}

</div>

`;

}


if(device.cpu > 80){


warning++;

alertBox.innerHTML += `

<div class="warning">

⚠ WARNING: ${device.name}
<br>
High CPU Usage: ${device.cpu}%

</div>

`;

}


});

document.getElementById("totalDevice").innerHTML = devices.length;


document.getElementById("onlineDevice").innerHTML = online;


document.getElementById("offlineDevice").innerHTML =
devices.length - online;

let totalCPU = 0;
let countCPU = 0;


devices.forEach(device=>{

if(device.status=="UP"){

totalCPU += device.cpu;
countCPU++;

}

});


let averageCPU = Math.round(totalCPU/countCPU);


cpuHistory.push(averageCPU);
timeHistory.push(new Date().toLocaleTimeString());


if(cpuHistory.length > 10){

cpuHistory.shift();
timeHistory.shift();

}


cpuChart.update();

// update time

document.getElementById("time").innerHTML =
new Date().toLocaleTimeString();

document.getElementById("criticalAlert").innerHTML = critical;


document.getElementById("warningAlert").innerHTML = warning;


}



loadDevices();


// refresh every 3 seconds

setInterval(()=>{

loadDevices();

},3000);

function showAll(){

currentFilter="ALL";
updateDashboard(currentFilter,currentKeyword);

}


function showOnline(){

currentFilter="ONLINE";

updateDashboard(currentFilter,currentKeyword);

}


function showOffline(){

currentFilter="OFFLINE";

updateDashboard(currentFilter,currentKeyword);

}


function searchDevice(){

currentKeyword = document.getElementById("searchBox").value;

updateDashboard(currentFilter,currentKeyword);

}

function showDevice(name){


let device = devices.find(d => d.name == name);


document.getElementById("deviceDetails").innerHTML = `

<h3>${device.name}</h3>

<p>IP Address: ${device.ip}</p>

<p>Status: ${device.status}</p>

<p>CPU Usage: ${device.cpu}%</p>

<p>Last Check: ${new Date().toLocaleTimeString()}</p>

`;


}

const nodes = new vis.DataSet([

{id:1,label:"📡 Access Point\n192.168.1.1"},

{id:2,label:"💻 Laptop\n192.168.1.211"},

{id:3,label:"📱 Xiaomi\n192.168.1.250"},

{id:4,label:"📱 Nubia\n192.168.1.187"}

]);


const edges = new vis.DataSet([

{from:1,to:2},

{from:1,to:3},

{from:1,to:4}

]);


const container =
document.getElementById("networkMap");


const data = {

nodes:nodes,

edges:edges

};


const options = {

nodes:{

shape:"box"

}

};


new vis.Network(container,data,options);

function updateTopology(){

    devices.forEach(device=>{

        let color = device.status=="UP"
        ? "lightgreen"
        : "red";

        if(nodes.get(device.id)){

            nodes.update({

                id: device.id,

                label:
                (device.type=="Phone"?"📱":
                device.type=="Laptop"?"💻":
                "📡")
                +
                " "+device.name+
                "\n"+
                device.ip,

                color:{
                    background: color,
                    border:"#333"
                }

            });

        }

    });

}

async function loadDevices(){

const response = await fetch("http://127.0.0.1:5000/api/devices");

devices = await response.json();

updateDashboard(currentFilter,currentKeyword);

updateTopology();

}