/**
 * Frontend client for communicating with ML backend API
 * Enables advanced model training, predictions, and management
 */

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

class MLBackendClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.currentModelId = localStorage.getItem('ml-model-id') || null;
  }

  /**
   * Train a new model with images and labels
   * @param {File[]} images - Array of image files
   * @param {string[]} labels - Array of labels corresponding to images
   * @returns {Promise<Object>} Training result with modelId and accuracy
   */
  async trainModel(images, labels) {
    try {
      const formData = new FormData();

      // Add images
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      // Add labels as JSON
      formData.append('labels', JSON.stringify(labels));

      const response = await fetch(`${this.baseURL}/models/train`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Training failed: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        this.currentModelId = data.modelId;
        localStorage.setItem('ml-model-id', data.modelId);
      }
      return data;
    } catch (error) {
      console.error('Training error:', error);
      throw error;
    }
  }

  /**
   * Make predictions with trained model
   * @param {File} image - Image to predict on
   * @returns {Promise<Object>} Prediction results
   */
  async predict(image) {
    try {
      if (!this.currentModelId) {
        throw new Error('No model selected. Please train a model first.');
      }

      const formData = new FormData();
      formData.append('image', image);
      formData.append('modelId', this.currentModelId);

      const response = await fetch(`${this.baseURL}/models/predict`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Prediction failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }

  /**
   * Get list of all trained models
   * @returns {Promise<Array>} Array of models
   */
  async listModels() {
    try {
      const response = await fetch(`${this.baseURL}/models`);

      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  }

  /**
   * Get details of a specific model
   * @param {string} modelId - Model ID
   * @returns {Promise<Object>} Model details
   */
  async getModelDetails(modelId) {
    try {
      const response = await fetch(`${this.baseURL}/models/${modelId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch model details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching model details:', error);
      throw error;
    }
  }

  /**
   * Export model data
   * @param {string} modelId - Model ID to export
   * @returns {Promise<Object>} Exportable model data
   */
  async exportModel(modelId) {
    try {
      const response = await fetch(`${this.baseURL}/models/${modelId}/export`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to export model');
      }

      return await response.json();
    } catch (error) {
      console.error('Error exporting model:', error);
      throw error;
    }
  }

  /**
   * Delete a model
   * @param {string} modelId - Model ID to delete
   * @returns {Promise<Object>} Deletion result
   */
  async deleteModel(modelId) {
    try {
      const response = await fetch(`${this.baseURL}/models/${modelId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete model');
      }

      if (this.currentModelId === modelId) {
        this.currentModelId = null;
        localStorage.removeItem('ml-model-id');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting model:', error);
      throw error;
    }
  }

  /**
   * Set current model
   * @param {string} modelId - Model ID to set as current
   */
  setCurrentModel(modelId) {
    this.currentModelId = modelId;
    localStorage.setItem('ml-model-id', modelId);
  }

  /**
   * Get current model ID
   * @returns {string|null} Current model ID
   */
  getCurrentModel() {
    return this.currentModelId;
  }

  /**
   * Health check
   * @returns {Promise<Object>} Server status
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const mlBackendClient = new MLBackendClient();

export default MLBackendClient;
