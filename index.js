const express = require("express");
const app = express();
const port = 3000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
app.use(express.urlencoded({ extended: true }))

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
    const { name, email, password } = req.body;
    try {
        const data = await prisma.user.create({
            data: {
                name,
                email,
                password,
            }
        });
        res.json({ message: "User created successfully" , data});
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post("/api/users/post", async (req, res) => {
    const {userId,title } = req.body;
    try {
        const data = await prisma.post.create({
        data: {
            title,
            userId
        }
        });
        res.json({ message: "User created successfully" , data});
    } catch (error) {
        res.status(500).json("error", error);
    }
});

app.get("/api/users/:id", async (req, res) => {
    const uid = req.params.id;
    try {
        const data = await prisma.test_db.findUnique({
            where: { uid: parseInt(uid) },
        });
        res.json({ message: data });
    } catch (error) {
        res.status(500).json(error.meta.cause);
    }
});

app.patch("/api/users/:id", async (req, res) => {
    const id = req.params.id;
    const { name, password } = req.body;
    console.log(id, name, password);
    try {
        const data = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name,
                password
            }
        });
        res.json({ message: "User created successfully", data });
    } catch (error) {
        res.status(500).json(error.meta.cause);
    }
});

app.delete("/api/users/:id", async (req, res) => {
    const uid = req.params.id;
    try {
        const data = await prisma.test_db.delete({
            where: {
                uid: parseInt(uid)
            }
        });
        res.json({ message: "User created successfully", data });
    } catch (error) {
        res.status(500).json(error.meta.cause);
    }
})


app.get("/test", async (req, res) => {

    await prisma.user.create({
        data: {
            id: 2,
            name: "Hasan ali",
            email:"hasanali@gmail.com",
            password:"100200300"
        }
    })

    // await prisma.post.create({
    //     data: {
    //         id: 3,
    //         title: "1st post by ladis",
    //         userId: 2
    //     }
    // })

    res.send("created")
})

app.get("/test2", async (req, res) => {

    // let data = await prisma.post.findMany({
    //     include: {
    //         User: true
    //     }
    // })
    let data = await prisma.user.findMany({
        include: {
            post: true
            // post:{
            //     where:{
            //         id: 2
            //     }
            // }
        }
    })

    res.send(data)
})

app.get("/test3", async (req, res) => {

    let data = await prisma.user.findUnique(
        {
            where: {
                id: 1
            },
            include: {
                post: true
            }
        })

    res.send(data)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})