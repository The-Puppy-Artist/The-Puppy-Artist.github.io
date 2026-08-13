// Clock Function
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


//Biography Countdown Clock Function
function updateBioCountdown() {
        const livedCounter = document.getElementById('lived-counter');
        const bdayCounter = document.getElementById('bday-counter');

// If counter isnt on page, skips running this function or code
if (!livedCounter || !bdayCounter) return;

        const birthDate = new Date('2005-10-10T00:00:00');
        const currentDate = new Date();

        //1. Time Lived Counter
        const timeLived = currentDate - birthDate;
        const daysLived = Math.floor(timeLived / (1000 * 60 * 60 * 24));
        const hoursLived = Math.floor((timeLived / (1000 * 60 * 60)) % 24);
        const minutesLived = Math.floor((timeLived / (1000 * 60)) % 60);
        const secondsLived = Math.floor((timeLived / 1000) % 60);
        livedCounter.textContent = `${daysLived} days, ${hoursLived} hours, ${minutesLived} minutes, ${secondsLived} seconds`;

        //2. Time Until Next Birthday Counter
        const nextBirthday = new Date(currentDate.getFullYear(), 9, 10);
        
        //if birthday has passed this year, calculate for next year
        // Moved this UP so it fixes the year before doing the math!
        if (currentDate > nextBirthday) {
                nextBirthday.setFullYear(currentDate.getFullYear() + 1);
        }

        const timeUntilBirthday = nextBirthday - currentDate;
        const daysUntilBirthday = Math.floor(timeUntilBirthday / (1000 * 60 * 60 * 24));
        const hoursUntilBirthday = Math.floor((timeUntilBirthday / (1000 * 60 * 60)) % 24);
        const minutesUntilBirthday = Math.floor((timeUntilBirthday / (1000 * 60)) % 60);
        const secondsUntilBirthday = Math.floor((timeUntilBirthday / 1000) % 60);
        bdayCounter.textContent = `${daysUntilBirthday} days, ${hoursUntilBirthday} hours, ${minutesUntilBirthday} minutes, ${secondsUntilBirthday} seconds`;
}

// Don't forget to tell the script to run this every second!
setInterval(updateBioCountdown, 1000);
updateBioCountdown();
