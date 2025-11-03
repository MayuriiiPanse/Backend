// require("dotenv").config();
// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const morgan = require("morgan");
// const { Server } = require("socket.io");

// const connectDB = require("./src/db/db");
// // const app = require("./src/db/db");
// const authRoutes = require("./src/routes/authRoutes");
// const foodRoutes = require("./src/routes/foodRoutes");
// const chatRoutes = require("./src/routes/chatRoutes");
// const Chat = require("./src/models/chatSchema");

// const PORT = process.env.PORT || 3000;
// const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// const app = express();
// app.set("trust proxy", 1);

// const corsConfig = {
//   origin: function (origin, cb) {
//     if (!origin || origin === CLIENT_ORIGIN) return cb(null, true);
//     return cb(new Error("CORS: origin not allowed"));
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// };

// app.use((req, res, next) => {
//     if (!isConnected) {
//      connectDB();
//     }
//     next();
// });

// app.use(cors(corsConfig));
// // No bare "*" here; preflights are handled by cors middleware
// app.use(express.json({ limit: "5mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(morgan("dev"));

// app.use("/uploads", express.static("uploads"));

// app.use("/api/auth", authRoutes);
// app.use("/api/foods", foodRoutes);
// app.use("/api/chat", chatRoutes);

// app.get("/health", (_req, res) => res.json({ ok: true }));

// connectDB();

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: CLIENT_ORIGIN,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"]
//   },
//   transports: ["websocket", "polling"]
// });
// app.set("io", io);

// io.on("connection", (socket) => {
//   const userId = socket.handshake.auth?.userId ? String(socket.handshake.auth.userId) : null;

//   socket.on("join-room", ({ foodId }) => {
//     if (!foodId) return;
//     socket.join(String(foodId));
//   });

//   socket.on("leave-room", ({ foodId }) => {
//     if (!foodId) return;
//     socket.leave(String(foodId));
//   });

//   socket.on("typing", ({ foodId, isTyping }) => {
//     if (!foodId) return;
//     socket.to(String(foodId)).emit("typing", { userId, isTyping: !!isTyping });
//   });

//   socket.on("send-message", async (payload, cb) => {
//     try {
//       const { foodId, text, receiverId } = payload || {};
//       if (!foodId || !text || !receiverId) throw new Error("Invalid payload");
//       const room = String(foodId);
//       const doc = await Chat.create({
//         foodId,
//         room,
//         sender: userId,
//         receiver: receiverId,
//         message: text,
//         deliveredAt: new Date()
//       });
//       const msg = {
//         id: String(doc._id),
//         room,
//         foodId: doc.foodId,
//         text: doc.message,
//         senderId: userId,
//         receiverId,
//         createdAt: doc.createdAt,
//         deliveredAt: doc.deliveredAt
//       };
//       io.to(room).emit("receive-message", msg);
//       cb?.({ ok: true, data: msg });
//     } catch {
//       cb?.({ ok: false, error: "Failed to send message" });
//     }
//   });
// });

// // Express v5-safe catch-all (no "*")
// app.all("/{*any}", (_req, res) => res.status(404).json({ error: "Not found" }));

// // server.listen(PORT, () => {
// //   console.log(`Server http://localhost:${PORT}`);
// //   console.log(`Allowed client origin: ${CLIENT_ORIGIN}`);
// // });

// if (process.env.VERCEL) {
//   module.exports = app; // for Vercel serverless function
// } else {
//   server.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
//   });
// }


require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { Server } = require("socket.io");

const connectDB = require("./src/db/db");
const authRoutes = require("./src/routes/authRoutes");
const foodRoutes = require("./src/routes/foodRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const Chat = require("./src/models/chatSchema");

const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = express();
app.set("trust proxy", 1);

// ✅ Connect to MongoDB once (on cold start)
connectDB();

// ✅ Simplified CORS for both local + deployed use
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/chat", chatRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

// ✅ 404 handler
// app.all("*", (_req, res) => res.status(404).json({ error: "Not found" }));
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ✅ Vercel deployment (no socket.io)
if (process.env.VERCEL) {
  module.exports = app;
} 
// ✅ Local dev (with socket.io)
else {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: CLIENT_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    },
    transports: ["websocket", "polling"]
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth?.userId ? String(socket.handshake.auth.userId) : null;

    socket.on("join-room", ({ foodId }) => {
      if (foodId) socket.join(String(foodId));
    });

    socket.on("leave-room", ({ foodId }) => {
      if (foodId) socket.leave(String(foodId));
    });

    socket.on("typing", ({ foodId, isTyping }) => {
      if (!foodId) return;
      socket.to(String(foodId)).emit("typing", { userId, isTyping: !!isTyping });
    });

    socket.on("send-message", async (payload, cb) => {
      try {
        const { foodId, text, receiverId } = payload || {};
        if (!foodId || !text || !receiverId) throw new Error("Invalid payload");

        const room = String(foodId);
        const doc = await Chat.create({
          foodId,
          room,
          sender: userId,
          receiver: receiverId,
          message: text,
          deliveredAt: new Date()
        });

        const msg = {
          id: String(doc._id),
          room,
          foodId: doc.foodId,
          text: doc.message,
          senderId: userId,
          receiverId,
          createdAt: doc.createdAt,
          deliveredAt: doc.deliveredAt
        };

        io.to(room).emit("receive-message", msg);
        cb?.({ ok: true, data: msg });
      } catch {
        cb?.({ ok: false, error: "Failed to send message" });
      }
    });
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
