import app from "./index";
import { PORT } from "./config";
import { connectDatabase } from "./database/mongodb";

connectDatabase();

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Server also available on your local IP (e.g., http://172.25.0.222:${PORT})`);
});