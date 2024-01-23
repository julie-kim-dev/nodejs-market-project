import express from 'express';
import Product from '../schemas/products.schema.js';

// 상품 작성 POST
// 상품 목록 조회 GET
// 상품 상세 조회 GET
// 상품 수정 PUT
// 상품 삭제 DELETE

// 상품 작성 POST
router.post('/products', async (req, res, next) => {
  try {
    // 400 body를 입력받지 못한 경우 -> 데이터가 없을 경우
    if (!req.body) {
      return res
        .status(400)
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }
    // 클라이언트에게 전달받은 데이터를 변수에 저장
    const { title, content, userName, password } = req.body; // 구조분해할당
    // 필수사항 다 끝나면 이 부분 항목마다 유효성검사 넣어보기

    // 게시글 생성
    const newProduct = new Product({
      title, // == title: title
      content,
      userName,
      password,
      /*status:"FOR_SALE"*/
    });
    const createdTime = new Date();

    // 생성된 게시글 몽고디비에 저장
    await newProduct.save();

    return res
      .status(201)
      .json({ product, uploadMessage: '판매 상품을 등록하였습니다.' });
  } catch (error) {
    return res
      .status(500)
      .json({ product, errorMessage: '예기치 못한 에러가 발생하였습니다.' });
    // 원래 에러 로깅해야함
  }
});

// 게시글 전체 목록 조회 api
router.get('/products', async (req, res, next) => {
  const products = await Product.find({});

  // 목록 조회 결과를 클라이언트에게 반환
  return res.status(200).json({ products });
});

const router = express.Router();

export default router;
