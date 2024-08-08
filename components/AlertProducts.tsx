/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog"; // Adjust the import based on your project structure
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Product {
  barcode: string;
  prod_name: string;
  prod_price: number;
}

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newProduct, setNewProduct] = useState({
    barcode: "",
    prod_name: "",
    prod_price: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(
          "http://localhost/3rdProj/p-o-s-master/phpdata/fetch_products.php"
        );
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = useCallback(() => {
    const filtered = products.filter((product) =>
      product.prod_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, handleSearch]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (selectedProductIndex !== null) {
      if (event.key === "ArrowUp") {
        setSelectedProductIndex((prevIndex) =>
          prevIndex! > 0 ? prevIndex! - 1 : prevIndex
        );
      } else if (event.key === "ArrowDown") {
        setSelectedProductIndex((prevIndex) =>
          prevIndex! < filteredProducts.length - 1 ? prevIndex! + 1 : prevIndex
        );
      } else if (event.key === "Enter" && selectedProductIndex !== null) {
        const selectedProduct = filteredProducts[selectedProductIndex];
        console.log("Selected product:", selectedProduct);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProductIndex, filteredProducts]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/3rdProj/p-o-s-master/phpdata/add_products.php",
        newProduct
      );
      if (response.data.status === "success") {
        // Refresh product list after adding new product
        const updatedProducts = await axios.get<Product[]>(
          "http://localhost/3rdProj/p-o-s-master/phpdata/fetch_products.php"
        );
        setProducts(updatedProducts.data);
        setFilteredProducts(updatedProducts.data);
        setNewProduct({ barcode: "", prod_name: "", prod_price: "" });
        setErrorMessage(""); // Clear any previous error message
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    window.removeEventListener("keydown", handleKeyDown);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    window.addEventListener("keydown", handleKeyDown);
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>Open Products</AlertDialogTrigger>
        <AlertDialogContent className="max-w-[80vw] h-[90vh] bg-zinc-900 grid grid-cols-3 gap-2">
          <Card className="w-full max-w-lg bg-white border border-muted rounded-lg overflow-hidden col-span-1">
            <div className="p-6 flex flex-col items-center justify-center gap-4">
              <form className="w-full" onSubmit={handleAddProduct}>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      type="text"
                      placeholder="Barcode"
                      value={newProduct.barcode}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          barcode: e.target.value,
                        })
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.prod_name}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          prod_name: e.target.value,
                        })
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Price"
                      value={newProduct.prod_price}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          prod_price: e.target.value,
                        })
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Add Product
                  </Button>
                </div>
              </form>
              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
            </div>
          </Card>
          <div className="max-w-[70vw] w-full col-span-2">
            <input
              type="text"
              placeholder="Search products..."
              className="mb-4 p-2 border border-gray-400 rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <div className="overflow-y-scroll w-full max-h-[50vh]">
              <table className="text-xl min-w-full">
                <thead>
                  <tr className="bg-blue-800 text-white">
                    <th className="bg-blue-800">Barcode</th>
                    <th className="bg-blue-800">Product Name</th>
                    <th className="bg-blue-800">Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product.barcode}
                      className={
                        selectedProductIndex === index ? "bg-blue-300" : ""
                      }
                    >
                      <td className="py-4 px-6 text-black">
                        {product.barcode}
                      </td>
                      <td className="py-4 px-6 text-black">
                        {product.prod_name}
                      </td>
                      <td className="py-4 px-6 text-black">
                        ₱{product.prod_price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductTable;
