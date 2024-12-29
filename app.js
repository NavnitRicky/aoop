const express=require("express"); 
const app=express();
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
 const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
 main().then(()=>{
   console.log("connected db");

}).catch((err)=>{
     console.log(err);
});
 async function main() {
    await mongoose.connect(mongo_url);
    
 } 
 app.set("view engine","ejs");
 app.set("views",path.join(__dirname,"views"));
 app.use(express.static(path.join(__dirname,"/public")));//for css ke liye 
 //static file ka use karte hai 

 app.use(express.urlencoded({extended:true}));
 app.use(methodOverride("_method"));
 //app.use(express.static('public')); 
 app.engine("ejs",ejsmate);


 // home route is 
app.get("/",(req,res)=>{
    res.send("i am root and port is working well")
});
//testing 
// app.get("/testing", async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"my villa",
//         description:"by the beach",
//         price:1200,
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("sucesfuuly");
// });
//listing to listin of all list
 app.get("/listings", async(req,res)=>{
    const allListing= await Listing.find({});
    console.log(allListing);
  res.render("listings/index.ejs",{allListing});
   });
   
      //create new route 
 app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
 // res.redirect("/listings");
});
   


   //show route 
   // app.get("/listings/:id",async(req,res)=>{
   //    let {id}=req.params;
   //    const listing= await Listing.findById(id);
   //    res.render("listings/show.ejs",{listing});
   // })
   //show listing ka details ke liye 

   app.get("/listings/:id", async (req, res, next) => {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).send("Invalid ID format");
      }
      try {
          const listing = await Listing.findById(id);
          if (!listing) {
              return res.status(404).send("Listing not found");
          }
          res.render("listings/show.ejs", { listing });
      } catch (err) {
          next(err);
      }
  });
  //edit
//    app.get("/listings/:id/edit", async(req,res)=>{
//       let {id}=req.params;
//       const listing= await Listing.findById(id);
//        res.render("listings/edit.ejs",{listing});
//    });


app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params;
  
    try {
      const listing = await Listing.findById(id); // Fetch the listing by ID
      if (!listing) {
        return res.status(404).send('Listing not found');
      }
      res.render('listings/edit.ejs', { listing}); // Render the edit view
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });


  
  //create 
  app.post("/listings",async(req,res)=>{
    const newListings=new Listing(req.body.listing);
    await newListings.save();
     res.redirect("/listings");
})

   
  
   //update
   app.put("/listings/:id",async(req,res)=>{
      let {id}=req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      res.redirect("/listings");
   });
   //delete route 
   app.delete("/listings/:id",async(req,res)=>{
      let {id}=req.params;
      let deletedlisting=await Listing.findByIdAndDelete(id);
      console.log(deletedlisting);
      res.redirect("/listings");
   });

app.listen(8083,()=>{
    console.log("app listening on port number 8083");
})