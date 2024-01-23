import express from 'express';
import Product from '../schemas/products.schema.js';

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

    return res.status(201).json({ message: '판매 상품을 등록하였습니다.' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: '예기치 못한 에러가 발생하였습니다.' });
    // 원래 에러 로깅해야함
  }
});

// 상품 목록 조회 GET
router.get('/products', async (req, res, next) => {
  try {
    const products = await Product.find()
      .select('_id title userName status createdAt') // select로 필요한 부분만 받아오기
      .sort({ createdAt: -1 });

    // 목록 조회 결과를 클라이언트에게 반환
    return res.status(200).json({ products });
  } catch (error) {
    return res
      .status(500)
      .json({ message: '예기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 상세 조회 GET
router.get('/products/:productId', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId) // 변수명 주의! 전체가 아니고 상품 상세라서 하나로
      .select('_id title content userName status createdAt'); // content만 추가

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }

    // 목록 조회 결과를 클라이언트에게 반환
    return res.status(200).json({ products });
  } catch (error) {
    return res
      .status(500)
      .json({ message: '예기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 수정 PUT
router.put('/products/:productId', async (req, res, next) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    const { title, content, password, status } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }

    if (password !== product.password) {
      // 인자로 준 password와 product의 password가 다르면 에러출력
      return res
        .status(401)
        .json({ message: '상품을 수정할 권한이 존재하지 않습니다.' });
    }

    product.title = title;
    product.content = content;
    product.status = status;

    await product.save();
    res.json({ message: '상품 정보를 수정하였습니다.' }); // 200은 status 코드 넘겨주지 않아도 상관없음
  } catch (error) {
    return res
      .status(500)
      .json({ message: '예기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 삭제 DELETE
router.delete('/products/:productId', async (req, res, next) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    const prodectId = req.params.productId;
    const { password } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }

    if (password !== product.password) {
      // 인자로 준 password와 product의 password가 다르면 에러출력
      return res
        .status(401)
        .json({ message: '상품을 수정할 권한이 존재하지 않습니다.' });
    }

    await prodect.deleteOne({ id: productId });

    res.json({ message: '상품을 삭제하였습니다.' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: '예기치 못한 에러가 발생하였습니다.' });
  }
});

const router = express.Router();

export default router;
