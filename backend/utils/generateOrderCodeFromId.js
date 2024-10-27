import crc from 'crc';

export function generateOrderCodeFromId(id) {
    const hashValue = crc.crc32(id).toString(10); // Chuyển hash thành chuỗi số
    return parseInt(hashValue, 10); // Chuyển chuỗi thành số nguyên
}
