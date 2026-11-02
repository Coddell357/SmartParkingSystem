// This default .ino file will contain logic to control the LCD Display which will display the nujmber of available parkings based off the readings it retrieves from Firebase
// This code will be flashed onto the DevKitV1 ESP32
// It tracks a 350 parking spots where 348 of them are mock spots are permanently occupied
// Realtime parking spot availability depends on the 2 live sensor bays polled from Firebase

#include <Arduino.h>
#include <WiFi.h> // (Espressif Systems, 2023)
#include "esp_eap_client.h" // WPA2 Enterprise Library
#include <Firebase_ESP_Client.h> // (Mobizt, 2023)
#include <LiquidCrystal.h> // (Arduino, 2023b)
#include <time.h>

// Helper headers needed for Firebase token generation (Mobizt, 2023)
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// Wifi Credentials (campus wifi)
#define WIFI_SSID "Edu-WiFi"
#define EAP_IDENTITY "st10435542@myemeris.edu.za"
#define EAP_PASSWORD "Happydays@22"

// our Firebase Credentials
#define API_KEY "AIzaSyDbL55frdOhcMZPmW3HiUFhBb7AWbj6Nwg"
#define DATABASE_URL "https://wil-smartparking-default-rtdb.firebaseio.com"

// Initialize the LCD pins (RS, E, D4, D5, D6, D7) (Arduino, 2023b)
LiquidCrystal lcd(22, 23, 5, 18, 19, 21);

// Firebase Core Objects (Mobizt, 2023)
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Our parking lot configurations
const int TOTAL_SPOTS = 350;
const int MOCK_OCCUPIED_SPOTS = 348;
unsigned long lastDatabasePoll = 0;

// Syncs ESP32 clock with NTP to prevent Firebase SSL rejections (taken from Parking Sensor Node code)
void syncClock() {
  configTime(2 * 3600, 0, "pool.ntp.org", "time.nist.gov");
  Serial.print("Waiting for NTP time sync: ");
  time_t now = time(nullptr);
  int retry = 0;

  while (now < 1700000000 && retry < 30) {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
    retry++;
  }

  if (now >= 1700000000) 
  {
    Serial.println("\nTime synchronized successfully.");
  } 
  else 
  {
    Serial.println("\nWARNING: NTP time synchronization failed.");
  }
}

void setup() {
  Serial.begin(115200);

  // LCD Contrast PWM Setup (Universal ESP32 Core compatibility) (Arduino, 2023d)
  pinMode(13, OUTPUT);
  #if defined(ESP_ARDUINO_VERSION_MAJOR) && ESP_ARDUINO_VERSION_MAJOR >= 3
    ledcAttach(13, 1000, 8); // 1 kHz frequency, 8-bit resolution
    ledcWrite(13, 120);
  #else
    ledcSetup(0, 1000, 8); // Channel 0, 1 kHz, 8-bit
    ledcAttachPin(13, 0);
    ledcWrite(0, 120);
  #endif
  
  // RW pin grounded for Write mode (Arduino, 2023a)
  pinMode(4, OUTPUT);
  digitalWrite(4, LOW); 

  // Initializes the screen
  lcd.begin(16, 2);
  lcd.setCursor(0, 0);
  lcd.print("SMART PARKING");
  lcd.setCursor(0, 1);
  lcd.print("Connecting Wifi");

  // Wifi section
  // Connect to Wifi (Espressif Systems, 2023)
  WiFi.mode(WIFI_STA);

  // Feeds the credentials to the ESP32 authentication client
  esp_eap_client_set_identity((uint8_t *)EAP_IDENTITY, strlen(EAP_IDENTITY));
  esp_eap_client_set_username((uint8_t *)EAP_IDENTITY, strlen(EAP_IDENTITY));
  esp_eap_client_set_password((uint8_t *)EAP_PASSWORD, strlen(EAP_PASSWORD));
  esp_wifi_sta_enterprise_enable();

  WiFi.begin(WIFI_SSID);

  Serial.print("\nConnecting to Campus Wifi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  
  Serial.println("\nCampus Wifi Connected.");
  lcd.setCursor(0, 1);
  lcd.print("Wifi Connected! ");

  syncClock();

  // Firebase section
  // Initializes Firebase (Mobizt, 2023)
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase Auth Successful.");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Firebase Ready");
  } else {
    Serial.printf("Firebase Auth Error: %s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;
  fbdo.setResponseSize(1024);
  fbdo.setBSSLBufferSize(4096, 1024);
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  
  delay(1500); 
  lcd.clear();
}

// Created this function to handle the UI display on the LCD (Arduino, 2023b)
void updateDisplay(int totalOccupied) {
  lcd.setCursor(0, 0);
  lcd.print("Spots Available:");
  
  lcd.setCursor(0, 1);
  if (totalOccupied <= TOTAL_SPOTS) 
  {
     lcd.print("LOT FULL!       ");
  } 
  else 
  {
     lcd.print(totalOccupied);
     lcd.print(" / ");
     lcd.print(TOTAL_SPOTS);
     lcd.print("        "); 
  }
}

void loop() {
  // Non-blocking timer to poll Firebase every 2 seconds (Arduino, 2023c)
  if (millis() - lastDatabasePoll > 2000) 
  {
    lastDatabasePoll = millis();
    
    if (Firebase.ready()) 
    {
      int liveAvailable = 0;

      // Checks Bay 1's Status (Mobizt, 2023)
      if (Firebase.RTDB.getString(&fbdo, "/ParkingLots/Lot_A/nodes/Node_01/bays/Bay1/status")) 
      {
        if (fbdo.stringData() == "Occupied") 
        {
          liveOccupied++;
        }
      }

      // Checks Bay 2's Status (Mobizt, 2023)
      if (Firebase.RTDB.getString(&fbdo, "/ParkingLots/Lot_A/nodes/Node_01/bays/Bay2/status")) 
      {
        if (fbdo.stringData() == "Occupied") 
        {
          liveOccupied++;
        }
      }

      // Total Occupied = Total mock spots (248) + live occupied
      int totalOccupied = MOCK_OCCUPIED_SPOTS + liveOccupied;
      
      Serial.printf("Live Occupied: %d/2 | Total Lot Occupancy: %d/%d\n", liveOccupied, totalOccupied, TOTAL_SPOTS);
      updateDisplay(totalAvailable);
    }
  }

}

/* REFERENCES:

 * Arduino, 2023a. digitalWrite() (Version 2.0) [Source Code] Available at: < https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/ > [Accessed 29 September 2026]
 * Arduino, 2023b. LiquidCrystal() (Version 1.0.7) [Source Code] Available at: < https://www.arduino.cc/reference/en/libraries/liquidcrystal/ > [Accessed 29 September 2026]
 * Arduino, 2023c. millis() (Version 2.0) [Source Code] Available at: < https://www.arduino.cc/reference/en/language/functions/time/millis/ > [Accessed 29 September 2026]
 * Arduino, 2023c. pinMode() (Version 2.0) [Source Code] Available at: < https://www.arduino.cc/reference/en/language/functions/digital-io/pinmode/ > [Accessed 29 September 2026]
 * Espressif Systems, 2023. WiFi Station Example (Version 3.0) [Source Code] Available at: < https://github.com/espressif/arduino-esp32/tree/master/libraries/WiFi > [Accessed 29 September 2026]
 * Mobizt, 2023. Firebase Arduino Client Library for ESP8266 and ESP32 (Version 4.4.14) [Source Code] Available at: < https://github.com/mobizt/Firebase-ESP-Client > [Accessed 29 September 2026]

*/
