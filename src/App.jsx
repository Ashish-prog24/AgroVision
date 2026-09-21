import React, { useState, useEffect } from "react";
import { FileText, Sliders, Beaker, Sprout, Bug, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import Header from "./components/Header";
import VoiceAssistant from "./components/VoiceAssistant";
import SoilUploader from "./components/SoilUploader";
import FarmSetupStep from "./components/FarmSetupStep";
import FertilizerAdvisory from "./components/FertilizerAdvisory";
import CropRecommender from "./components/CropRecommender";
import PestDiseaseDetector from "./components/PestDiseaseDetector";
import SoilHealthCardModal from "./components/SoilHealthCardModal";
import LocationModal from "./components/LocationModal";

import { SAMPLE_SOIL_REPORTS } from "./data/sampleReports";
import { CROPS_DATABASE } from "./data/cropsData";
import { TRANSLATIONS } from "./data/translations";
import { calculateFertilizerPrescription } from "./services/agronomyEngine";
import { convertLandArea } from "./services/areaConverter";
import { SpeechService } from "./services/speechService";
import { fetchAgroWeather, detectPresentLocation, getSavedLocation, saveLocation } from "./services/weatherService";

export default function App() {
  // Main State
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [currentStep, setCurrentStep] = useState(1); // 1: Soil Upload, 2: Farm/Crop/Area/Weather Setup, 3: Fertilizer Advisory, 4: Crop Recommender, 5: Pest Vision
  const [showVoiceWidget, setShowVoiceWidget] = useState(true);
  const [showSoilCardModal, setShowSoilCardModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Soil Report Data
  const defaultReport = SAMPLE_SOIL_REPORTS[0];
  const [selectedReportId, setSelectedReportId] = useState(defaultReport.id);
  const [soilParams, setSoilParams] = useState(defaultReport.parameters);
  const [soilType, setSoilType] = useState(defaultReport.soilType);

  // Farm Setup State & Saved Location
  const savedLoc = getSavedLocation();
  const [selectedCropId, setSelectedCropId] = useState("rice");
  const [areaValue, setAreaValue] = useState(3.0);
  const [areaUnitId, setAreaUnitId] = useState("acres"); // acres, hectares, sqft, bigha, guntha
  const [locationQuery, setLocationQuery] = useState(savedLoc ? savedLoc.name : "Locating your farm...");
  const [weatherData, setWeatherData] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationMethod, setLocationMethod] = useState(savedLoc ? (savedLoc.method || "SAVED") : null);

  // Translations & Prescriptions
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentCrop = CROPS_DATABASE.find((c) => c.id === selectedCropId) || CROPS_DATABASE[0];
  const areaConversion = convertLandArea(areaValue, areaUnitId);
  const fertilizerPrescription = calculateFertilizerPrescription(soilParams, currentCrop, areaConversion.acres, soilType);

  // Update theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Speech sync
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(SpeechService.isSpeaking());
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Update location handler when chosen via modal or detected
  const handleSelectLocation = (res) => {
    if (res && res.weather) {
      setWeatherData(res.weather);
      setLocationQuery(res.locationName || res.weather.name);
      setLocationMethod(res.method || "MANUAL");
      // Automatically adapt regional soil texture if report is default or custom
      if (res.weather.soilAffinity && (selectedReportId === "odisha_bargarh" || selectedReportId === "custom_upload")) {
        setSoilType(res.weather.soilAffinity);
      }
    }
  };

  // Auto-detect user's present location & live weather on startup
  const handleAutoDetectLocation = async (forceFresh = false) => {
    setIsLocating(true);
    try {
      const res = await detectPresentLocation(forceFresh);
      if (res && res.weather) {
        handleSelectLocation(res);
      }
    } catch (e) {
      console.warn("Auto-detect location error:", e);
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    handleAutoDetectLocation();
  }, []);

  const handleStopVoice = () => {
    SpeechService.stop();
    setIsSpeaking(false);
  };

  return (
    <div className="app-container">
      {/* 1. Header Bar */}
      <Header
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        t={t}
        onOpenSoilCard={() => setShowSoilCardModal(true)}
        onToggleVoiceWidget={() => setShowVoiceWidget((prev) => !prev)}
        isSpeaking={isSpeaking}
        onStopVoice={handleStopVoice}
        weatherData={weatherData}
        onDetectLocation={() => handleAutoDetectLocation(true)}
        isLocating={isLocating}
        locationMethod={locationMethod}
        onOpenLocationModal={() => setShowLocationModal(true)}
      />

      {/* 2. Voice Assistant Widget */}
      {showVoiceWidget && (
        <VoiceAssistant
          language={language}
          t={t}
          soilParams={soilParams}
          selectedCrop={currentCrop}
          farmAreaAcre={areaConversion.acres}
          fertilizerPrescription={fertilizerPrescription}
          onClose={() => setShowVoiceWidget(false)}
        />
      )}

      {/* 3. Streamlined Step Progress & Module Nav Bar */}
      <div className="glass-panel main-step-nav-bar">
        <div className="nav-bar-inner">
          {/* Main 3-Step Guided Journey */}
          <div className="nav-journey-steps">
            <button
              className={`nav-tab-btn ${currentStep === 1 ? "active" : ""}`}
              onClick={() => setCurrentStep(1)}
            >
              <span className="step-num-badge">1</span>
              <span className="step-label-full">1. Upload Soil Report</span>
              <span className="step-label-short">1. Soil Report</span>
            </button>

            <span className="step-arrow-divider">➔</span>

            <button
              className={`nav-tab-btn ${currentStep === 2 ? "active" : ""}`}
              onClick={() => setCurrentStep(2)}
            >
              <span className="step-num-badge">2</span>
              <span className="step-label-full">2. Crop, Area & Weather</span>
              <span className="step-label-short">2. Farm & Crop</span>
            </button>

            <span className="step-arrow-divider">➔</span>

            <button
              className={`nav-tab-btn ${currentStep === 3 ? "active" : ""}`}
              onClick={() => setCurrentStep(3)}
            >
              <span className="step-num-badge">3</span>
              <span className="step-label-full">3. Fertilizer Advisory</span>
              <span className="step-label-short">3. Fertilizer Rx</span>
            </button>
          </div>

          {/* Quick-Access Dedicated Modules */}
          <div className="nav-extra-modules">
            <button
              className={`nav-tab-btn ${currentStep === 4 ? "active" : ""}`}
              onClick={() => setCurrentStep(4)}
              title="Crop Suitability & Profitability Matrix"
            >
              <Sprout size={16} />
              <span>Crops</span>
            </button>

            <button
              className={`nav-tab-btn ${currentStep === 5 ? "active" : ""}`}
              onClick={() => setCurrentStep(5)}
              title="CNN Plant Disease Diagnostic"
            >
              <Bug size={16} />
              <span>Pest Vision</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Active Main Content */}
      <main style={{ minHeight: "60vh" }}>
        {/* Step 1: Upload Soil Report (Default First Page) */}
        {currentStep === 1 && (
          <SoilUploader
            soilParams={soilParams}
            setSoilParams={setSoilParams}
            selectedReportId={selectedReportId}
            setSelectedReportId={setSelectedReportId}
            selectedCropId={selectedCropId}
            setSelectedCropId={setSelectedCropId}
            soilType={soilType}
            setSoilType={setSoilType}
            onProceedToFarmSetup={() => setCurrentStep(2)}
            weatherData={weatherData}
            locationQuery={locationQuery}
            isLocating={isLocating}
            locationMethod={locationMethod}
            onDetectLocation={() => handleAutoDetectLocation(true)}
            onOpenLocationModal={() => setShowLocationModal(true)}
            t={t}
          />
        )}

        {/* Step 2: Farm, Crop, Multi-Unit Area & Location Setup */}
        {currentStep === 2 && (
          <FarmSetupStep
            selectedCropId={selectedCropId}
            setSelectedCropId={setSelectedCropId}
            areaValue={areaValue}
            setAreaValue={setAreaValue}
            areaUnitId={areaUnitId}
            setAreaUnitId={setAreaUnitId}
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
            weatherData={weatherData}
            setWeatherData={setWeatherData}
            onProceedToAdvisory={() => setCurrentStep(3)}
            onBackToSoilUpload={() => setCurrentStep(1)}
            onOpenLocationModal={() => setShowLocationModal(true)}
            t={t}
          />
        )}

        {/* Step 3: Precision Fertilizer & Weather-Adjusted Advisory */}
        {currentStep === 3 && (
          <FertilizerAdvisory
            soilParams={soilParams}
            selectedCropId={selectedCropId}
            areaValue={areaValue}
            areaUnitId={areaUnitId}
            soilType={soilType}
            locationQuery={locationQuery}
            weatherData={weatherData}
            language={language}
            onBackToFarmSetup={() => setCurrentStep(2)}
            t={t}
          />
        )}

        {/* Step 4: AI Crop Recommender & Financial ROI */}
        {currentStep === 4 && (
          <CropRecommender
            soilParams={soilParams}
            soilType={soilType}
            farmAreaAcre={areaConversion.acres}
            onSelectTargetCrop={(cropId) => {
              setSelectedCropId(cropId);
              setCurrentStep(3); // Jump to fertilizer prescription for that crop
            }}
            selectedCropId={selectedCropId}
            weatherData={weatherData}
            locationQuery={locationQuery}
            t={t}
          />
        )}

        {/* Step 5: CNN Pest & Disease Vision Classifier */}
        {currentStep === 5 && (
          <PestDiseaseDetector language={language} t={t} />
        )}
      </main>

      {/* 5. Official Soil Health Card Certificate Modal */}
      {showSoilCardModal && (
        <SoilHealthCardModal
          soilParams={soilParams}
          selectedCropId={selectedCropId}
          farmAreaAcre={areaConversion.acres}
          soilType={soilType}
          selectedReportId={selectedReportId}
          weatherData={weatherData}
          locationQuery={locationQuery}
          onClose={() => setShowSoilCardModal(false)}
          t={t}
        />
      )}

      {/* 6. Farm Location Selector & Live Search Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentLocationName={locationQuery}
        currentWeather={weatherData}
        currentMethod={locationMethod}
        onLocationSelected={handleSelectLocation}
        t={t}
      />

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "2rem 1rem",
          color: "var(--text-dim)",
          fontSize: "0.8rem",
          borderTop: "1px solid var(--border-card)",
          marginTop: "2rem",
        }}
      >
        <div>
          <strong>AgroVision™</strong> • Precision Agriculture, Computer Vision & Multilingual Voice Advisory.
        </div>
        <div style={{ marginTop: "0.3rem", fontSize: "0.75rem" }}>
          Compliant with ICAR, FAO & USDA Soil Health & Fertilizer Standards.
        </div>
      </footer>
    </div>
  );
}
