import Food from "../models/food.js";

export const createFood = async (data, user) => {
    if(user.role !== "admin"){
        throw new Error("Only an admin can create food")
    }

    const food = await Food.create(data);
    return food;
};

export const getAllFood = async (query) => {
    const where = {};

    if(query.name) {
        where.name = query.name
    }

    if(query.category) {
        where.category = query.category;
    }

    if(query.isAvailable){
        where.isAvailable = query.isAvailable === "true"
    }

    const foods = await Food.findAll({ where });

    return foods;
};


export const getFoodById = async (id) => {
    const food = await Food.findByPk(id);

    if(!food) {
        throw new Error ("Food not found");
    }

    return food;
};

export const updateFood = async (id, data, user) => {
  if (user.role !== "admin") {
    throw new Error("Only admin can update food");
  }

  const food = await Food.findByPk(id);

  if (!food) {
    throw new Error("Food not found");
  }

  await food.update(data);
  await food.reload();

  return food;
};



export const deleteFood = async (id, user) => {
    if(user.role !== "admin"){
        throw new Error("Only admin can delete food")
    }

    const food = await Food.findByPk(id);
    if(!food){
        throw new Error("Food not found")
    }

    await food.destroy();

    return { message: "Food deleted successfully" }

}