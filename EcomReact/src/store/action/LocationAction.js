// locationActions.js
import { setAddresses, setLoading, setError } from './LocationReducer';

// Fetch addresses from server
export const fetchAddresses = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await fetch('http://localhost:8080/api/users/addresses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch addresses');
    }
    
    const data = await response.json();
    dispatch(setAddresses(data));
    
  } catch (error) {
    dispatch(setError(error.message));
    console.error('Error fetching addresses:', error);
  }
};

// Add new address to server
export const createAddress = (addressData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await fetch('YOUR_API_ENDPOINT/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create address');
    }
    
    // Refresh addresses list
    dispatch(fetchAddresses());
    
  } catch (error) {
    dispatch(setError(error.message));
    console.error('Error creating address:', error);
  }
};

// Update address on server
export const updateAddressOnServer = (addressId, addressData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await fetch(`YOUR_API_ENDPOINT/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update address');
    }
    
    // Refresh addresses list
    dispatch(fetchAddresses());
    
  } catch (error) {
    dispatch(setError(error.message));
    console.error('Error updating address:', error);
  }
};

// Delete address from server
export const deleteAddressFromServer = (addressId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await fetch(`YOUR_API_ENDPOINT/addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete address');
    }
    
    // Refresh addresses list
    dispatch(fetchAddresses());
    
  } catch (error) {
    dispatch(setError(error.message));
    console.error('Error deleting address:', error);
  }
};