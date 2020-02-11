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


// APPLICATION
// Creation of the server with a request and a respond as parameters
const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    // PRODUCTS OVERVIEW
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, {'Content-type': 'text/html'});

        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                res.end(overviewOutput);
            });
        });
    } 
    
    // LAPTOP DETAILS
    else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, {'Content-type': 'text/html'});
        // res.end(`This is the LAPTOP page for laptop ${id}!`);
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
        });
    }

    // IMAGES
    else if ((/\.(jpg|jpeg|png|gif)$/i).toLocaleString(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, {'Content-type': 'image/jpg'});
            res.end(data);
        });
    }

    // URL NOT FOUND
    else {
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('URL was not found on the server');
    }
    
});

// Run the server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml;
    output = output.replace(/{%ID%}/g, laptop.id);
    output = output.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    return output;
}