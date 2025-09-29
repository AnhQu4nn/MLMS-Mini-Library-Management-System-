# MLMS - Mini Library Management System

Hệ thống Quản lý Thư viện Mini được xây dựng với ReactJS, Node.js và MySQL.

## 📋 Báo cáo Hệ thống

### 🏗️ Kiến trúc Hệ thống

Hệ thống MLMS sử dụng kiến trúc **3-tier (3 lớp)** với các thành phần chính:

#### 1. **Presentation Layer (Lớp Giao diện)**
- **Frontend**: React.js với TypeScript
- **UI Framework**: Material-UI (MUI)
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios

#### 2. **Business Logic Layer (Lớp Xử lý nghiệp vụ)**
- **Backend**: Node.js với Express.js
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: bcryptjs
- **Middleware**: CORS, Authentication middleware
- **API**: RESTful API design

#### 3. **Data Access Layer (Lớp Dữ liệu)**
- **Database**: MySQL
- **Connection**: mysql2 connection pool
- **Models**: Custom ORM-like models
- **Schema**: Structured SQL database

### 🗂️ Sơ đồ Lớp (Class Diagram)

#### Backend Models:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      User       │    │      Book       │    │   Borrowing     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ - id: number    │    │ - id: number    │    │ - id: number    │
│ - username: str │    │ - title: string │    │ - user_id: num  │
│ - email: string │    │ - author: str   │    │ - book_id: num  │
│ - password: str │    │ - isbn: string  │    │ - borrow_date   │
│ - full_name:str │    │ - publisher:str │    │ - due_date      │
│ - phone: string │    │ - pub_year: num │    │ - return_date   │
│ - address: str  │    │ - category: str │    │ - status: enum  │
│ - role: enum    │    │ - description   │    │ - notes: string │
│ - created_at    │    │ - total_copies  │    │ - created_at    │
│ - updated_at    │    │ - avail_copies  │    │ - updated_at    │
├─────────────────┤    │ - location: str │    ├─────────────────┤
│ + create()      │    │ - created_at    │    │ + create()      │
│ + findById()    │    │ - updated_at    │    │ + findById()    │
│ + findByUser()  │    ├─────────────────┤    │ + getAll()      │
│ + findByEmail() │    │ + create()      │    │ + getByUserId() │
│ + getAll()      │    │ + findById()    │    │ + returnBook()  │
│ + update()      │    │ + getAll()      │    │ + updateStatus()│
│ + delete()      │    │ + update()      │    │ + getOverdue()  │
│ + validatePass()│    │ + delete()      │    │ + getStats()    │
└─────────────────┘    │ + updateCopies()│    └─────────────────┘
                       │ + getAvailable()│
                       │ + getCategories()│
                       └─────────────────┘
```

#### Frontend Components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      App        │    │     Layout      │    │  AuthContext    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ - Router setup  │    │ - Header        │    │ - user: User    │
│ - Theme config  │    │ - Sidebar       │    │ - token: string │
│ - Context wrap  │    │ - Main content  │    │ - login()       │
└─────────────────┘    └─────────────────┘    │ - register()    │
                                              │ - logout()      │
┌─────────────────┐    ┌─────────────────┐    │ - isLoading     │
│   Dashboard     │    │     Books       │    └─────────────────┘
├─────────────────┤    ├─────────────────┤    
│ - Statistics    │    │ - Book list     │    ┌─────────────────┐
│ - Recent books  │    │ - Add/Edit form │    │ ProtectedRoute  │
│ - My borrowings │    │ - Search/Filter │    ├─────────────────┤
└─────────────────┘    └─────────────────┘    │ - Role check    │
                                              │ - Auth guard    │
┌─────────────────┐    ┌─────────────────┐    └─────────────────┘
│   Borrowings    │    │     Users       │    
├─────────────────┤    ├─────────────────┤    
│ - Borrowing list│    │ - User list     │    
│ - Return books  │    │ - Add/Edit user │    
│ - Overdue books │    │ - Role mgmt     │    
└─────────────────┘    └─────────────────┘    
```

### 🗄️ Sơ đồ Cơ sở Dữ liệu (Database Diagram)

