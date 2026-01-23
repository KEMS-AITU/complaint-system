


# Complaint System

## Local Setup

### Windows (PowerShell)

1.  **Open PowerShell** in the project root, e.g.:
    
    ```
    C:\Users\user\Desktop\complaint_system
    
    ```
    
2.  **Activate the virtual environment**:
    
    ```powershell
    .\venv\Scripts\Activate.ps1
    
    ```
    
    -   If you see an execution policy error, run once:
        
        ```powershell
        Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
        
        ```
        
3.  **Install dependencies**:
    
    ```powershell
    python -m pip install --upgrade pip
    pip install django djangorestframework django-cors-headers
    
    ```
    
    -   If you have a `requirements.txt`, you can instead run:
        
        ```powershell
        pip install -r requirements.txt
        
        ```
        
4.  **Apply database migrations**:
    
    ```powershell
    python manage.py migrate
    
    ```
    
5.  **Run the development server**:
    
    ```powershell
    python manage.py runserver
    
    ```
    
6.  **Open the app in your browser**:
    
    ```
    http://127.0.0.1:8000/
    
    ```
    

----------

### Linux / macOS

1.  **Open a terminal** in the project root:
    
    ```bash
    cd /path/to/complaint-system-be
    
    ```
    
2.  **Run the development startup script**:
    
    ```bash
    ./dev.sh
    
    ```
    
    -   If you get a permission error:
        
        ```bash
        chmod +x dev.sh
        ./dev.sh
        
        ```
        
3.  **Open the app in your browser**:
    
    ```
    http://127.0.0.1:8000/
    
    ```
    

----------

### Notes

-   The project uses **SQLite** as the database (`db.sqlite3`).
    
-   The custom user model is `feedback.User` (see `complaint_system/settings.py`).
    
-   The `dev.sh` script automatically:
    
    -   Creates a virtual environment if it doesn’t exist
        
    -   Installs dependencies
        
    -   Applies migrations
        
    -   Starts the development server


