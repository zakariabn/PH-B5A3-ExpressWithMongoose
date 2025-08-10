import app from "./app";
import "dotenv/config";
import { connectToDatabase } from "./app/utils/db";

const port = process.env.PORT || 5000;

async function main() {
  try {
    //db connection
    connectToDatabase().catch((err) => {
      console.error("Startup database connection failed:", err);
    });

    app.listen(port, () => {
      console.log(`🟢 App listening on port: ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// function call
main();
