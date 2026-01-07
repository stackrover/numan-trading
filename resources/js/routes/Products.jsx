import { useProducts, useDeleteProduct } from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Products() {
    const { data, isLoading } = useProducts();
    const { mutate: deleteProduct } = useDeleteProduct();
    const [selectedProduct, setSelectedProduct] = useState(null);

    const products = data?.data || [];

    const handleDelete = (id) => {
        deleteProduct(id);
    };

    return (
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your catalog of items.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Icon icon="solar:add-circle-linear" width="20" className="mr-2" />
                    New Product
                </Button>
            </header>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-400">Loading products...</TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-400">No products found.</TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">{product.title}</span>
                                            <span className="text-xs text-gray-400">{product.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-600">{product.category_id || "Uncategorized"}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-bold text-gray-900">${product.price}</span>
                                        {product.discount_price && (
                                            <span className="text-[10px] text-gray-400 line-through ml-2">${product.discount_price}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {product.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
                                                <Icon icon="solar:pen-linear" width="18" />
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600">
                                                        <Icon icon="solar:trash-bin-trash-linear" width="18" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete "{product.title}". This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(product.id)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
