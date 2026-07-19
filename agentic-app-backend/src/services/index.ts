import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRoutes from '../routes/chat.route.ts';
import customerRoutes from '../routes/customer.route.ts';
import orderRoutes from '../routes/order.route.ts';
import weatherRoutes from '../routes/weather.route.ts';
import mcpRoutes from '../routes/mcp-server.routes.ts';
import connectToMongoDB from '../config/mongodb.ts';


const app = express();
app.use(cors());
app.use(express.json()); 



//sample route
app.get('/', (req, res) => {
  res.send('Hello, Agentic App Backend');
});
app.use('/api/customers',customerRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/weather',weatherRoutes);
app.use('/mcp',mcpRoutes);

//Start the server
const PORT: number = Number(process.env.PORT) || 3000;

/*app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});*/

async function startServer(){
  try{
    await connectToMongoDB();

    app.listen(PORT , () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }catch(error){
    console.error('Failed to start server:',error);
  }
}
startServer();