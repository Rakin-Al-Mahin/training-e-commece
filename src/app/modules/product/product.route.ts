import express from 'express';
import multer from 'multer';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { fileFilter, storage } from '../../../shared/cloudinary';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = express.Router();
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  upload.single('image'),
  validateRequest(ProductValidation.createProductZodSchema),
  ProductController.createProduct
);

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getSingleProduct);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  upload.single('image'),
  validateRequest(ProductValidation.updateProductZodSchema),
  ProductController.updateProduct
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ProductController.deleteProduct
);

export const ProductRoutes = router;
