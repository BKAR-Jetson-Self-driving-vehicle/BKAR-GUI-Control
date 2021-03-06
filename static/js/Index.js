// Warning
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    alert("Giao diện không phù hợp cho thiết bị di động, vui lòng truy cập vào bằng thiết bị màn hình lớn!");
}



// Time
function showTime(){
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds();
    var session = "AM";
    
    if(h == 0){
        h = 12;
    }
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("MyClockDisplay").innerText = time;
    setTimeout(showTime, 1000);
}
showTime();

// System Information
const api_system_url = '/System';
async function getSystemData(){
    try{
        const response = await fetch(api_system_url);
        const data = await response.json();
        if(data.CONNECTED === true){
            document.getElementById("ip-address").innerText = data.IP;
            if(document.getElementById("ScreenFrame").contentWindow.location.href.split('/')[3] == 'Stream'){
                document.getElementById("delay").innerText = "Stream: " + String(Date.now() - data.TIMESTAMP) + " ms";
            }
            else{
                document.getElementById("delay").innerText = "Stream: -- ms";
            }
            document.getElementById("gear").innerText = data.GEAR;
            document.getElementById("voltage").innerText = data.VOLTAGE + " V";
            document.getElementById("distance").innerText = data.DISTANCE + " Cm";
        }
        else{
            document.getElementById("ip-address").innerText = "Chưa kết nối";
            document.getElementById("delay").innerText = "Stream: -- ms";
            document.getElementById("voltage").innerText = "--- V";
            document.getElementById("distance").innerText = "--- cm";
            // document.getElementById("Traffic-Sign").style.filter = invert();
            // document.getElementById("Self-Driving-mode").style.filter = invert();
            // document.getElementById("Remote-Control-mode").style.filter = invert();
        }
    }
    finally{
        setTimeout(getSystemData, 500);
    }
}
getSystemData();

// Footer status bar
const api_motor_url = '/Motor';
const api_sensor_url = '/Sensor';
async function getFooterData(){
    try{
        const response_motor = await fetch(api_motor_url);
        const response_sensor = await fetch(api_sensor_url);
        const motor = await response_motor.json();
        const sensor = await response_sensor.json();
        
        document.getElementById("rateA").innerText = motor.A_RATE;
        document.getElementById("rateB").innerText = motor.B_RATE;
        document.getElementById("speed").innerText = motor.SPEED;

        document.getElementById("x-axis").innerText = sensor.X;
        document.getElementById("y-axis").innerText = sensor.Y;
        document.getElementById("z-axis").innerText = sensor.Z;
    }
    finally{
        setTimeout(getFooterData, 50);
    }
}
getFooterData();

// Light status
const api_light_url = '/Light';
async function getLightData(){
    try{
        const response_light = await fetch(api_light_url);
        const lights = await response_light.json();
        
        // document.getElementById('left-light').style.filter = invert();
        // document.getElementById('head-light').hidden = lights.HEAD;
        // document.getElementById('light-light').hidden = lights.RIGHT;
    }
    finally{
        setTimeout(getLightData, 500);
    }
}
getLightData();

// Main Frame Navigation Buttons
document.getElementById("StreamButton").onclick = function StreamButtonClicked(){
    document.getElementById("ScreenFrame").src = "/Connection";
}

document.getElementById("ControllerButton").onclick = function ControllerButtonClicked(){
    document.getElementById("ScreenFrame").src = "/Controller";
}

document.getElementById("LogsButton").onclick = function LogsButtonClicked(){
    document.getElementById("ScreenFrame").src = "/Logs";
}

document.getElementById("InforButton").onclick = function InforButtonClicked(){
    document.getElementById("ScreenFrame").src = "/Information";
}

// Gamepad api
const api_control_url = '/Control';
function createDictKey(myGamepad){
    var KEY = {'BUTTON':{}, 'AXIS':{}}
    for(i=0; i<myGamepad.axes.length; i++){
        KEY['AXIS'][String(i)]= myGamepad.axes[i];
    }
    for(i=0; i<myGamepad.buttons.length; i++){
        KEY['BUTTON'][String(i)]= myGamepad.buttons[i].value;
    }
    return KEY;
}

function Controller(){
    const myGamepad = navigator.getGamepads()[0];
    if(myGamepad != null){
        KEY = createDictKey(myGamepad);
        if (myGamepad.connected) {
            fetch(api_control_url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"CONNECTED": true})
            }).then(response => {
                return response.json()
            });
            fetch(api_control_url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(KEY)
            }).then(response => {
                return response.json()
            });
        }
        else{
            fetch(api_control_url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"CONNECTED": false})
            }).then(response => {
                return response.json()
            });
        }
    }
    else{
        fetch(api_control_url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"CONNECTED": false})
        }).then(response => {
            return response.json()
        });
    }
    setTimeout(Controller, 100);
}
Controller();