//This part of code is alternative if you are willing to be using an auto ping sender to the code to keep it alive.

var http = require('http');  
http.createServer(function (req, res) {   
  res.write("Bot actif");   
  res.end(); 
}).listen(8080);
client.on('ready', () => {
  console.log('Le bot est en ligne!')
  let activities = [``, ``, ``   ],i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ %  activities.length]}`,  {type:"STREAMING",url:"https://www.youtube.com/watch?v=DWcJFNfaw9c"  }), 5000)
});
