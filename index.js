// Configuration Import
const app = require('./app');


// Application Running
const PORT = process.env.RUNNING_PORT;
app.listen(PORT, ()=>{
    console.log(`Application run at @${PORT}`);
})