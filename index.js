const express=require("express");
const app=express();
const port=3000;
const { PrismaClient } = require('@prisma/client');
const prisma=new PrismaClient();

async function checkDBConnection() {
    try {
        await prisma.$connect();
        console.log("DB connection established");
    } catch (e) {
        console.log("Error DB connection", e);
    }
}

checkDBConnection();
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/api/users", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const data = await prisma.test_db.findMany({
            skip,
            take: limit,
        });
        res.json({ "UserList": data });
    } catch (error) {
        // res.status(500).json({ error: "Internal Server Error", error });
        res.status(500).json(error.meta.cause);
    }
});

app.post("/api/users", async (req, res) => {
    const {fullName, email, password}=req.body
    try {
        const data = await prisma.test_db.create({
            data: {
                fullName,
                email,
                password,
            }
        });
        res.json({ message: "User created successfully", data });
    } catch (error) {
        res.status(500).json(error.meta.cause);
    }
});

app.patch("/api/users/:id", async(req, res)=>{
    const uid=req.params.id;
    const {fullName, password}=req.body;
    try {
        const data = await prisma.test_db.update({
            where:{uid:parseInt(uid)},
            data: {
                fullName,
                password
            }
        });
        res.json({ message: "User created successfully", data });
    } catch (error) {
        res.status(500).json(error.meta.cause);
    }
});

app.delete("/api/users/:id", async(req, res)=>{
    const uid=req.params.id;
    try {
        const data = await prisma.test_db.delete({
            where:{
                uid:parseInt(uid)
            }
        });
        res.json({ message: "User created successfully", data });
    } catch (error) {
        res.status(500).json( error.meta.cause );
    }
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})