import mongoose from 'mongoose';
export const DocSchema = new mongoose.Schema({
  DescriptionofProduct: {
    type: String,
    required: true,
  },
  VendorPONumber: {
    type: Number,
    required: true,
  },
});