const express = require("express");
const multer = require("multer");
const fs = require("fs");

const con = require("../config/sql");

const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/img_product");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.get("/", (req, res, next) => {
  con.connect(function (err) {
    const sqlget = "SELECT * FROM product";
    con.query(sqlget, function (err, result) {
      res.status(200).json({
        message: "GET product , Connected !",
        data: result,
        err: err,
      });
    });
  });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  con.connect(function (err) {
    const sqlget = "SELECT * FROM product WHERE id_product='" + id + "'";
    con.query(sqlget, function (err, result) {
      res.status(200).json({
        message: "GET product , Connected !",
        id: id,
        data: result,
        err: err,
      });
    });
  });
});

router.post("/", upload.single("file"), (req, res, next) => {
  const product = {
    name_product: req.body.name_product,
    price_product: req.body.price_product,
    description_product: req.body.description_product,
    img_product: "/img_product/" + req.file.filename,
  };
  //   if (req.files) {
  con.connect(function (err) {
    const sqlpost =
      "INSERT INTO product (name_product, price_product, description_product, img_product)" +
      "VALUES ('" +
      product.name_product +
      "', '" +
      product.price_product +
      "', '" +
      product.description_product +
      "', '" +
      product.img_product +
      "')";

    con.query(sqlpost, function (err, result) {
      res.status(200).json({
        message: "POST product , Connected !",
        data: result,
        err: err,
      });
    });
  });

  //   }
});

router.put("/:productId", upload.single("file"), (req, res, next) => {
  const id = req.params.productId;
  const product = {
    name_product: req.body.name_product,
    price_product: req.body.price_product,
    description_product: req.body.description_product,
    // img_product: "/img_product/" + req.file.filename,
    nameimg: req.body.nameimg,
  };
  res.status(200).json({
      message: "PUT product , Connected !",

      file:"sds "+ req.file,
    });
  //   if (req.files) {
  con.connect(function (err) {
    const sqlput = "UPDATE product";
    " SET name_product = '" +
      product.name_product +
      "', price_product= '" +
      product.price_product +
      "' description_product= '" +
      product.description_product +
      "' img_product= '" +
      product.img_product +
      "' WHERE id_product = " +
      id;
    // fs.unlink(product.nameimg, function (err) {

    //   console.log("File deleted!");
    // });
    
    // con.query(sqlput, function (err, result) {
    //   res.status(200).json({
    //     message: "PUT product , Connected !",
    //     data: result,
    //     err: err,
    //   });
    // });
  });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  res.status(200).json({
    message: "DELETE product",
    id: id,
  });
});
module.exports = router;
