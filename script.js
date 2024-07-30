// Function to handle section display
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Example functions for the Log Work Hours section
function logHours() {
    // Add your logging functionality here
    console.log('Work hours logged');
}

// Example functions for the Track Task Time section
let timerInterval;
let elapsedTime = 0;

function startTimer() {
    document.querySelector('.stop-btn').disabled = false;
    document.querySelector('.start-btn').disabled = true;

    timerInterval = setInterval(() => {
        elapsedTime += 1;
        const hours = Math.floor(elapsedTime / 3600);
        const minutes = Math.floor((elapsedTime % 3600) / 60);
        const seconds = elapsedTime % 60;
        document.getElementById('timerTime').textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    document.querySelector('.start-btn').disabled = false;
    document.querySelector('.stop-btn').disabled = true;

    const taskDescription = document.getElementById('taskDescription').value;
    if (taskDescription) {
        const taskList = document.getElementById('taskList');
        const listItem = document.createElement('li');
        listItem.textContent = `Task: ${taskDescription} | Time: ${document.getElementById('timerTime').textContent}`;
        taskList.appendChild(listItem);
        document.getElementById('taskDescription').value = '';
    }
}

// Example functions for Generate Reports section
function generateReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Sample data for demonstration
    const reportData = [
        { task: "Task 1", hours: "2:30:00" },
        { task: "Task 2", hours: "1:45:00" },
        { task: "Task 3", hours: "3:15:00" }
    ];

    doc.text('Time Tracking Report', 10, 10);
    let yPosition = 20;

    reportData.forEach(item => {
        doc.text(`Task: ${item.task}`, 10, yPosition);
        doc.text(`Hours: ${item.hours}`, 10, yPosition + 10);
        yPosition += 20;
    });

    // Add more data and formatting as needed
    return doc;
}

function exportReport(format) {
    const doc = generateReport();

    if (format === 'pdf') {
        doc.save('report.pdf');
    } else if (format === 'csv') {
        // CSV export logic
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Task, Hours\n"
            + "Task 1, 2:30:00\n"
            + "Task 2, 1:45:00\n"
            + "Task 3, 3:15:00\n";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        console.log('Unsupported format');
    }
}

// Example functions for Set Reminders section
let reminderTimeout;
let reminderInterval;
let snoozeTimeout;

function setReminder() {
    const interval = parseInt(document.getElementById('reminderInterval').value, 10);
    const type = document.getElementById('reminderType').value;

    if (interval && type) {
        // Clear any existing reminders
        clearTimeout(reminderTimeout);
        clearInterval(reminderInterval);
        clearTimeout(snoozeTimeout);

        // Set a reminder with the specified interval and type
        reminderInterval = setInterval(() => {
            alertReminder(type);
        }, interval * 60 * 1000); // Convert minutes to milliseconds

        // Set the first reminder
        reminderTimeout = setTimeout(() => {
            alertReminder(type);
        }, interval * 60 * 1000); // Convert minutes to milliseconds

        // Provide feedback
        alert(`Reminder set to every ${interval} minutes with ${type} notifications.`);
    } else {
        alert('Please set both interval and type.');
    }
}

function alertReminder(type) {
    const dismiss = confirm(`Reminder: Time for a ${type} notification! Press OK to dismiss or Cancel to snooze for 5 minutes.`);
    
    if (dismiss) {
        // Dismiss the reminder
        clearTimeout(reminderTimeout);
        clearInterval(reminderInterval);
        alert('Reminder dismissed.');
    } else {
        // Snooze the reminder
        clearTimeout(reminderTimeout);
        clearInterval(reminderInterval);
        snoozeTimeout = setTimeout(() => {
            alertReminder(type);
        }, 5 * 60 * 1000); // Snooze for 5 minutes
        alert('Reminder snoozed for 5 minutes.');
        
        // Reset interval for future reminders
        reminderInterval = setInterval(() => {
            alertReminder(type);
        }, 5 * 60 * 1000); // Convert 5 minutes to milliseconds
    }
}


// Example functions for Integration Settings section
function connectPlatform() {
    const platform = document.getElementById('integrationPlatform').value;
    const detailsSection = document.getElementById('integrationDetails');
    const linkedTasksSection = document.getElementById('linkedTasks');

    if (platform) {
        detailsSection.classList.remove('hidden');
        linkedTasksSection.classList.remove('hidden');
        detailsSection.innerHTML = ''; // Clear previous details

        switch (platform) {
            case 'asana':
                detailsSection.innerHTML = `
                    <h3>Asana Integration</h3>
                    <p>To connect with Asana:</p>
                    <ol>
                        <li>Log in to your Asana account.</li>
                        <li>Go to <a href="https://app.asana.com/0/developer-console" target="_blank">Asana Developer Console</a>.</li>
                        <li>Create a new App to get your API token.</li>
                        <li>Enter the API token below to authenticate.</li>
                    </ol>
                    <div class="form-group">
                        <label for="asanaToken">API Token:</label>
                        <input type="text" id="asanaToken" name="asanaToken" placeholder="Enter your Asana API token">
                    </div>
                    <button type="button" class="btn" onclick="authenticateAsana()">Authenticate</button>
                `;
                break;
            case 'trello':
                detailsSection.innerHTML = `
                    <h3>Trello Integration</h3>
                    <p>To connect with Trello:</p>
                    <ol>
                        <li>Log in to your Trello account.</li>
                        <li>Go to <a href="https://trello.com/app-key" target="_blank">Trello API Key</a> to get your API key.</li>
                        <li>Generate an API token from the same page.</li>
                        <li>Enter your API key and token below to authenticate.</li>
                    </ol>
                    <div class="form-group">
                        <label for="trelloKey">API Key:</label>
                        <input type="text" id="trelloKey" name="trelloKey" placeholder="Enter your Trello API key">
                    </div>
                    <div class="form-group">
                        <label for="trelloToken">API Token:</label>
                        <input type="text" id="trelloToken" name="trelloToken" placeholder="Enter your Trello API token">
                    </div>
                    <button type="button" class="btn" onclick="authenticateTrello()">Authenticate</button>
                `;
                break;
            case 'jira':
                detailsSection.innerHTML = `
                    <h3>Jira Integration</h3>
                    <p>To connect with Jira:</p>
                    <ol>
                        <li>Log in to your Jira account.</li>
                        <li>Go to <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank">Jira API Tokens</a> to generate your API token.</li>
                        <li>Enter your API token and domain below to authenticate.</li>
                    </ol>
                    <div class="form-group">
                        <label for="jiraToken">API Token:</label>
                        <input type="text" id="jiraToken" name="jiraToken" placeholder="Enter your Jira API token">
                    </div>
                    <div class="form-group">
                        <label for="jiraDomain">Domain:</label>
                        <input type="text" id="jiraDomain" name="jiraDomain" placeholder="Enter your Jira domain (e.g., example.atlassian.net)">
                    </div>
                    <button type="button" class="btn" onclick="authenticateJira()">Authenticate</button>
                `;
                break;
            default:
                detailsSection.classList.add('hidden');
                linkedTasksSection.classList.add('hidden');
                break;
        }
    } else {
        detailsSection.classList.add('hidden');
        linkedTasksSection.classList.add('hidden');
    }
}

function authenticateAsana() {
    const token = document.getElementById('asanaToken').value;
    if (token) {
        // Implement authentication and data syncing logic with Asana API
        console.log('Authenticating with Asana using token:', token);
        // Mock success message and display linked tasks
        alert('Successfully connected with Asana!');
        displayLinkedTasks(); // Simulate linked task display
    } else {
        alert('Please enter your Asana API token.');
    }
}

function authenticateTrello() {
    const key = document.getElementById('trelloKey').value;
    const token = document.getElementById('trelloToken').value;
    if (key && token) {
        // Implement authentication and data syncing logic with Trello API
        console.log('Authenticating with Trello using key:', key, 'and token:', token);
        // Mock success message and display linked tasks
        alert('Successfully connected with Trello!');
        displayLinkedTasks(); // Simulate linked task display
    } else {
        alert('Please enter your Trello API key and token.');
    }
}

function authenticateJira() {
    const token = document.getElementById('jiraToken').value;
    const domain = document.getElementById('jiraDomain').value;
    if (token && domain) {
        // Implement authentication and data syncing logic with Jira API
        console.log('Authenticating with Jira using token:', token, 'and domain:', domain);
        // Mock success message and display linked tasks
        alert('Successfully connected with Jira!');
        displayLinkedTasks(); // Simulate linked task display
    } else {
        alert('Please enter your Jira API token and domain.');
    }
}

function displayLinkedTasks() {
    const taskListUl = document.getElementById('taskList');
    // Example tasks for demonstration
    taskListUl.innerHTML = `
        <li>Task 1 - Project A</li>
        <li>Task 2 - Project B</li>
        <li>Task 3 - Project C</li>
    `;
}


