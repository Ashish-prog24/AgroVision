import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding AgroVision database...')

  // Demo admin user
  await prisma.user.upsert({
    where: { email: 'admin@agrovision.in' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@agrovision.in',
      passwordHash: '$2b$10$placeholder_hash_for_admin',
      role: 'admin',
      language: 'en',
    },
  })

  // Demo farmer
  const farmer = await prisma.user.upsert({
    where: { email: 'ramesh@example.com' },
    update: {},
    create: {
      name: 'Ramesh Kumar',
      email: 'ramesh@example.com',
      phone: '9876543210',
      passwordHash: '$2b$10$placeholder_hash',
      role: 'user',
      language: 'or',
      village: 'Pipili',
      district: 'Puri',
      state: 'Odisha',
    },
  })

  // Demo farm
  const farm = await prisma.farm.upsert({
    where: { id: 'demo-farm-001' },
    update: {},
    create: {
      id: 'demo-farm-001',
      userId: farmer.id,
      name: 'Ramesh\'s Main Farm',
      latitude: 20.0543,
      longitude: 85.8315,
      village: 'Pipili',
      district: 'Puri',
      state: 'Odisha',
      area: 2.0,
      areaUnit: 'acre',
      irrigationType: 'canal',
    },
  })

  // Demo soil report
  await prisma.soilReport.upsert({
    where: { id: 'demo-soil-001' },
    update: {},
    create: {
      id: 'demo-soil-001',
      farmId: farm.id,
      ph: 6.2,
      ec: 0.38,
      organicCarbon: 0.42,
      nitrogen: 210,
      phosphorus: 12,
      potassium: 280,
      sulphur: 8,
      zinc: 0.45,
      iron: 6.2,
      boron: 0.3,
      manganese: 3.1,
      copper: 0.28,
    },
  })

  // === CROPS ===
  const crops = [
    { name: 'Paddy (Rice)', nameHi: 'धान', nameOr: 'ଧାନ', category: 'cereals', season: 'kharif', phMin: 5.5, phMax: 6.5, tempMin: 20, tempMax: 38, rainfallMin: 150, rainfallMax: 250, irrigationNeeded: true, duration: 120, waterRequirement: 'high', description: 'Paddy is the primary Kharif crop of India, especially in eastern states like Odisha, West Bengal, and Bihar.', descriptionHi: 'धान भारत की प्रमुख खरीफ फसल है।', descriptionOr: 'ଧାନ ଭାରତର ମୁଖ୍ୟ ଖରିଫ ଫସଲ।', scientificName: 'Oryza sativa', regions: 'Odisha,West Bengal,Bihar,Assam,Andhra Pradesh' },
    { name: 'Wheat', nameHi: 'गेहूं', nameOr: 'ଗହମ', category: 'cereals', season: 'rabi', phMin: 6.0, phMax: 7.5, tempMin: 10, tempMax: 25, rainfallMin: 40, rainfallMax: 100, irrigationNeeded: true, duration: 120, waterRequirement: 'medium', description: 'Wheat is a primary Rabi cereal grown widely across northern and central India.', descriptionHi: 'गेहूं उत्तर भारत की प्रमुख रबी फसल है।', descriptionOr: 'ଗହମ ଉତ୍ତର ଭାରତର ମୁଖ୍ୟ ରବି ଫସଲ।', scientificName: 'Triticum aestivum', regions: 'Punjab,Haryana,Uttar Pradesh,Madhya Pradesh,Rajasthan' },
    { name: 'Maize', nameHi: 'मक्का', nameOr: 'ମକା', category: 'cereals', season: 'kharif,rabi', phMin: 5.8, phMax: 7.5, tempMin: 18, tempMax: 35, rainfallMin: 60, rainfallMax: 110, irrigationNeeded: false, duration: 90, waterRequirement: 'medium', description: 'Maize is a versatile crop grown across seasons. It is used as food, fodder, and for poultry feed.', descriptionHi: 'मक्का एक बहुउपयोगी फसल है।', descriptionOr: 'ମକା ଏକ ବହୁ ଉପଯୋଗୀ ଫସଲ।', scientificName: 'Zea mays', regions: 'Karnataka,Andhra Pradesh,Rajasthan,Madhya Pradesh,Bihar,Odisha' },
    { name: 'Arhar (Tur/Pigeon Pea)', nameHi: 'अरहर/तुअर', nameOr: 'ହରଡ', category: 'pulses', season: 'kharif', phMin: 6.0, phMax: 7.0, tempMin: 20, tempMax: 35, rainfallMin: 60, rainfallMax: 150, irrigationNeeded: false, duration: 150, waterRequirement: 'low', description: 'Arhar (Tur dal) is a major protein-rich pulse crop especially in peninsular India.', descriptionHi: 'अरहर प्रोटीन युक्त दलहन फसल है।', descriptionOr: 'ହରଡ ପ୍ରୋଟିନ ସମୃଦ୍ଧ ଡାଲ ଫସଲ।', scientificName: 'Cajanus cajan', regions: 'Maharashtra,Uttar Pradesh,Karnataka,Madhya Pradesh,Andhra Pradesh,Odisha' },
    { name: 'Moong (Green Gram)', nameHi: 'मूंग', nameOr: 'ମୁଗ', category: 'pulses', season: 'kharif,zaid', phMin: 6.2, phMax: 7.2, tempMin: 25, tempMax: 35, rainfallMin: 45, rainfallMax: 75, irrigationNeeded: false, duration: 60, waterRequirement: 'low', description: 'Moong is a short duration pulse excellent for crop rotation and summer cultivation.', descriptionHi: 'मूंग एक छोटी अवधि की दलहन फसल है।', descriptionOr: 'ମୁଗ ଏକ ଅଳ୍ପ ସମୟ ଡାଲ ଫସଲ।', scientificName: 'Vigna radiata', regions: 'Rajasthan,Maharashtra,Andhra Pradesh,Odisha,Karnataka' },
    { name: 'Groundnut', nameHi: 'मूंगफली', nameOr: 'ଚିନାବାଦାମ', category: 'oilseeds', season: 'kharif,rabi', phMin: 5.5, phMax: 7.0, tempMin: 22, tempMax: 38, rainfallMin: 50, rainfallMax: 125, irrigationNeeded: false, duration: 110, waterRequirement: 'medium', description: 'Groundnut is a major oilseed crop that also improves soil nitrogen via nitrogen fixation.', descriptionHi: 'मूंगफली एक प्रमुख तिलहन फसल है।', descriptionOr: 'ଚିନାବାଦାମ ଏକ ମୁଖ୍ୟ ତୈଳ ଫସଲ।', scientificName: 'Arachis hypogaea', regions: 'Gujarat,Andhra Pradesh,Tamil Nadu,Karnataka,Rajasthan,Odisha' },
    { name: 'Mustard', nameHi: 'सरसों', nameOr: 'ସୋରିଷ', category: 'oilseeds', season: 'rabi', phMin: 6.0, phMax: 7.5, tempMin: 10, tempMax: 25, rainfallMin: 25, rainfallMax: 60, irrigationNeeded: false, duration: 90, waterRequirement: 'low', description: 'Mustard is a major Rabi oilseed crop requiring cool weather for best yield.', descriptionHi: 'सरसों रबी की प्रमुख तिलहन फसल है।', descriptionOr: 'ସୋରିଷ ରବି ଋତୁ ତୈଳ ଫସଲ।', scientificName: 'Brassica juncea', regions: 'Rajasthan,Uttar Pradesh,Haryana,Madhya Pradesh,West Bengal,Odisha' },
    { name: 'Sunflower', nameHi: 'सूरजमुखी', nameOr: 'ସୂର୍ଯ୍ୟମୁଖୀ', category: 'oilseeds', season: 'kharif,rabi,zaid', phMin: 6.0, phMax: 7.5, tempMin: 18, tempMax: 35, rainfallMin: 35, rainfallMax: 100, irrigationNeeded: true, duration: 90, waterRequirement: 'medium', description: 'Sunflower is a versatile oilseed crop with good drought tolerance.', descriptionHi: 'सूरजमुखी एक बहुउद्देशीय तिलहन फसल है।', descriptionOr: 'ସୂର୍ଯ୍ୟମୁଖୀ ବହୁ ଋତୁ ତୈଳ ଫସଲ।', scientificName: 'Helianthus annuus', regions: 'Karnataka,Andhra Pradesh,Maharashtra,Odisha,Tamil Nadu' },
    { name: 'Tomato', nameHi: 'टमाटर', nameOr: 'ଟମାଟୋ', category: 'vegetables', season: 'rabi,zaid', phMin: 6.0, phMax: 7.0, tempMin: 18, tempMax: 32, rainfallMin: 40, rainfallMax: 100, irrigationNeeded: true, duration: 90, waterRequirement: 'high', description: 'Tomato is a high-value vegetable crop grown throughout India with excellent market demand.', descriptionHi: 'टमाटर एक उच्च मूल्य वाली सब्जी है।', descriptionOr: 'ଟମାଟୋ ଏକ ଅଧିକ ଲାଭ ତରକାରୀ ଫସଲ।', scientificName: 'Solanum lycopersicum', regions: 'all' },
    { name: 'Brinjal (Eggplant)', nameHi: 'बैंगन', nameOr: 'ବାଇଗଣ', category: 'vegetables', season: 'kharif,rabi', phMin: 5.5, phMax: 7.0, tempMin: 20, tempMax: 35, rainfallMin: 60, rainfallMax: 120, irrigationNeeded: true, duration: 120, waterRequirement: 'medium', description: 'Brinjal is a popular vegetable grown across India with long bearing period.', descriptionHi: 'बैंगन एक लोकप्रिय सब्जी फसल है।', descriptionOr: 'ବାଇଗଣ ଏକ ଲୋକପ୍ରିୟ ତରକାରୀ।', scientificName: 'Solanum melongena', regions: 'all' },
    { name: 'Okra (Lady\'s Finger)', nameHi: 'भिंडी', nameOr: 'ଭେଣ୍ଡି', category: 'vegetables', season: 'kharif,zaid', phMin: 6.0, phMax: 7.5, tempMin: 24, tempMax: 40, rainfallMin: 60, rainfallMax: 100, irrigationNeeded: false, duration: 60, waterRequirement: 'medium', description: 'Okra is a warm season vegetable well adapted to high temperature conditions.', descriptionHi: 'भिंडी गर्म मौसम की सब्जी है।', descriptionOr: 'ଭେଣ୍ଡି ଗ୍ରୀଷ୍ମ ଋତୁ ତରକାରୀ।', scientificName: 'Abelmoschus esculentus', regions: 'all' },
    { name: 'Potato', nameHi: 'आलू', nameOr: 'ଆଳୁ', category: 'vegetables', season: 'rabi', phMin: 5.0, phMax: 6.5, tempMin: 10, tempMax: 25, rainfallMin: 50, rainfallMax: 120, irrigationNeeded: true, duration: 90, waterRequirement: 'high', description: 'Potato is a major Rabi vegetable with very high caloric yield per acre.', descriptionHi: 'आलू एक प्रमुख रबी सब्जी है।', descriptionOr: 'ଆଳୁ ଏକ ମୁଖ୍ୟ ଶୀତ ଋତୁ ତରକାରୀ।', scientificName: 'Solanum tuberosum', regions: 'Uttar Pradesh,West Bengal,Bihar,Odisha,Madhya Pradesh' },
    { name: 'Onion', nameHi: 'प्याज', nameOr: 'ପିଆଜ', category: 'vegetables', season: 'rabi', phMin: 6.0, phMax: 7.5, tempMin: 12, tempMax: 30, rainfallMin: 40, rainfallMax: 100, irrigationNeeded: true, duration: 120, waterRequirement: 'medium', description: 'Onion is a high-value crop with strong market demand throughout the year.', descriptionHi: 'प्याज एक उच्च मूल्य वाली सब्जी है।', descriptionOr: 'ପିଆଜ ଏକ ଅଧିକ ଲାଭ ଫସଲ।', scientificName: 'Allium cepa', regions: 'Maharashtra,Karnataka,Madhya Pradesh,Gujarat,Odisha' },
    { name: 'Chilli', nameHi: 'मिर्च', nameOr: 'ଲଙ୍କା', category: 'spices', season: 'kharif,rabi', phMin: 6.0, phMax: 7.0, tempMin: 20, tempMax: 35, rainfallMin: 60, rainfallMax: 120, irrigationNeeded: true, duration: 150, waterRequirement: 'medium', description: 'Chilli is an important spice crop and cash crop grown across India.', descriptionHi: 'मिर्च एक महत्वपूर्ण मसाला फसल है।', descriptionOr: 'ଲଙ୍କା ଏକ ଗୁରୁତ୍ୱପୂର୍ଣ ମସଲା ଫସଲ।', scientificName: 'Capsicum annuum', regions: 'Andhra Pradesh,Karnataka,Odisha,Maharashtra' },
    { name: 'Turmeric', nameHi: 'हल्दी', nameOr: 'ହଳଦୀ', category: 'spices', season: 'kharif', phMin: 5.5, phMax: 7.0, tempMin: 20, tempMax: 38, rainfallMin: 100, rainfallMax: 200, irrigationNeeded: false, duration: 270, waterRequirement: 'high', description: 'Turmeric is a high-value spice crop that prefers warm, humid conditions.', descriptionHi: 'हल्दी एक मूल्यवान मसाला फसल है।', descriptionOr: 'ହଳଦୀ ଏକ ଅଧିକ ମୂଲ୍ୟ ମସଲା ଫସଲ।', scientificName: 'Curcuma longa', regions: 'Odisha,Andhra Pradesh,Tamil Nadu,Maharashtra,Karnataka' },
    { name: 'Banana', nameHi: 'केला', nameOr: 'କଦଳୀ', category: 'fruits', season: 'kharif,rabi', phMin: 5.5, phMax: 7.0, tempMin: 18, tempMax: 40, rainfallMin: 100, rainfallMax: 200, irrigationNeeded: true, duration: 365, waterRequirement: 'high', description: 'Banana is a perennial cash crop offering year-round income.', descriptionHi: 'केला एक बारहमासी नकदी फसल है।', descriptionOr: 'କଦଳୀ ଏକ ବର୍ଷ ସାରା ଆୟ ଦେଉଥିବା ଫସଲ।', scientificName: 'Musa spp.', regions: 'Andhra Pradesh,Tamil Nadu,Maharashtra,Gujarat,Odisha' },
    { name: 'Cotton', nameHi: 'कपास', nameOr: 'ତୁଳା', category: 'oilseeds', season: 'kharif', phMin: 6.0, phMax: 8.0, tempMin: 22, tempMax: 40, rainfallMin: 60, rainfallMax: 150, irrigationNeeded: false, duration: 160, waterRequirement: 'medium', description: 'Cotton is a major commercial crop well adapted to deep black soils and warm climate.', descriptionHi: 'कपास एक प्रमुख व्यावसायिक फसल है।', descriptionOr: 'ତୁଳା ଏକ ଗୁରୁତ୍ୱପୂର୍ଣ ବ୍ୟବସାୟିକ ଫସଲ।', scientificName: 'Gossypium hirsutum', regions: 'Maharashtra,Gujarat,Andhra Pradesh,Karnataka,Madhya Pradesh' },
    { name: 'Sugarcane', nameHi: 'गन्ना', nameOr: 'ଆଖୁ', category: 'cereals', season: 'kharif', phMin: 6.0, phMax: 8.0, tempMin: 20, tempMax: 38, rainfallMin: 100, rainfallMax: 175, irrigationNeeded: true, duration: 365, waterRequirement: 'high', description: 'Sugarcane is an important commercial crop with assured market through sugar mills.', descriptionHi: 'गन्ना एक महत्वपूर्ण व्यावसायिक फसल है।', descriptionOr: 'ଆଖୁ ଏକ ବ୍ୟବସାୟିକ ଫସଲ।', scientificName: 'Saccharum officinarum', regions: 'Uttar Pradesh,Maharashtra,Karnataka,Tamil Nadu,Andhra Pradesh,Odisha' },
    { name: 'Soybean', nameHi: 'सोयाबीन', nameOr: 'ସୋୟାବିନ', category: 'oilseeds', season: 'kharif', phMin: 6.0, phMax: 7.5, tempMin: 20, tempMax: 35, rainfallMin: 60, rainfallMax: 150, irrigationNeeded: false, duration: 95, waterRequirement: 'medium', description: 'Soybean is an important oilseed-cum-pulse crop rich in protein.', descriptionHi: 'सोयाबीन एक महत्वपूर्ण तिलहन-दलहन फसल है।', descriptionOr: 'ସୋୟାବିନ ଏକ ଗୁରୁତ୍ୱପୂର୍ଣ ଫସଲ।', scientificName: 'Glycine max', regions: 'Madhya Pradesh,Maharashtra,Rajasthan,Karnataka,Odisha' },
    { name: 'Black Gram (Urad)', nameHi: 'उड़द', nameOr: 'ବିରି', category: 'pulses', season: 'kharif,zaid', phMin: 6.0, phMax: 7.5, tempMin: 25, tempMax: 40, rainfallMin: 60, rainfallMax: 100, irrigationNeeded: false, duration: 70, waterRequirement: 'low', description: 'Black gram is an important pulse crop adapted to warm humid conditions.', descriptionHi: 'उड़द एक महत्वपूर्ण दलहन फसल है।', descriptionOr: 'ବିରି ଏକ ଗୁରୁତ୍ୱପୂର୍ଣ ଡାଲ ଫସଲ।', scientificName: 'Vigna mungo', regions: 'Andhra Pradesh,Uttar Pradesh,Odisha,Tamil Nadu,Madhya Pradesh' },
    { name: 'Ginger', nameHi: 'अदरक', nameOr: 'ଅଦା', category: 'spices', season: 'kharif', phMin: 5.5, phMax: 7.0, tempMin: 22, tempMax: 32, rainfallMin: 150, rainfallMax: 300, irrigationNeeded: false, duration: 240, waterRequirement: 'high', description: 'Ginger is a high-value spice crop that prefers humid tropical conditions.', descriptionHi: 'अदरक एक उच्च मूल्य मसाला फसल है।', descriptionOr: 'ଅଦା ଏକ ଅଧିକ ମୂଲ୍ୟ ମସଲା ଫସଲ।', scientificName: 'Zingiber officinale', regions: 'Kerala,Odisha,Meghalaya,Arunachal Pradesh,Andhra Pradesh' },
    { name: 'Cowpea', nameHi: 'लोबिया', nameOr: 'ଚୋଳି', category: 'pulses', season: 'kharif,zaid', phMin: 5.5, phMax: 7.0, tempMin: 25, tempMax: 38, rainfallMin: 40, rainfallMax: 100, irrigationNeeded: false, duration: 60, waterRequirement: 'low', description: 'Cowpea is a versatile legume excellent for soil health and fodder.', descriptionHi: 'लोबिया एक बहुउद्देशीय फलीदार फसल है।', descriptionOr: 'ଚୋଳି ଏକ ବହୁ ଉପଯୋଗୀ ଡାଲ ଫସଲ।', scientificName: 'Vigna unguiculata', regions: 'Odisha,Rajasthan,Andhra Pradesh,Karnataka,Tamil Nadu' },
    { name: 'Sesame (Til)', nameHi: 'तिल', nameOr: 'ତିଳ', category: 'oilseeds', season: 'kharif', phMin: 5.5, phMax: 7.5, tempMin: 25, tempMax: 38, rainfallMin: 50, rainfallMax: 100, irrigationNeeded: false, duration: 80, waterRequirement: 'low', description: 'Sesame is a drought-tolerant oilseed with excellent adaptability to poor soils.', descriptionHi: 'तिल एक सूखा सहिष्णु तिलहन फसल है।', descriptionOr: 'ତିଳ ଏକ ଶୁଷ୍କ ସହ୍ୟ ତୈଳ ଫସଲ।', scientificName: 'Sesamum indicum', regions: 'Odisha,Andhra Pradesh,Rajasthan,Gujarat,Madhya Pradesh' },
    { name: 'Lentil (Masur)', nameHi: 'मसूर', nameOr: 'ମସୁର', category: 'pulses', season: 'rabi', phMin: 6.0, phMax: 8.0, tempMin: 10, tempMax: 28, rainfallMin: 30, rainfallMax: 75, irrigationNeeded: false, duration: 100, waterRequirement: 'low', description: 'Lentil is an important Rabi pulse with high nutritional value.', descriptionHi: 'मसूर एक महत्वपूर्ण रबी दलहन है।', descriptionOr: 'ମସୁର ଏକ ଗୁରୁତ୍ୱପୂର୍ଣ ରବି ଡାଲ।', scientificName: 'Lens culinaris', regions: 'Uttar Pradesh,Madhya Pradesh,Bihar,Odisha,Rajasthan' },
  ]

  console.log(`Creating ${crops.length} crops...`)
  const createdCrops: { [name: string]: string } = {}
  for (const crop of crops) {
    const c = await prisma.crop.upsert({
      where: { id: `crop-${crop.name.replace(/[^a-zA-Z]/g, '-').toLowerCase()}` },
      update: {},
      create: {
        id: `crop-${crop.name.replace(/[^a-zA-Z]/g, '-').toLowerCase()}`,
        ...crop,
      },
    })
    createdCrops[crop.name] = c.id
  }

  // === FERTILIZER RULES ===
  const fertilizerRules = [
    { cropName: 'Paddy (Rice)', soilNStatus: 'medium', nitrogenPerAcre: 50, phosphorusPerAcre: 25, potassiumPerAcre: 25, sulphurPerAcre: 10, applicationStage: 'split', source: 'ICAR/CRRI Recommendation 2023', version: '2023' },
    { cropName: 'Wheat', soilNStatus: 'medium', nitrogenPerAcre: 55, phosphorusPerAcre: 27, potassiumPerAcre: 20, sulphurPerAcre: 8, applicationStage: 'split', source: 'ICAR/IIWBR Recommendation 2023', version: '2023' },
    { cropName: 'Maize', soilNStatus: 'medium', nitrogenPerAcre: 60, phosphorusPerAcre: 25, potassiumPerAcre: 25, sulphurPerAcre: 10, applicationStage: 'split', source: 'ICAR/IIMR Recommendation 2023', version: '2023' },
    { cropName: 'Arhar (Tur/Pigeon Pea)', soilNStatus: 'medium', nitrogenPerAcre: 10, phosphorusPerAcre: 20, potassiumPerAcre: 10, sulphurPerAcre: 5, applicationStage: 'basal', source: 'ICAR/IIPR Recommendation 2023', version: '2023' },
    { cropName: 'Moong (Green Gram)', soilNStatus: 'medium', nitrogenPerAcre: 8, phosphorusPerAcre: 16, potassiumPerAcre: 8, sulphurPerAcre: 4, applicationStage: 'basal', source: 'ICAR/IIPR Recommendation 2023', version: '2023' },
    { cropName: 'Groundnut', soilNStatus: 'medium', nitrogenPerAcre: 10, phosphorusPerAcre: 20, potassiumPerAcre: 20, sulphurPerAcre: 16, applicationStage: 'basal', source: 'ICAR/DGR Recommendation 2023', version: '2023' },
    { cropName: 'Mustard', soilNStatus: 'medium', nitrogenPerAcre: 40, phosphorusPerAcre: 20, potassiumPerAcre: 15, sulphurPerAcre: 20, applicationStage: 'split', source: 'ICAR/DRMR Recommendation 2023', version: '2023' },
    { cropName: 'Tomato', soilNStatus: 'medium', nitrogenPerAcre: 50, phosphorusPerAcre: 30, potassiumPerAcre: 30, sulphurPerAcre: 8, applicationStage: 'split', source: 'State Dept. of Agriculture Recommendation', version: '2023' },
    { cropName: 'Potato', soilNStatus: 'medium', nitrogenPerAcre: 60, phosphorusPerAcre: 30, potassiumPerAcre: 50, sulphurPerAcre: 10, applicationStage: 'split', source: 'ICAR/CPRI Recommendation 2023', version: '2023' },
    { cropName: 'Cotton', soilNStatus: 'medium', nitrogenPerAcre: 55, phosphorusPerAcre: 25, potassiumPerAcre: 25, sulphurPerAcre: 10, applicationStage: 'split', source: 'ICAR/CICR Recommendation 2023', version: '2023' },
    { cropName: 'Sugarcane', soilNStatus: 'medium', nitrogenPerAcre: 125, phosphorusPerAcre: 50, potassiumPerAcre: 50, sulphurPerAcre: 15, applicationStage: 'split', source: 'ICAR/SBI Recommendation 2023', version: '2023' },
    { cropName: 'Soybean', soilNStatus: 'medium', nitrogenPerAcre: 15, phosphorusPerAcre: 25, potassiumPerAcre: 15, sulphurPerAcre: 8, applicationStage: 'basal', source: 'ICAR/IISR Recommendation 2023', version: '2023' },
    { cropName: 'Onion', soilNStatus: 'medium', nitrogenPerAcre: 50, phosphorusPerAcre: 25, potassiumPerAcre: 30, sulphurPerAcre: 10, applicationStage: 'split', source: 'State Dept. of Agriculture Recommendation', version: '2023' },
    { cropName: 'Chilli', soilNStatus: 'medium', nitrogenPerAcre: 40, phosphorusPerAcre: 25, potassiumPerAcre: 25, sulphurPerAcre: 8, applicationStage: 'split', source: 'State Dept. of Agriculture Recommendation', version: '2023' },
    { cropName: 'Turmeric', soilNStatus: 'medium', nitrogenPerAcre: 40, phosphorusPerAcre: 25, potassiumPerAcre: 40, sulphurPerAcre: 8, applicationStage: 'split', source: 'ICAR/NRC Spices Recommendation', version: '2023' },
    { cropName: 'Banana', soilNStatus: 'medium', nitrogenPerAcre: 100, phosphorusPerAcre: 40, potassiumPerAcre: 150, sulphurPerAcre: 15, applicationStage: 'split', source: 'ICAR/NRC Banana Recommendation', version: '2023' },
    { cropName: 'Okra (Lady\'s Finger)', soilNStatus: 'medium', nitrogenPerAcre: 30, phosphorusPerAcre: 20, potassiumPerAcre: 20, sulphurPerAcre: 5, applicationStage: 'split', source: 'State Dept. Recommendation 2023', version: '2023' },
    { cropName: 'Brinjal (Eggplant)', soilNStatus: 'medium', nitrogenPerAcre: 35, phosphorusPerAcre: 20, potassiumPerAcre: 20, sulphurPerAcre: 6, applicationStage: 'split', source: 'State Dept. Recommendation 2023', version: '2023' },
    { cropName: 'Sunflower', soilNStatus: 'medium', nitrogenPerAcre: 40, phosphorusPerAcre: 25, potassiumPerAcre: 25, sulphurPerAcre: 20, applicationStage: 'split', source: 'ICAR/DMAPR Recommendation 2023', version: '2023' },
    { cropName: 'Ginger', soilNStatus: 'medium', nitrogenPerAcre: 40, phosphorusPerAcre: 25, potassiumPerAcre: 40, sulphurPerAcre: 8, applicationStage: 'split', source: 'ICAR/NRC Spices Recommendation', version: '2023' },
  ]

  console.log('Creating fertilizer rules...')
  for (const rule of fertilizerRules) {
    const cropId = createdCrops[rule.cropName]
    if (!cropId) continue
    await prisma.fertilizerRule.upsert({
      where: { id: `fr-${rule.cropName.replace(/[^a-zA-Z]/g, '-').toLowerCase()}` },
      update: {},
      create: {
        id: `fr-${rule.cropName.replace(/[^a-zA-Z]/g, '-').toLowerCase()}`,
        cropId,
        nitrogenPerAcre: rule.nitrogenPerAcre,
        phosphorusPerAcre: rule.phosphorusPerAcre,
        potassiumPerAcre: rule.potassiumPerAcre,
        sulphurPerAcre: rule.sulphurPerAcre,
        applicationStage: rule.applicationStage,
        source: rule.source,
        version: rule.version,
      },
    })
  }

  // === ALERT RULES ===
  const alertRules = [
    { type: 'heavy_rain', threshold: 70, unit: '%', messageEn: 'Heavy rainfall expected. Consider postponing fertilizer application.', messageHi: 'भारी बारिश की संभावना। खाद डालना कुछ दिन टाल दें।', messageOr: 'ଭାରି ବୃଷ୍ଟି ଆଶା। ସାର ପ୍ରୟୋଗ ପ୍ରକ୍ଷେପ କରନ୍ତୁ।' },
    { type: 'heat', threshold: 38, unit: '°C', messageEn: 'Extreme heat alert. Ensure adequate irrigation for crops.', messageHi: 'भीषण गर्मी की चेतावनी। फसलों की सिंचाई सुनिश्चित करें।', messageOr: 'ଅତ୍ୟଧିକ ଗ୍ରୀଷ୍ମ। ଫସଲ ଦ ଜଳ ସେଚ ନିଶ୍ଚିତ କରନ୍ତୁ।' },
    { type: 'wind', threshold: 30, unit: 'km/h', messageEn: 'Strong winds forecast. Protect supported crops and young seedlings.', messageHi: 'तेज हवाओं की संभावना। सहारा दी गई फसलों और नए पौधों को सुरक्षित करें।', messageOr: 'ପ୍ରବଳ ପବନ ଆଶା। ଚାରା ଗଛ ରକ୍ଷା କରନ୍ତୁ।' },
    { type: 'dry_spell', threshold: 10, unit: '%', messageEn: 'Dry spell expected. Plan irrigation schedule carefully.', messageHi: 'सूखा दौर आने की संभावना। सिंचाई का उचित प्रबंध करें।', messageOr: 'ଶୁଷ୍କ ସ୍ଥିତି ଆଶା। ଜଳ ସେଚ ଯୋଜନା ବନାନ୍ତୁ।' },
    { type: 'waterlogging', threshold: 15, unit: 'mm', messageEn: 'Risk of waterlogging. Ensure proper drainage in fields.', messageHi: 'जलभराव का खतरा। खेतों की जल निकासी सुनिश्चित करें।', messageOr: 'ଜଳ ଜମିବା ଆଶଙ୍କା। ଜମି ନିଷ୍କାସନ ନିଶ୍ଚିତ କରନ୍ତୁ।' },
  ]
  for (const rule of alertRules) {
    await prisma.alertRule.upsert({
      where: { id: `ar-${rule.type}` },
      update: {},
      create: { id: `ar-${rule.type}`, ...rule },
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`   Users: 2, Farms: 1, Crops: ${crops.length}, Fertilizer Rules: ${fertilizerRules.length}, Alert Rules: ${alertRules.length}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
