const Pet = require("../models/Pet.js");

const createPet = async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json({ success: true, pet });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.json({ success: true, pet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.json({ success: true, pet });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      species,
      breed,
      minAge,
      maxAge,
      status = "Available",
      search,
    } = req.query;

    const query = {};

    // Build query filters
    if (species) query.species = species;
    if (breed) query.breed = new RegExp(breed, "i");
    if (status) query.status = status;
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { breed: new RegExp(search, "i") },
      ];
    }

    const pets = await Pet.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Pet.countDocuments(query);

    res.json({
      success: true,
      pets,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPets: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.json({ success: true, message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPet,
  getPetById,
  updatePet,
  getAllPets,
  deletePet,
};
