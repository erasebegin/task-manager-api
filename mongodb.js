const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

const id = new ObjectID().getTimestamp();
console.log(id);

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database");
    }
    const db = client.db(databaseName);

    // db.collection("users").insertMany(
    //   [
    //     {
    //       name: "Papa Hoolio",
    //       age: 3,
    //     },
    //     {
    //       name: "Old Man Patwan",
    //       age: 12,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("errorrrrrrrr");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // db.collection("tasks").insertMany(
    //   [
    //     {
    //       task: "perk up the primroses",
    //       complete: false,
    //     },
    //     {
    //       task: "run over the umpire",
    //       complete: false,
    //     },
    //     {
    //       task: "unwalk three journeys",
    //       complete: true,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("erroooorrrrrrrrrrrrr");
    //     }
    //     console.log(result.ops);
    //   }
    // );

    db.collection("tasks")
      .updateMany(
        { complete: { $eq: false } },
        {
          $set: {
            complete: true,
          },
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });

	// db.collection("tasks").deleteMany()
	// THIS DELETES EVERYTHING IN THE COLLECTION
  }
);
