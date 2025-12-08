const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const STORAGE_PATH = path.join(__dirname, '..', process.env.STORAGE_PATH || 'storage');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_PATH)) {
    fs.mkdirSync(STORAGE_PATH, { recursive: true });
}

const TASKS_FILE = path.join(STORAGE_PATH, 'tasks.json');
const SOURCES_FILE = path.join(STORAGE_PATH, 'sources.json');

/**
 * Load data from JSON file
 */
function loadData(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error(`Error loading data from ${filePath}:`, error);
        return [];
    }
}

/**
 * Save data to JSON file
 */
function saveData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error saving data to ${filePath}:`, error);
        return false;
    }
}

/**
 * Tasks CRUD operations
 */
const tasks = {
    getAll: () => loadData(TASKS_FILE),

    getById: (id) => {
        const allTasks = loadData(TASKS_FILE);
        return allTasks.find(task => task.id === id);
    },

    create: (taskData) => {
        const allTasks = loadData(TASKS_FILE);
        const newTask = {
            id: uuidv4(),
            ...taskData,
            createdAt: new Date().toISOString(),
        };
        allTasks.push(newTask);
        saveData(TASKS_FILE, allTasks);
        return newTask;
    },

    update: (id, updates) => {
        const allTasks = loadData(TASKS_FILE);
        const index = allTasks.findIndex(task => task.id === id);
        if (index === -1) return null;

        allTasks[index] = { ...allTasks[index], ...updates };
        saveData(TASKS_FILE, allTasks);
        return allTasks[index];
    },

    delete: (id) => {
        const allTasks = loadData(TASKS_FILE);
        const filtered = allTasks.filter(task => task.id !== id);
        saveData(TASKS_FILE, filtered);
        return filtered.length < allTasks.length;
    },
};

/**
 * Sources CRUD operations
 */
const sources = {
    getAll: () => loadData(SOURCES_FILE),

    getById: (id) => {
        const allSources = loadData(SOURCES_FILE);
        return allSources.find(source => source.id === id);
    },

    create: (sourceData) => {
        const allSources = loadData(SOURCES_FILE);
        const newSource = {
            id: uuidv4(),
            ...sourceData,
            createdAt: new Date().toISOString(),
        };
        allSources.push(newSource);
        saveData(SOURCES_FILE, allSources);
        return newSource;
    },
};

module.exports = {
    tasks,
    sources,
};
