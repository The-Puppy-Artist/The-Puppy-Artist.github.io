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

/* --- DYNAMIC SIDEBAR SCANNER FOR logTemplate.html --- */
document.addEventListener("DOMContentLoaded", () => {
    const sidebarList = document.getElementById("sidebar-log-list");
    const markdownContent = document.getElementById("markdown-content");
    const postTitleDisplay = document.getElementById("post-title-display");

    // UPDATE THIS TO YOUR EXACT GITHUB USERNAME / REPOSITORY
    const githubRepo = "The-Puppy-Artist/The-Puppy-Artist.github.io"; 

    // Get the current post parameter from the URL (e.g., ?post=2026-08-22-test-run-3.md)
    const urlParams = new URLSearchParams(window.location.search);
    const currentPost = urlParams.get("post");

    const apiUrl = `https://api.github.com/repos/${githubRepo}/contents/content/blog`;

    // 1. Fetch the file list for the sidebar
    if (sidebarList) {
        fetch(apiUrl)
            .then(res => {
                if (!res.ok) throw new Error("Unable to read logs.");
                return res.json();
            })
            .then(files => {
                sidebarList.innerHTML = ""; // Clear "Scanning..."

                files.forEach(file => {
                    if (file.name.endsWith(".md")) {
                        let displayName = file.name.replace(/^[0-9]{4}-[0-9]{2}-[0-9]{2}-/, "").replace(".md", ".txt");

                        const item = document.createElement("a");
                        item.href = `logTemplate.html?post=${file.name}`;
                        item.className = "sidebar-file-item";
                        item.innerHTML = `📄 ${displayName}`;

                        // If no post is selected yet, default to the first file found
                        if (!currentPost && file === files.find(f => f.name.endsWith(".md"))) {
                            window.location.href = `logTemplate.html?post=${file.name}`;
                            return;
                        }

                        // Highlight the active file
                        if (file.name === currentPost) {
                            item.classList.add("active-log");
                        }

                        sidebarList.appendChild(item);
                    }
                });
            })
            .catch(error => {
                sidebarList.innerHTML = `<span style="color: var(--accent-red); font-size: 14px;">[ERR: Offline]</span>`;
                console.error("Sidebar Error:", error);
            });
    }

    // 2. If a specific post is requested, fetch and render its markdown contents
    if (currentPost && markdownContent) {
        const fileUrl = `https://raw.githubusercontent.com/${githubRepo}/main/content/blog/${currentPost}`;

        if (postTitleDisplay) {
            postTitleDisplay.textContent = currentPost.replace(".md", ".txt");
        }

        fetch(fileUrl)
            .then(res => {
                if (!res.ok) throw new Error("Post not found.");
                return res.text();
            })
            .then(markdownText => {
                let cleanMarkdown = markdownText;
                if (markdownText.startsWith("---")) {
                    const parts = markdownText.split("---");
                    if (parts.length >= 3) {
                        cleanMarkdown = parts.slice(2).join("---").trim();
                    }
                }

                // Parse markdown and reveal the paper
                markdownContent.innerHTML = marked.parse(cleanMarkdown);
                markdownContent.classList.add("loaded"); // <--- Add this line
            })
            .catch(error => {
                markdownContent.innerHTML = `<p style="color: var(--accent-red);">[Error: Could not load log contents.]</p>`;
                console.error("Post Load Error:", error);
            });
    }
});

/* --- Deter Casual Inspection --- */
// Disables the right-click context menu entirely
document.addEventListener('contextmenu', event => event.preventDefault());

// Disables common shortcut keys like F12, Ctrl+Shift+I, Ctrl+U
//document.addEventListener('keydown', event => {
    //if (
        //event.key === 'F12' || 
        //(event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J' || event.key === 'C')) || 
        //(event.ctrlKey && event.key === 'U')
    //) {
        //event.preventDefault();
        //alert("[SYSTEM LOCK]: Unauthorized inspection attempt blocked.");
    //}
//});

/* --- DYNAMIC PHOTO GALLERY SCANNER --- */
document.addEventListener("DOMContentLoaded", () => {
    const photoGrid = document.getElementById("dynamic-photo-grid");

    if (photoGrid) {
        const githubRepo = "The-Puppy-Artist/The-Puppy-Artist.github.io";
        const apiUrl = `https://api.github.com/repos/${githubRepo}/contents/content/photos`;

        fetch(apiUrl)
            .then(res => {
                if (!res.ok) throw new Error(`API returned status ${res.status}`);
                return res.json();
            })
            .then(async files => {
                const markdownFiles = files.filter(file => file.name.endsWith(".md"));
                
                // If no CMS posts are found, leave the HTML fallback alone so it doesn't go blank!
                if (markdownFiles.length === 0) return;

                // Only clear if we actually have dynamic photos to add
                let generatedHTML = "";

                for (const file of markdownFiles) {
                    try {
                        const response = await fetch(file.download_url);
                        const text = await response.text();

                        const parts = text.split("---");
                        if (parts.length >= 3) {
                            const yamlData = parts[1];
                            
                            const imgMatch = yamlData.match(/image:\s*(['"]?)(.*?)\1/);
                            const capMatch = yamlData.match(/caption:\s*(['"]?)(.*?)\1/);

                            if (imgMatch && imgMatch[2]) {
                                let imgPath = imgMatch[2].trim();
                                let caption = capMatch && capMatch[2] ? capMatch[2].trim() : "Capture";

                                if (imgPath.startsWith("/")) {
                                    imgPath = imgPath.substring(1);
                                }

                                generatedHTML += `
                                    <div class="photo-frame">
                                        <img src="${imgPath}" alt="${caption}">
                                        <div class="photo-caption" style="text-align:center; margin-top:5px; font-size:18px;">${caption}</div>
                                        <div class="image-shield"></div>
                                    </div>
                                `;
                            }
                        }
                    } catch (err) {
                        console.error("Error parsing photo:", err);
                    }
                }

                // If we successfully generated frames, update the grid
                if (generatedHTML !== "") {
                    photoGrid.innerHTML = generatedHTML;
                }
            })
            .catch(error => {
                console.error("Photo Gallery API Error:", error);
            });
    }
});