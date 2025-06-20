import mongoose from "mongoose";
import app from "./app";
import "dotenv/config";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  try {
    console.log(`App listening on port :${port}`);
  } catch (error) {}
});

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/library_management");
    console.log("✅ Database connection successful");
    console.log(`🟢 App listening on port: ${port}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);

    // Exiting the process if something went wrong
    process.exit(1);
  }
}
// function call
main();
