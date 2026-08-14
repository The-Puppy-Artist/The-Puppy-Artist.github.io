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

/* --- BLOG POST FETCHER & TRANSLATOR --- */
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Check the URL for the '?post=' parameter
    const urlParams = new URLSearchParams(window.location.search);
    const postFile = urlParams.get('post');

    // 2. If we are on the template page and a file is requested, fetch it!
    if (postFile && document.querySelector('.post-body')) {
        
        // Point the fetch API to your Decap CMS content folder
        fetch(`content/blog/${postFile}`)
            .then(response => {
                if (!response.ok) throw new Error("File not found in the directory.");
                return response.text();
            })
            .then(text => {
                // 3. Decap CMS puts data (title, date) at the top of the file between '---' lines.
                // We need to split that "frontmatter" away from the main blog text.
                const splitText = text.split('---');
                
                let markdownBody = text; 
                let title = postFile.replace('.md', '');
                let date = "Unknown Date";

                // If the file has standard CMS formatting
                if (splitText.length >= 3) {
                    const frontmatter = splitText[1];
                    markdownBody = splitText.slice(2).join('---'); // Everything after the top data

                    // Extract the title and date using basic matching
                    const titleMatch = frontmatter.match(/title:\s*"?([^"\n]+)"?/);
                    if (titleMatch) title = titleMatch[1];
                    
                    const dateMatch = frontmatter.match(/date:\s*(.*?)\s/);
                    if (dateMatch) date = new Date(dateMatch[1]).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    });
                }

                // 4. Inject the Title and Date into the retro UI
                document.querySelector('.title-text').textContent = title + ".txt";
                document.querySelector('.post-meta').innerHTML = `
                    <strong>AUTHOR:</strong> The Puppy Artist <br>
                    <strong>LOG DATE:</strong> ${date} <br>
                    <strong>SUBJECT:</strong> ${title}
                `;
                
                // 5. Use Marked.js to translate the markdown body into HTML and inject it
                document.querySelector('.post-body').innerHTML = marked.parse(markdownBody);
            })
            .catch(error => {
                // If it fails, show a classic system error message
                document.querySelector('.post-body').innerHTML = `<p style="color: red;">[SYSTEM ERROR]: Cannot retrieve log entry. ${error.message}</p>`;
            });
    }
});

/* --- AUTOMATED DIRECTORY SCANNER --- */
document.addEventListener("DOMContentLoaded", () => {
    
    const grid = document.getElementById('dynamic-folder-grid');
    
    // Only run this script if we are actually on the blog.html page
    if (grid) {
        // UPDATE THIS WITH YOUR ACTUAL GITHUB INFO (e.g., "Gabriel-Alistair/BlogFolio")
        const githubRepo = "The-Puppy-Artist/The-Puppy-Artist.github.io"; 
        
        // The GitHub API endpoint to read the contents of a specific folder
        const apiUrl = `https://api.github.com/repos/${githubRepo}/contents/content/blog`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error("Could not connect to the directory.");
                return response.json();
            })
            .then(files => {
                // Clear any loading text
                grid.innerHTML = "";

                // Loop through every file GitHub finds in that folder
                files.forEach(file => {
                    // We only want to create icons for markdown files
                    if (file.name.endsWith('.md')) {
                        
                        // Create the visible text label (e.g., changing "2026-08-14-test.md" to "test.txt")
                        let displayName = file.name.replace(/^[0-9]{4}-[0-9]{2}-[0-9]{2}-/, ''); // Strips the date
                        displayName = displayName.replace('.md', '.txt'); // Changes extension for aesthetics

                        // Build the HTML for the icon
                        const fileLink = document.createElement('a');
                        fileLink.href = `logTemplate.html?post=${file.name}`;
                        fileLink.className = 'folder-icon';
                        fileLink.innerHTML = `
                            <div class="icon-img">📄</div>
                            <span>${displayName}</span>
                        `;

                        // Drop the new icon onto the desktop!
                        grid.appendChild(fileLink);
                    }
                });
            })
            .catch(error => {
                grid.innerHTML = `<p style="color: var(--accent-red);">[SYSTEM ERROR]: ${error.message}</p>`;
            });
    }
});