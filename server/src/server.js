const connectDB = require("../config/db");
const app = require("./app");
const { serverPort } = require("./secret");

app.listen(serverPort, async () => {
  console.log(`Server Successfully running at http://localhost:${serverPort}`);
  await connectDB();
});
