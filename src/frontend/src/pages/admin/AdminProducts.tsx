import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../../backend";
import { ExternalBlob } from "../../backend";
import {
  useAvailableProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "../../hooks/useQueries";

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0n,
  unit: "",
  stockQuantity: 0n,
  isAvailable: true,
  imageId: undefined,
};

const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2", "sk-3"];

function ProductForm({
  initial,
  onSave,
  isSaving,
}: {
  initial: Omit<Product, "id"> & { id?: string };
  onSave: (product: Omit<Product, "id"> & { id?: string }) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity"
          ? BigInt(value || 0)
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let product = { ...form };
    if (imageFile) {
      const bytes = new Uint8Array(await imageFile.arrayBuffer());
      const blob =
        ExternalBlob.fromBytes(bytes).withUploadProgress(setUploadProgress);
      product = { ...product, imageId: blob };
    }
    onSave(product);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1">
          <Label>Product Name</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Alphonso Mangoes"
            required
            data-ocid="admin.input"
          />
        </div>
        <div className="space-y-1">
          <Label>Price (₹)</Label>
          <Input
            name="price"
            type="number"
            min={0}
            value={Number(form.price)}
            onChange={handleChange}
            required
            data-ocid="admin.input"
          />
        </div>
        <div className="space-y-1">
          <Label>Unit</Label>
          <Input
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="kg / 250g / dozen"
            required
            data-ocid="admin.input"
          />
        </div>
        <div className="space-y-1">
          <Label>Stock Quantity</Label>
          <Input
            name="stockQuantity"
            type="number"
            min={0}
            value={Number(form.stockQuantity)}
            onChange={handleChange}
            required
            data-ocid="admin.input"
          />
        </div>
        <div className="space-y-1 flex flex-col justify-end">
          <Label className="mb-2">Available for Sale</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={form.isAvailable}
              onCheckedChange={(v) =>
                setForm((prev) => ({ ...prev, isAvailable: v }))
              }
              data-ocid="admin.switch"
            />
            <span className="text-sm text-muted-foreground">
              {form.isAvailable ? "Yes" : "No"}
            </span>
          </div>
        </div>
        <div className="col-span-2 space-y-1">
          <Label>Description</Label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe your fruit..."
            data-ocid="admin.textarea"
          />
        </div>
        <div className="col-span-2 space-y-1">
          <Label>Product Image</Label>
          <label
            className="flex items-center gap-3 cursor-pointer border border-dashed border-border rounded-lg p-3 hover:bg-muted/50 transition-colors"
            data-ocid="admin.upload_button"
          >
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {imageFile ? imageFile.name : "Click to upload image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <p className="text-xs text-muted-foreground">
              Uploading: {uploadProgress}%
            </p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={isSaving}
          data-ocid="admin.submit_button"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Save Product"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function AdminProducts() {
  const { data: products, isLoading } = useAvailableProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const handleCreate = async (
    product: Omit<Product, "id"> & { id?: string },
  ) => {
    try {
      await createProduct.mutateAsync({
        ...product,
        id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      } as Product);
      setAddOpen(false);
      toast.success("Product added!");
    } catch {
      toast.error("Failed to add product.");
    }
  };

  const handleUpdate = async (
    product: Omit<Product, "id"> & { id?: string },
  ) => {
    if (!editProduct) return;
    try {
      await updateProduct.mutateAsync({
        ...product,
        id: editProduct.id,
      } as Product);
      setEditProduct(null);
      toast.success("Product updated!");
    } catch {
      toast.error("Failed to update product.");
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete product.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">Products</h2>
        <Button
          onClick={() => setAddOpen(true)}
          data-ocid="admin.open_modal_button"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="admin.loading_state">
          {SKELETON_KEYS.map((k) => (
            <Skeleton key={k} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <div className="text-center py-16" data-ocid="admin.empty_state">
          <p className="text-muted-foreground">
            No products yet. Add your first fruit!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p, i) => (
            <div
              key={p.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
              data-ocid={`admin.item.${i + 1}`}
            >
              <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={
                    p.imageId?.getDirectURL() ??
                    "/assets/generated/fruit-mango.dim_600x600.jpg"
                  }
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{p.name}</p>
                <p className="text-sm text-muted-foreground">
                  ₹{Number(p.price)} / {p.unit} · Stock:{" "}
                  {Number(p.stockQuantity)}
                </p>
              </div>
              <Badge variant={p.isAvailable ? "default" : "secondary"}>
                {p.isAvailable ? "Available" : "Hidden"}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditProduct(p)}
                  data-ocid={`admin.edit_button.${i + 1}`}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      data-ocid={`admin.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent data-ocid="admin.dialog">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove {p.name} from your store.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="admin.cancel_button">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(p.id)}
                        className="bg-destructive text-destructive-foreground"
                        data-ocid="admin.confirm_button"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            initial={{ ...EMPTY_PRODUCT }}
            onSave={handleCreate}
            isSaving={createProduct.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editProduct}
        onOpenChange={(o) => !o && setEditProduct(null)}
      >
        <DialogContent className="max-w-lg" data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <ProductForm
              initial={editProduct}
              onSave={handleUpdate}
              isSaving={updateProduct.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
