// Librairies
const fs = require('fs');
const http = require('http');
const url = require('url');

// Configs
const hostname = '127.0.0.1';
const port = 1337;

// Files for our application
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

// Creation of the server with a request and a respond as parameters
const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end('This is the PRODUCTS page');
    } 
    
    else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, {'Content-type': 'text/html'});
        // res.end(`This is the LAPTOP page for laptop ${id}!`);
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            console.log(laptop);
            let output = data;;
            output = output.replace(/{%PRODUCTNAME%}/g, laptop.productName);
            output = output.replace(/{%IMAGE%}/g, laptop.image);
            output = output.replace(/{%PRICE%}/g, laptop.price);
            output = output.replace(/{%SCREEN%}/g, laptop.screen);
            output = output.replace(/{%CPU%}/g, laptop.cpu);
            output = output.replace(/{%STORAGE%}/g, laptop.storage);
            output = output.replace(/{%RAM%}/g, laptop.ram);
            output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
            res.end(output);
        });
    }

    else {
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('URL was not found on the server');
    }
    
});

// Run the server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});