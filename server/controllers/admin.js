const Recipes = require("../models/recipes");
const Reviews = require("../models/reviews");
const Users = require("../models/users");
// const Favourites = require("../models/favourites");

const sequelize = require("../utils/database");
const { Op } = require("sequelize");

exports.getAllData = async(req,res)=>{
  try {
    // Fetch all users
    const users = await Users.findAll({
      attributes: ['id', 'name', 'email', 'bio', 'isAdmin']
    });

    // Fetch all recipes
    const recipes = await Recipes.findAll({
      include: [
        {
          model: Reviews,
          include: [
            {
              model: Users,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        users,
        recipes,
      },
    });
  } catch (error) {
    console.error("Error fetching all data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch data",
    });
  }
}

exports.addAdmin= async(req,res)=>{
  const { userId } = req.body;

  try {
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.isAdmin) {
      return res.status(400).json({ success: false, message: 'User is already admin' });
    }

    user.isAdmin = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User added to admin successfully',
      user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    res.status(500).json({ success: false, message: 'Failed to add user to admin' });
  }
}