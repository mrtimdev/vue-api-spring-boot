import axios from 'axios'

export interface Car {
  name: string
  wheels: number
}

const API_URL = 'http://localhost:8080/cars'

export class CarService {
  async getCarByName(name: string): Promise<Car | null> {
    try {
      const response = await axios.get(`${API_URL}/${name}`)
      return response.data
    } catch (error) {
      return null
    }
  }

  async addCar(car: Car): Promise<void> {
    await axios.post(API_URL, car)
  }

  async getCarsByWheels(wheels: number): Promise<Car[]> {
    const response = await axios.get(`${API_URL}/wheels/${wheels}`)
    return response.data
  }

  async getAllCars(): Promise<Car[]> {
    const response = await axios.get(API_URL)
    return response.data
  }
  async resetData(): Promise<void> {
    await axios.delete(API_URL) // Assuming DELETE method clears all data on the backend
  }
}
