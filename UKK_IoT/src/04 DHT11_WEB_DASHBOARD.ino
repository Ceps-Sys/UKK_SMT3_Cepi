#include "config.h"
#include "dht_sensor.h"
#include "oled_display.h"
#include "wifi_manager.h"
#include "async_server.h"

float currentTemp = 0.0;
float currentHum = 0.0;
unsigned long bootMillis = 0;
static unsigned long lastSensormillis = 0;

void setup() {
    Serial.begin(SERIAL_BAUD);
    delay(1000);
    bootMillis = millis();
    
    Serial.println();
    Serial.println("========================================");
    Serial.println("    Proyek 4 DHT 11 dengan layar TFT    ");
    Serial.println("========================================");

    initDisplay()
    showConnectingWiFi(WIFI_SSID);

    initDHT();

    initLittleFS();

    bool connected = connectToWifi();

    if (connented) {
        initAsyncWebServer();
    }

    readDHT(currentTemp, currentHum);
    drawDashbordOled(currentTemp, currentHum, connected, localIPAddress);
}

void loop() {
    unsigned long now = millis();

    if (now - lastSensorMillis >= SENSOR_READ_INTERVAL) {
        lastSensorMillis = now;

        if (readDHT(currentTemp, currentHum)) {
            Serial.print("[ASYNC NODE] suhu: ");
            Serial.print(currentTemp, 1);
            Serial.print("[ASYNC NODE] Hum: ");
            Serial.print(currentHum, 1);
            Serial.print("%");

            drawDashboardOled(currentTemp, currentHum, wifiConnected, localIPAddress);
            
        }
    }
}