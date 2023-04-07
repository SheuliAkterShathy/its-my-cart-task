const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();



// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7czv3fq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});



async function run() {
  try {

    // collections
    const studentsCollection = client.db("its-my-cart").collection("students");


    //------------ Operational Section Starts ------------//



    // Define a route for getting all students
    app.get("/students", async (req, res) => {
      const query = {};
      const result = await studentsCollection.find(query).toArray();
      res.send(result);
    });



 // Define a route for adding a student info
    app.post("/student", async (req, res) => {
      const student = req.body;
      const result = await studentsCollection.insertOne(student);
      res.send(result);
    });



     // Define a route for update students-information

    app.get("/updated-student/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedStudent = await studentsCollection.findOne(query);
      res.send(updatedStudent);
    });


    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const update = req.body;
      const option = { upsert: true };
      const updateStudent = {
        $set: {
          info: update.info,
        },
      };
      const result = await studentsCollection.updateOne(
        filter,
        updateStudent,
        option
      );
      res.send(result);
    });



     // Define a route for deleting student info

    app.delete("/student/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await studentsCollection.deleteOne(filter);
      res.send(result);
    });



    //------------  Operational Section Ends  ------------//



  } finally {
  }
}
run().catch(console.log);


app.get("/", async (req, res) => {
  res.send("Its My Cart server is running");
});


app.listen(port, () => console.log(`Its My Cart running on ${port}`));
