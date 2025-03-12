import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipo para los productos en el carrito
export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen_url: string;
}

// Tipo para el contexto del carrito
interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cantidad'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getIVA: () => number;
  itemsCount: number;
}

// Crear el contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Proveedor del contexto
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Cargar items del localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem('shopping_cart');
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
        localStorage.removeItem('shopping_cart');
      }
    }
  }, []);
  
  // Guardar en localStorage cuando cambian los items
  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(items));
  }, [items]);
  
  // Añadir un item al carrito
  const addItem = (item: Omit<CartItem, 'cantidad'>) => {
    setItems(prevItems => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Si ya existe, incrementar la cantidad
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].cantidad += 1;
        return updatedItems;
      } else {
        // Si no existe, añadirlo con cantidad 1
        return [...prevItems, { ...item, cantidad: 1 }];
      }
    });
  };
  
  // Eliminar un item del carrito
  const removeItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Actualizar la cantidad de un item
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, cantidad: quantity } : item
      )
    );
  };
  
  // Vaciar el carrito
  const clearCart = () => {
    setItems([]);
  };
  
  // Calcular el subtotal (sin IVA)
  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  };
  
  // Calcular el IVA (19%)
  const getIVA = () => {
    return getSubtotal() * 0.19;
  };
  
  // Calcular el total (subtotal + IVA)
  const getTotal = () => {
    return getSubtotal() + getIVA();
  };
  
  // Calcular el número total de items en el carrito
  const itemsCount = items.reduce((count, item) => count + item.cantidad, 0);
  
  // Valor del contexto
  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTotal,
    getIVA,
    itemsCount
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 