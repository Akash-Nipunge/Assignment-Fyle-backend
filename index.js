API_URL="https://api.github.com/users/"
const express = require('express');
const cors = require('cors')
const app = express();
const PORT = 5000;
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
let allData = [];
// Middleware to handle pagination
async function getData(username)
{
  const response = await fetch(API_URL+username+'/repos');
  const data = await response.json()
  return data;
}

app.use(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  allData = await getData(req.query.username || 'johnpapa');
  // Create a subset of data based on pagination parameters
  res.paginatedData = allData.length?allData.slice(startIndex, endIndex):[];
  next();
});

// Route to get paginated data
app.get('/',(req,res)=>{
  res.send("hello")
})
app.get('/user', (req, res) => {
  res.json({
    totalItems: allData.length,
    currentPage: parseInt(req.query.page) || 1,
    totalPages: Math.ceil(allData.length / (parseInt(req.query.limit) || 10)),
    data: res.paginatedData,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
