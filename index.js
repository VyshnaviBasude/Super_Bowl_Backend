const http = require('http');
const fs = require('fs');
const path = require('path');
const {MongoClient} = require('mongodb');

async function mongodbConnection(){
    const url ="mongodb+srv://basude:vyshnavi@cluster0.mz5dkf1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(url);
    try {
        await client.connect();
        const data = await findSuperBowl(client);
        return data;
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function findSuperBowl(client ){
    const cursor = client.db("superbowlwinnersdb").collection("superbowlwinners").find({});
    const results = await cursor.toArray();
    const js= (JSON.stringify(results));  
    console.log(js);
    return results;
};
function myImages(fp){
     const ext = path.extname(fp);
     const imageTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpg',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
    };
    const imageContentType = imageTypes[ext] || 'text/plain';
    return imageContentType;
}

http.createServer(async (req, res) => {
    if (req.url =='/api'){
        const superBowlData =await mongodbConnection();
        console.log(JSON.stringify(superBowlData));
        res.setHeader("Access-Control-Allow-Origin", '*');
        res.writeHead(200,{"content-type":"application/json"});
        res.end(JSON.stringify(superBowlData));
    }
    else{
        let fp = path.join(__dirname, "public", req.url === '/' ? "index.html" : req.url);      
        fs.readFile (fp,(err,content) =>{
            if (err) 
            {
                res.writeHead(404,{'Content-Type':'text/html'});
                res.end("<h1> 404 </h1>");
            }
            else{
            res.writeHead(200,{'Content-Type':myImages(fp)});
            res.end(content);
            }
        })
    }
    
  }).listen(3667, () => console.log(`Server is running on `));

