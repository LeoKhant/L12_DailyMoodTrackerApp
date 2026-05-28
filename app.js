// Import Express so we can create routes and run the web server
const express = require('express');

// Import body-parser so the app can read data submitted from forms
const bodyParser = require('body-parser');

// Create the Express application
const app = express();

// The app will run on port 3000
const port = 3000;

// This allows the server to read form data from POST requests
app.use(bodyParser.urlencoded({ extended: true }));

// Use EJS so we can render dynamic HTML pages
app.set('view engine', 'ejs');

// This array stores all mood entries while the server is running
let moods = [
    { 
        id: 1, 
        date: '2026-05-27', 
        mood: 'Focused', 
        energy: 'High', 
        stress: 'Low', 
        comment: 'Finished revision and felt productive' 
    },
    { 
        id: 2, 
        date: '2026-05-28', 
        mood: 'Drained', 
        energy: 'Low', 
        stress: 'High', 
        comment: 'Long school day and many tasks' 
    },
    { 
        id: 3, 
        date: '2026-05-29', 
        mood: 'Calm', 
        energy: 'Medium', 
        stress: 'Low', 
        comment: 'Relaxed after completing homework' 
    },
    { 
        id: 4, 
        date: '2026-05-30', 
        mood: 'Motivated', 
        energy: 'High', 
        stress: 'Medium', 
        comment: 'Started working on project early' 
    }
];

// This helper changes the date format from yyyy-mm-dd to dd-mm-yy for display
app.locals.formatDate = function(dateString) {
    if (!dateString) {
        return '';
    }

    const parts = dateString.split('-');
    const year = parts[0].slice(2);
    const month = parts[1];
    const day = parts[2];

    return day + '-' + month + '-' + year;
};

// This helper decides the mood status shown on the homepage
app.locals.getMoodStatus = function(mood, stress) {
    if (stress === 'High') {
        return 'Needs Rest';
    } else if (mood === 'Focused' || mood === 'Motivated') {
        return 'Productive';
    } else if (mood === 'Calm') {
        return 'Balanced';
    } else if (mood === 'Drained') {
        return 'Low Energy';
    } else {
        return 'Neutral';
    }
};

// Home route: display all mood entries
app.get('/', function(req, res) {
    // Send the mood list to index.ejs
    res.render('index', { moods });
});

// Show the form page for adding a new mood entry
app.get('/moods', function(req, res) {
    res.render('addMood');
});

// Add route: receive form data and save a new mood entry into the array
app.post('/moods', function(req, res) {
    // Get the values submitted from addMood.ejs
    const { date, mood, energy, stress, comment } = req.body;

    // Create a new internal ID for the mood entry
    const id = moods.length > 0 ? moods[moods.length - 1].id + 1 : 1;

    // Create one new mood object using the form data
    const newMood = {
        id: id,
        date: date,
        mood: mood,
        energy: energy,
        stress: stress,
        comment: comment
    };

    // Add the new mood entry into the moods array
    moods.push(newMood);

    // Return to the homepage so the updated list is shown
    res.redirect('/');
});

// Edit route: find the selected mood entry and show it in the update form
app.get('/moods/:id/update', function(req, res) {
    // Get the selected mood ID from the URL
    const moodId = parseInt(req.params.id);

    // find() searches the array for the matching mood entry
    const updateMood = moods.find(function(moodEntry) {
        return moodEntry.id === moodId;
    });

    // Send the selected mood entry to updateMood.ejs
    res.render('updateMood', { updateMood });
});

// Update route: receive edited form data and replace the old mood entry
app.post('/moods/:id/update', function(req, res) {
    // Get the selected mood ID from the URL
    const moodId = parseInt(req.params.id);

    // Get the updated values submitted from updateMood.ejs
    const { date, mood, energy, stress, comment } = req.body;

    // Create the updated version of the mood entry
    const updatedMood = {
        id: moodId,
        date: date,
        mood: mood,
        energy: energy,
        stress: stress,
        comment: comment
    };

    // map() goes through the array and replaces only the matching mood entry
    moods = moods.map(function(moodEntry) {
        if (moodEntry.id === moodId) {
            return updatedMood;
        }
        return moodEntry;
    });

    // Return to the homepage after updating
    res.redirect('/');
});

// Delete route: remove the selected mood entry from the array
app.get('/moods/:id/delete', function(req, res) {
    // Get the selected mood ID from the URL
    const moodId = parseInt(req.params.id);

    // filter() keeps every mood entry except the selected one
    moods = moods.filter(function(moodEntry) {
        return moodEntry.id !== moodId;
    });

    // Return to the homepage after deleting
    res.redirect('/');
});

// Start the server and show the local URL in the terminal
app.listen(port, function() {
    console.log(`Server is running at http://localhost:${port}`);
});