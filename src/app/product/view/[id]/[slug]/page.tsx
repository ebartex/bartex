// app/product/view/[id]/[slug]/page.tsx

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Definicja typu produktu
interface Product {
  id: string;
  nazwa: string;

}

const ProductPage = () => {
  // Pobieramy parametry 'productId' i 'productSlug' z URL
  const params = useParams<{ id: string, slug: string }>();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://www.bapi2.ebartex.pl/tw/index?tw-id=${id}`
        );
        const data = await response.json();

        // Jeśli dane są poprawne, ustawiamy stan produktu
        if (data) {
          setProduct(data); // Ustawiamy dane produktu
        } else {
          setError("Produkt nie znaleziony");
        }

        setLoading(false); // Po zakończeniu ładowania zmieniamy stan
      } catch (err) {
        setError("Błąd podczas pobierania danych produktu");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Zmienna zależna od params.productId

  // Jeśli dane są ładowane, wyświetlamy spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-4 border-blue-600"></div>
      </div>
    );
  }

  // Jeśli wystąpił błąd, wyświetlamy komunikat o błędzie
  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Jeśli produkt nie został znaleziony
  if (!product) {
    return (
      <div className="text-center">
        <p>Produkt nie został znaleziony.</p>
      </div>
    );
  }

  // Renderowanie produktu, gdy dane są dostępne
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        <div className="md:w-1/2">
          {/* Obrazek produktu */}
  
        </div>
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product[0].nazwa}</h1>

          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
            Dodaj do koszyka
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
