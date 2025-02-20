const { faker } = require("@faker-js/faker");
const { MongoClient, ObjectId } = require("mongodb");
const mongoose = require("mongoose");

// Helper function to generate a random integer between min and max (inclusive)
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seedDB() {
  // Replace with your MongoDB Atlas URI or local connection string
  const uri =
    "mongodb+srv://yashc:yash123456@cluster0.xqys6ob.mongodb.net/lab?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected correctly to server");

    // Replace 'yourDatabaseName' with your database name and 'patientmasters' with your collection name
    const collection = client.db("lab").collection("patientmasters");

    // Drop the collection if it already exists (optional)
    await collection.drop().catch((err) => {
      if (err.codeName === "NamespaceNotFound") {
        console.log("Collection does not exist, skipping drop.");
      } else {
        throw err;
      }
    });

    // Array to hold generated patient documents
    let seedData = [];

    for (let i = 0; i < 100000; i++) {
      // Generate basic personal info
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const salutation = faker.person.prefix();
      const middleName = faker.person.firstName();
      const country = faker.location.country();
      const state = faker.location.state();
      const city = faker.location.city();
      const address = faker.location.streetAddress();
      const mobile = faker.phone.number();
      const email = faker.internet.email(firstName, lastName);
      const dateOfBirth = faker.date.past(50, new Date());
      const age = randomIntFromInterval(1, 100);
      const gender = faker.helpers.arrayElement(["Male", "Female"]);
      const ageType = "Years";
      const patientType = faker.helpers.arrayElement([
        "Inpatient",
        "Outpatient",
      ]);
      const bloodGroup = faker.helpers.arrayElement([
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ]);
      const maritalStatus = faker.helpers.arrayElement([
        "Single",
        "Married",
        "Divorced",
        "Widowed",
      ]);
      const priorityCard = faker.datatype.boolean();
      const value = randomIntFromInterval(10, 100);
      // Here, userId should be an ObjectId. For fake data, we create a new ObjectId.
      const userId = new mongoose.Types.ObjectId("6784c2855dd48a187664248f");
      const percentage = randomIntFromInterval(0, 100);

      // Create a patient document matching your schema
      let patient = {
        patientId: faker.string.uuid(),
        salutation,
        firstName,
        middleName,
        lastName,
        country,
        state,
        city,
        address,
        mobile,
        email,
        dateOfBirth,
        age,
        gender,
        ageType,
        patientType,
        bloodGroup,
        maritalStatus,
        priorityCard,
        value,
        userId,
        percentage,
      };

      seedData.push(patient);
    }

    // Insert all fake patient records into the collection
    await collection.insertMany(seedData);
    console.log("Database seeded! :)");
  } catch (err) {
    console.error("An error occurred while seeding the database:", err);
  } finally {
    client.close();
  }
}

seedDB();
