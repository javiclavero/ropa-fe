import React from 'react';
import { Carousel } from 'antd';

interface ClothingItem {
  id: number;
  name: string;
  price?: number;
  imageUrl?: string;
}

interface ClothingListProps {
  items: ClothingItem[];
}

const ClothingList: React.FC<ClothingListProps> = ({ items }) => {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6, // Muestra 3 ítems en una sola fila
    slidesToScroll: 1, // Desliza 1 ítem a la vez
    arrows: true, // Muestra las flechas de navegación
  };
  return (
    items.length > 0 ? (
    <Carousel {...carouselSettings}>
      {items.map((item) => (
        <div key={item.id} className="clothing-item" style={{ textAlign: 'center' }}>
          <h3>{item.name}</h3>
          <img
             src={`http://localhost:5000/uploads/cloth-${item.id}.jpg`} // Aquí estaba el problema
             alt={item.name}
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
          
        </div>
      ))}
    </Carousel>) : (
    <p>No hay prendas disponibles para esta categoría.</p>
  )
);
}

export default ClothingList;
