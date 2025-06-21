import app from "./app";
import 'dotenv/config';

const port = process.env.PORT || 5000;

async function main() {
  try {
    // Database connection is now handled by app.ts
    // We just need to start listening here for local development
    
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
