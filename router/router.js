import { Router } from "express";
import Categories from "../controllers/getCategories.js";
import AllCategories from "../controllers/getAllCategories.js";

const router = Router()

router.route('/categories').get(Categories);
router.route('/allcategories').get(AllCategories);





export default router