import app from "./app";
import { initDatabase } from "./db";
const port = 8000;

const main = async()=>{
initDatabase();

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

}
main();