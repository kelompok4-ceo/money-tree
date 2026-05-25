// JokeAPI Base URL
const JOKE_API = 'https://v2.jokeapi.dev/joke';

let jokeCount = 0;

// Load joke count from localStorage
window.addEventListener('load', () => {
    jokeCount = parseInt(localStorage.getItem('jokeCount')) || 0;
    updateJokeCount();
});

// Get a random joke from any category
async function getJoke() {
    await fetchJoke('Any');
}

// Get a joke by specific type
async function getJokeByType(type) {
    if (!type) {
        await fetchJoke('Any');
        return;
    }
    await fetchJoke(type);
}

// Fetch joke from API
async function fetchJoke(category) {
    const jokeContent = document.getElementById('joke-content');
    const loading = document.getElementById('loading');
    
    // Show loading state
    jokeContent.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        // Map user-friendly names to API categories
        const categoryMap = {
            'general': 'General',
            'programming': 'Programming',
            'knock-knock': 'Knock-Knock',
            '': 'Any'
        };

        const apiCategory = categoryMap[category] || category;
        
        // Fetch from JokeAPI
        const response = await fetch(`${JOKE_API}/${apiCategory}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch joke');
        }

        const data = await response.json();

        // Handle joke content
        let jokeText = '';
        if (data.type === 'single') {
            jokeText = data.joke;
        } else if (data.type === 'twopart') {
            jokeText = `${data.setup} <br><br> ${data.delivery}`;
        }

        // Display joke
        jokeContent.innerHTML = `<p>${jokeText}</p>`;
        jokeContent.classList.remove('hidden');
        loading.classList.add('hidden');

        // Increment and save count
        jokeCount++;
        localStorage.setItem('jokeCount', jokeCount);
        updateJokeCount();

    } catch (error) {
        jokeContent.innerHTML = `<p>❌ Oops! Could not fetch a joke. Please try again!</p>`;
        jokeContent.classList.remove('hidden');
        loading.classList.add('hidden');
        console.error('Error fetching joke:', error);
    }
}

// Update joke counter display
function updateJokeCount() {
    document.getElementById('joke-count').textContent = jokeCount;
}

// Set today's date as default for joke count reset
function resetJokeCount() {
    if (confirm('Reset joke counter?')) {
        jokeCount = 0;
        localStorage.setItem('jokeCount', '0');
        updateJokeCount();
    }
}