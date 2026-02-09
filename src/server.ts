import app from "./index";
import { PORT } from "./config";
import { connectDatabase } from "./database/mongodb";

connectDatabase();

app.listen(Number(PORT), () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
