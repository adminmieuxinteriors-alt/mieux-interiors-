const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://mhdnisam0_db_user:mieuxAdmin123@cluster0.qlty6qu.mongodb.net/mieux_interiors?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    const services = await mongoose.connection.db.collection("services").find().toArray();
    console.log("Services in DB:");
    console.dir(services, { depth: null });

    const projects = await mongoose.connection.db.collection("projects").find().toArray();
    console.log("Projects in DB:");
    console.dir(projects, { depth: null });

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
