-- Tạo database
CREATE DATABASE IF NOT EXISTS mlms_db;
USE mlms_db;

-- Bảng users (người dùng)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('admin', 'librarian', 'member') DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng books (sách)
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    publisher VARCHAR(100),
    publication_year YEAR,
    category VARCHAR(50),
    description TEXT,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    location VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng borrowings (mượn sách)
CREATE TABLE IF NOT EXISTS borrowings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    status ENUM('borrowed', 'returned', 'overdue') DEFAULT 'borrowed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Thêm dữ liệu mẫu
INSERT INTO users (username, email, password, full_name, role) VALUES 
('admin', 'admin@mlms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Quản trị viên', 'admin'),
('librarian', 'librarian@mlms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Thủ thư', 'librarian'),
('member1', 'member1@mlms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Thành viên 1', 'member');

INSERT INTO books (title, author, isbn, publisher, publication_year, category, description, total_copies, available_copies, location) VALUES 
-- Công nghệ thông tin
('Lập trình JavaScript', 'Nguyễn Văn A', '978-0123456789', 'NXB Giáo dục', 2023, 'Công nghệ', 'Sách học lập trình JavaScript từ cơ bản đến nâng cao', 5, 5, 'Kệ A1'),
('React.js Toàn tập', 'Trần Thị B', '978-0123456790', 'NXB Thông tin', 2023, 'Công nghệ', 'Hướng dẫn học React.js chi tiết', 3, 3, 'Kệ A2'),
('Node.js và Express', 'Lê Văn C', '978-0123456791', 'NXB Khoa học', 2022, 'Công nghệ', 'Phát triển backend với Node.js', 4, 4, 'Kệ A3'),
('Cơ sở dữ liệu MySQL', 'Phạm Văn D', '978-0123456792', 'NXB Đại học', 2023, 'Cơ sở dữ liệu', 'Quản lý cơ sở dữ liệu với MySQL', 2, 2, 'Kệ A4'),
('Python cho người mới bắt đầu', 'Hoàng Thị E', '978-0321654987', 'NXB Thông tin', 2023, 'Công nghệ', 'Hướng dẫn lập trình Python từ cơ bản', 6, 6, 'Kệ A5'),
('Java Spring Boot', 'Lê Minh F', '978-0789123456', 'NXB Đại học', 2022, 'Công nghệ', 'Phát triển ứng dụng web với Spring Boot', 3, 3, 'Kệ A6'),

-- Văn học Việt Nam
('Truyện Kiều', 'Nguyễn Du', '978-0111222333', 'NXB Văn học', 1820, 'Văn học', 'Tác phẩm kinh điển của văn học Việt Nam', 8, 7, 'Kệ B1'),
('Số đỏ', 'Vũ Trọng Phụng', '978-0444555666', 'NXB Văn học', 1936, 'Văn học', 'Tiểu thuyết nổi tiếng về xã hội Việt Nam', 5, 4, 'Kệ B2'),
('Tắt đèn', 'Ngô Tất Tố', '978-0777888999', 'NXB Văn học', 1939, 'Văn học', 'Tác phẩm về đời sống nông dân Việt Nam', 4, 3, 'Kệ B3'),
('Chí Phèo', 'Nam Cao', '978-0123987654', 'NXB Văn học', 1941, 'Văn học', 'Truyện ngắn nổi tiếng của Nam Cao', 6, 5, 'Kệ B4'),
('Vợ nhặt', 'Kim Lân', '978-0456321789', 'NXB Văn học', 1962, 'Văn học', 'Tác phẩm về tình người trong hoàn cảnh khó khăn', 3, 2, 'Kệ B5'),

-- Khoa học tự nhiên
('Vật lý đại cương', 'Nguyễn Văn G', '978-0654321987', 'NXB Khoa học', 2021, 'Khoa học', 'Giáo trình vật lý cơ bản cho sinh viên', 7, 6, 'Kệ C1'),
('Hóa học hữu cơ', 'Trần Thị H', '978-0987123456', 'NXB Giáo dục', 2022, 'Khoa học', 'Cơ sở hóa học hữu cơ và ứng dụng', 4, 4, 'Kệ C2'),
('Sinh học phân tử', 'Lê Văn I', '978-0321789456', 'NXB Khoa học', 2023, 'Khoa học', 'Nghiên cứu về sinh học ở cấp độ phân tử', 3, 3, 'Kệ C3'),
('Toán cao cấp', 'Phạm Minh J', '978-0789456123', 'NXB Đại học', 2021, 'Toán học', 'Giáo trình toán cao cấp cho kỹ sư', 8, 7, 'Kệ C4'),

-- Kinh tế - Quản trị
('Kinh tế học vi mô', 'Hoàng Thị K', '978-0147258369', 'NXB Kinh tế', 2022, 'Kinh tế', 'Nguyên lý cơ bản của kinh tế học vi mô', 5, 5, 'Kệ D1'),
('Marketing hiện đại', 'Nguyễn Văn L', '978-0258147369', 'NXB Thương mại', 2023, 'Kinh tế', 'Chiến lược marketing trong thời đại số', 4, 3, 'Kệ D2'),
('Quản trị doanh nghiệp', 'Trần Thị M', '978-0369147258', 'NXB Kinh tế', 2022, 'Kinh tế', 'Nghệ thuật quản lý và lãnh đạo hiệu quả', 6, 5, 'Kệ D3'),

-- Tâm lý - Xã hội
('Tâm lý học đại cương', 'Lê Văn N', '978-0741852963', 'NXB Tâm lý', 2021, 'Tâm lý học', 'Cơ sở lý thuyết và thực hành tâm lý học', 5, 4, 'Kệ E1'),
('Đắc nhân tâm', 'Dale Carnegie', '978-0671027032', 'NXB Simon & Schuster', 1936, 'Tâm lý học', 'Nghệ thuật giao tiếp và ảnh hưởng đến người khác', 10, 8, 'Kệ E2');
