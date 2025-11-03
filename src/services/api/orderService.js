import { toast } from 'react-toastify';

export const orderService = {
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
          {"field": {"Name": "billing_info_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "items_c"}}
        ],
        orderBy: [{"fieldName": "order_date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to component-expected format
      return response.data.map(order => ({
        Id: order.Id,
        billingInfo: order.billing_info_c ? JSON.parse(order.billing_info_c) : {},
        shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : {},
        status: order.status_c,
        total: order.total_c,
        orderDate: order.order_date_c,
        items: order.items_c ? JSON.parse(order.items_c) : []
      }));
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data?.message || error);
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
          {"field": {"Name": "billing_info_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "items_c"}}
        ]
      };

      const response = await apperClient.getRecordById('order_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Order not found");
      }

      // Transform database fields to component-expected format
      const order = response.data;
      return {
        Id: order.Id,
        billingInfo: order.billing_info_c ? JSON.parse(order.billing_info_c) : {},
        shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : {},
        status: order.status_c,
        total: order.total_c,
        orderDate: order.order_date_c,
        items: order.items_c ? JSON.parse(order.items_c) : []
      };
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error?.response?.data?.message || error);
      throw new Error("Order not found");
    }
  },

  async create(orderData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const params = {
        records: [{
          Name: `Order ${new Date().toISOString()}`,
          billing_info_c: JSON.stringify(orderData.billingInfo),
          shipping_address_c: JSON.stringify(orderData.shippingAddress),
          status_c: orderData.status || "Confirmed",
          total_c: orderData.total,
          order_date_c: new Date().toISOString(),
          items_c: JSON.stringify(orderData.items)
        }]
      };

      const response = await apperClient.createRecord('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create order");
      }

      if (response.results && response.results[0].success) {
        const order = response.results[0].data;
        return {
          Id: order.Id,
          billingInfo: order.billing_info_c ? JSON.parse(order.billing_info_c) : {},
          shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : {},
          status: order.status_c,
          total: order.total_c,
          orderDate: order.order_date_c,
          items: order.items_c ? JSON.parse(order.items_c) : []
        };
      }

      throw new Error("Failed to create order");
    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error);
      throw new Error("Failed to create order");
    }
  },

  async updateStatus(id, status) {
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
          status_c: status
        }]
      };

      const response = await apperClient.updateRecord('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update order");
      }

      if (response.results && response.results[0].success) {
        const order = response.results[0].data;
        return {
          Id: order.Id,
          billingInfo: order.billing_info_c ? JSON.parse(order.billing_info_c) : {},
          shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : {},
          status: order.status_c,
          total: order.total_c,
          orderDate: order.order_date_c,
          items: order.items_c ? JSON.parse(order.items_c) : []
        };
      }

      throw new Error("Failed to update order");
    } catch (error) {
      console.error("Error updating order status:", error?.response?.data?.message || error);
      throw new Error("Failed to update order");
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

      const response = await apperClient.deleteRecord('order_c', params);
      
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
      console.error("Error deleting order:", error?.response?.data?.message || error);
      return false;
    }
  }
};