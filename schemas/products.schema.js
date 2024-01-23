import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: Number,
  },
});

// productSchema를 바탕으로 Product모델을 생성하여, 외부로 내보냄
export default mongoose.model('Product', productSchema);
