// // src/routes/foodRoutes.js
// const router = require('express').Router();
// const ctrl = require('../controllers/foodController');
// const { requireAuth, requireRole } = require('../middleware/authMiddleware');
// const upload = require('../middleware/upload');
// const { validateBody } = require('../middleware/validate');
// const { createFoodSchema, updateFoodSchema } = require('../validation/foodSchemas');

// router.get('/', ctrl.getAllFoods);
// router.get('/:id', ctrl.getFoodById);

// // Public add (optional) – gate with captcha/rate-limit if kept
// router.post('/add-public', upload.single('image'), validateBody(createFoodSchema), ctrl.addFood);

// // Authenticated donor post
// router.post('/', requireAuth, requireRole('donor','admin'), upload.single('image'), validateBody(createFoodSchema), ctrl.postFood);

// router.patch('/:id', requireAuth, requireRole('donor','admin'), upload.single('image'), validateBody(updateFoodSchema), ctrl.updateFood);

// router.delete('/:id', requireAuth, requireRole('donor','admin'), ctrl.deleteFood);

// // Reserve / mark picked
// router.post('/:id/reserve', requireAuth, requireRole('seeker','admin'), ctrl.reserveFood);
// router.post('/:id/picked', requireAuth, requireRole('donor','admin'), ctrl.markPicked);

// module.exports = router;



// const router = require("express").Router();
// const multer = require("multer");
// const { auth } = require("../middleware/authMiddleware");
// const ctrl = require("../controllers/foodController");

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, "uploads"),
//   filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"))
// });
// const upload = multer({ storage });

// router.get("/", ctrl.list);
// router.get("/:id", ctrl.getOne);

// router.post("/post", auth, upload.single("image"), ctrl.post);
// router.post("/add", auth, upload.single("image"), ctrl.post);
// router.put("/:id", auth, upload.single("image"), ctrl.update);
// router.delete("/:id", auth, ctrl.remove);
// router.post("/:id/accept", auth, ctrl.accept);

// module.exports = router;



// const router = require("express").Router();
// const path = require("path");
// const fs = require("fs");
// const multer = require("multer");
// const { auth } = require("../middleware/authMiddleware");
// const ctrl = require("../controllers/foodController");

// const UPLOAD_DIR = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
//   filename: (_req, file, cb) => {
//     const clean = file.originalname.replace(/\s+/g, "_");
//     cb(null, Date.now() + "-" + clean);
//   }
// });
// const upload = multer({ storage });

// router.get("/", ctrl.list);
// router.get("/:id", ctrl.getOne);
// router.post("/post", auth, upload.single("image"), ctrl.post);
// router.post("/add", auth, upload.single("image"), ctrl.post);
// router.put("/:id", auth, upload.single("image"), ctrl.update);
// router.delete("/:id", auth, ctrl.remove);
// router.post("/:id/accept", auth, ctrl.accept);

// module.exports = router;


const router = require("express").Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const { auth } = require("../middleware/authMiddleware");
const ctrl = require("../controllers/foodController");

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Configure storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "food_uploads", // folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
  },
});

const upload = multer({ storage });

// ✅ Routes
router.get("/", ctrl.list);
router.get("/:id", ctrl.getOne);
router.post("/post", auth, upload.single("image"), ctrl.post);
router.post("/add", auth, upload.single("image"), ctrl.post);
router.put("/:id", auth, upload.single("image"), ctrl.update);
router.delete("/:id", auth, ctrl.remove);
router.post("/:id/accept", auth, ctrl.accept);

module.exports = router;
