# APROFLEET BackOffice - User Roles and Page Access Guide

## Table of Contents
1. [User Roles Overview](#user-roles-overview)
2. [Role-Based Page Access Matrix](#role-based-page-access-matrix)
3. [Detailed Page Documentation](#detailed-page-documentation)

---

## User Roles Overview

### 1. Super Admin
**Access Level**: Full System Access
**Description**: Highest level of administrative control with access to all features, tenants, and system configurations.

**Capabilities**:
- Manage all tenants and their configurations
- Create and manage manufacturer accounts
- Access all vehicles across all tenants
- View system-wide analytics and reports
- Manage all users regardless of tenant
- Access system logs and API documentation
- Configure system-wide settings
- Billing and subscription management

**Use Case**: Platform administrators at DY Innovate who manage the entire APROFLEET ecosystem.

---

### 2. Manufacturer
**Access Level**: Multi-Tenant Management
**Description**: Vehicle manufacturers who oversee multiple golf course clients.

**Capabilities**:
- View and manage assigned golf course tenants
- Monitor all vehicles manufactured by them across tenants
- Access cross-tenant analytics for their vehicles
- View maintenance data for quality control
- Manage manufacturer-specific settings
- Access API documentation for integration
- Limited user management (within their scope)

**Use Case**: Golf cart manufacturers like Club Car, Yamaha, or E-Z-GO who provide vehicles to multiple golf courses.

---

### 3. Golf Course Admin
**Access Level**: Single Tenant Full Access
**Description**: Administrators of individual golf courses with full control over their facility's operations.

**Capabilities**:
- Manage all vehicles within their golf course
- Create and manage reservations
- Oversee maintenance operations
- Access golf course-specific analytics
- Manage golf course staff accounts
- Configure golf course settings
- View operational logs
- Request support from manufacturer/super admin

**Use Case**: General managers or operations directors at individual golf courses.

---

### 4. Maintenance Staff
**Access Level**: Maintenance Operations
**Description**: Technicians and maintenance personnel responsible for vehicle upkeep.

**Capabilities**:
- View assigned maintenance tasks
- Update maintenance status and add service notes
- Access vehicle maintenance history
- Report issues and request parts
- View vehicle locations for service pickup
- Update vehicle operational status
- Limited access to vehicle monitoring data

**Use Case**: Golf course maintenance technicians, mechanics, and service personnel.

---

### 5. Viewer
**Access Level**: Read-Only Access
**Description**: Limited access role for monitoring and reporting purposes.

**Capabilities**:
- View dashboard statistics
- View vehicle list and basic information
- View reservations (no editing)
- View maintenance schedules
- View analytics and reports
- No editing or administrative functions

**Use Case**: Staff members who need visibility into operations without modification rights, such as accounting, management trainees, or external auditors.

---

## Role-Based Page Access Matrix

| Page | Super Admin | Manufacturer | Golf Course Admin | Maintenance Staff | Viewer |
|------|:-----------:|:------------:|:-----------------:|:-----------------:|:------:|
| **Login** | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Dashboard** | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Vehicles** | ✓ (All) | ✓ (Own) | ✓ (Tenant) | ✓ (Limited) | ✓ (View Only) |
| **Reservations** | ✓ | ✓ | ✓ | ✗ | ✓ (View Only) |
| **Maintenance** | ✓ | ✓ | ✓ | ✓ (Limited) | ✓ (View Only) |
| **Analytics** | ✓ (All) | ✓ (Own) | ✓ (Tenant) | ✗ | ✓ (View Only) |
| **Tenants** | ✓ | ✓ (Limited) | ✗ | ✗ | ✗ |
| **Users** | ✓ (All) | ✓ (Limited) | ✓ (Tenant) | ✗ | ✗ |
| **Logs** | ✓ | ✓ (Limited) | ✓ (Tenant) | ✗ | ✗ |
| **API Docs** | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Settings** | ✓ | ✓ | ✓ | ✓ | ✓ |

**Legend**:
- ✓ = Full Access
- ✓ (Limited) = Restricted Access
- ✓ (View Only) = Read-Only Access
- ✓ (Own) = Only manufacturer's own data
- ✓ (Tenant) = Only tenant's own data
- ✗ = No Access

---

## Detailed Page Documentation

---

### 1. Login Page
**Route**: `/login`
**Access**: Public (unauthenticated users)

#### Purpose
Secure authentication gateway for all users to access the APROFLEET BackOffice platform.

#### Components

##### Header Section
- **Logo**: APROFLEET branding
- **Tagline**: "BackOffice Management System"

##### Login Form
- **Email Input Field**
  - Type: Email
  - Validation: Email format required
  - Placeholder: "Enter your email"

- **Password Input Field**
  - Type: Password
  - Validation: Minimum length requirement
  - Placeholder: "Enter your password"
  - Toggle: Show/hide password option

- **Remember Me Checkbox**
  - Extends session duration
  - Optional feature

- **Login Button**
  - Primary action button
  - Triggers authentication

##### Demo Accounts Section
- **Quick Login Cards**
  - Pre-configured demo accounts for testing
  - One-click login for each role:
    - Super Admin
    - Manufacturer
    - Golf Course Admin
    - Maintenance Staff
    - Viewer
  - Displays role name and description

##### Additional Features
- **Forgot Password Link**: (UI only, not implemented in demo)
- **Error Messages**: Display authentication failures
- **Loading States**: Visual feedback during login process

#### User Flow
1. User enters credentials or selects demo account
2. System validates credentials
3. On success: Generate authentication token
4. Store token in localStorage
5. Redirect to dashboard
6. On failure: Display error message

#### Security Features
- Token-based authentication
- Secure password handling
- Session management
- Auto-logout on token expiration

---

### 2. Dashboard
**Route**: `/dashboard`
**Access**: All authenticated users

#### Purpose
Central hub providing overview of key metrics, quick actions, and recent activity across the platform.

#### Components

##### Page Header
- **Title**: "APROFLEET BackOffice Dashboard"
- **User Info**: Display current user name and role
- **Last Updated**: Timestamp of data refresh

##### Statistics Overview Cards (Row 1)
Located at top of dashboard, displaying key metrics:

1. **Total Vehicles Card**
   - Large number display: Total vehicle count
   - Icon: Vehicle/cart icon
   - Trend indicator: Percentage change from previous period
   - Color: Black border, white background
   - Click action: Navigate to vehicles page

2. **Active Vehicles Card**
   - Large number display: Currently operational vehicles
   - Icon: Active status icon
   - Percentage: Active vehicles / total vehicles
   - Color: Black border, white background
   - Click action: Filter vehicles by active status

3. **Maintenance Alerts Card**
   - Large number display: Vehicles requiring attention
   - Icon: Warning/alert icon
   - Priority indicator: Critical alerts highlighted
   - Color: Red accent for critical items
   - Click action: Navigate to maintenance page

4. **Tenants Card** (Super Admin / Manufacturer only)
   - Large number display: Total tenant count
   - Icon: Building/organization icon
   - Status: Active tenants count
   - Color: Black border, white background
   - Click action: Navigate to tenants page

##### Quick Actions Panel
- **Add New Vehicle Button**
  - Opens vehicle creation modal
  - Access: Admin roles only

- **Create Reservation Button**
  - Opens reservation creation form
  - Access: Admin roles only

- **Schedule Maintenance Button**
  - Opens maintenance scheduling form
  - Access: Admin and maintenance staff

- **Generate Report Button**
  - Opens report generation wizard
  - Access: Admin roles and viewers

##### Tenant Overview Section (Multi-Tenant Roles)
Displayed for Super Admin and Manufacturer roles:

- **Tenant Cards Grid**
  - Card per golf course tenant
  - Each card contains:
    - **Tenant Name**: Golf course name
    - **Tenant ID**: Unique identifier
    - **Subscription Tier**: Enterprise/Professional/Basic
    - **Vehicle Count**: Total vehicles assigned
    - **Active Vehicles**: Currently operational count
    - **Status Indicator**: Online/offline status
    - **Last Activity**: Timestamp
    - **Action Button**: "View Details"

- **Filters**
  - Filter by subscription tier
  - Filter by status
  - Search by tenant name

##### Recent Activity Feed
- **Activity List**
  - Chronological list of recent events
  - Each entry shows:
    - **Timestamp**: Date and time
    - **Event Type**: Icon and category
    - **Description**: Brief event summary
    - **Actor**: User who triggered event
    - **Action Link**: View details (if applicable)

- **Event Types**
  - Vehicle status changes
  - Maintenance completions
  - New reservations
  - User logins
  - Alert triggers
  - Configuration changes

- **Pagination**: Load more button for older events

##### System Status Panel (Admin Roles)
- **Service Health Indicators**
  - API Server: Online/Offline status
  - Database: Connection status
  - Redis Cache: Status
  - WebSocket: Connection status

- **System Metrics**
  - API response time
  - Active sessions count
  - Error rate

##### Charts and Visualizations
- **Vehicle Utilization Chart**
  - 7-day utilization trends
  - Line or bar chart
  - Hover tooltips with details

- **Maintenance Overview Chart**
  - Pie chart showing maintenance status distribution
  - Completed vs pending vs in-progress

#### Responsive Behavior
- **Desktop**: Multi-column grid layout
- **Tablet**: 2-column layout
- **Mobile**: Single column, stacked cards

#### Data Refresh
- Auto-refresh every 30 seconds
- Manual refresh button
- Last updated timestamp

---

### 3. Vehicles Page
**Route**: `/vehicles`
**Access**: All authenticated users (with role-based data filtering)

#### Purpose
Comprehensive vehicle fleet management interface for monitoring, tracking, and managing all vehicles in the system.

#### Components

##### Page Header
- **Title**: "Vehicle Management"
- **Breadcrumb**: Dashboard > Vehicles
- **Total Count**: Display total vehicles (filtered)
- **Add Vehicle Button** (Admin only): Opens creation modal

##### Filter Panel
Collapsible panel at top of page:

- **Status Filter**
  - Options: All, Active, Maintenance, Offline, Decommissioned
  - Multi-select capability
  - Visual badges with color coding

- **Vehicle Type Filter**
  - Options: All, Golf Cart, Utility Vehicle, Mower, Beverage Cart
  - Dropdown or radio selection
  - Icon for each type

- **Battery Level Filter**
  - Range slider: 0-100%
  - Preset ranges: Critical (<20%), Low (20-50%), Good (50-80%), Full (>80%)
  - Color indicators

- **Location Filter** (if GPS enabled)
  - Dropdown: All locations, specific areas
  - Options: On Course, In Garage, Charging Station, Maintenance Bay

- **Manufacturer Filter** (Super Admin only)
  - Dropdown: All manufacturers
  - List of vehicle manufacturers

- **Tenant Filter** (Super Admin / Manufacturer)
  - Dropdown: All tenants
  - List of golf course tenants

- **Search Bar**
  - Search by: Vehicle ID, VIN, License Plate, Model
  - Real-time search results

- **Apply Filters Button**: Execute filter query
- **Clear All Button**: Reset to defaults

##### Bulk Actions Bar
Appears when vehicles are selected:

- **Selection Counter**: "X vehicles selected"
- **Select All Checkbox**: Select all visible vehicles
- **Bulk Actions Dropdown**:
  - Update Status (Active/Maintenance/Offline)
  - Assign to Location
  - Export Selected
  - Schedule Maintenance
  - Delete (with confirmation)

##### Vehicle List Table
Data table with sortable columns:

**Columns**:
1. **Checkbox**: Select individual vehicles
2. **Vehicle ID**: Unique identifier (sortable)
3. **Type**: Icon + name (Golf Cart, etc.)
4. **Model**: Manufacturer and model name
5. **Status**: Color-coded badge (Active/Maintenance/Offline)
6. **Battery Level**:
   - Progress bar with percentage
   - Color coding: Green (>50%), Yellow (20-50%), Red (<20%)
7. **Location**: Current location or last known position
8. **Mileage**: Total distance traveled (sortable)
9. **Last Activity**: Timestamp (sortable)
10. **Actions**: Quick action buttons
    - View Details (eye icon)
    - Edit (pencil icon)
    - Schedule Maintenance (wrench icon)
    - More (three dots menu)

**Table Features**:
- Sortable columns (click header to sort)
- Fixed header on scroll
- Row hover effects
- Pagination: 25/50/100 per page
- Responsive: Condenses on mobile

##### Vehicle Details Modal
Triggered by clicking "View Details" on any vehicle:

**Modal Structure**:

**Header Section**:
- Vehicle ID and Model
- Close button (X)

**Tab Navigation**:
1. **Overview Tab**
   - Vehicle image/photo
   - Basic Information:
     - VIN Number
     - License Plate
     - Year/Model
     - Color
     - Serial Number
   - Current Status:
     - Operational status
     - Battery level (with visual gauge)
     - Current location
     - Last service date
   - Quick Stats:
     - Total mileage
     - Operating hours
     - Average speed
     - Fuel/charge efficiency

2. **Location & Tracking Tab**
   - Map view (placeholder for GPS integration)
   - Location history table:
     - Timestamp
     - Location
     - Duration
   - Geofence status
   - Movement patterns

3. **Maintenance History Tab**
   - Service records table:
     - Date
     - Service type
     - Technician
     - Description
     - Parts replaced
     - Cost
     - Status
   - Upcoming scheduled maintenance
   - Maintenance recommendations

4. **Usage Statistics Tab**
   - Charts and graphs:
     - Daily/weekly/monthly usage
     - Battery discharge patterns
     - Operating hours distribution
   - Performance metrics:
     - Average speed
     - Distance per charge
     - Efficiency ratings

5. **Documents Tab**
   - Registration documents
   - Warranty information
   - Insurance details
   - Service manuals
   - Upload new documents button

**Footer Actions**:
- Edit Vehicle button
- Schedule Maintenance button
- Download Report button
- Delete Vehicle button (with confirmation)

##### Add/Edit Vehicle Modal
Triggered by "Add Vehicle" or "Edit" buttons:

**Form Sections**:

1. **Basic Information**
   - Vehicle Type (dropdown)
   - Manufacturer (dropdown)
   - Model Name (text)
   - Year (number)
   - VIN (text)
   - License Plate (text, optional)
   - Color (text or color picker)

2. **Technical Specifications**
   - Battery Capacity (if electric)
   - Motor Type
   - Max Speed
   - Weight
   - Passenger Capacity
   - Cargo Capacity

3. **Assignment**
   - Tenant (dropdown - Super Admin/Manufacturer only)
   - Default Location (dropdown)
   - Assigned Driver (optional)

4. **Purchase Information**
   - Purchase Date
   - Purchase Price
   - Supplier
   - Warranty Expiry Date

5. **Status**
   - Initial Status (Active/Maintenance/Offline)
   - Notes (textarea)

**Form Actions**:
- Save button (validates and submits)
- Cancel button (closes modal, confirms if changes made)

##### Export Functionality
Triggered by "Export" button:

- **Export Options Modal**:
  - Format: CSV, Excel, PDF
  - Data Range: All/Filtered/Selected
  - Include Fields: Checkboxes for columns
  - Export button
  - Cancel button

##### Real-Time Updates
- WebSocket connection for live status updates
- Visual indicator when data refreshes
- Battery levels update every 5 minutes
- Location updates every 30 seconds (if tracking enabled)

#### Role-Based Features

**Super Admin View**:
- All vehicles across all tenants
- Cross-tenant analytics
- Tenant column in table
- Bulk tenant reassignment

**Manufacturer View**:
- Only vehicles manufactured by them
- Cross-tenant view for their vehicles
- Manufacturing batch information

**Golf Course Admin View**:
- Only vehicles within their tenant
- Full CRUD operations
- Assignment to staff

**Maintenance Staff View**:
- Read-only vehicle list
- Focus on vehicles needing maintenance
- Service history access

**Viewer View**:
- Read-only access
- No edit or delete capabilities
- Export functionality only

#### Performance Optimizations
- Virtual scrolling for large datasets
- Lazy loading of vehicle images
- Debounced search
- Cached filter results

---

### 4. Reservations Page
**Route**: `/reservations`
**Access**: Super Admin, Manufacturer, Golf Course Admin, Viewer (read-only)

#### Purpose
Manage vehicle bookings and reservations for golf course operations, including tee time coordination and member vehicle assignments.

#### Components

##### Page Header
- **Title**: "Reservation Management"
- **Breadcrumb**: Dashboard > Reservations
- **Create Reservation Button** (Admin only): Opens booking modal

##### Statistics Cards Row
Four cards displaying reservation metrics:

1. **Total Reservations Card**
   - Count: Total active and scheduled bookings
   - Icon: Calendar icon
   - Border: Black, solid

2. **Scheduled Card**
   - Count: Future reservations
   - Icon: Clock icon
   - Border: Gray, solid
   - Color coding: Gray theme

3. **Active Card**
   - Count: Currently in-use reservations
   - Icon: Active/play icon
   - Border: Black, bold
   - Color coding: Black theme

4. **Completed Card**
   - Count: Finished reservations
   - Icon: Checkmark icon
   - Border: Gray, solid
   - Color coding: Gray theme

5. **Cancelled Card**
   - Count: Cancelled bookings
   - Icon: X icon
   - Border: Light gray, solid
   - Background: Light gray
   - Color coding: Gray theme

##### View Toggle
Toggle between two view modes:

- **List View** (default)
  - Table format
  - More detailed information per row

- **Calendar View**
  - Month/week/day calendar
  - Visual booking slots
  - Drag-and-drop rescheduling (admin only)

##### Filter Panel (List View)

**Filter Options**:
- **Status Filter**
  - All, Scheduled, Active, Completed, Cancelled
  - Multi-select with badges

- **Date Range Filter**
  - Date picker: Start date and end date
  - Presets: Today, This Week, This Month, Custom

- **Vehicle Filter**
  - Dropdown: All vehicles or specific vehicle
  - Searchable dropdown

- **Member/Customer Filter**
  - Search by name or member ID
  - Autocomplete functionality

- **Time Filter**
  - Morning (6am-12pm)
  - Afternoon (12pm-6pm)
  - Evening (6pm-closing)

**Actions**:
- Apply Filters button
- Clear Filters button

##### Reservations List Table

**Columns**:
1. **Reservation ID**: Unique booking identifier
2. **Customer/Member**: Name and member ID
3. **Vehicle**: Vehicle ID and type
4. **Date**: Booking date
5. **Time**: Start time - End time (duration)
6. **Status**: Color-coded badge
   - Scheduled: Gray background
   - Active: Black background, white text
   - Completed: Green checkmark
   - Cancelled: Red X
7. **Tee Time**: Associated tee time (if applicable)
8. **Notes**: Brief notes or special requests (truncated)
9. **Actions**: Dropdown menu
   - View Details
   - Edit Reservation (admin, if not completed)
   - Start Rental (change to active)
   - Complete Rental
   - Cancel Reservation
   - Print Receipt

**Table Features**:
- Sortable columns
- Pagination: 25/50/100 rows per page
- Row highlighting on hover
- Status color coding
- Responsive design

##### Calendar View

**Calendar Features**:
- **Month View**:
  - Grid showing all days
  - Color-coded dots for reservations
  - Click day to see day view

- **Week View**:
  - 7-day horizontal layout
  - Time slots on vertical axis
  - Reservation blocks showing:
    - Customer name
    - Vehicle ID
    - Time duration
  - Color coding by status

- **Day View**:
  - Detailed hourly schedule
  - Large blocks for each reservation
  - Drag-and-drop to reschedule (admin only)
  - Conflict detection (overlapping bookings)

**Calendar Controls**:
- Previous/Next navigation arrows
- Today button (jump to current date)
- View mode toggle (Month/Week/Day)
- Export calendar button

##### Create Reservation Modal
Triggered by "Create Reservation" button:

**Form Sections**:

1. **Customer Information**
   - Search existing member (autocomplete)
   - Or enter new customer:
     - Name (required)
     - Phone number (required)
     - Email (optional)
     - Member ID (optional)

2. **Vehicle Selection**
   - Vehicle type dropdown
   - Specific vehicle selection (shows available vehicles)
   - Visual indicator: Available / Unavailable
   - Battery level display

3. **Date & Time**
   - Date picker (required)
   - Start time (dropdown or time picker)
   - Duration (dropdown: 30 min, 1 hr, 2 hrs, 4 hrs, Full Day)
   - End time (auto-calculated)
   - Tee time association (optional)

4. **Additional Details**
   - Number of players (if applicable)
   - Special requests (textarea)
   - Notes for staff (textarea)
   - Payment method (if applicable)

5. **Pricing** (if enabled)
   - Rate selection
   - Calculated total
   - Deposit amount
   - Payment status

**Validation**:
- Vehicle availability check
- Conflict detection with existing reservations
- Business hours validation
- Required field validation

**Form Actions**:
- Create Reservation button
- Save as Draft button (admin only)
- Cancel button

##### Reservation Details Modal
Triggered by clicking "View Details":

**Modal Structure**:

**Header**:
- Reservation ID
- Status badge
- Close button

**Customer Details Section**:
- Customer name
- Contact information
- Member ID (if applicable)
- Booking history link

**Reservation Details Section**:
- Vehicle information (with photo)
- Date and time
- Duration
- Tee time association
- Special requests
- Staff notes

**Status Timeline**:
- Created: Timestamp and user
- Confirmed: Timestamp
- Started: Timestamp (if active/completed)
- Completed: Timestamp (if completed)
- Cancelled: Timestamp and reason (if cancelled)

**Actions Section**:
- Edit Reservation button (if editable)
- Start Rental button (if scheduled)
- Complete Rental button (if active)
- Cancel Reservation button
- Print/Download Receipt button
- Send Confirmation Email button

**Activity Log**:
- Chronological list of all changes
- User who made changes
- Timestamps

##### Bulk Operations
When multiple reservations are selected:

- **Selection Counter**: "X reservations selected"
- **Bulk Actions Dropdown**:
  - Change Status
  - Send Confirmation Emails
  - Export Selected
  - Print Receipts
  - Cancel Selected (with confirmation)

##### Quick Stats Panel (Sidebar or Top)
Real-time statistics:

- **Today's Bookings**: Count of reservations today
- **Vehicles in Use**: Currently active rentals
- **Upcoming (Next 2 Hours)**: Scheduled soon
- **Available Vehicles**: Ready to book
- **Revenue Today**: Total booking revenue (if enabled)

##### Conflict Detection Alerts
Visual warnings for:

- **Double Bookings**: Same vehicle, overlapping times
- **Maintenance Conflicts**: Vehicle scheduled for service
- **Capacity Warnings**: All vehicles booked
- **Overdue Rentals**: Active reservations past end time

#### Role-Based Features

**Super Admin / Manufacturer**:
- View all reservations across tenants
- Cross-tenant booking management
- Advanced analytics

**Golf Course Admin**:
- Full CRUD for their tenant's reservations
- Assign vehicles
- Manage pricing and rates
- Access to all reservations at their facility

**Viewer**:
- Read-only access to list and details
- Export functionality
- No create/edit/delete capabilities

#### Real-Time Features
- WebSocket updates for new bookings
- Live status changes
- Availability updates
- Conflict alerts

#### Integration Points
- Sync with tee time management system
- Member management integration
- Payment processing (if enabled)
- Email/SMS notifications

---

### 5. Maintenance Page
**Route**: `/maintenance`
**Access**: Super Admin, Manufacturer, Golf Course Admin, Maintenance Staff (limited), Viewer (read-only)

#### Purpose
Comprehensive maintenance management system for tracking service requests, scheduling preventive maintenance, managing work orders, and maintaining vehicle service history.

#### Components

##### Page Header
- **Title**: "Maintenance Management"
- **Breadcrumb**: Dashboard > Maintenance
- **Create Service Request Button** (Admin only): Opens new request modal

##### Summary Statistics Cards Row
Five key metric cards:

1. **Pending Requests Card**
   - Count: Unassigned or not started
   - Icon: Clock icon
   - Border: Orange/yellow accent
   - Click: Filter to pending status

2. **In Progress Card**
   - Count: Currently being worked on
   - Icon: Tools/wrench icon
   - Border: Blue accent
   - Click: Filter to in-progress status

3. **Completed This Month Card**
   - Count: Finished service requests
   - Icon: Checkmark icon
   - Border: Green accent
   - Click: View completed list

4. **Critical Issues Card**
   - Count: High-priority/critical requests
   - Icon: Alert/warning icon
   - Border: Red accent
   - Pulsing animation for attention
   - Click: Filter to critical priority

5. **Average Response Time Card**
   - Time: Average from request to completion
   - Icon: Stopwatch icon
   - Trend: Up/down indicator
   - Color: Based on performance threshold

##### Tab Navigation
Three main tabs for different maintenance views:

**Tabs**:
1. **Service Requests** (default)
2. **Scheduled Maintenance**
3. **Service History**

---

#### Tab 1: Service Requests

##### Filter Panel

**Filter Options**:
- **Status Filter**
  - All, Pending, Assigned, In Progress, Completed, Cancelled
  - Multi-select with color badges

- **Priority Filter**
  - All, Critical, High, Medium, Low
  - Visual priority indicators

- **Vehicle Filter**
  - Dropdown: All vehicles or specific vehicle
  - Searchable

- **Technician Filter**
  - All, Unassigned, or specific technician
  - Shows technician workload

- **Date Range**
  - Created date range
  - Due date range
  - Completion date range

- **Category Filter**
  - Engine/Motor
  - Battery/Electrical
  - Brakes
  - Tires
  - Body/Exterior
  - Other

**Actions**:
- Apply Filters
- Clear Filters
- Save Filter Preset (admin)

##### Service Requests Table

**Columns**:
1. **Request ID**: Unique identifier with clickable link
2. **Vehicle**: Vehicle ID and type (with icon)
3. **Issue Category**: Icon + category name
4. **Priority**: Color-coded badge
   - Critical: Red
   - High: Orange
   - Medium: Yellow
   - Low: Gray
5. **Status**: Status badge with color
   - Pending: Gray
   - Assigned: Blue
   - In Progress: Orange
   - Completed: Green
   - Cancelled: Red
6. **Description**: Brief issue description (truncated)
7. **Assigned To**: Technician name/photo or "Unassigned"
8. **Created**: Date and time
9. **Due Date**: Target completion date (red if overdue)
10. **Actions**: Quick actions dropdown
    - View Details
    - Edit Request (admin)
    - Assign Technician (admin)
    - Update Status (technician/admin)
    - Add Notes
    - Close Request
    - Delete (admin only)

**Table Features**:
- Sortable columns
- Color-coded priority rows
- Overdue highlighting (red background)
- Pagination
- Export to CSV/Excel

##### Create Service Request Modal

**Form Sections**:

1. **Vehicle Selection**
   - Search vehicle by ID, VIN, or license plate
   - Dropdown with autocomplete
   - Display current vehicle status
   - Show last maintenance date

2. **Issue Details**
   - Category (dropdown):
     - Engine/Motor
     - Battery/Electrical
     - Brakes
     - Steering
     - Tires
     - Suspension
     - Body/Exterior
     - Lights
     - Other
   - Issue Title (text, required)
   - Detailed Description (textarea, required)
   - Symptoms observed (textarea)

3. **Priority & Urgency**
   - Priority Level (dropdown):
     - Critical: Safety issue, vehicle unusable
     - High: Major performance impact
     - Medium: Minor issue, vehicle still usable
     - Low: Cosmetic or non-urgent
   - Impact on Operations (textarea)

4. **Scheduling**
   - Requested Completion Date (date picker)
   - Preferred Technician (dropdown, optional)
   - Estimated Duration (dropdown: 0.5hr, 1hr, 2hrs, 4hrs, 1 day, 2+ days)

5. **Additional Information**
   - Upload Photos (up to 5 images)
   - Upload Documents (warranty, previous reports)
   - Special Instructions (textarea)
   - Notify Options:
     - Email notification to technician
     - SMS alert for critical issues

**Validation**:
- Required fields: Vehicle, category, title, description, priority
- Date validation: Due date cannot be in past
- File size limits for uploads

**Form Actions**:
- Create Request button
- Create & Assign button (opens assignment modal)
- Save as Draft button
- Cancel button

##### Service Request Details Modal

**Modal Structure**:

**Header Section**:
- Request ID
- Priority badge
- Status badge
- Created date
- Close button

**Request Information**:
- **Vehicle Details**:
  - Vehicle ID, Model, Type
  - Current location
  - Battery level
  - Last service date
  - Link to vehicle profile

- **Issue Details**:
  - Category
  - Title
  - Full description
  - Symptoms
  - Reported by: User name and timestamp
  - Photos/attachments gallery

**Assignment & Scheduling**:
- Assigned Technician:
  - Name and photo
  - Contact information
  - Current workload
  - Change technician button (admin)
- Due Date
- Estimated Duration
- Actual Start Time (if started)
- Completion Time (if completed)

**Status Timeline**:
Vertical timeline showing:
- Request Created: User, timestamp
- Assigned: Technician assigned, timestamp
- Started: Work began, timestamp
- Paused: If work stopped temporarily
- Parts Ordered: If waiting on parts
- Completed: Work finished, timestamp

**Work Notes & Updates**:
Chronological log of updates:
- Technician notes
- Status changes
- Parts used
- Time spent
- Photos of repairs
- Each entry shows: User, timestamp, content

**Add Update Section** (Technician/Admin):
- Note/Update textarea
- Attach photo button
- Update status dropdown
- Log time spent (hours)
- Parts used (multi-select)
- Save Update button

**Parts & Materials Used**:
Table showing:
- Part Name
- Part Number
- Quantity
- Cost (if available)
- Add Part button (technician/admin)

**Action Buttons**:
- Edit Request (admin)
- Change Status (technician/admin)
- Assign/Reassign (admin)
- Mark as Completed (technician/admin)
- Reopen Request (if closed prematurely)
- Close/Archive (admin)
- Print Work Order
- Download PDF Report

---

#### Tab 2: Scheduled Maintenance

##### Purpose
Manage preventive maintenance schedules based on mileage, operating hours, or time intervals.

##### Calendar View
- **Month View**: Overview of all scheduled maintenance
- **Week View**: Detailed weekly schedule
- **List View**: Table format of upcoming maintenance

##### Maintenance Schedule Table

**Columns**:
1. **Vehicle**: ID and model
2. **Maintenance Type**:
   - Oil Change
   - Battery Check
   - Tire Rotation
   - Brake Inspection
   - Full Service
   - Annual Inspection
3. **Scheduled Date**: Target date
4. **Interval Type**: Mileage-based, Hours-based, Time-based
5. **Next Due**: Calculated next service date
6. **Status**: Upcoming, Due Soon, Overdue
7. **Actions**:
   - Schedule Now
   - Edit Schedule
   - View History
   - Skip (with reason)

##### Create Scheduled Maintenance

**Form Fields**:
- Vehicle Selection (single or bulk)
- Maintenance Type (dropdown or custom)
- Recurrence Pattern:
  - Every X miles
  - Every X operating hours
  - Every X days/weeks/months
- First Occurrence Date
- Estimated Duration
- Assign Technician (optional)
- Reminder Settings:
  - Notify X days before due
  - Email/SMS notifications

**Maintenance Templates**:
Pre-configured templates for common services:
- Basic Service (every 500 miles)
- Battery Maintenance (every 30 days)
- Full Service (every 1000 miles or 6 months)
- Annual Inspection
- Custom template creation (admin)

##### Overdue Maintenance Alerts
Banner at top showing:
- Count of overdue maintenance tasks
- List of vehicles needing immediate attention
- Quick action buttons to create service requests

---

#### Tab 3: Service History

##### Purpose
Complete historical record of all maintenance performed on vehicles.

##### Filter Panel
- Vehicle selection
- Date range
- Service type
- Technician
- Cost range

##### Service History Table

**Columns**:
1. **Date**: Service date
2. **Vehicle**: ID and model
3. **Service Type**: Category and description
4. **Technician**: Name
5. **Duration**: Time spent
6. **Parts Used**: List of parts/materials
7. **Cost**: Total cost (if tracking enabled)
8. **Outcome**: Completed successfully, follow-up needed, etc.
9. **Actions**: View details, download report

##### Service History Details
Click any record to view:
- Complete service report
- Before/after photos
- Parts list with costs
- Technician notes
- Related service requests
- Download/print PDF report

##### Analytics Section (Admin roles)
- **Maintenance Costs by Month**: Bar chart
- **Most Common Issues**: Pie chart
- **Average Resolution Time**: Line chart
- **Cost per Vehicle**: Table with sorting
- **Technician Performance**: Completion rates, average time

---

#### Maintenance Dashboard Sidebar (Optional)

##### Quick Stats
- Vehicles Currently in Maintenance Bay
- Technicians Available / Busy
- Parts Inventory Alerts (low stock)
- Today's Completed Services

##### Upcoming Maintenance Today
Mini-list of scheduled maintenance for today:
- Vehicle ID
- Service type
- Time slot
- Assigned technician

---

#### Role-Based Features

**Super Admin**:
- Full access to all maintenance across all tenants
- Manage technician accounts
- Configure maintenance templates
- Access cost tracking and analytics

**Manufacturer**:
- View maintenance for their manufactured vehicles
- Quality control insights
- Common issue analysis
- Limited editing capabilities

**Golf Course Admin**:
- Full maintenance management for their vehicles
- Create/edit/assign service requests
- Manage scheduled maintenance
- Access service history and reports
- Manage technician assignments

**Maintenance Staff**:
- View assigned service requests
- Update status and add work notes
- Log parts used and time spent
- Upload photos of repairs
- Mark tasks as completed
- Limited access to create new requests

**Viewer**:
- Read-only access to service requests
- View scheduled maintenance
- Access service history
- Export reports
- No editing capabilities

#### Real-Time Features
- Live status updates via WebSocket
- Push notifications for new assignments (maintenance staff)
- Alerts for critical issues
- Due date reminders
- Auto-refresh every 60 seconds

#### Integration Points
- Vehicle status auto-update on completion
- Parts inventory system integration
- Time tracking for labor costs
- Email/SMS notification system
- Calendar sync for scheduled maintenance

---

### 6. Analytics Page
**Route**: `/analytics`
**Access**: Super Admin, Manufacturer, Golf Course Admin, Viewer (read-only)

#### Purpose
Comprehensive data visualization and reporting platform providing insights into fleet performance, usage patterns, costs, and operational efficiency.

#### Components

##### Page Header
- **Title**: "Analytics & Reports"
- **Breadcrumb**: Dashboard > Analytics
- **Date Range Selector**: Global date filter affecting all charts
  - Presets: Last 7 days, Last 30 days, Last 90 days, Last Year, Custom
- **Export All Data Button**: Download complete analytics report

##### Dashboard Summary Cards
Top row with key performance indicators:

1. **Total Distance Traveled**
   - Large number: Total miles/km
   - Period comparison: vs previous period
   - Trend indicator: Up/down arrow with percentage
   - Icon: Distance/odometer icon

2. **Average Fleet Utilization**
   - Percentage: Active time / total available time
   - Visual gauge/progress bar
   - Color coding: Green (>70%), Yellow (40-70%), Red (<40%)
   - Icon: Utilization chart icon

3. **Maintenance Costs**
   - Total cost for period
   - Breakdown: Parts + Labor
   - Cost per vehicle average
   - Trend comparison
   - Icon: Dollar sign icon

4. **Energy Efficiency**
   - Miles per charge average
   - Battery health average
   - Charging costs
   - Icon: Battery/energy icon

##### Tab Navigation
Multiple tabs for different analytical views:

**Tabs**:
1. **Fleet Overview** (default)
2. **Usage Trends**
3. **Maintenance Analytics**
4. **Cost Analysis**
5. **Performance Metrics**

---

#### Tab 1: Fleet Overview

##### Fleet Composition Section

**Vehicle Distribution Pie Chart**:
- Breakdown by vehicle type:
  - Golf Carts
  - Utility Vehicles
  - Mowers
  - Beverage Carts
  - Other
- Interactive: Click slice to filter
- Legend with counts and percentages
- Color coded

**Status Distribution Bar Chart**:
- Stacked bar showing:
  - Active vehicles
  - In maintenance
  - Offline
  - Charging
- Y-axis: Vehicle count
- X-axis: Time periods or vehicle types
- Hover tooltips with details

##### Current Fleet Status Map (if GPS enabled)
- Interactive map showing:
  - Vehicle locations in real-time
  - Color-coded markers by status
  - Clustering for dense areas
  - Click marker for vehicle details
  - Heat map overlay option

##### Fleet Health Score
Composite metric card:
- Overall health score (0-100)
- Factors:
  - Average battery health: X%
  - Maintenance compliance: X%
  - Utilization efficiency: X%
  - Safety record: X%
- Visual gauge with color zones
- Trend over time (sparkline)

##### Age & Condition Analysis
- **Fleet Age Distribution**: Histogram showing vehicle age ranges
- **Condition Ratings**: Pie chart (Excellent, Good, Fair, Poor)
- **Replacement Recommendations**: List of vehicles due for replacement

---

#### Tab 2: Usage Trends

##### Usage Over Time Chart
Multi-line chart showing:
- Lines:
  - Total distance traveled
  - Operating hours
  - Number of trips
  - Active vehicles count
- X-axis: Time (days, weeks, months based on date range)
- Y-axis: Dual axis for different metrics
- Toggle lines on/off
- Zoom and pan controls
- Export chart as image

##### Daily Usage Pattern Heatmap
- Rows: Hours of day (24-hour)
- Columns: Days of week
- Color intensity: Usage level (trips, distance, or vehicles in use)
- Identify peak usage times
- Helps with scheduling and resource allocation

##### Utilization by Vehicle Type
Horizontal bar chart:
- Bars for each vehicle type
- Length: Average utilization percentage
- Color coding: Same as fleet overview
- Hover for exact percentages
- Click to drill down

##### Top Performers Table
List of most-used vehicles:
1. **Vehicle ID**
2. **Type**
3. **Total Distance**: Mileage
4. **Operating Hours**
5. **Number of Trips**
6. **Utilization %**
7. **View Details**: Link to vehicle profile

##### Underutilized Assets Table
List of least-used vehicles:
- Same columns as top performers
- Highlights vehicles that may be:
  - Surplus to requirements
  - Needing redeployment
  - Having issues affecting usage

##### Usage Forecasting (if enabled)
- Predicted usage for next 30 days
- Based on historical trends
- Line chart with confidence intervals
- Helps with capacity planning

---

#### Tab 3: Maintenance Analytics

##### Maintenance Overview Cards
Four summary cards:
1. **Total Service Requests**: Count and trend
2. **Average Resolution Time**: Hours/days
3. **Repeat Issues**: Percentage of recurring problems
4. **Preventive vs Reactive**: Ratio

##### Maintenance Frequency Chart
Bar chart showing:
- X-axis: Time periods (weeks/months)
- Y-axis: Number of maintenance events
- Stacked bars:
  - Preventive maintenance
  - Reactive repairs
  - Emergency fixes
- Identify trends and seasonality

##### Common Issues Breakdown
Pie or donut chart:
- Segments: Issue categories
  - Battery/Electrical: X%
  - Engine/Motor: X%
  - Brakes: X%
  - Tires: X%
  - Other: X%
- Click segment to see detailed list

##### Mean Time Between Failures (MTBF)
- Line chart tracking MTBF over time
- By vehicle type or overall fleet
- Benchmark lines for industry standards
- Indicates reliability improvements

##### Maintenance Costs Over Time
Area chart:
- X-axis: Time periods
- Y-axis: Cost
- Stacked areas:
  - Parts costs
  - Labor costs
  - External service costs
- Cumulative total line
- Hover for details

##### Technician Performance Table
(Admin only)
- **Technician Name**
- **Requests Completed**: Count
- **Average Resolution Time**: Hours
- **Customer Rating**: If feedback enabled
- **Specialization**: Primary skill areas
- Sort by any column

##### Maintenance Schedule Compliance
Gauge chart:
- Percentage of scheduled maintenance completed on time
- Color zones:
  - Green: >90%
  - Yellow: 70-90%
  - Red: <70%
- List of overdue items

##### Vehicle Downtime Analysis
Bar chart:
- Vehicles sorted by total downtime
- Shows days/hours in maintenance
- Impact on fleet availability
- Identify problem vehicles

---

#### Tab 4: Cost Analysis

##### Total Cost of Ownership Dashboard

**Summary Cards**:
1. **Acquisition Costs**: Initial purchase prices
2. **Operating Costs**: Energy, consumables
3. **Maintenance Costs**: Repairs and parts
4. **Total TCO**: Sum of all costs

##### Cost Breakdown by Category
Pie chart:
- Maintenance: X%
- Energy/Fuel: X%
- Insurance: X%
- Depreciation: X%
- Other: X%

##### Cost per Vehicle
Table showing:
1. **Vehicle ID**
2. **Type**
3. **Age**
4. **Acquisition Cost**
5. **Total Maintenance**: Cumulative
6. **Operating Costs**: Energy, etc.
7. **Total Cost**
8. **Cost per Mile**: TCO / total distance
9. **Actions**: View detailed breakdown

##### Cost Trends Over Time
Line chart:
- Multiple lines for cost categories
- X-axis: Time
- Y-axis: Cost
- Toggle categories on/off
- Identify cost spikes and trends

##### Cost Comparison by Vehicle Type
Grouped bar chart:
- Groups: Vehicle types
- Bars per group: Cost categories
- Compare costs across types
- Inform purchasing decisions

##### Return on Investment (ROI) Analysis
- Table or cards for each vehicle or type
- Formula: (Revenue - Costs) / Costs
- ROI percentage
- Payback period
- Profitability indicators

##### Budget vs Actual
Bar chart:
- Grouped bars: Budgeted vs Actual costs
- Categories: Maintenance, energy, parts, etc.
- Variance percentage
- Overspend/underspend highlighting

##### Cost Forecasting
- Predictive chart showing projected costs
- Based on historical data
- Next 3/6/12 months
- Helps with budgeting

---

#### Tab 5: Performance Metrics

##### Speed & Distance Metrics

**Average Speed by Vehicle Type**:
- Bar chart comparing average speeds
- Identify efficiency differences

**Total Distance Leaderboard**:
- Top 10 vehicles by mileage
- Shows most-worked vehicles

##### Battery Performance

**Battery Health Distribution**:
- Histogram: Number of vehicles by health %
- Identify batteries needing replacement

**Charge Efficiency Over Time**:
- Line chart: Miles per charge
- Track degradation
- Compare vehicle types

**Charging Patterns**:
- Heatmap: Charging times by day/hour
- Optimize charging schedules

##### Environmental Impact (if tracking enabled)

**Emissions Saved**:
- Calculated savings vs gas vehicles
- CO2 reduction
- Visual comparison

**Energy Consumption**:
- Total kWh used
- Cost of energy
- Efficiency metrics

##### Safety Metrics (if tracking enabled)

**Incidents by Type**:
- Pie chart: Types of incidents
- Near misses, minor, major

**Safety Score by Vehicle**:
- Table with safety ratings
- Based on incident history and compliance

**Training Compliance**:
- Percentage of staff with current certifications

##### Operational Efficiency

**Trips per Vehicle per Day**:
- Bar chart showing daily trip averages
- Identify optimal utilization

**Idle Time Analysis**:
- Vehicles with excessive idle time
- Opportunities for better deployment

**Response Time to Service Requests**:
- Average time from request to start
- Target vs actual

---

#### Global Features Across All Tabs

##### Filter Panel (Collapsible)
Always available, affecting all charts:

- **Tenant Filter** (Multi-tenant roles):
  - Dropdown: Select one or more tenants
  - "All Tenants" option

- **Vehicle Type Filter**:
  - Checkboxes: Golf Cart, Utility, Mower, etc.

- **Vehicle Status Filter**:
  - Include inactive vehicles checkbox
  - Include vehicles in maintenance

- **Date Range Filter** (also in header):
  - Start and end date pickers
  - Presets

- **Apply Filters** button
- **Reset to Defaults** button

##### Export Options
Available on each chart/table:

- **Export Chart as Image**: PNG, SVG
- **Export Data**: CSV, Excel, JSON
- **Download PDF Report**: Formatted report with chart images

##### Comparison Mode
- Select two time periods to compare
- Side-by-side or overlay visualization
- Percentage change calculations

##### Custom Reports Builder (Admin only)
Modal for creating custom reports:

1. **Select Metrics**: Multi-select dropdown
2. **Choose Visualizations**: Chart types
3. **Set Filters**: Date, tenant, vehicle type
4. **Schedule Delivery**: Email report daily/weekly/monthly
5. **Save Template**: Reusable report configurations

##### Alerts & Notifications
Configure alerts based on thresholds:
- Utilization drops below X%
- Maintenance costs exceed $X
- Battery health below X%
- Distance exceeds expected range

##### Data Refresh
- **Last Updated**: Timestamp displayed
- **Auto-Refresh**: Toggle on/off, set interval
- **Manual Refresh** button

---

#### Role-Based Features

**Super Admin**:
- Access all analytics across all tenants
- Cross-tenant comparison reports
- System-wide trends
- Full export capabilities

**Manufacturer**:
- Analytics for their manufactured vehicles only
- Cross-tenant performance of their models
- Quality metrics and reliability data
- Comparative analysis by client

**Golf Course Admin**:
- Full analytics for their tenant
- Benchmarking against industry averages (if available)
- Budget and cost management tools
- Export and reporting

**Viewer**:
- Read-only access to all analytics
- Export charts and data
- No configuration changes

#### Performance Optimizations
- Lazy loading of charts (render as scrolled into view)
- Cached data for common date ranges
- Progressive data loading for large datasets
- Chart throttling on window resize

#### Responsive Design
- Charts adapt to screen size
- Mobile: Stacked/vertical layouts
- Touch-friendly controls
- Swipe navigation between tabs

---

### 7. Tenants Page
**Route**: `/tenants`
**Access**: Super Admin (full), Manufacturer (limited)

#### Purpose
Manage multiple golf course clients (tenants) in the multi-tenant SaaS platform. Super Admins can create, configure, and monitor all tenants. Manufacturers can view tenants using their vehicles.

#### Components

##### Page Header
- **Title**: "Tenant Management"
- **Breadcrumb**: Dashboard > Tenants
- **Total Tenants Count**: Display active tenant count
- **Add New Tenant Button** (Super Admin only): Opens creation modal

##### Summary Statistics Cards Row

1. **Total Tenants Card**
   - Count: All registered tenants
   - Icon: Building icon
   - Trend: New this month

2. **Active Tenants Card**
   - Count: Currently active subscriptions
   - Percentage: Active / total
   - Color: Green accent

3. **Total Vehicles Card**
   - Count: Vehicles across all tenants
   - Average: Vehicles per tenant
   - Icon: Vehicle icon

4. **Total Revenue Card** (Super Admin only)
   - Monthly recurring revenue
   - Trend: vs previous month
   - Icon: Dollar sign

##### Filter Panel

**Filter Options**:
- **Status Filter**:
  - All, Active, Trial, Suspended, Inactive
  - Color-coded badges

- **Subscription Tier Filter**:
  - All, Enterprise, Professional, Basic
  - Multi-select

- **Region/Location Filter**:
  - Dropdown: All regions, specific states/countries
  - Useful for geographic analysis

- **Search Bar**:
  - Search by tenant name, subdomain, or ID
  - Real-time filtering

**Actions**:
- Apply Filters
- Clear Filters

##### Tenants Grid View (Default)
Card-based layout showing tenant cards:

**Each Tenant Card Contains**:

**Header Section**:
- **Tenant Name**: Golf course name
- **Tier Badge**: Enterprise/Professional/Basic
- **Status Badge**: Active/Trial/Suspended/Inactive

**Metrics Section**:
- **Vehicle Count**:
  - Total vehicles assigned
  - Active vehicles count
  - Icon: Vehicle icon
- **Subscription**:
  - Plan level
  - Monthly cost (Super Admin only)
- **Joined Date**: When tenant was created

**Status Indicators**:
- **Active Vehicles**: Progress bar showing active/total ratio
- **Last Activity**: Timestamp of last system use
- **Health Status**: Overall tenant health icon (green checkmark, yellow warning, or red alert)

**Quick Actions**:
- **View Details** button: Opens detailed view
- **Quick Actions** dropdown (Super Admin):
  - Edit Tenant
  - Manage Subscription
  - View Billing
  - Suspend Account
  - Delete Tenant (with confirmation)

**Visual Elements**:
- Border color-coded by tier:
  - Enterprise: Black, bold
  - Professional: Medium gray
  - Basic: Light gray
- Hover effect: Shadow elevation
- Status dot indicator in corner

##### Tenants Table View (Toggle)
Alternative view showing more data in table format:

**Columns**:
1. **Tenant ID**: Unique identifier
2. **Name**: Golf course name
3. **Subdomain**: URL subdomain
4. **Tier**: Subscription level badge
5. **Status**: Status badge
6. **Vehicles**: Total / Active
7. **Users**: Number of user accounts
8. **Joined**: Date created
9. **Last Active**: Recent activity timestamp
10. **MRR** (Super Admin): Monthly recurring revenue
11. **Actions**: Dropdown menu

**Table Features**:
- Sortable columns
- Pagination: 25/50/100 per page
- Bulk selection checkboxes (Super Admin)
- Export to CSV/Excel

##### Tenant Details Modal/Page
Triggered by "View Details" button:

**Modal Structure with Tabs**:

**Tab 1: Overview**

**Tenant Information Section**:
- **Basic Details**:
  - Tenant Name
  - Tenant ID
  - Subdomain (e.g., pinevalley.aprofleet.com)
  - Status: Active/Trial/Suspended
  - Tier: Enterprise/Professional/Basic

- **Contact Information**:
  - Primary Contact Name
  - Email
  - Phone Number
  - Address
  - Website

- **Dates & Timeline**:
  - Created Date
  - Subscription Start Date
  - Trial End Date (if applicable)
  - Renewal Date
  - Last Login

**Quick Stats Grid**:
- Total Vehicles
- Active Vehicles
- Total Users
- Active Reservations
- Maintenance Requests (open)
- Storage Used (if file storage enabled)

**Recent Activity Feed**:
- Last 10 activities from this tenant
- User logins
- Vehicle status changes
- Reservations created
- Maintenance requests

**Tab 2: Vehicles**

**Vehicle List for This Tenant**:
- Embedded vehicle table (similar to main vehicles page)
- Filtered to show only this tenant's vehicles
- Actions (Super Admin):
  - Add Vehicle to Tenant
  - Remove Vehicle from Tenant
  - Reassign Vehicle

**Vehicle Allocation**:
- Current: X vehicles
- Plan Limit: Y vehicles
- Remaining: Y - X
- Upgrade prompt if at limit

**Tab 3: Users**

**User Management**:
- List of users belonging to this tenant
- Columns:
  - Name
  - Email
  - Role (Admin, Staff, Viewer)
  - Last Login
  - Status (Active/Inactive)
  - Actions: Edit, Deactivate, Delete

- **Add User Button** (Super Admin, Golf Course Admin)
- **Bulk User Operations**: Import, export users

**Tab 4: Subscription & Billing** (Super Admin only)

**Subscription Details**:
- **Current Plan**: Enterprise/Professional/Basic
- **Billing Cycle**: Monthly/Annual
- **Price**: $X/month
- **Next Billing Date**
- **Payment Method**: Card ending in XXXX

**Plan Features**:
- Checkboxes showing included features:
  - Number of vehicles allowed
  - Number of users allowed
  - API access
  - Advanced analytics
  - Priority support

**Billing History Table**:
- **Date**
- **Description**: Invoice description
- **Amount**
- **Status**: Paid, Pending, Failed
- **Invoice**: Download link

**Actions**:
- Change Plan button
- Update Payment Method button
- Cancel Subscription button (with confirmation)
- Generate Invoice button

**Tab 5: Settings**

**Tenant-Specific Configuration**:

- **Branding** (if white-label enabled):
  - Logo upload
  - Primary color selection
  - Custom domain

- **Features Enabled**:
  - Checkboxes for enabling/disabling features:
    - Reservations module
    - Maintenance tracking
    - Analytics
    - API access
    - GPS tracking

- **Limits & Quotas**:
  - Max vehicles: Number input
  - Max users: Number input
  - Max API calls/month: Number
  - Storage limit: GB

- **Notifications**:
  - Admin email for system notifications
  - Email frequency: Immediate, Daily digest, Weekly

- **Timezone & Localization**:
  - Timezone selection
  - Language preference
  - Date/time format

**Save Settings** button

**Tab 6: Activity Log** (Super Admin only)

**Comprehensive Audit Trail**:
- Table of all actions related to this tenant
- Columns:
  - Timestamp
  - User
  - Action (Created, Updated, Login, etc.)
  - Details
  - IP Address (if logged)

- Filter by:
  - Date range
  - Action type
  - User

- Export log button

---

##### Create Tenant Modal (Super Admin only)

**Multi-Step Form**:

**Step 1: Basic Information**
- **Tenant Name** (required): Golf course name
- **Subdomain** (required): Unique subdomain identifier
  - Real-time availability check
  - Example: pinevalley → pinevalley.aprofleet.com
- **Description** (optional): Brief description

**Step 2: Contact Details**
- **Primary Contact Name** (required)
- **Email** (required)
- **Phone Number** (required)
- **Address**: Street, City, State, Zip, Country
- **Website** (optional)

**Step 3: Subscription**
- **Tier Selection** (required):
  - Basic: Up to 20 vehicles, basic features
  - Professional: Up to 50 vehicles, advanced features
  - Enterprise: Unlimited, all features + API
- **Billing Cycle**: Monthly or Annual (discount)
- **Trial Period**: Checkbox to start with trial (14/30 days)

**Step 4: Initial Setup**
- **Number of Vehicles**: How many vehicles to allocate initially
- **Create Admin User**:
  - Admin Name (required)
  - Admin Email (required)
  - Auto-generate password checkbox
  - Send welcome email checkbox

**Step 5: Review & Create**
- Summary of all entered information
- Terms and conditions checkbox
- **Create Tenant** button
- **Back** to edit

**Post-Creation Actions**:
- Success message
- Option to:
  - Add vehicles immediately
  - Create additional users
  - Configure settings
  - Send welcome email to admin

---

##### Bulk Operations (Super Admin only)
When multiple tenants are selected:

- **Selection Counter**: "X tenants selected"
- **Bulk Actions Dropdown**:
  - Export Selected
  - Change Status (Activate/Suspend)
  - Send Notification Email
  - Generate Reports
  - Delete (with strong confirmation)

##### Tenant Analytics Summary Panel
Sidebar or bottom section showing aggregate metrics:

- **Tenant Growth Chart**: Line chart showing new tenants over time
- **Tier Distribution**: Pie chart of subscription tiers
- **Churn Rate**: Percentage of cancelled/suspended accounts
- **Average Vehicles per Tenant**: Number
- **Revenue Breakdown**: By tier

---

#### Role-Based Features

**Super Admin View**:
- Full CRUD operations on all tenants
- Access to billing and subscription management
- View all tenant data and activity logs
- Create and delete tenants
- Configure quotas and limits
- System-wide tenant analytics

**Manufacturer View**:
- View tenants that use their vehicles
- Read-only access to tenant information
- Cannot see billing or sensitive data
- Cannot create, edit, or delete tenants
- Limited to tenants with their manufactured vehicles

#### Real-Time Features
- Live status updates (active users, vehicles in use)
- WebSocket connection for instant notifications
- Usage metrics updated every 5 minutes

#### Integration Points
- Payment gateway for subscription billing
- Email service for notifications and invoices
- Subdomain provisioning (if DNS integrated)
- User provisioning automation

---

### 8. Users Page
**Route**: `/users`
**Access**: Super Admin (all users), Manufacturer (limited), Golf Course Admin (tenant users only)

#### Purpose
Manage user accounts, roles, permissions, and access control across the platform. Different roles have varying levels of user management capabilities.

#### Components

##### Page Header
- **Title**: "User Management"
- **Breadcrumb**: Dashboard > Users
- **Total Users Count**: Display total user count (based on permissions)
- **Add New User Button** (Admin roles): Opens user creation modal

##### Summary Statistics Cards Row

1. **Total Users Card**
   - Count: All users (within accessible scope)
   - Icon: User icon
   - Trend: New this month

2. **Active Users Card**
   - Count: Users logged in recently
   - Definition: Active in last 30 days
   - Percentage: Active / total
   - Color: Green accent

3. **By Role Breakdown Card**
   - Mini chart showing role distribution
   - Super Admin: X
   - Golf Course Admin: X
   - Maintenance Staff: X
   - Viewer: X

4. **Pending Invitations Card**
   - Count: Users invited but not yet registered
   - Icon: Envelope/invite icon
   - Action: Resend invitations

##### Filter Panel

**Filter Options**:
- **Role Filter**:
  - All Roles
  - Super Admin
  - Manufacturer
  - Golf Course Admin
  - Maintenance Staff
  - Viewer
  - Multi-select checkboxes

- **Status Filter**:
  - All
  - Active
  - Inactive
  - Pending (invited but not registered)
  - Suspended

- **Tenant Filter** (Super Admin / Manufacturer):
  - Dropdown: All tenants or specific tenant
  - Shows users by tenant affiliation

- **Last Login Filter**:
  - Active today
  - Active this week
  - Active this month
  - Inactive 30+ days

- **Search Bar**:
  - Search by name, email, or user ID
  - Real-time filtering

**Actions**:
- Apply Filters
- Clear Filters

##### Users Table

**Columns**:
1. **Checkbox**: Bulk selection
2. **User ID**: Unique identifier (sortable)
3. **Name**: Full name with avatar/initials circle
4. **Email**: Email address
5. **Role**: Badge with role name and color
   - Super Admin: Black
   - Manufacturer: Dark gray
   - Golf Course Admin: Blue
   - Maintenance Staff: Green
   - Viewer: Light gray
6. **Tenant**: Tenant name (Super Admin / Manufacturer view only)
7. **Status**: Active, Inactive, Pending, Suspended (badge)
8. **Last Login**: Timestamp (sortable)
9. **Created**: Account creation date (sortable)
10. **Actions**: Dropdown menu
    - View Details
    - Edit User
    - Change Role (admin only)
    - Reset Password
    - Suspend Account
    - Delete User (with confirmation)

**Table Features**:
- Sortable columns (click header)
- Pagination: 25/50/100 rows per page
- Hover row highlighting
- Color-coded role badges
- Status indicators (green dot for active, gray for inactive)
- Export to CSV/Excel

##### User Details Modal
Triggered by clicking "View Details":

**Modal Structure**:

**Header Section**:
- User avatar (photo or initials)
- User name
- Role badge
- Status badge
- Close button

**Tab Navigation**:

**Tab 1: Profile Information**

**Personal Details**:
- **Full Name**: Text
- **Email**: Email address
- **Phone Number**: Phone
- **Job Title**: Optional text
- **Department**: Optional text

**Account Information**:
- **User ID**: Unique identifier
- **Role**: Current role with description
- **Tenant**: Associated golf course (if applicable)
- **Status**: Active/Inactive/Suspended
- **Created Date**: When account was created
- **Created By**: Admin who created account
- **Last Login**: Date and time
- **Last IP Address**: Security info (admin view only)

**Permissions Summary** (if granular permissions enabled):
- List of specific permissions granted
- Inherited from role
- Custom permissions (if any)

**Tab 2: Activity Log**

**User Activity History**:
- Chronological list of user actions
- Table columns:
  - **Timestamp**: Date and time
  - **Action**: Login, Viewed page, Created reservation, etc.
  - **Resource**: Affected entity (vehicle ID, reservation ID, etc.)
  - **Details**: Brief description
  - **IP Address** (admin view only)

- Filters:
  - Date range
  - Action type

- **Export Activity Log** button

**Tab 3: Settings**

**User-Specific Settings**:
- **Notification Preferences**:
  - Email notifications: On/Off
  - SMS notifications: On/Off
  - Push notifications: On/Off
  - Notification types to receive (checkboxes)

- **Access Restrictions**:
  - IP Whitelist (admin only)
  - Session timeout: Dropdown (30 min, 1 hr, 4 hrs, 8 hrs, 24 hrs)
  - Two-factor authentication: Required/Optional/Disabled

- **API Access** (if applicable):
  - API key display (masked)
  - Regenerate API key button
  - API usage limits

**Action Buttons**:
- **Edit User** button: Opens edit modal
- **Change Password** button: Sends reset email or allows admin to set password
- **Suspend Account** button: Temporarily disable access
- **Delete User** button: Permanently remove (with strong confirmation)
- **Resend Invitation** button (if pending)

---

##### Add User Modal

**Form Sections**:

**Step 1: Basic Information**
- **Full Name** (required): Text input
- **Email** (required): Email input with validation
  - Check for duplicate emails
- **Phone Number** (optional): Phone input
- **Job Title** (optional): Text input

**Step 2: Role & Permissions**
- **Role Selection** (required): Dropdown or radio buttons
  - Super Admin (Super Admin only can assign)
  - Manufacturer (Super Admin only)
  - Golf Course Admin
  - Maintenance Staff
  - Viewer
  - Display role descriptions on selection

- **Tenant Assignment**:
  - Dropdown: Select tenant (Super Admin / Manufacturer)
  - For Golf Course Admin creating users: Auto-assigned to their tenant

- **Custom Permissions** (optional, advanced):
  - Checkboxes for granular permissions if role-based isn't enough
  - Override role defaults

**Step 3: Account Setup**
- **Password Options**:
  - Auto-generate secure password (recommended)
  - Manually set password (text input with strength indicator)
  - User sets password on first login (send invitation email)

- **Notifications**:
  - Send welcome email: Checkbox (checked by default)
  - Send invitation to set password: Checkbox

- **Account Status**:
  - Active immediately: Radio button (default)
  - Pending activation: Radio button (user must verify email)

**Step 4: Review & Create**
- Summary of entered information
- **Create User** button
- **Back** to edit previous steps
- **Cancel** button

**Post-Creation**:
- Success message
- Display temporary password (if auto-generated)
- Option to:
  - Create another user
  - Send welcome email now
  - View user details

---

##### Edit User Modal
Similar to Add User, but:
- Pre-filled with existing user data
- Cannot change email (or warning if changed)
- **Save Changes** button
- Track what changed for activity log

---

##### Bulk Operations
When multiple users are selected:

- **Selection Counter**: "X users selected"
- **Bulk Actions Dropdown**:
  - Change Role (confirm for each or batch)
  - Change Status (Activate/Suspend)
  - Send Notification Email
  - Export Selected Users (CSV/Excel)
  - Delete Users (with strong confirmation, cannot bulk delete admins)

##### Password Management

**Reset Password Functionality**:
- Admin can trigger password reset for any user
- Sends email with reset link
- Link expires in 24 hours
- User sets new password

**Change Own Password**:
- User can change their own password in Settings page
- Requires current password
- Password strength validation
- Confirmation field

##### Role Change Confirmation
When changing a user's role (especially to/from admin):
- **Warning Modal**:
  - "You are about to change [User]'s role from [Old Role] to [New Role]"
  - List of permission changes
  - "This action will:"
    - Grant/revoke permissions
    - Change accessible data
  - Confirmation checkbox: "I understand the implications"
  - **Confirm Change** button
  - **Cancel** button

##### User Invitations System

**Invite New User Flow**:
1. Admin enters email and role
2. System generates invitation link
3. Email sent to user with:
   - Welcome message
   - Company/tenant name
   - Invitation link
   - Expiry notice (7 days)
4. User clicks link, lands on registration page
5. User sets password and completes profile
6. Account activated

**Pending Invitations Panel**:
- Separate section showing invited but unregistered users
- Columns:
  - Email
  - Role
  - Invited By
  - Invited Date
  - Expires
  - Actions: Resend, Cancel Invitation

---

#### Role-Based Features

**Super Admin View**:
- Full access to all users across all tenants
- Create users with any role including Super Admin and Manufacturer
- View system-wide user analytics
- Manage cross-tenant user permissions
- Access security logs and IP addresses
- Bulk user operations

**Manufacturer View**:
- View users associated with their tenant relationships
- Limited to specific tenants they work with
- Cannot create Super Admin or other Manufacturer users
- Cannot see sensitive security data
- Read-only for most users outside their scope

**Golf Course Admin View**:
- Full user management for their tenant only
- Create and manage Golf Course Admin, Maintenance Staff, and Viewer roles
- Cannot create Super Admin or Manufacturer roles
- Cannot see users from other tenants
- Access to their tenant's user activity logs

**Maintenance Staff / Viewer**:
- No access to Users page (route protected)

---

#### Real-Time Features
- Live status updates (online/offline indicators)
- Instant notification when new user registers
- Activity log updates in real-time (WebSocket)

#### Security Features
- Password complexity requirements enforced
- Email verification for new accounts
- Two-factor authentication options (if enabled)
- Session management (force logout capabilities)
- IP address logging for security audits
- Failed login attempt tracking

#### Integration Points
- Email service for invitations and notifications
- SMS service for phone verification (optional)
- LDAP/Active Directory integration (future)
- Single Sign-On (SSO) support (future)

---

### 9. Logs Page
**Route**: `/logs`
**Access**: Super Admin (full), Manufacturer (limited), Golf Course Admin (tenant logs)

#### Purpose
Comprehensive system logging and monitoring interface for tracking application events, errors, and debugging. Provides real-time log streaming and historical log analysis.

#### Components

##### Page Header
- **Title**: "System Logs"
- **Breadcrumb**: Dashboard > Logs
- **Real-Time Indicator**: Green pulsing dot with "LIVE" label if streaming enabled
- **Pause/Resume Streaming Button**: Control real-time updates

##### Service Filter Tabs
Horizontal tabs at top to filter by service/component:

**Tabs**:
1. **All Services** (default)
2. **API Server**: Backend API logs
3. **Database**: Database queries and connections
4. **Redis**: Cache operations
5. **WebSocket**: Real-time connection logs
6. **Auth Service**: Authentication and authorization events
7. **Payment Service**: Billing and payment logs

**Visual Indicators per Tab**:
- Badge with count of logs from that service
- Error indicator (red dot) if recent errors

##### Log Level Filter Bar
Horizontal button group for filtering by severity:

**Buttons** (toggle on/off, multi-select):
1. **ERROR**: Red background, white text
   - Critical errors requiring immediate attention
2. **WARN**: Yellow/orange background
   - Warnings that may indicate problems
3. **INFO**: Blue background
   - Informational messages (default logging)
4. **DEBUG**: Gray background
   - Detailed debugging information

**Badge Count**: Show number of logs per level

##### Filter Panel (Collapsible)

**Advanced Filters**:
- **Date & Time Range**:
  - Date picker: Start and end dates
  - Time picker: Specific time ranges
  - Presets: Last 15 minutes, Last hour, Last 24 hours, Last 7 days, Custom

- **Search Query**:
  - Text input: Search log messages
  - Supports regex patterns
  - Placeholder: "Search logs... (supports regex)"
  - Real-time search as typing (debounced)

- **User Filter** (if logs track user):
  - Dropdown: Filter by user who triggered event
  - Options: All users, specific user

- **IP Address Filter**:
  - Text input: Filter by source IP
  - Useful for security analysis

- **Request ID / Trace ID**:
  - Text input: Track specific request chain
  - For distributed tracing

- **Tenant Filter** (Super Admin / Manufacturer):
  - Dropdown: All tenants or specific tenant
  - Filter logs by tenant context

**Actions**:
- **Apply Filters** button
- **Clear All** button
- **Save Filter Preset** button (for frequent searches)

##### Logs Display Area

**Live Log Stream** (Real-Time Mode):
- Auto-scrolling log entries
- New logs appear at top (or bottom based on preference)
- Smooth animations for new entries
- Pause auto-scroll when user manually scrolls

**Log Entry Format**:
Each log entry is a row with:

1. **Timestamp**:
   - Format: YYYY-MM-DD HH:MM:SS.mmm
   - Timezone indicator
   - Color: Gray text

2. **Log Level Badge**:
   - ERROR: Red badge
   - WARN: Yellow badge
   - INFO: Blue badge
   - DEBUG: Gray badge
   - Uppercase text

3. **Service/Component**:
   - Service name in brackets [API], [DB], [WS], etc.
   - Color-coded by service

4. **Message**:
   - Main log message text
   - Syntax highlighting for structured data (JSON)
   - Line breaks preserved
   - Truncated if very long (click to expand)

5. **Additional Context** (expandable):
   - Click row to expand details:
     - Full stack trace (if error)
     - Request/response data
     - User context
     - Metadata (tenant ID, user ID, IP, etc.)

6. **Actions**:
   - Copy log entry button
   - Copy request ID button
   - Filter by this service button
   - Filter by this user button

**Visual Features**:
- Zebra striping: Alternating row background colors for readability
- Hover effect: Highlight row on mouse over
- Error rows: Subtle red tint background
- Warning rows: Subtle yellow tint background
- Monospace font for log messages
- Syntax highlighting for JSON/XML in messages

##### Pagination & Loading
- **Infinite Scroll**: Load more logs as scrolling (if not in real-time mode)
- **Pagination Controls**:
  - Page size selector: 50, 100, 200, 500 logs per page
  - Previous/Next page buttons
  - Jump to page input
- **Loading Indicator**: Spinner when fetching more logs

##### Log Details Sidebar/Modal
When clicking on a log entry to see full details:

**Expandable Panel or Modal**:

**Header**:
- Timestamp
- Log level badge
- Service name
- Close button

**Message Section**:
- Full, untruncated log message
- Copy message button

**Context Section**:
- **Request Details**:
  - Request ID / Trace ID
  - HTTP Method and Path (if applicable)
  - Status Code
  - Response Time
  - User Agent

- **User Context**:
  - User ID
  - User Name
  - User Role
  - User Tenant

- **System Context**:
  - Server/Pod ID
  - IP Address
  - Hostname
  - Process ID

**Stack Trace Section** (if error):
- Full stack trace with file paths and line numbers
- Syntax highlighting
- Clickable file paths (if integrated with code editor)

**Related Logs**:
- Show other logs with same request ID
- Trace entire request lifecycle
- Link to related logs

**Actions**:
- **Copy All Details** button
- **Download as JSON** button
- **Create Issue** button (if issue tracker integrated)
- **Share Log** button (generate shareable link)

##### Log Export Functionality

**Export Button** (top right):
Opens export modal with options:

**Export Options**:
- **Format**:
  - JSON
  - CSV
  - Plain Text (.log file)
  - Excel

- **Content**:
  - All filtered logs
  - Selected logs (if selection feature enabled)
  - Current page only

- **Date Range**:
  - Use current filter
  - Custom range

- **Include**:
  - Checkboxes: Timestamp, Level, Service, Message, Stack Trace, Metadata

**Actions**:
- **Export** button: Download file
- **Cancel** button

##### Real-Time Streaming Controls

**Streaming Settings Panel**:
- **Auto-Scroll**: Toggle on/off
- **Scroll Direction**: Top or Bottom (where new logs appear)
- **Update Frequency**: Slider (1s, 5s, 10s intervals)
- **Max Logs Displayed**: Prevent browser overload (500, 1000, 2000)
- **Notification Sound**: Toggle alert sound for errors

##### Log Statistics Dashboard (Optional Sidebar or Top Panel)

**Summary Cards**:
1. **Total Logs**: Count in current view
2. **Error Rate**: Percentage of logs that are errors
3. **Average Response Time**: If tracking API logs
4. **Top Error**: Most frequent error message

**Visualizations**:
- **Log Volume Chart**: Line chart showing log count over time (last hour/day)
  - Color-coded by log level
- **Service Distribution**: Pie chart showing logs per service
- **Error Trends**: Sparkline showing error rate over time

##### Alerts & Monitoring (Admin Roles)

**Configure Alerts Button**:
Opens modal to set up alerts:

**Alert Configuration**:
- **Trigger Condition**:
  - Error rate exceeds X% in Y minutes
  - Specific error message appears X times
  - Service stops logging (potential crash)

- **Notification Method**:
  - Email
  - SMS
  - In-app notification
  - Webhook (e.g., Slack)

- **Alert Frequency**:
  - Immediate
  - Once per hour
  - Daily digest

- **Save Alert** button

---

#### Role-Based Features

**Super Admin View**:
- Access all logs across all services and tenants
- View system-level logs (infrastructure, deployments)
- Configure log retention policies
- Set up monitoring alerts
- Access sensitive data in logs (IPs, user details)

**Manufacturer View**:
- View logs related to their manufactured vehicles
- Filtered to show only relevant tenant logs
- Cannot see infrastructure or system logs
- Limited access to user details

**Golf Course Admin View**:
- View logs for their tenant only
- Focus on application-level logs (API, auth)
- Cannot see infrastructure logs
- Cannot see logs from other tenants

**Maintenance Staff / Viewer**:
- No access to Logs page (route protected)

---

#### Performance Optimizations
- Virtual scrolling for large log datasets (render only visible rows)
- Debounced search input (reduce re-renders)
- Lazy loading of log details (fetch on expand)
- WebSocket for real-time updates (efficient vs polling)
- Client-side log buffering (prevent overwhelming browser)

#### Real-Time Features
- WebSocket connection for live log streaming
- Auto-refresh for near real-time updates (if WebSocket unavailable)
- Visual indicator when new logs available (if paused)
- Browser notification for critical errors (if enabled)

#### Responsive Design
- Desktop: Three-column layout (filters, logs, details sidebar)
- Tablet: Two-column (logs and expandable details)
- Mobile: Single column, collapsible filters, full-screen details

#### Integration Points
- Logging service backend (e.g., ElasticSearch, Splunk, CloudWatch)
- Alerting system (PagerDuty, Slack, email)
- Error tracking (Sentry, Rollbar)
- Distributed tracing (Jaeger, Zipkin)

---

### 10. API Documentation Page
**Route**: `/api-docs`
**Access**: Super Admin, Manufacturer, Golf Course Admin

#### Purpose
Interactive API documentation portal providing comprehensive reference for APROFLEET BackOffice RESTful API. Enables developers to understand, test, and integrate with the platform's API.

#### Components

##### Page Header
- **Title**: "API Documentation"
- **Breadcrumb**: Dashboard > API Documentation
- **Version Indicator**: "API Version 1.0"
- **Base URL Display**: `https://api.aprofleet.com/v1`

##### Introduction Section
At top of page, before endpoint listings:

**Welcome Panel**:
- Brief description of the API
- Authentication overview
- Rate limiting information
- Support contact information

**Quick Start Guide**:
- Getting an API key
- Making your first request (code example)
- Handling responses
- Error codes overview

##### API Navigation Sidebar (Left)
Sticky sidebar with table of contents:

**Sections**:
1. **Introduction**
2. **Authentication**
3. **Endpoints**:
   - Vehicles
   - Reservations
   - Maintenance
   - Analytics
   - Tenants (admin only)
   - Users (admin only)
4. **Webhooks**
5. **Rate Limits**
6. **Errors**
7. **Changelog**

**Features**:
- Smooth scroll to section on click
- Active section highlighting
- Collapsible subsections
- Search within documentation

---

#### Authentication Section

**Authentication Methods**:

**1. API Key Authentication**:
- Header format: `X-API-Key: your_api_key_here`
- How to obtain API key (link to settings page)
- Key rotation best practices

**2. Bearer Token (OAuth 2.0)**:
- Header format: `Authorization: Bearer your_token_here`
- Token endpoint: `POST /api/v1/auth/token`
- Refresh token flow

**Example Request with Authentication**:
```bash
curl -X GET https://api.aprofleet.com/v1/vehicles \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json"
```

**Code Examples** (in multiple languages):
- JavaScript (fetch)
- Python (requests)
- cURL
- PHP
- Ruby

---

#### Endpoints Section

For each API endpoint, display a comprehensive card:

##### Endpoint Card Structure

**Endpoint Header Row**:
Horizontal layout containing:

1. **HTTP Method Badge**:
   - GET: Blue background
   - POST: Green background
   - PUT: Yellow background
   - PATCH: Orange background
   - DELETE: Red background
   - Uppercase text, white color

2. **Endpoint Path**:
   - Monospace font
   - Example: `/api/v1/vehicles/{vehicleId}`
   - Path parameters in curly braces highlighted

3. **Auth Badge**:
   - 🔒 AUTH icon/badge if authentication required
   - Public if no auth needed

4. **Rate Limit Badge**:
   - Example: "100 REQ/MIN"
   - Shows request limits
   - Aligned to right

5. **Expand/Collapse Icon**:
   - Arrow icon (▶ or ▼)
   - Indicates expandable state

**Endpoint Description**:
- Below header, brief text explaining what the endpoint does
- Use case example

**Expandable Endpoint Details**:
When expanded (click anywhere on header or arrow):

---

**1. Request Section**:

**Path Parameters** (if applicable):
Table showing:
- **Name**: Parameter name (e.g., `vehicleId`)
- **Type**: Data type (string, integer, etc.)
- **Required**: Yes/No
- **Description**: What the parameter represents

**Query Parameters** (if applicable):
Table showing:
- **Name**: Parameter name (e.g., `status`, `page`, `limit`)
- **Type**: Data type
- **Required**: Yes/No
- **Default**: Default value if not provided
- **Description**: Parameter purpose

Example:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| status | string | No | all | Filter by status: active, maintenance, offline |
| page | integer | No | 1 | Page number for pagination |
| limit | integer | No | 25 | Number of results per page |

**Request Headers**:
Table of required headers:
- Authorization
- Content-Type
- X-Tenant-ID (if multi-tenant)

**Request Body** (for POST/PUT/PATCH):
- JSON schema display
- Syntax-highlighted JSON example
- Field descriptions table:
  - **Field**: Field name
  - **Type**: Data type
  - **Required**: Yes/No
  - **Description**: Field purpose

**Example Request Body**:
```json
{
  "vehicleType": "GOLF_CART",
  "manufacturer": "Yamaha",
  "model": "Drive2 QuieTech EFI",
  "year": 2023,
  "vin": "ABC123XYZ456789",
  "batteryCapacity": 105,
  "status": "ACTIVE"
}
```

---

**2. Response Section**:

**Success Response** (Status 200, 201, etc.):
- HTTP status code badge (green)
- Response body schema
- Syntax-highlighted JSON example
- Field descriptions

**Example Success Response**:
```json
{
  "id": "veh-001",
  "vehicleType": "GOLF_CART",
  "manufacturer": "Yamaha",
  "model": "Drive2 QuieTech EFI",
  "status": "ACTIVE",
  "batteryLevel": 87,
  "location": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "createdAt": "2025-10-15T10:30:00Z",
  "updatedAt": "2025-10-23T08:45:00Z"
}
```

**Error Responses**:
Table or accordion of possible error codes:

| Status Code | Description | Example |
|-------------|-------------|---------|
| 400 Bad Request | Invalid request format or parameters | Missing required field |
| 401 Unauthorized | Authentication failed | Invalid API key |
| 403 Forbidden | Insufficient permissions | Role doesn't allow access |
| 404 Not Found | Resource not found | Vehicle ID doesn't exist |
| 429 Too Many Requests | Rate limit exceeded | Try again in 60 seconds |
| 500 Internal Server Error | Server error | Contact support |

**Example Error Response**:
```json
{
  "error": {
    "code": "VEHICLE_NOT_FOUND",
    "message": "Vehicle with ID veh-001 not found",
    "timestamp": "2025-10-23T12:00:00Z",
    "requestId": "req-abc123"
  }
}
```

---

**3. Try It Out Section** (Interactive):

**Interactive API Tester**:
- Input fields for all parameters
- Pre-filled examples (editable)
- **Send Request** button
- Real-time response display

**Fields**:
- Path parameter inputs
- Query parameter inputs
- Request body editor (JSON editor with syntax highlighting)
- Headers editor (if needed)

**Try It Out Example**:
```
Path Parameters:
┌─────────────────────────────────┐
│ vehicleId: [veh-001___________] │
└─────────────────────────────────┘

Query Parameters:
┌─────────────────────────────────┐
│ include: [location,battery____] │
└─────────────────────────────────┘

[Send Request]

Response (Status 200):
{
  "id": "veh-001",
  ...
}
```

---

**4. Code Examples Section**:

**Tabbed Code Samples** (for multiple languages):

Tabs: cURL | JavaScript | Python | PHP | Ruby

**cURL Example**:
```bash
curl -X GET "https://api.aprofleet.com/v1/vehicles/veh-001" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**JavaScript Example**:
```javascript
const response = await fetch('https://api.aprofleet.com/v1/vehicles/veh-001', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data);
```

**Python Example**:
```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.aprofleet.com/v1/vehicles/veh-001', headers=headers)
data = response.json()
print(data)
```

**Copy Code Button**: One-click copy to clipboard

---

#### API Endpoints List

**Vehicles Endpoints**:
- `GET /api/v1/vehicles` - List all vehicles
- `GET /api/v1/vehicles/{vehicleId}` - Get vehicle details
- `POST /api/v1/vehicles` - Create new vehicle
- `PUT /api/v1/vehicles/{vehicleId}` - Update vehicle
- `DELETE /api/v1/vehicles/{vehicleId}` - Delete vehicle
- `GET /api/v1/vehicles/{vehicleId}/location` - Get vehicle location
- `GET /api/v1/vehicles/{vehicleId}/battery` - Get battery status

**Reservations Endpoints**:
- `GET /api/v1/reservations` - List reservations
- `GET /api/v1/reservations/{reservationId}` - Get reservation details
- `POST /api/v1/reservations` - Create reservation
- `PUT /api/v1/reservations/{reservationId}` - Update reservation
- `DELETE /api/v1/reservations/{reservationId}` - Cancel reservation

**Maintenance Endpoints**:
- `GET /api/v1/maintenance` - List service requests
- `GET /api/v1/maintenance/{requestId}` - Get request details
- `POST /api/v1/maintenance` - Create service request
- `PUT /api/v1/maintenance/{requestId}` - Update request
- `POST /api/v1/maintenance/{requestId}/notes` - Add work note

**Analytics Endpoints**:
- `GET /api/v1/analytics/fleet-summary` - Fleet statistics
- `GET /api/v1/analytics/usage-trends` - Usage data
- `GET /api/v1/analytics/maintenance-costs` - Cost breakdown

**Tenants Endpoints** (Admin only):
- `GET /api/v1/tenants` - List tenants
- `GET /api/v1/tenants/{tenantId}` - Get tenant details
- `POST /api/v1/tenants` - Create tenant
- `PUT /api/v1/tenants/{tenantId}` - Update tenant

**Users Endpoints** (Admin only):
- `GET /api/v1/users` - List users
- `GET /api/v1/users/{userId}` - Get user details
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/{userId}` - Update user

---

#### Rate Limits Section

**Rate Limiting Information**:

**Limits by Plan**:
- **Basic**: 100 requests per minute
- **Professional**: 500 requests per minute
- **Enterprise**: 2000 requests per minute

**Rate Limit Headers**:
Returned in every response:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: Timestamp when limit resets

**Example**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1729692000
```

**Handling Rate Limits**:
- Best practices
- Retry logic recommendations
- Exponential backoff example code

---

#### Webhooks Section

**Webhook Configuration**:
- How to register webhook URLs
- Webhook events available:
  - `vehicle.status_changed`
  - `reservation.created`
  - `reservation.completed`
  - `maintenance.request_created`
  - `maintenance.request_completed`

**Webhook Payload Example**:
```json
{
  "event": "vehicle.status_changed",
  "timestamp": "2025-10-23T12:00:00Z",
  "data": {
    "vehicleId": "veh-001",
    "oldStatus": "ACTIVE",
    "newStatus": "MAINTENANCE",
    "reason": "Battery replacement"
  }
}
```

**Webhook Security**:
- Signature verification
- HMAC SHA256 example
- Replay attack prevention

---

#### Error Codes Reference

**Comprehensive Error Table**:

| Error Code | HTTP Status | Description | Resolution |
|------------|-------------|-------------|------------|
| INVALID_REQUEST | 400 | Malformed request body | Check request format |
| UNAUTHORIZED | 401 | Missing or invalid auth | Provide valid token |
| FORBIDDEN | 403 | Insufficient permissions | Check user role |
| NOT_FOUND | 404 | Resource doesn't exist | Verify resource ID |
| CONFLICT | 409 | Resource already exists | Use different identifier |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests | Wait and retry |
| INTERNAL_ERROR | 500 | Server error | Contact support |
| SERVICE_UNAVAILABLE | 503 | Temporary unavailability | Retry later |

**Error Response Format**:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "timestamp": "2025-10-23T12:00:00Z",
    "requestId": "req-abc123",
    "details": {
      "field": "Additional context"
    }
  }
}
```

---

#### Changelog Section

**Version History**:

**v1.0.0 - October 2025**:
- Initial API release
- All core endpoints implemented
- Authentication and rate limiting

**Future Versions** (placeholder):
- v1.1.0: Real-time GPS tracking endpoints
- v1.2.0: Advanced analytics endpoints
- v2.0.0: Major version with breaking changes

---

#### Global Features

**Search Functionality**:
- Search bar at top of sidebar
- Search across all endpoints, parameters, and descriptions
- Instant results highlighting
- Keyboard shortcut: Ctrl/Cmd + K

**Copy to Clipboard**:
- Copy button for all code examples
- Copy endpoint URLs
- Copy curl commands

**Dark Mode Toggle** (optional):
- Toggle for light/dark theme
- Improves readability for developers

**Export API Collection**:
- Download Postman collection
- Download OpenAPI/Swagger spec (JSON/YAML)
- Download Insomnia collection

---

#### Role-Based Content

**Super Admin View**:
- All endpoints visible
- Including tenant and user management endpoints
- System-level API documentation

**Manufacturer / Golf Course Admin View**:
- Standard endpoints (vehicles, reservations, maintenance, analytics)
- Limited admin endpoints
- Tenant-specific notes in documentation

---

#### Responsive Design
- Desktop: Three-column (sidebar, main content, code examples)
- Tablet: Two-column (collapsible sidebar, main content)
- Mobile: Single column, hamburger menu for navigation

#### Interactive Features
- Live API testing (try it out)
- Real-time validation of inputs
- Response time tracking
- Save example requests

---

### 11. Settings Page
**Route**: `/settings`
**Access**: All authenticated users

#### Purpose
User-specific configuration page allowing users to manage their profile, display preferences, notification settings, security options, and application settings.

#### Components

##### Page Header
- **Title**: "Settings"
- **Breadcrumb**: Dashboard > Settings
- **User Info**: Display current user name and role

##### Tab Navigation
Vertical sidebar tabs on left (desktop) or horizontal tabs on top (mobile):

**Tabs**:
1. **Profile** (default)
2. **Display Preferences**
3. **Notifications**
4. **Security**
5. **Account** (admin roles only)

---

#### Tab 1: Profile

##### Profile Photo Section
- **Current Photo**: Display user avatar (circular)
  - Shows uploaded photo or generated initials
- **Upload Photo Button**: Opens file picker
  - Accepted formats: JPG, PNG, GIF
  - Max size: 5MB
  - Crop/resize tool after upload
- **Remove Photo Button**: Delete custom photo, revert to initials

##### Personal Information Section

**Form Fields** (all editable):

1. **Full Name** (required)
   - Text input
   - Validation: Min 2 characters

2. **Email Address** (required)
   - Email input
   - Validation: Valid email format
   - Note: "Changing email requires verification"

3. **Phone Number** (optional)
   - Phone input with country code selector
   - Validation: Valid phone format

4. **Job Title** (optional)
   - Text input
   - Example: "Fleet Manager", "Maintenance Supervisor"

5. **Department** (optional)
   - Text input or dropdown (if predefined)

6. **Bio** (optional)
   - Textarea: Brief description
   - Max 500 characters
   - Character counter

**Account Information** (read-only):
- **User ID**: Display only, not editable
- **Role**: Display with badge, not editable (admins can change via Users page)
- **Tenant**: Display tenant name (if applicable)
- **Account Created**: Date of registration
- **Last Login**: Last successful login timestamp

**Action Buttons**:
- **Save Changes** button (primary, enabled when form dirty)
- **Cancel** button (revert changes)

**Success/Error Messages**:
- "Profile updated successfully" (green banner)
- "Email verification sent to new address" (blue banner)
- Error messages for validation failures (red text under field)

---

#### Tab 2: Display Preferences

##### Theme Section

**Theme Selection**:
- Radio buttons or dropdown:
  - **Light**: Light background, dark text (default)
  - **Dark**: Dark background, light text
  - **Auto**: Follow system preferences
- Visual preview of each theme (optional)
- Apply immediately on selection (or save button)

##### Language Section

**Language Preference**:
- Dropdown selector:
  - English
  - Korean (한국어)
  - Japanese (日本語) (future)
  - Spanish (Español) (future)
- Note: "Page will reload to apply language change"

##### Timezone Section

**Timezone Selection**:
- Searchable dropdown with timezone list
- Examples:
  - (UTC-05:00) Eastern Time (US & Canada)
  - (UTC+09:00) Seoul
  - (UTC+00:00) UTC
- Current time display in selected timezone

##### Date & Time Format Section

**Date Format**:
- Dropdown:
  - MM/DD/YYYY (10/23/2025)
  - DD/MM/YYYY (23/10/2025)
  - YYYY-MM-DD (2025-10-23)
- Preview: "Today is [formatted date]"

**Time Format**:
- Radio buttons:
  - 12-hour (3:30 PM)
  - 24-hour (15:30)
- Preview: "Current time is [formatted time]"

##### Display Density Section

**Content Density**:
- Radio buttons or slider:
  - **Comfortable**: More spacing, larger elements
  - **Compact**: Less spacing, more content per screen
- Affects table row height, card padding, etc.

##### Data Display Section

**Units of Measurement**:
- Distance:
  - Miles
  - Kilometers
- Temperature (if applicable):
  - Fahrenheit
  - Celsius

**Number Format**:
- Thousand separator:
  - Comma: 1,000
  - Space: 1 000
  - Period: 1.000
- Decimal separator:
  - Period: 1.50
  - Comma: 1,50

**Action Buttons**:
- **Save Preferences** button
- **Reset to Defaults** button

---

#### Tab 3: Notifications

##### Email Notifications Section

**Enable Email Notifications**:
- Master toggle: On/Off
- When off, all email notifications disabled

**Notification Types** (checkboxes, enabled only if master toggle on):
- **Vehicle Alerts**:
  - Low battery warnings
  - Vehicle offline
  - Maintenance due
- **Reservations**:
  - New reservation created
  - Reservation cancelled
  - Upcoming reservation reminders (X hours before)
- **Maintenance**:
  - New service request assigned (maintenance staff)
  - Service request status changes
  - Scheduled maintenance reminders
- **System**:
  - Account security alerts
  - System updates and announcements
  - Weekly summary reports

**Email Frequency**:
- Radio buttons:
  - **Immediate**: Send as events occur (default)
  - **Daily Digest**: One email per day with summary
  - **Weekly Digest**: One email per week

##### SMS Notifications Section (if enabled)

**Enable SMS Notifications**:
- Master toggle: On/Off
- Phone number display (from profile)
- Note: "Standard messaging rates may apply"

**SMS Notification Types** (checkboxes):
- Critical vehicle alerts only
- High-priority maintenance requests
- Security alerts (password changes, new login)

##### Push Notifications Section (if PWA enabled)

**Enable Push Notifications**:
- Master toggle: On/Off
- Browser permission request button (if not granted)

**Push Notification Types**:
- Similar to email notifications
- Real-time alerts in browser

##### Notification Preferences

**Quiet Hours** (optional):
- Do not send notifications during specific hours
- Time range selectors: From [9:00 PM] to [7:00 AM]
- Days of week checkboxes (apply quiet hours only on selected days)

**Notification Sounds**:
- Enable/disable notification sounds
- Volume slider

**Action Buttons**:
- **Save Notification Settings** button
- **Test Notification** button (sends test email/SMS/push)

---

#### Tab 4: Security

##### Password Management Section

**Change Password**:
- **Current Password** input (required)
  - Password field with show/hide toggle
- **New Password** input (required)
  - Password field
  - Password strength meter (weak/fair/good/strong)
  - Requirements checklist:
    - ✓ At least 8 characters
    - ✓ Contains uppercase letter
    - ✓ Contains lowercase letter
    - ✓ Contains number
    - ✓ Contains special character
- **Confirm New Password** input (required)
  - Password field
  - Match validation

- **Change Password** button
- Success message: "Password changed successfully. You may need to log in again."

##### Two-Factor Authentication (2FA) Section

**Status**:
- Display current 2FA status:
  - Enabled (green badge with checkmark)
  - Disabled (gray badge)

**Enable 2FA** (if disabled):
- **Setup 2FA** button
- Opens modal with steps:
  1. Download authenticator app (Google Authenticator, Authy, etc.)
  2. Scan QR code
  3. Enter verification code from app
  4. Save backup codes

**Disable 2FA** (if enabled):
- **Disable 2FA** button
- Confirmation dialog: "Are you sure? This will reduce your account security."
- Requires password confirmation

**Backup Codes**:
- Display list of backup codes (if 2FA enabled)
- Used if authenticator unavailable
- **Regenerate Codes** button
- **Download Codes** button (save as text file)

##### Session Management Section

**Active Sessions**:
- Table of current login sessions:
  - **Device/Browser**: User agent info
  - **IP Address**: Source IP
  - **Location**: City, Country (based on IP, if available)
  - **Last Activity**: Timestamp
  - **Current Session**: Badge indicating this session
  - **Actions**: "Log Out" button for other sessions

- **Log Out All Other Sessions** button
  - Confirmation: "This will log you out from all devices except this one."

**Session Timeout**:
- Dropdown: Select automatic logout time
  - 30 minutes
  - 1 hour
  - 4 hours
  - 8 hours
  - 24 hours
  - Never (not recommended)

##### API Keys Section (Admin roles only)

**API Key Management**:
- Display current API key (masked):
  - Example: `apro_••••••••••••••1234`
- **Show API Key** button (reveals full key temporarily)
- **Copy API Key** button
- **Regenerate API Key** button
  - Warning: "Old key will stop working immediately. Update your integrations."
  - Confirmation dialog

- **API Key Created**: Date of key generation
- **Last Used**: Timestamp of last API call

**Action Buttons**:
- **Save Security Settings** button

---

#### Tab 5: Account (Admin Roles Only)

##### Account Information Section (read-only)

**Account Details**:
- **Account Type**: Role-based (Super Admin, Golf Course Admin, etc.)
- **Tenant**: Associated tenant (if applicable)
- **Account Status**: Active, Suspended, etc.
- **Member Since**: Registration date
- **Subscription Tier**: If user's tenant has subscription info

##### Danger Zone Section

**Deactivate Account**:
- **Deactivate My Account** button (red)
- Warning: "Deactivating your account will:"
  - Log you out immediately
  - Prevent future logins
  - Retain your data for 30 days
  - Require admin to reactivate
- Confirmation modal:
  - "Are you absolutely sure?"
  - Text input: "Type 'DEACTIVATE' to confirm"
  - **Confirm Deactivation** button

**Delete Account** (if self-service deletion enabled):
- **Delete My Account** button (red, more prominent)
- Warning: "Deleting your account will:"
  - Permanently delete all your data
  - Cannot be undone
  - Invalidate all sessions
- Confirmation modal:
  - Strong warning
  - Text input: "Type 'DELETE' to confirm"
  - Password confirmation
  - **Permanently Delete Account** button

---

#### Global Settings Features

##### Form Validation
- Real-time validation on all inputs
- Clear error messages under fields
- Disable save button until validation passes
- Visual indicators (red border for errors, green for valid)

##### Unsaved Changes Warning
- Detect when form is modified (dirty state)
- Show warning banner: "You have unsaved changes"
- Confirm navigation away: "Leave without saving?" modal

##### Auto-Save (optional)
- Auto-save drafts every 30 seconds
- Indicator: "Saving..." → "Saved"

##### Reset to Defaults
- Button to reset all settings to platform defaults
- Confirmation: "This will reset all your preferences. Continue?"

---

#### Role-Based Features

**All Users**:
- Access Profile, Display Preferences, Notifications, Security tabs
- Basic settings and preferences

**Admin Roles** (Super Admin, Golf Course Admin):
- Additional Account tab
- API key management in Security
- More notification options (system-level alerts)

**Maintenance Staff / Viewer**:
- Simplified settings (fewer notification options)
- No API key management
- No account danger zone

---

#### Responsive Design
- Desktop: Sidebar tabs on left, content on right
- Tablet: Tabs on top, full-width content
- Mobile: Stacked layout, accordion-style sections

#### Real-Time Features
- Live password strength meter
- Instant theme switching preview
- Real-time session activity updates

#### Accessibility
- Keyboard navigation through form fields
- ARIA labels for screen readers
- Focus indicators
- High contrast mode support

---

## Summary

This comprehensive guide covers all 11 pages of the APROFLEET BackOffice application, detailing:

- **5 User Roles**: Super Admin, Manufacturer, Golf Course Admin, Maintenance Staff, Viewer
- **11 Pages**: Login, Dashboard, Vehicles, Reservations, Maintenance, Analytics, Tenants, Users, Logs, API Docs, Settings
- **100+ UI Components**: Cards, tables, modals, forms, charts, filters, etc.
- **Role-Based Access Control**: Granular permissions per role and page
- **Responsive Design**: Desktop, tablet, and mobile layouts
- **Real-Time Features**: WebSocket updates, live streaming, instant notifications
- **Comprehensive Functionality**: Full CRUD operations, advanced filtering, bulk actions, data export

Each page is designed with:
- Clear information hierarchy
- Intuitive navigation and workflows
- Consistent design language (black and white minimalist)
- Performance optimizations for large datasets
- Accessibility considerations
- Security best practices

The application provides a complete solution for fleet management, from vehicle tracking and maintenance to reservations, analytics, and multi-tenant administration.
