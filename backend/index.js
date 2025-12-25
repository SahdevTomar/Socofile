import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import dotnev from "dotenv";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import postRoute from "./routes/post.route.js";
dotnev.config({});

const app = express();

const port = process.env.port || 3000;

app.get("/", (_, res) => {
    return res.status(200).json({
        message: "hello from backend",
        success: true
    });
})
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOptions));
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);



app.listen(port, () => {
    connectDB();
    console.log(`server  is litening on port ${port}`);
})