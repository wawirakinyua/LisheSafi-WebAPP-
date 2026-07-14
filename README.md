# LisheSafi-WebAPP-
# LisheSafi 🇰🇪
### APT3065: Web Application Development — Midterm Project
**United States International University-Africa (USIU-Africa)**

**Group Members:**
* Wawira Kinyua 
* Glory Nkatha 

##  Project Overview
LisheSafi is a client-side, privacy-by-design web utility built to help Kenyan users track their nutrition and fitness goals.

Traditional fitness apps require you to upload your personal biometrics, weight, and daily habits directly to central servers in plaintext, creating massive privacy risks. To solve this and to align with the **Kenya Data Protection Act, 2019**, LisheSafi uses a **Zero-Knowledge Architecture**:
1. **Local Edge Computing:** All calculations (calories, macros) and cleartext data handling happen strictly inside your browser.
2. **Blind Cloud Storage:** Our remote MongoDB database only receives and stores unreadable, encrypted Base64 strings. We, as the developers, have absolutely zero way of reading your logged diet data.
3. **Hyper-Localized Nutrition:** We embedded a custom food dictionary sourced directly from the official **Kenya Food Composition Tables (FAO & Ministry of Health)**. You can calculate nutrition metrics for local staples like *Ugali, Sukuma Wiki, Managu, Terere,* and *Omena* instantly, offline, and without sending lookup queries over the network.


## 🛠️ System Architecture

Our design partitions the system into three simple layers:
+-------------------------------------------------+
              |         CLIENT-SIDE BROWSER ENCLAVE (Edge)      |
              |                                                 |
              |   [ ReactJS UI ] <---> [ Web Crypto API ]       |
              |    Render screens       PBKDF2 Key Derivation   |
              |    & Local FAO Dict     Symmetric AES-256-GCM   |
              |          ^                      ^               |
              +----------|----------------------|---------------+
                         |                      |
                         v                      v
              +-------------------------------------------------+
              |      SECURE CLIENT STORAGE (IndexedDB)          |
              |   - Non-extractable CryptoKeys (Access Locked)  |
              +-------------------------------------------------+
                                        |
                              HTTPS/TLS Ciphertext
                                        v
              +-------------------------------------------------+
              |         BLIND CLOUD STORAGE (MongoDB Atlas)      |
              |   - Stores opaque, encrypted Base64 strings     |
              |   - No decryption logic on the server           |
              +-------------------------------------------------+


### Key Technical Choices & Trade-offs
* **Why Web Crypto API?** Standard web apps encrypt data on the server. We use the browser's native `SubtleCrypto` interface to encrypt data *before* it leaves your computer.
* **Why Embedded JSON instead of an API?** Querying external nutrition APIs tracks what you eat. Embedding the FAO dataset locally inside the frontend bundle makes searches instantaneous, works offline, and keeps your eating habits completely private.
* **No-Budget Architecture:** By offloading all calculations and encryption tasks to the user's browser, our backend hosting footprint is incredibly small. We run entirely on free-tier services (MongoDB Atlas Shared Cluster and static frontend hosting), keeping initial development and maintenance costs at **KES 0.00**.

---

##  Database Schemas (MongoDB Atlas)

Our database is structured specifically to decouple user identities from actual fitness logs. The collections in our cluster are organized as follows:

### 1. vault_users
Acts as the secure directory. It maps blinded credentials to a verification salt.
* `_id`: Cryptographically derived unique hash.
* `client_auth_verification_salt`: Random cryptographic salt passed back to the client browser to derive key instances.
* `tracking_index_created_epoch`: UNIX timestamp.

### 2. encrypted_health_data
Holds the user's actual fitness records, fully locked and encrypted on-device.
* `_id`: Randomly generated unique payload ID.
* `user_crypt_hash`: Linked reference matching the hashed user ID.
* `encrypted_ciphertext_blob`: AES-256-GCM base64 encrypted string (e.g., `"GCM_Ciphertext_Block_Base64..."`).
* `authentication_tag_hash`: Ensures the encrypted data block hasn't been modified.
* `crypto_initialization_vector`: The required 12-byte initialization vector (IV) used during GCM encryption.

### 3. local_nutrition_ref
Our local dictionary embedded on the client-side to track Kenyan foods.
* `food_swahili_market_label`: (e.g., `"managu"`).
* `food_english_scientific_name`: (e.g., `"African Nightshade"`).
* `protein_grams_base_100g`: Protein content.
* `carbohydrate_grams_base_100g`: Carbohydrate content.
* `lipids_fats_grams_base_100g`: Fat content.
* `caloric_baseline_value_kcal`: Total energy value.


##  Running the Project Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_GITHUB_USERNAME/LishaSafi-Web-App.git](https://github.com/YOUR_GITHUB_USERNAME/LishaSafi-Web-App.git)
   cd LishaSafi-Web-App
2. **Install Dependencies**
  ```bash
npm install
```
3.Start the local development server:
   ```bash
   npm run dev
```
4. Build the application for production deployment:
     ```bash
   npm run build
    ```

 Project Team & Roles
 Wawira Kinyua — Frontend Development & Core Cryptographic Client Implementation  
 Glory Nkatha — Database Modeling, Setup, & Secure Sync API Integration  
