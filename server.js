const url = require('url');
const http = require('http');
const fs = require('fs');

const app = http.createServer((request, response) => {
	var method = request.method;
	var path = request.url.split('?')[0];
	console.log(`Method: ${method}`);
	console.log(`Path: ${path}`);	

	if(method == 'GET'){
		switch(path){
			case '/':
				fs.readFile('/var/log/custom/log1/access.log', (err, data) => {
				  if (err) throw err;
				  console.log(data);
				});
				response.writeHead(200, {"Content-Type": "text/html"});
				response.write('<h1>Hello world!</h1>');
				response.end();
				break;
			case '/test':
			  var query = url.parse(request.url, true).query;
			  console.log('Query: ', query);
			  var username = query.username;
			  response.writeHead(200, {"Content-Type": "text/html"});
			  response.write(`Hello ${username}!`);
			  response.end();
				break;	
			default:
				response.writeHead(404, {"Content-Type": "text/html"});
				response.write('<h1>404&nbps;Page Not Found</h1>');
				response.end();
		}
	} else if(method == 'POST') {
		switch(path){
			case '/test':
				var chunks = [];
				request.on('data', chunk => { chunks.push(chunk) });
				request.on('end', () => {
					const data = Buffer.concat(chunks);
				  console.log(data.toString());
				  response.writeHead(200, {"Content-Type": "text/html"});
				  // response.write(`Hi ${username}!`);
				  response.write('YA')
					response.end();
				});			
				break;
			default:
				response.writeHead(404, {"Content-Type": "text/html"});
				response.write('<h1>404&nbps;Page Not Found</h1>');
				response.end();
		}
	} else {
		response.writeHead(400, {"Content-Type": "text/html"});
		response.write('<h1>400&nbps;Bad Request</h1>');
		response.end();
	}
});

app.listen(3000, (err)=>{
	if(err) console.error(err.message);
	else console.log("server running at port: 3000");
});

/*
 * $ node server.js
 * 
 * Broswer: http://localhost:3000/?username=Veck
 * Shows: "Hello Veck!"
 */


 /*
 	== POST with form-data == 
	
	------WebKitFormBoundaryWosWS3XQY8cecFsA
	Content-Disposition: form-data; name="username"

	Veck
	------WebKitFormBoundaryWosWS3XQY8cecFsA--


	== POST with x-www-form-urlencoded ==
	username=Veck
  */