```sql
┌─────────────────────────────────────┐
│               USERS                 │
├─────────────────────────────────────┤
│ id (PK)          │ INT AUTO_INC     │
│ username         │ VARCHAR(50) UNQ  │
│ email            │ VARCHAR(100) UNQ │
│ password         │ VARCHAR(255)     │
│ full_name        │ VARCHAR(100)     │
│ phone            │ VARCHAR(20)      │
│ address          │ TEXT             │
│ role             │ ENUM(admin,...)  │
│ created_at       │ TIMESTAMP        │
│ updated_at       │ TIMESTAMP        │
└─────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
┌─────────────────────────────────────┐
│             BORROWINGS              │
├─────────────────────────────────────┤
│ id (PK)          │ INT AUTO_INC     │
│ user_id (FK)     │ INT              │ ──┐
│ book_id (FK)     │ INT              │   │
│ borrow_date      │ DATE             │   │
│ due_date         │ DATE             │   │
│ return_date      │ DATE NULL        │   │
│ status           │ ENUM(borrowed...) │   │
│ notes            │ TEXT             │   │
│ created_at       │ TIMESTAMP        │   │
│ updated_at       │ TIMESTAMP        │   │
└─────────────────────────────────────┘   │
                    ▲                     │
                    │ N:1                 │
                    │                     │
┌─────────────────────────────────────┐   │
│               BOOKS                 │   │
├─────────────────────────────────────┤   │
│ id (PK)          │ INT AUTO_INC     │ ──┘
│ title            │ VARCHAR(200)     │
│ author           │ VARCHAR(100)     │
│ isbn             │ VARCHAR(20) UNQ  │
│ publisher        │ VARCHAR(100)     │
│ publication_year │ YEAR             │
│ category         │ VARCHAR(50)      │
│ description      │ TEXT             │
│ total_copies     │ INT DEFAULT 1    │
│ available_copies │ INT DEFAULT 1    │
│ location         │ VARCHAR(50)      │
│ created_at       │ TIMESTAMP        │
│ updated_at       │ TIMESTAMP        │
└─────────────────────────────────────┘

Relationships:
- users.id → borrowings.user_id (1:N)
- books.id → borrowings.book_id (1:N)
- borrowings table acts as junction for users-books many-to-many relationship
```

### 🔐 Phân quyền Hệ thống

| Vai trò | Quyền hạn |
|---------|-----------|
| **Admin** | Toàn quyền: Quản lý users, books, borrowings, xem thống kê |
| **Member** | Xem sách, mượn sách, xem lịch sử cá nhân |

## 🌟 Tính năng

### Cho Admin:
- ✅ Quản lý sách (thêm, sửa, xóa, tìm kiếm)
- ✅ Quản lý người dùng 
- ✅ Quản lý mượn/trả sách
- ✅ Xem thống kê và báo cáo
- ✅ Theo dõi sách quá hạn

### Cho Thành viên:
- ✅ Xem danh sách sách
- ✅ Mượn sách
- ✅ Xem lịch sử mượn sách
- ✅ Quản lý thông tin cá nhân

## 🛠️ Công nghệ sử dụng

### Backend:
- **Node.js** với Express.js
- **MySQL** cho cơ sở dữ liệu
- **JWT** cho xác thực
- **bcryptjs** cho mã hóa mật khẩu
- **CORS** cho cross-origin requests

### Frontend:
- **React** với TypeScript
- **Material-UI** cho giao diện
- **React Router** cho routing
- **Axios** cho API calls
- **React Hook Form** cho forms

## 📋 Yêu cầu hệ thống

- **Node.js** >= 16.0.0
- **MySQL** >= 8.0
- **npm** hoặc **yarn**

## 🚀 Hướng dẫn Cài đặt và Chạy Chương trình

### 📋 Yêu cầu Hệ thống

Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt:

