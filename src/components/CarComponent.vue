<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="max-w-md w-full p-6 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-semibold mb-6 text-center text-gray-800">Car Info Checker</h1>
      <div class="mb-4">
        <input
          v-model="carName"
          @keyup.enter="checkCar"
          placeholder="Enter a car name or command"
          class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        />
      </div>
      <div class="flex gap-10 custom-gap">
        <button
          @click="checkCar"
          class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          Check
        </button>

        <button
          @click="resetData"
          type="button"
          class="w-full p-3 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Reset
        </button>
      </div>
      <div v-if="message" class="mt-4 text-center text-gray-700 text-lg font-medium">
        {{ message }}
      </div>
      <ul v-if="carList.length" class="mt-4 space-y-2">
        <li
          v-for="car in carList"
          :key="car.name"
          class="p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 shadow-sm"
        >
          {{ car.name }} has {{ car.wheels }} wheels.
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { CarService } from '../services/CarService'
interface Car {
  name: string
  wheels: number
}
export default {
  name: 'CarComponent',
  setup() {
    const carService = new CarService()
    const carName = ref('')
    const message = ref('')
    const carList = ref<Car[]>([])

    const checkCar = async () => {
      if (carName.value === '4-wheel-car') {
        const cars = await carService.getCarsByWheels(4)
        message.value = `[${cars.length}] ${cars.map((car) => car.name).join(', ')}`
        carList.value = cars
      } else if (carName.value === '2-wheel-car') {
        const cars = await carService.getCarsByWheels(2)
        message.value = `[${cars.length}] ${cars.map((car) => car.name).join(', ')}`
        carList.value = cars
      } else if (carName.value === 'All') {
        const cars = await carService.getAllCars()
        message.value = `[${cars.length}] ${cars.map((car) => car.name).join(', ')}`
        carList.value = cars
      } else if (carName.value === 'Bye') {
        message.value = 'Goodbye!'
        carList.value = []
      } else {
        const car = await carService.getCarByName(carName.value)
        if (car) {
          message.value = `"${car.name}" has ${car.wheels} wheels.`
          carList.value = []
        } else {
          const wheels = prompt(`"${carName.value}" is not on my list. Number of wheels?`)
          if (wheels) {
            const newCar: Car = { name: carName.value, wheels: parseInt(wheels) }
            await carService.addCar(newCar)
            message.value = `Thanks. I updated the information.`
          }
        }
      }
    }

    const resetData = async () => {
      await carService.resetData()
      carList.value = []
      message.value = 'Data has been reset!'
    }

    return {
      carName,
      message,
      carList,
      checkCar,
      resetData
    }
  }
}
</script>
<style scoped>
input {
  margin-bottom: 1rem;
}
.custom-gap {
  gap: 10px !important;
}
</style>
