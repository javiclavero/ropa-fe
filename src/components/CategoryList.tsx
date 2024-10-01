import React from 'react';

interface Category {
  id: number;
  name: string;
}

interface CategoryListProps {
  categories: Category[];
  onCategorySelect: (id: number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onCategorySelect }) => {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.id} onClick={() => onCategorySelect(category.id)}>
          {category.name}
        </li>
      ))}
    </ul>
  );
}

export default CategoryList;
