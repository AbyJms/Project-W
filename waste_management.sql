-- =====================================================
-- HarithaKarmaSena Waste Management Database Schema
-- Executable SQL File
-- =====================================================

-- ---------- DATABASE ----------
DROP DATABASE IF EXISTS waste_management;
CREATE DATABASE waste_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE waste_management;

-- =====================================================
-- REFERENCE TABLES
-- =====================================================

CREATE TABLE wards (
    ward_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ward_name VARCHAR(100) NOT NULL,
    ward_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ward_code (ward_code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB;

CREATE TABLE waste_types (
    waste_type_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    waste_type_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_recyclable BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_waste_type_name (waste_type_name),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB;

CREATE TABLE violation_reasons (
    violation_reason_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reason_code VARCHAR(20) UNIQUE NOT NULL,
    reason_description VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_reason_code (reason_code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB;

-- =====================================================
-- CORE ENTITIES
-- =====================================================

CREATE TABLE households (
    household_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ward_id INT UNSIGNED NOT NULL,
    household_name VARCHAR(200) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id),
    INDEX idx_ward_id (ward_id),
    INDEX idx_contact_phone (contact_phone),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB;

CREATE TABLE workers (
    worker_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ward_id INT UNSIGNED NOT NULL,
    worker_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    employee_id VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (ward_id) REFERENCES wards(ward_id),
    INDEX idx_ward_id (ward_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB;

-- =====================================================
-- TRANSACTIONS
-- =====================================================

CREATE TABLE pickup_requests (
    pickup_request_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    household_id INT UNSIGNED NOT NULL,
    request_date DATE NOT NULL,
    status ENUM('requested','assigned','collected','cancelled') DEFAULT 'requested',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_at TIMESTAMP NULL,
    collected_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (household_id) REFERENCES households(household_id),
    INDEX idx_household_status (household_id, status)
) ENGINE=InnoDB;

CREATE TABLE pickup_request_waste_types (
    pickup_request_id INT UNSIGNED NOT NULL,
    waste_type_id INT UNSIGNED NOT NULL,
    quantity_kg DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (pickup_request_id, waste_type_id),
    FOREIGN KEY (pickup_request_id) REFERENCES pickup_requests(pickup_request_id) ON DELETE CASCADE,
    FOREIGN KEY (waste_type_id) REFERENCES waste_types(waste_type_id)
) ENGINE=InnoDB;

CREATE TABLE pickup_assignments (
    assignment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pickup_request_id INT UNSIGNED NOT NULL,
    worker_id INT UNSIGNED NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    FOREIGN KEY (pickup_request_id) REFERENCES pickup_requests(pickup_request_id),
    FOREIGN KEY (worker_id) REFERENCES workers(worker_id)
) ENGINE=InnoDB;

CREATE TABLE violations (
    violation_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    household_id INT UNSIGNED NOT NULL,
    worker_id INT UNSIGNED NOT NULL,
    pickup_request_id INT UNSIGNED,
    violation_reason_id INT UNSIGNED NOT NULL,
    severity ENUM('low','medium','high') DEFAULT 'medium',
    violation_date DATE NOT NULL,
    description TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (household_id) REFERENCES households(household_id),
    FOREIGN KEY (worker_id) REFERENCES workers(worker_id),
    FOREIGN KEY (pickup_request_id) REFERENCES pickup_requests(pickup_request_id),
    FOREIGN KEY (violation_reason_id) REFERENCES violation_reasons(violation_reason_id)
) ENGINE=InnoDB;

-- =====================================================
-- ADMIN USERS (OPTIONAL)
-- =====================================================

CREATE TABLE admin_users (
    admin_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin','admin','manager') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- SEED DATA
-- =====================================================

INSERT INTO waste_types (waste_type_name, description, is_recyclable) VALUES
('Food Waste','Organic waste',FALSE),
('Plastic','Plastic items',TRUE),
('Paper','Paper items',TRUE),
('Glass','Glass waste',TRUE),
('Metal','Metal waste',TRUE),
('Mixed Waste','Unsegregated waste',FALSE),
('E-Waste','Electronic waste',TRUE),
('Hazardous','Hazardous waste',FALSE);

INSERT INTO violation_reasons (reason_code, reason_description) VALUES
('UNSEGREGATED','Waste not segregated'),
('MIXED_PLASTIC_FOOD','Plastic mixed with food'),
('HAZARDOUS_MIXED','Hazardous waste mixed'),
('OTHER','Other reason');
