import { Link } from 'react-router-dom'

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  status: string;
  thumbnail: string;
  hoverThumbnail?: string;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + " VND";
};

const statusLabel = (status: string) => {
  switch (status) {
    case "NEW_IN":
      return "NEW IN";
    case "ACTIVE":
      return "ACTIVE";
    case "SOLD_OUT":
      return "SOLD OUT";
    case "PRE_ORDER":
      return "PRE ORDER";
    default:
      return status;
  }
};

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="w-full bg-black p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.slug}`}
            className="group cursor-pointer text-white"
          >

            <div className="relative aspect-square overflow-hidden bg-neutral-900">

              <img
                src={product.thumbnail}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out scale-100 opacity-100 group-hover:scale-105 group-hover:opacity-0"
              />


              {product.hoverThumbnail && (
                <img
                  src={product.hoverThumbnail}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out scale-110 opacity-0 group-hover:opacity-100"
                />
              )}

              <div className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] font-semibold px-2 py-1 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
                {statusLabel(product.status)}
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-sm uppercase tracking-wide line-clamp-2">
                {product.name}
              </h3>
              <div className="mt-1 text-sm font-medium">
                {formatPrice(product.price)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
