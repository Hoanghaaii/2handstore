import Event from '../models/event.model.js';
import { postImage } from './image.controller.js';

export const getEvent = async (req, res) => {
    try {
        const events = await Event.find({});
        return res.status(200).json({ success: true, events });
    } catch (error) {
        return res.status(500).json({ success: false, "Error": error.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id; // Lấy ID từ tham số URL

        // Tìm sự kiện theo ID
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        return res.status(200).json({ success: true, event });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const postEvent = async (req, res) => {
    const { title, location, dateFrom, dateTo, content } = req.body;
    const file = req.file; // Lấy file từ request (nếu dùng multer)

    try {
        // Kiểm tra nếu thiếu thông tin
        if (!title || !location || !content || !dateFrom || !dateTo || !file) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Gọi hàm postImage để upload ảnh lên S3
        const imageResponse = await postImage(req, 'event'); // Prefix là 'event'
        if (!imageResponse.success) {
            return res.status(500).json({ success: false, message: "Image upload failed" });
        }

        // Tạo đối tượng sự kiện và lưu vào MongoDB
        const event = new Event({
            title,
            imageUrl: imageResponse.imageUrl, // Lưu đường dẫn ảnh vào MongoDB
            location,
            dateFrom,
            dateTo,
            content,
            createAt: Date.now(),
        });

        // Lưu sự kiện vào MongoDB
        await event.save();

        // Trả về phản hồi thành công
        return res.status(200).json({ success: true, message: "Event created successfully", event });

    } catch (error) {
        console.error("An error occurred: " + error.message);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const putEvent = async (req, res) => {
    try {
        const eventId = req.params.id; // Lấy ID của sự kiện từ URL
        const { title, location, dateFrom, dateTo, content, createAt } = req.body;
        let imageUrl;

        // Nếu có file mới được upload
        if (req.file) {
            // Gọi hàm postImage để upload ảnh mới lên S3
            const imageResponse = await postImage(req, res, 'event'); // Prefix là 'event'
            if (!imageResponse.success) {
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
            imageUrl = imageResponse.imageUrl; // Lấy URL của ảnh mới
        }

        // Tìm và cập nhật sự kiện theo ID
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { 
                title, 
                location, 
                dateFrom, 
                dateTo, 
                content, 
                createAt, 
                ...(imageUrl && { imageUrl }) // Cập nhật imageUrl nếu có ảnh mới
            },
            { new: true } // Trả về sự kiện sau khi đã cập nhật
        );

        // Kiểm tra nếu không tìm thấy sự kiện với ID đã cho
        if (!updatedEvent) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        return res.status(200).json({ success: true, message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const deletedEvent = await Event.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        return res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
