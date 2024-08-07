"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { CartesianGrid, XAxis, Bar, BarChart } from "recharts";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Product {
  barcode: string;
  prod_name: string;
  prod_price: number;
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<
    number | null
  >(null);
  const [selectedColumn, setSelectedColumn] = useState<string>("prod_name");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newProduct, setNewProduct] = useState({
    barcode: "",
    prod_name: "",
    prod_price: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const prodNameInputRef = useRef<HTMLInputElement>(null);
  const prodPriceInputRef = useRef<HTMLInputElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

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
    const key = event.key;
    if (key === "/") {
      event.preventDefault();
      searchInputRef.current?.focus();
      return;
    }

    if (event.ctrlKey && key === "Enter") {
      handleAddProduct();
      return;
    }

    if (event.shiftKey && key === "Enter" && selectedProductIndex !== null) {
      setSelectedProduct(filteredProducts[selectedProductIndex]);
      setAlertOpen(true);
      return;
    }

    if (key === "Delete" && selectedProductIndex !== null) {
      handleDeleteProduct(filteredProducts[selectedProductIndex].barcode);
      console.log(filteredProducts[selectedProductIndex].barcode);
      return;
    }

    switch (true) {
      case key === "ArrowUp":
        event.preventDefault();
        setSelectedProductIndex((prevIndex) => {
          const newIndex = prevIndex! > 0 ? prevIndex! - 1 : prevIndex;
          rowRefs.current[newIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          return newIndex;
        });
        break;

      case key === "ArrowDown":
        event.preventDefault();
        setSelectedProductIndex((prevIndex) => {
          const newIndex =
            prevIndex! < filteredProducts.length - 1
              ? prevIndex! + 1
              : prevIndex;
          rowRefs.current[newIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          return newIndex;
        });
        break;

      case key === "[":
      case key === "]":
        const columns = ["barcode", "prod_name", "prod_price"];
        const currentIndex = columns.indexOf(selectedColumn);
        if (key === "[") {
          const newIndex =
            currentIndex > 0 ? currentIndex - 1 : columns.length - 1;
          setSelectedColumn(columns[newIndex]);
        } else {
          const newIndex =
            currentIndex < columns.length - 1 ? currentIndex + 1 : 0;
          setSelectedColumn(columns[newIndex]);
        }
        break;

      case key === "Enter":
        if (selectedProductIndex !== null) {
          const selectedProduct = filteredProducts[selectedProductIndex];
          console.log("Selected product:", selectedProduct);
        }
        break;
    }
  };

  useEffect(() => {
    const handleKeyDownWithRef = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(event.target.tagName)
      ) {
        return;
      }
      handleKeyDown(event);
    };

    window.addEventListener("keydown", handleKeyDownWithRef);
    return () => {
      window.removeEventListener("keydown", handleKeyDownWithRef);
    };
  }, [selectedProductIndex, filteredProducts, selectedColumn]);

  const handleAddProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/3rdProj/p-o-s-master/phpdata/add_products.php",
        newProduct
      );
      if (response.data.status === "success") {
        const updatedProducts = await axios.get<Product[]>(
          "http://localhost/3rdProj/p-o-s-master/phpdata/fetch_products.php"
        );
        toast({
          title: "Product added",
          variant: "success",
          description: "Product has been added successfully.",
        });
        setProducts(updatedProducts.data);
        setFilteredProducts(updatedProducts.data);
        setNewProduct({ barcode: "", prod_name: "", prod_price: "" });
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message);
        toast({
          title: "Error",
          variant: "destructive",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    if (selectedProduct) {
      try {
        const response = await axios.post(
          "http://localhost/3rdProj/p-o-s-master/phpdata/update_product.php",
          selectedProduct
        );
        if (response.data.status === "success") {
          const updatedProducts = await axios.get<Product[]>(
            "http://localhost/3rdProj/p-o-s-master/phpdata/fetch_products.php"
          );
          toast({
            title: "Product updated",
            variant: "success",
            description: "Product has been updated successfully.",
          });
          setProducts(updatedProducts.data);
          setFilteredProducts(updatedProducts.data);
          setSelectedProduct(null);
          setAlertOpen(false);
        } else {
          setErrorMessage(response.data.message);
          toast({
            title: "Error",
            variant: "destructive",
            description: response.data.message,
          });
          ``;
        }
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  const handleDeleteProduct = async (barcode: string) => {
    console.log("Deleting barcode:", barcode);

    try {
      const response = await axios.post(
        "http://localhost/3rdProj/p-o-s-master/phpdata/delete_product.php",
        new URLSearchParams({ barcode })
      );

      const data = response.data;
      console.log(data);

      if (data.status === "success") {
        // Handle successful deletion
        toast({
          title: "Product deleted",
          variant: "success",
          description: "Product has been deleted successfully.",
        });
        // Refresh the product list or update state
      } else {
        // Handle error
        toast({
          title: "Error",
          variant: "destructive",
          description: data.message,
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to delete product.",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <h1 className="text-2xl font-bold">GAISANO</h1>
      </header>
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[80vh]">
              <div className="flex items-center justify-between max-h-[80vh] mt-4">
                <div className="max-w-[70vw] max-h-[80vh] h-full  w-full col-span-2">
                  <input
                    type="text"
                    ref={searchInputRef}
                    placeholder="Search products..."
                    className="mb-4 p-2 border border-gray-400 rounded"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="overflow-y-scroll w-full max-h-[58vh]">
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
                              selectedProductIndex === index
                                ? "bg-blue-300"
                                : ""
                            }
                            ref={(el) => (rowRefs.current[index] = el)}
                          >
                            <td
                              className={`py-4 px-6 text-black ${
                                selectedColumn === "barcode" ? "" : ""
                              }`}
                            >
                              {product.barcode}
                            </td>
                            <td
                              className={`py-4 px-6 text-black ${
                                selectedColumn === "prod_name" ? "" : ""
                              }`}
                            >
                              {product.prod_name}
                            </td>
                            <td
                              className={`py-4 px-6 text-black ${
                                selectedColumn === "prod_price" ? "" : ""
                              }`}
                            >
                              ₱{product.prod_price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Product Add/Edit</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <form className="w-full" onSubmit={handleAddProduct}>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="barcode">Barcode</Label>
                      <Input
                        id="barcode"
                        ref={barcodeInputRef}
                        type="text"
                        placeholder="Barcode"
                        value={newProduct.barcode}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            barcode: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        ref={prodNameInputRef}
                        type="text"
                        placeholder="Product Name"
                        value={newProduct.prod_name}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            prod_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        ref={prodPriceInputRef}
                        type="number"
                        placeholder="Price"
                        value={newProduct.prod_price}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            prod_price: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Product
                    </Button>
                  </div>
                </form>
                <Card className="p-3 mt-4">
                  <CardHeader>
                    <CardTitle>Sales by Cashier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarchartChart className="aspect-[9/4]" />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogTrigger className="hidden" />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Product</AlertDialogTitle>
            <AlertDialogDescription>
              <form className="w-full" onSubmit={handleUpdateProduct}>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="updateBarcode">Barcode</Label>
                    <Input
                      id="updateBarcode"
                      type="text"
                      placeholder="Barcode"
                      value={selectedProduct?.barcode || ""}
                      onChange={(e) =>
                        setSelectedProduct((prev) => ({
                          ...prev!,
                          barcode: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="updateProductName">Product Name</Label>
                    <Input
                      id="updateProductName"
                      type="text"
                      placeholder="Product Name"
                      value={selectedProduct?.prod_name || ""}
                      onChange={(e) =>
                        setSelectedProduct((prev) => ({
                          ...prev!,
                          prod_name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="updatePrice">Price</Label>
                    <Input
                      id="updatePrice"
                      type="number"
                      placeholder="Price"
                      value={selectedProduct?.prod_price || ""}
                      onChange={(e) =>
                        setSelectedProduct((prev) => ({
                          ...prev!,
                          prod_price: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </form>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateProduct}>
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

function BarchartChart(props) {
  const [chartData, setChartData] = useState([]);
  const [salesDate, setSalesDate] = useState("");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/3rdProj/p-o-s-master/phpdata/get_all_sales_report.php"
        );
        const data = response.data;

        // Log the response data to verify its structure
        console.log("Sales data received:", data);

        // Ensure data contains the correct product information
        if (data && data.status === "success") {
          const salesData = data.sales;
          const date = salesData[0].sales_date; // Assuming all entries are from the same date
          setSalesDate(date);

          // Transform the data to match the structure required by Recharts
          const transformedData = salesData.map((sale) => ({
            cashier: `${sale.fName} ${sale.lName}`,
            sales: sale.items.reduce(
              (total, item) =>
                total + parseFloat(item.sales_item_prc) * item.sales_item_qty,
              0
            ),
          }));

          setChartData(transformedData);
        } else {
          setChartData([]);
          setSalesDate(""); // No sales data for the day
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  const colorMap = {
    "Giann Legaspi": "#8884d8",
    "Christian Valencia": "#82ca9d",
    "Raz Baldoza": "#ffc658",
    // Add more cashiers and their respective colors here
  };

  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="min-h-[300px]"
      >
        <BarChart
          width={600}
          height={300}
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="cashier"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey="sales"
            radius={8}
            fill={(entry) => colorMap[entry.cashier] || "#000"}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

export default Dashboard;
