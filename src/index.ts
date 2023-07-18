// express runs the server
import express from "express"
//Cross-Origin Resource Sharing 
import cors from "cors"
import fs, { ObjectEncodingOptions } from "fs"
import path from "path"
import bodyParser from "body-parser"

StartServer(3654,"C:");

function StartServer(PORT:number,PUBLICFOLDER:string){
    const WEBSITE_PREFIX = "http://"

    //create the api
    const app = express() 

    const corsOptions ={
        origin:'*', 
        credentials:true,            //access-control-allow-credentials:true
        optionSuccessStatus:200,
    }

    //Middleware
    app.use(cors(corsOptions))
    app.use(express.static(PUBLICFOLDER));

    app.use(express.json())
    app.use(bodyParser.urlencoded({extended:false}))

    //CRUD: Create Read Update Delete

    app.get("*", (req, res, next) => {
        if(req.url === "/favicon.ico")
        {
            res.send()
            return;
        }
        
        let host = req.headers.host;
        let url = req.url;

        let text = "Server is online!<br>";

        //from "/Users/Timo/" to "/Users/"
        let splitUrl = url.split("/")
        let parentURL = url.replace(splitUrl[splitUrl.length - 2], "") // remove the last /*path*/  from "/Users/Timo/" to "/Users//"
        if(parentURL.endsWith("//")){
            parentURL = parentURL.slice(0,parentURL.length-1) //removes the last  slash "//" => "/" from "/Users//" to "/Users/"
        }
        if(url.startsWith("/")){
            url = url.slice(1,url.length);
        }
        

        if(url != "/"){
            
            let returnLink = "<a href=\"" + WEBSITE_PREFIX + host + parentURL + "\">return</a> <br>";
            text += returnLink;
        }

        let allFiles = getAllFiles(PUBLICFOLDER + url);

        
        if(allFiles !== undefined){
            allFiles.forEach(file => {
                text += "<br><a href=\"" + WEBSITE_PREFIX + host  + url +  file + "\">" + file + "</a>";
            });
            console.log("FILES:" + allFiles);
        }else{
            console.log("NO FILES FOUND");
        }
        res.send(text)
        
        
    })

    function getAllFiles(localPath:string) : string[]{
        //let globalPath = path.join(__dirname,localPath) 
        try{
            let files = fs.readdirSync(localPath);
            //listing all files using forEach
            
            if(files === undefined){
                files.forEach(function (file) {
                    // Do whatever you want to do with the file
                    console.log("File:" + file); 
                    
                });
                return []
            }


            return files;
        }catch(err){
            console.log("error finding " + localPath)
        }



        return []       
    }


    app.listen(PORT,() => {
        console.log("[Server]: Server is running at http://localhost:" + PORT)
    })
}