| Phần mềm | Phiên bản tối thiểu | Ghi chú |
|----------|---------------------|---------|
| **Node.js** | >= 16.0.0 | [Download tại nodejs.org](https://nodejs.org/) |
| **npm** | >= 8.0.0 | Đi kèm với Node.js |
| **MySQL** | >= 8.0 | [Download tại mysql.com](https://www.mysql.com/downloads/) |
| **Git** | Latest | [Download tại git-scm.com](https://git-scm.com/) |

### 🔧 Các Bước Cài Đặt Chi Tiết

#### **Bước 1: Clone Repository**
```bash
# Clone project về máy local
git clone https://github.com/your-username/MLMS-Mini-Library-Management-System.git
cd MLMS-Mini-Library-Management-System
```

#### **Bước 2: Cài đặt Dependencies**
```bash
# Cài đặt tất cả dependencies cho root, backend và frontend
npm run install-deps

# Hoặc cài đặt từng phần riêng biệt:
npm install                    # Root dependencies
cd backend && npm install      # Backend dependencies
cd ../frontend && npm install  # Frontend dependencies
```

#### **Bước 3: Thiết lập Cơ sở Dữ liệu MySQL**

**3.1. Tạo Database:**
```sql
-- Đăng nhập MySQL
mysql -u root -p

-- Tạo database
CREATE DATABASE mlms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Thoát MySQL
exit;
```

**3.2. Import Schema và Dữ liệu mẫu:**
```bash
# Import schema và dữ liệu mẫu
mysql -u root -p mlms_db < backend/database/schema.sql
```

#### **Bước 4: Cấu hình Environment Variables**

**4.1. Tạo file .env cho Backend:**
```bash
# Copy file mẫu
cp backend/config.env.example backend/.env
```

**4.2. Chỉnh sửa file `backend/.env`:**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=mlms_db
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

> **⚠️ Lưu ý Bảo mật:** 
> - Thay `your_mysql_password_here` bằng mật khẩu MySQL thực tế
> - Tạo JWT_SECRET mạnh (ít nhất 32 ký tự)
> - Không commit file `.env` lên Git

### 🚀 Chạy Ứng Dụng

#### **Phương pháp 1: Chạy Đồng thời (Khuyến nghị)**
```bash
# Từ thư mục root, chạy cả backend và frontend
npm run dev
```

#### **Phương pháp 2: Chạy Riêng biệt**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Hoặc: npm start (production mode)
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 🌐 Truy cập Ứng dụng

Sau khi chạy thành công:

| Service | URL | Mô tả |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | Giao diện người dùng |
| **Backend API** | http://localhost:5000 | RESTful API |
| **API Health Check** | http://localhost:5000/api/health | Kiểm tra trạng thái API |
| **API Documentation** | http://localhost:5000/api/docs | Swagger docs (nếu có) |

## 👤 Tài khoản demo

Hệ thống đã có sẵn các tài khoản demo:

| Tài khoản | Mật khẩu | Vai trò |
|-----------|----------|---------|
| admin | password | Quản trị viên |
| librarian | password | Thủ thư |
| member1 | password | Thành viên |

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/profile` - Lấy thông tin profile

### Books
- `GET /api/books` - Lấy danh sách sách
- `GET /api/books/:id` - Lấy thông tin sách theo ID
- `POST /api/books` - Thêm sách mới (Admin/Librarian)
- `PUT /api/books/:id` - Cập nhật sách (Admin/Librarian)
- `DELETE /api/books/:id` - Xóa sách (Admin/Librarian)
- `GET /api/books/available` - Lấy sách có sẵn
- `GET /api/books/categories` - Lấy danh mục sách

### Borrowings
- `GET /api/borrowings` - Lấy danh sách mượn sách (Admin/Librarian)
- `GET /api/borrowings/:id` - Lấy thông tin mượn sách theo ID
- `POST /api/borrowings` - Tạo mượn sách mới
- `PUT /api/borrowings/:id/return` - Trả sách
- `GET /api/borrowings/my-borrowings` - Lấy lịch sử mượn sách của user
- `GET /api/borrowings/overdue` - Lấy sách quá hạn (Admin/Librarian)
- `GET /api/borrowings/statistics` - Lấy thống kê (Admin/Librarian)

### Users
- `GET /api/users` - Lấy danh sách người dùng (Admin/Librarian)
- `GET /api/users/:id` - Lấy thông tin người dùng theo ID
- `POST /api/users` - Tạo người dùng mới (Admin)
- `PUT /api/users/:id` - Cập nhật người dùng
- `DELETE /api/users/:id` - Xóa người dùng (Admin)

## 🗂️ Cấu trúc thư mục

```
MLMS-Mini-Library-Management-System/
├── backend/                    # Backend Node.js
│   ├── config/                # Cấu hình database
│   ├── controllers/           # Controllers
│   ├── database/              # Schema SQL
│   ├── middleware/            # Middleware (auth)
│   ├── models/                # Models
│   ├── routes/                # Routes
│   ├── package.json
│   └── server.js              # Entry point
├── frontend/                   # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   ├── pages/             # Pages
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   └── App.tsx
│   └── package.json
├── package.json               # Root package.json
└── README.md
```

## 🔧 Scripts có sẵn

- `npm run dev` - Chạy cả backend và frontend
- `npm run server` - Chỉ chạy backend
- `npm run client` - Chỉ chạy frontend
- `npm run install-deps` - Cài đặt dependencies cho tất cả

### 🎯 Kiểm tra Cài đặt Thành công

**1. Kiểm tra Backend:**
```bash
curl http://localhost:5000/api/health
# Kết quả mong đợi: {"status": "OK", "message": "Server is running"}
```

**2. Kiểm tra Frontend:**
- Mở trình duyệt và truy cập http://localhost:3000
- Trang đăng nhập sẽ hiển thị

**3. Test đăng nhập:**
- Username: `admin` | Password: `password`
- Username: `librarian` | Password: `password` 
- Username: `member1` | Password: `password`

## 🛡️ Bảo mật Hệ thống

### 🔐 Các Tính năng Bảo mật

| Tính năng | Mô tả | Công nghệ |
|-----------|-------|-----------|
| **Authentication** | Xác thực người dùng | JWT (JSON Web Token) |
| **Password Hashing** | Mã hóa mật khẩu | bcryptjs (salt rounds: 10) |
| **Authorization** | Phân quyền theo vai trò | Role-based Access Control |
| **Input Validation** | Kiểm tra dữ liệu đầu vào | Express validator |
| **CORS Protection** | Bảo vệ cross-origin | CORS middleware |
| **SQL Injection** | Ngăn chặn SQL injection | Prepared statements |

### 🔒 Luồng Xác thực (Authentication Flow)

```
1. User gửi credentials (username/password)
2. Backend verify credentials với database
3. Nếu hợp lệ: tạo JWT token với user info + role
4. Frontend lưu token trong localStorage
5. Mọi request sau đó gửi kèm token trong header
6. Backend verify token và check permissions
7. Trả về dữ liệu hoặc lỗi unauthorized
```

## 🐛 Xử lý Sự cố (Troubleshooting)

### ❌ Lỗi Database Connection
```bash
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Giải pháp:**
1. Kiểm tra MySQL service đang chạy: `sudo systemctl start mysql`
2. Verify thông tin kết nối trong `backend/.env`
3. Test connection: `mysql -u root -p -h localhost`
4. Đảm bảo database `mlms_db` đã được tạo

### ❌ Lỗi Port đã được sử dụng
```bash
Error: listen EADDRINUSE :::5000
```
**Giải pháp:**
```bash
# Tìm process đang sử dụng port
lsof -ti:5000
# Kill process
kill -9 <PID>
# Hoặc thay đổi port trong .env
PORT=5001
```

### ❌ Lỗi Dependencies
```bash
npm ERR! peer dep missing
```
**Giải pháp:**
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json  
rm -rf frontend/node_modules frontend/package-lock.json

# Cài lại dependencies
npm run install-deps
```

### ❌ Lỗi JWT Token
```bash
Error: jwt malformed
```
**Giải pháp:**
1. Xóa localStorage trong browser (F12 > Application > Storage)
2. Đăng nhập lại
3. Kiểm tra JWT_SECRET trong `.env`

### ❌ Lỗi CORS
```bash
Access to XMLHttpRequest blocked by CORS policy
```
**Giải pháp:**
1. Kiểm tra FRONTEND_URL trong `backend/.env`
2. Đảm bảo backend đang chạy trước khi start frontend

## 📊 Tóm tắt Báo cáo

### ✅ Điểm Mạnh của Hệ thống
- **Kiến trúc rõ ràng**: 3-tier architecture dễ maintain và scale
- **Bảo mật tốt**: JWT authentication + role-based authorization  
- **UI/UX hiện đại**: Material-UI với responsive design
- **Code quality**: TypeScript, structured models, clean API
- **Database design**: Normalized schema với proper relationships

### 🚀 Khả năng Mở rộng
- **Microservices**: Có thể tách backend thành nhiều services
- **Caching**: Thêm Redis cho performance
- **File upload**: Thêm tính năng upload ảnh sách
- **Notifications**: Email/SMS notifications cho overdue books
- **Reports**: Advanced reporting với charts

### 📈 Metrics Hệ thống
- **Backend**: ~15 API endpoints
- **Frontend**: ~8 main pages/components  
- **Database**: 3 main tables với proper indexing
- **Authentication**: JWT-based với 3 user roles
- **Security**: Multiple layers of protection

## 📞 Liên hệ & Hỗ trợ

### 👨‍💻 Thông tin Nhà phát triển
- **Project**: MLMS - Mini Library Management System
- **Version**: 1.0.0
- **License**: MIT
- **Technologies**: React.js, Node.js, MySQL, TypeScript

### 🆘 Hỗ trợ
- **Issues**: Tạo issue trên GitHub repository
- **Documentation**: Xem README và code comments
- **Demo**: Sử dụng tài khoản demo để test

### 📝 Changelog
- **v1.0.0**: Initial release với đầy đủ tính năng CRUD
- **Features**: User management, Book management, Borrowing system
- **Security**: JWT authentication, Role-based access control

---

**🎉 Cảm ơn bạn đã sử dụng MLMS! Chúc bạn có trải nghiệm tốt với hệ thống quản lý thư viện mini này!**

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng tạo issue trên GitHub repository.

---

**Phát triển bởi:** [Your Name]  
**Version:** 1.0.0  
**Ngày cập nhật:** $(date +%Y-%m-%d)
