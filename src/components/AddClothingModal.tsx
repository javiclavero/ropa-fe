import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { UploadFile } from 'antd/lib/upload/interface';
import { categories, Category } from '../data/clothingData';  

interface AddClothingModalProps {
  visible: boolean;
  onCancel: () => void;
  onAddSuccess: () => void;
}

const { Option } = Select;

const AddClothingModal: React.FC<AddClothingModalProps> = ({ visible, onCancel, onAddSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]); 


  const handleFileChange = (info: any) => {
    let newFileList = [...info.fileList];


    newFileList = newFileList.slice(-1);


    setFileList(newFileList);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (fileList.length === 0 || !fileList[0].originFileObj) {
        message.error('Debes subir una imagen.');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('prenda', values.prenda);
      formData.append('tipoPrenda', values.tipoPrenda);
      formData.append('imagen', fileList[0].originFileObj as Blob);  // adjuntar el archivo como blob

      // Enviar datos al backend
      await axios.post('http://localhost:5000/api/clothing-add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Prenda añadida correctamente');
      form.resetFields();
      setFileList([]);  
      onAddSuccess(); 
      onCancel();  
    } catch (error) {
      console.error('Error al añadir prenda:', error);
      message.error('Error al añadir prenda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Añadir Prenda"
      okText="Añadir"
      cancelText="Cancelar"
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="prenda"
          label="Nombre de la Prenda"
          rules={[{ required: true, message: 'Por favor, ingrese el nombre de la prenda' }]}
        >
          <Input placeholder="Nombre de la prenda" />
        </Form.Item>
        
        <Form.Item
          name="tipoPrenda"
          label="Tipo de Prenda"
          rules={[{ required: true, message: 'Por favor, seleccione el tipo de prenda' }]}
        >
          <Select placeholder="Selecciona el tipo de prenda">
            {categories.map((category: Category) => (
              <Option key={category.id} value={category.id}>{category.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Imagen de la prenda">
          <Upload
            beforeUpload={() => false}  
            onChange={handleFileChange}
            fileList={fileList}  
            maxCount={1}
            listType="picture"  
          >
            <Button icon={<UploadOutlined />}>Subir imagen</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddClothingModal;
