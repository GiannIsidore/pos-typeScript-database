<?php
include "headers.php";

class Products
{
  function getAllProduct()
  {
    include "connection.php";
    $sql = "SELECT * FROM products"; // Updated table name
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result ? json_encode($result) : 0;
  }

  function updatePrice($json)
  {
    // {"prod_id":1001,"price":1000}
    include "connection.php";
    $data = json_decode($json, true);
    $sql = "UPDATE products SET prod_price = :price WHERE prod_id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":price", $data["price"]);
    $stmt->bindParam(":id", $data["prod_id"]);
    $stmt->execute();
    return $stmt->rowCount() > 0 ? 1 : 0;
  }

  function addProduct($json)
  {
    // {"productName":"test","price":1000,"barcode":1011}
    include "connection.php";
    $data = json_decode($json, true);

    if ($this->recordExists($data["barcode"], "products", "prod_id")) {
      // Return -1 if the barcode already exists
      return -1;
    } else if ($this->recordExists($data["productName"], "products", "prod_name")) {
      // Return -2 if the product name already exists
      return -2;
    }

    $sql = "INSERT INTO products (prod_id, prod_name, prod_price) VALUES (:id, :name, :price)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":name", $data["productName"]);
    $stmt->bindParam(":price", $data["price"]);
    $stmt->bindParam(":id", $data["barcode"]);
    $stmt->execute();
    return $stmt->rowCount() > 0 ? 1 : 0;
  }

  private function recordExists($value, $table, $column)
  {
    include "connection.php";
    $sql = "SELECT COUNT(*) FROM $table WHERE $column = :value";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":value", $value);
    $stmt->execute();
    $count = $stmt->fetchColumn();
    return $count > 0;
  }
}

// Fetch JSON input and operation type
$json = isset($_POST["json"]) ? $_POST["json"] : "0";
$operation = isset($_POST["operation"]) ? $_POST["operation"] : "0";

$product = new Products();

switch ($operation) {
  case "getAllProduct":
    echo $product->getAllProduct();
    break;
  case "updatePrice":
    echo $product->updatePrice($json);
    break;
  case "addProduct":
    echo $product->addProduct($json);
    break;
  default:
    echo json_encode(["status" => "error", "message" => "No valid operation specified"]);
    break;
}