export const  promiseTimeout = (promise, timeoutMs)  =>{
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Promise timed out'));
        }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
}