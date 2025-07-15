import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { CloudinaryUploadFile } from '../../../interfaces/cloudinaryUpload';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import {
  deleteCloudinaryFiles,
  extractPublicIdFromUrl,
  uploadToCloudinary,
} from '../../../shared/cloudinary';
import { productSearchableFields } from './product.constants';
import { IProduct, IProductFilters } from './product.interface';
import { Product } from './product.model';

const createProduct = async (
  product: IProduct,
  image?: CloudinaryUploadFile
): Promise<IProduct> => {
  let imageUrl: string | undefined;

  if (image) {
    const uploadedImages = await uploadToCloudinary([image]);
    imageUrl = uploadedImages[0].secure_url;
  }

  const createdProduct = await Product.create({
    ...product,
    ...(imageUrl && { image: imageUrl }), // Store just the URL
  });

  return createdProduct;
};

const getAllProducts = async (
  filters: IProductFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IProduct[]>> => {
  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: productSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (minPrice !== undefined) {
    andConditions.push({
      price: { $gte: minPrice },
    });
  }

  if (maxPrice !== undefined) {
    andConditions.push({
      price: { $lte: maxPrice },
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const result = await Product.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleProduct = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return result;
};

const updateProduct = async (
  id: string,
  payload: Partial<IProduct>,
  newImage?: CloudinaryUploadFile
): Promise<IProduct | null> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  let imageUrl: string | undefined;

  if (newImage) {
    // Delete old image if exists
    if (product.image) {
      const publicId = extractPublicIdFromUrl(product.image);
      if (publicId) await deleteCloudinaryFiles([publicId]);
    }

    // Upload new image
    const uploadedImages = await uploadToCloudinary([newImage]);
    imageUrl = uploadedImages[0].secure_url;
  }

  const result = await Product.findByIdAndUpdate(
    id,
    {
      ...payload,
      ...(imageUrl && { image: imageUrl }),
      ...(newImage === null && { image: undefined }), // Handle image removal
    },
    { new: true }
  );

  return result;
};

const deleteProduct = async (id: string): Promise<IProduct | null> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Delete image from Cloudinary if exists
  if (product.image) {
    const publicId = extractPublicIdFromUrl(product.image);
    if (publicId) await deleteCloudinaryFiles([publicId]);
  }

  const result = await Product.findByIdAndDelete(id);
  return result;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
