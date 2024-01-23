import express from 'express';
import products from '../schemas/products.schema.js';

// 게시글 등록 api
router.post('/products', async (req, res, next) => {
  // 클라이언트에게 전달받은 데이터를 변수에 저장
  const { title, content, userName, password } = req.body;

  // 전달받은 데이터가 없을 경우
  if (!product) {
    return res
      .status(400)
      .json({ errorMessage: '작성된 데이터가 존재하지 않습니다.' });
  }

  // 게시글 생성
  const product = new Product({ title, content, userName, password });
  const createdTime = new Date();

  // 생성된 게시글 몽고디비에 저장
  await product.save();

  return res
    .status(201)
    .json({ product, uploadMessage: '판매 상품을 등록하였습니다.' });
});

// 게시글 전체 목록 조회 api
router.get('/products', async (req, res, next) => {
  const products = await Product.find({});

  // 목록 조회 결과를 클라이언트에게 반환
  return res.status(200).json({ products });
});

const router = express.Router();

export default router;
