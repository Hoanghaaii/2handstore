import Category from '../models/category.model.js'

export const getCategory= async (req, res)=>{
    try {
        const categories = await Category.find({});
        if (!categories || categories.length === 0) {
            return res.status(404).json({ success: false, message: "No categories found" });
        }
        return res.status(200).json({ success: true, categories });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getCategoryByName = async (req, res) => {
    const keyword = req.params.name; // Lấy từ khóa từ tham số
    try {
        const category = await Category.find({ name: { $regex: keyword, $options: 'i' } }); // Tìm kiếm danh mục với regex
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        return res.status(200).json({ success: true, category });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const postCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        if (!name ||!description) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newCategory = new Category({ name, description });
        await newCategory.save();

        return res.status(201).json({ success: true, message: "Category created successfully", category: newCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

export const updateCategory = async (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;

    try {
        if (!name &&!description) {
            return res.status(400).json({ success: false, message: "At least one field needs to be updated" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        return res.status(200).json({ success: true, message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

export const deleteCategory = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        return res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}