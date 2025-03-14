const getExpenseModel = require("../models/Collection");

// Helper function to get current month's date range
const getCurrentMonthDateRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { firstDay, lastDay };
};

const getProfile = async (req, res) => {
  try {
    const dbName = req.userId;
    const ExpenseModel = getExpenseModel(dbName);

    // Find the profile document
    const profile = await ExpenseModel.findOne({ type: 'profile' });

    if (!profile) {
      return res.json({ 
        success: true, 
        profile: {
          name: '',
          email: '',
          phone: '',
          address: '',
          profilePicture: '',
          bankAccounts: [],
          customCategories: []
        }
      });
    }

    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createProfile = async (req, res) => {
  try {
    const dbName = req.userId;
    const ExpenseModel = getExpenseModel(dbName);

    const {
      name,
      email,
      phone,
      address,
      profilePicture,
      bankAccounts,
      customCategories
    } = req.body;

    // Find existing profile or create new one
    let profile = await ExpenseModel.findOne({ type: 'profile' });

    if (profile) {
      // Update existing profile
      profile.name = name;
      profile.email = email;
      profile.phone = phone;
      profile.address = address;
      profile.profilePicture = profilePicture;
      profile.bankAccounts = bankAccounts;
      profile.customCategories = customCategories;
    } else {
      // Create new profile
      profile = new ExpenseModel({
        type: 'profile',
        name,
        email,
        phone,
        address,
        profilePicture,
        bankAccounts,
        customCategories
      });
    }

    await profile.save();
    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const dbName = req.userId;
    const ExpenseModel = getExpenseModel(dbName);

    const profile = await ExpenseModel.findOneAndUpdate(
      { type: 'profile' },
      { ...req.body },
      { new: true, upsert: true }
    );

    res.json({ success: true, profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile
}; 