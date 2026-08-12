function updateClocks() {
        const localTime = new Date();
        
        //Standard formatting option (HH:MM:SS, AM/PM)
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };



//1. Viewers Local time here
document.getElementById('clock-local').textContent = localTime.toLocaleTimeString([], options);

//2. Philippine Time (UTC+8)
const phTime = new Date(localTime.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
document.getElementById('clock-ph').textContent = phTime.toLocaleTimeString([], options);

//3. Japanese Time (UTC+9)
const jpTime = new Date(localTime.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
document.getElementById('clock-jp').textContent = jpTime.toLocaleTimeString([], options);

};

//Runs immedietly so the clocks dont show blank for a second
updateClocks();

// Updates the clocks every 1000 milliseconds (1 second)
setInterval(updateClocks, 1000);

