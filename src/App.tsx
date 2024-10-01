import React, { useState } from "react";
import axios from "axios";
import { Collapse, Button } from "antd";
import "antd/dist/reset.css"; // Importar los estilos de Ant Design
import { categories } from "./data/clothingData";
import ClothingList from "./components/ClothingList";
import AddClothingModal from "./components/AddClothingModal";

const { Panel } = Collapse;

// Define la interfaz para las prendas que vas a mostrar
interface ClothingItem {
  id: number;
  name: string;
  imageUrl?: string; // Imagen opcional
  CloType: number;
}

const App: React.FC = () => {
  const [clothingItems, setClothingItems] = useState<{
    [key: number]: ClothingItem[];
  }>({});
  const [expandedPanel, setExpandedPanel] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState(false); // Estado para controlar el modal

  // Función que se llama cuando se expande un panel
  const handleCategorySelect = (categoryId: number) => {
    if (!clothingItems[categoryId]) {
      // Realizar la llamada a la API para obtener las prendas de la categoría seleccionada
      axios
        .post("http://localhost:5000/api/clothing-items", {
          CloType: categoryId,
        })
        .then((response) => {
          // Mapear los datos de la API para que coincidan con ClothingItem
          const mappedData = response.data.map((item: any) => ({
            id: item.CloId,
            name: item.CloName,
            price: 0, // Como no tienes precio, lo puedes dejar en 0 o un valor por defecto
            imageUrl: "", // Puedes agregar una imagen por defecto si lo necesitas
            CloType: item.CloType,
          }));

          setClothingItems((prev) => ({ ...prev, [categoryId]: mappedData }));
        })
        .catch((error) => {
          console.error("Error fetching clothing items:", error);
        });
    }
    setExpandedPanel(categoryId); // Actualizar el panel expandido
  };

 // Función para abrir el modal
 const handleAddClothing = () => {
  setModalVisible(true);
};

// Función para cerrar el modal
const handleCancel = () => {
  setModalVisible(false);
};

// Función que se ejecuta cuando se añade una prenda
const handleAddSuccess = () => {
  console.log('Prenda añadida correctamente');
  // Aquí puedes refrescar tu listado de prendas o cualquier otra acción
};

  return (
    <div className="App">
      <h1>Catálogo de Ropa</h1>

      <Button type="primary" onClick={handleAddClothing}>
        Añadir Prenda
      </Button>

      {/* Lista de categorías con collapse */}
      <Collapse
        accordion
        activeKey={expandedPanel?.toString()}
        onChange={(key) => handleCategorySelect(Number(key))}
      >
        {categories.map((category) => (
          <Panel header={category.name} key={category.id}>
            {/* Mostrar las prendas dentro de cada panel */}
            <ClothingList items={clothingItems[category.id] || []} />
          </Panel>
        ))}
      </Collapse>

{/* Modal para añadir prenda */}
<AddClothingModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onAddSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default App;
