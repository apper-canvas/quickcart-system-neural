import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const productService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}}, 
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "specifications_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to component-expected format
      return response.data.map(product => ({
        Id: product.Id,
        name: product.name_c || product.Name,
        category: product.category_c,
        description: product.description_c,
        imageUrl: product.image_url_c,
        inStock: product.in_stock_c,
        price: product.price_c,
        specifications: product.specifications_c ? JSON.parse(product.specifications_c) : {}
      }));
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}}, 
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "specifications_c"}}
        ]
      };

      const response = await apperClient.getRecordById('product_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Product not found");
      }

      // Transform database fields to component-expected format
      const product = response.data;
      return {
        Id: product.Id,
        name: product.name_c || product.Name,
        category: product.category_c,
        description: product.description_c,
        imageUrl: product.image_url_c,
        inStock: product.in_stock_c,
        price: product.price_c,
        specifications: product.specifications_c ? JSON.parse(product.specifications_c) : {}
      };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error);
      throw new Error("Product not found");
    }
  },

  async getByCategory(category) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}}, 
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "specifications_c"}}
        ],
        where: [{"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}]
      };

      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to component-expected format
      return response.data.map(product => ({
        Id: product.Id,
        name: product.name_c || product.Name,
        category: product.category_c,
        description: product.description_c,
        imageUrl: product.image_url_c,
        inStock: product.in_stock_c,
        price: product.price_c,
        specifications: product.specifications_c ? JSON.parse(product.specifications_c) : {}
      }));
    } catch (error) {
      console.error("Error fetching products by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(productData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const params = {
        records: [{
          Name: productData.name,
          name_c: productData.name,
          category_c: productData.category,
          description_c: productData.description,
          image_url_c: productData.imageUrl,
          in_stock_c: productData.inStock,
          price_c: productData.price,
          specifications_c: JSON.stringify(productData.specifications || {})
        }]
      };

      const response = await apperClient.createRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create product");
      }

      if (response.results && response.results[0].success) {
        const product = response.results[0].data;
        return {
          Id: product.Id,
          name: product.name_c || product.Name,
          category: product.category_c,
          description: product.description_c,
          imageUrl: product.image_url_c,
          inStock: product.in_stock_c,
          price: product.price_c,
          specifications: product.specifications_c ? JSON.parse(product.specifications_c) : {}
        };
      }

      throw new Error("Failed to create product");
    } catch (error) {
      console.error("Error creating product:", error?.response?.data?.message || error);
      throw new Error("Failed to create product");
    }
  },

  async update(id, productData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const params = {
        records: [{
          Id: id,
          Name: productData.name,
          name_c: productData.name,
          category_c: productData.category,
          description_c: productData.description,
          image_url_c: productData.imageUrl,
          in_stock_c: productData.inStock,
          price_c: productData.price,
          specifications_c: JSON.stringify(productData.specifications || {})
        }]
      };

      const response = await apperClient.updateRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update product");
      }

      if (response.results && response.results[0].success) {
        const product = response.results[0].data;
        return {
          Id: product.Id,
          name: product.name_c || product.Name,
          category: product.category_c,
          description: product.description_c,
          imageUrl: product.image_url_c,
          inStock: product.in_stock_c,
          price: product.price_c,
          specifications: product.specifications_c ? JSON.parse(product.specifications_c) : {}
        };
      }

      throw new Error("Failed to update product");
    } catch (error) {
      console.error("Error updating product:", error?.response?.data?.message || error);
      throw new Error("Failed to update product");
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results && response.results[0].success) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting product:", error?.response?.data?.message || error);
      return false;
return false;
    }
  }
};