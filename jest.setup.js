const originalError = console.error;

console.error = (...args) => {
    if (args[0].startsWith('Warning: ')) return;
    originalError(...args);
};
