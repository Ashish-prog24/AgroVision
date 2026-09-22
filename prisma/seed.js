const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding AgroVision database...')

  const farmer = await prisma.user.upsert({
    where: { email: 'ramesh@example.com' },
    update: {},
    create: {
      name: 'Ramesh Kumar',
      email: 'ramesh@example.com',
      phone: '9876543210',
      passwordHash: 'demo',
      role: 'user',
      language: 'or',
      village: 'Pipili',
      district: 'Puri',
      state: 'Odisha',
    },
  })

  await prisma.user.upsert({
    where: { email: 'admin@agrovision.in' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@agrovision.in',
      passwordHash: 'demo',
      role: 'admin',
      language: 'en',
    },
  })

  const farm = await prisma.farm.upsert({
    where: { id: 'demo-farm-001' },
    update: {},
    create: {
      id: 'demo-farm-001',
      userId: farmer.id,
      name: "Ramesh's Main Farm",
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

  await prisma.soilReport.upsert({
    where: { id: 'demo-soil-001' },
    update: {},
    create: {
      id: 'demo-soil-001',
      farmId: farm.id,
      ph: 6.2, ec: 0.38, organicCarbon: 0.42,
      nitrogen: 210, phosphorus: 12, potassium: 280,
      sulphur: 8, zinc: 0.45, iron: 6.2, boron: 0.3, manganese: 3.1, copper: 0.28,
    },
  })

  const crops = [
    { id:'c-paddy', name:'Paddy (Rice)', nameHi:'धान', nameOr:'ଧାନ', scientificName:'Oryza sativa', category:'cereals', season:'kharif', regions:'Odisha,West Bengal,Bihar,Assam', phMin:5.5, phMax:6.5, tempMin:20, tempMax:38, rainfallMin:150, rainfallMax:250, irrigationNeeded:true, duration:120, waterRequirement:'high', description:'Paddy is the primary Kharif crop of eastern India.' },
    { id:'c-wheat', name:'Wheat', nameHi:'गेहूं', nameOr:'ଗହମ', scientificName:'Triticum aestivum', category:'cereals', season:'rabi', regions:'Punjab,Haryana,UP,MP', phMin:6.0, phMax:7.5, tempMin:10, tempMax:25, rainfallMin:40, rainfallMax:100, irrigationNeeded:true, duration:120, waterRequirement:'medium', description:'Wheat is the primary Rabi cereal of northern India.' },
    { id:'c-maize', name:'Maize', nameHi:'मक्का', nameOr:'ମକା', scientificName:'Zea mays', category:'cereals', season:'kharif,rabi', regions:'Karnataka,AP,Rajasthan,Odisha', phMin:5.8, phMax:7.5, tempMin:18, tempMax:35, rainfallMin:60, rainfallMax:110, irrigationNeeded:false, duration:90, waterRequirement:'medium', description:'Maize is a versatile crop grown across seasons.' },
    { id:'c-arhar', name:'Arhar (Pigeon Pea)', nameHi:'अरहर', nameOr:'ହରଡ', scientificName:'Cajanus cajan', category:'pulses', season:'kharif', regions:'Maharashtra,UP,Karnataka,Odisha', phMin:6.0, phMax:7.0, tempMin:20, tempMax:35, rainfallMin:60, rainfallMax:150, irrigationNeeded:false, duration:150, waterRequirement:'low', description:'Major protein-rich pulse of peninsular India.' },
    { id:'c-moong', name:'Moong (Green Gram)', nameHi:'मूंग', nameOr:'ମୁଗ', scientificName:'Vigna radiata', category:'pulses', season:'kharif,zaid', regions:'Rajasthan,Maharashtra,Odisha', phMin:6.2, phMax:7.2, tempMin:25, tempMax:35, rainfallMin:45, rainfallMax:75, irrigationNeeded:false, duration:60, waterRequirement:'low', description:'Short duration pulse for rotation and summer.' },
    { id:'c-groundnut', name:'Groundnut', nameHi:'मूंगफली', nameOr:'ଚିନାବାଦାମ', scientificName:'Arachis hypogaea', category:'oilseeds', season:'kharif,rabi', regions:'Gujarat,AP,Tamil Nadu,Odisha', phMin:5.5, phMax:7.0, tempMin:22, tempMax:38, rainfallMin:50, rainfallMax:125, irrigationNeeded:false, duration:110, waterRequirement:'medium', description:'Major oilseed crop fixing atmospheric nitrogen.' },
    { id:'c-mustard', name:'Mustard', nameHi:'सरसों', nameOr:'ସୋରିଷ', scientificName:'Brassica juncea', category:'oilseeds', season:'rabi', regions:'Rajasthan,UP,Haryana,Odisha', phMin:6.0, phMax:7.5, tempMin:10, tempMax:25, rainfallMin:25, rainfallMax:60, irrigationNeeded:false, duration:90, waterRequirement:'low', description:'Major Rabi oilseed requiring cool weather.' },
    { id:'c-tomato', name:'Tomato', nameHi:'टमाटर', nameOr:'ଟମାଟୋ', scientificName:'Solanum lycopersicum', category:'vegetables', season:'rabi,zaid', regions:'all', phMin:6.0, phMax:7.0, tempMin:18, tempMax:32, rainfallMin:40, rainfallMax:100, irrigationNeeded:true, duration:90, waterRequirement:'high', description:'High-value vegetable with strong market demand.' },
    { id:'c-brinjal', name:'Brinjal (Eggplant)', nameHi:'बैंगन', nameOr:'ବାଇଗଣ', scientificName:'Solanum melongena', category:'vegetables', season:'kharif,rabi', regions:'all', phMin:5.5, phMax:7.0, tempMin:20, tempMax:35, rainfallMin:60, rainfallMax:120, irrigationNeeded:true, duration:120, waterRequirement:'medium', description:'Popular vegetable with long bearing period.' },
    { id:'c-okra', name:'Okra (Lady\'s Finger)', nameHi:'भिंडी', nameOr:'ଭେଣ୍ଡି', scientificName:'Abelmoschus esculentus', category:'vegetables', season:'kharif,zaid', regions:'all', phMin:6.0, phMax:7.5, tempMin:24, tempMax:40, rainfallMin:60, rainfallMax:100, irrigationNeeded:false, duration:60, waterRequirement:'medium', description:'Warm season vegetable adapted to high temperatures.' },
    { id:'c-potato', name:'Potato', nameHi:'आलू', nameOr:'ଆଳୁ', scientificName:'Solanum tuberosum', category:'vegetables', season:'rabi', regions:'UP,West Bengal,Bihar,Odisha', phMin:5.0, phMax:6.5, tempMin:10, tempMax:25, rainfallMin:50, rainfallMax:120, irrigationNeeded:true, duration:90, waterRequirement:'high', description:'Major Rabi vegetable with high caloric yield.' },
    { id:'c-onion', name:'Onion', nameHi:'प्याज', nameOr:'ପିଆଜ', scientificName:'Allium cepa', category:'vegetables', season:'rabi', regions:'Maharashtra,Karnataka,MP,Odisha', phMin:6.0, phMax:7.5, tempMin:12, tempMax:30, rainfallMin:40, rainfallMax:100, irrigationNeeded:true, duration:120, waterRequirement:'medium', description:'High-value crop with strong year-round market demand.' },
    { id:'c-chilli', name:'Chilli', nameHi:'मिर्च', nameOr:'ଲଙ୍କା', scientificName:'Capsicum annuum', category:'spices', season:'kharif,rabi', regions:'AP,Karnataka,Odisha,Maharashtra', phMin:6.0, phMax:7.0, tempMin:20, tempMax:35, rainfallMin:60, rainfallMax:120, irrigationNeeded:true, duration:150, waterRequirement:'medium', description:'Important spice and cash crop across India.' },
    { id:'c-turmeric', name:'Turmeric', nameHi:'हल्दी', nameOr:'ହଳଦୀ', scientificName:'Curcuma longa', category:'spices', season:'kharif', regions:'Odisha,AP,Tamil Nadu,Maharashtra', phMin:5.5, phMax:7.0, tempMin:20, tempMax:38, rainfallMin:100, rainfallMax:200, irrigationNeeded:false, duration:270, waterRequirement:'high', description:'High-value spice crop preferring warm humid conditions.' },
    { id:'c-cotton', name:'Cotton', nameHi:'कपास', nameOr:'ତୁଳା', scientificName:'Gossypium hirsutum', category:'oilseeds', season:'kharif', regions:'Maharashtra,Gujarat,AP,Karnataka', phMin:6.0, phMax:8.0, tempMin:22, tempMax:40, rainfallMin:60, rainfallMax:150, irrigationNeeded:false, duration:160, waterRequirement:'medium', description:'Major commercial crop for deep black soils.' },
    { id:'c-soybean', name:'Soybean', nameHi:'सोयाबीन', nameOr:'ସୋୟାବିନ', scientificName:'Glycine max', category:'oilseeds', season:'kharif', regions:'MP,Maharashtra,Rajasthan,Odisha', phMin:6.0, phMax:7.5, tempMin:20, tempMax:35, rainfallMin:60, rainfallMax:150, irrigationNeeded:false, duration:95, waterRequirement:'medium', description:'Oilseed-cum-pulse rich in protein.' },
    { id:'c-sunflower', name:'Sunflower', nameHi:'सूरजमुखी', nameOr:'ସୂର୍ଯ୍ୟମୁଖୀ', scientificName:'Helianthus annuus', category:'oilseeds', season:'kharif,rabi,zaid', regions:'Karnataka,AP,Maharashtra,Odisha', phMin:6.0, phMax:7.5, tempMin:18, tempMax:35, rainfallMin:35, rainfallMax:100, irrigationNeeded:true, duration:90, waterRequirement:'medium', description:'Versatile oilseed with good drought tolerance.' },
    { id:'c-sugarcane', name:'Sugarcane', nameHi:'गन्ना', nameOr:'ଆଖୁ', scientificName:'Saccharum officinarum', category:'cereals', season:'kharif', regions:'UP,Maharashtra,Karnataka,Odisha', phMin:6.0, phMax:8.0, tempMin:20, tempMax:38, rainfallMin:100, rainfallMax:175, irrigationNeeded:true, duration:365, waterRequirement:'high', description:'Commercial crop with assured sugar mill market.' },
    { id:'c-banana', name:'Banana', nameHi:'केला', nameOr:'କଦଳୀ', scientificName:'Musa spp.', category:'fruits', season:'kharif,rabi', regions:'AP,Tamil Nadu,Maharashtra,Odisha', phMin:5.5, phMax:7.0, tempMin:18, tempMax:40, rainfallMin:100, rainfallMax:200, irrigationNeeded:true, duration:365, waterRequirement:'high', description:'Perennial cash crop with year-round income.' },
    { id:'c-ginger', name:'Ginger', nameHi:'अदरक', nameOr:'ଅଦା', scientificName:'Zingiber officinale', category:'spices', season:'kharif', regions:'Kerala,Odisha,Meghalaya,AP', phMin:5.5, phMax:7.0, tempMin:22, tempMax:32, rainfallMin:150, rainfallMax:300, irrigationNeeded:false, duration:240, waterRequirement:'high', description:'High-value spice preferring humid tropical conditions.' },
    { id:'c-lentil', name:'Lentil (Masur)', nameHi:'मसूर', nameOr:'ମସୁର', scientificName:'Lens culinaris', category:'pulses', season:'rabi', regions:'UP,MP,Bihar,Odisha', phMin:6.0, phMax:8.0, tempMin:10, tempMax:28, rainfallMin:30, rainfallMax:75, irrigationNeeded:false, duration:100, waterRequirement:'low', description:'Important Rabi pulse with high nutritional value.' },
    { id:'c-cowpea', name:'Cowpea', nameHi:'लोबिया', nameOr:'ଚୋଳି', scientificName:'Vigna unguiculata', category:'pulses', season:'kharif,zaid', regions:'Odisha,Rajasthan,AP,Karnataka', phMin:5.5, phMax:7.0, tempMin:25, tempMax:38, rainfallMin:40, rainfallMax:100, irrigationNeeded:false, duration:60, waterRequirement:'low', description:'Versatile legume excellent for soil health.' },
    { id:'c-sesame', name:'Sesame (Til)', nameHi:'तिल', nameOr:'ତିଳ', scientificName:'Sesamum indicum', category:'oilseeds', season:'kharif', regions:'Odisha,AP,Rajasthan,Gujarat', phMin:5.5, phMax:7.5, tempMin:25, tempMax:38, rainfallMin:50, rainfallMax:100, irrigationNeeded:false, duration:80, waterRequirement:'low', description:'Drought-tolerant oilseed for poor soils.' },
    { id:'c-blackgram', name:'Black Gram (Urad)', nameHi:'उड़द', nameOr:'ବିରି', scientificName:'Vigna mungo', category:'pulses', season:'kharif,zaid', regions:'AP,UP,Odisha,Tamil Nadu', phMin:6.0, phMax:7.5, tempMin:25, tempMax:40, rainfallMin:60, rainfallMax:100, irrigationNeeded:false, duration:70, waterRequirement:'low', description:'Important pulse adapted to warm humid conditions.' },
  ]

  console.log(`Seeding ${crops.length} crops...`)
  for (const crop of crops) {
    await prisma.crop.upsert({ where: { id: crop.id }, update: {}, create: crop })
  }

  const fertRules = [
    { id:'fr-paddy', cropId:'c-paddy', nitrogenPerAcre:50, phosphorusPerAcre:25, potassiumPerAcre:25, sulphurPerAcre:10, applicationStage:'split', source:'ICAR/CRRI 2023', version:'2023' },
    { id:'fr-wheat', cropId:'c-wheat', nitrogenPerAcre:55, phosphorusPerAcre:27, potassiumPerAcre:20, sulphurPerAcre:8, applicationStage:'split', source:'ICAR/IIWBR 2023', version:'2023' },
    { id:'fr-maize', cropId:'c-maize', nitrogenPerAcre:60, phosphorusPerAcre:25, potassiumPerAcre:25, sulphurPerAcre:10, applicationStage:'split', source:'ICAR/IIMR 2023', version:'2023' },
    { id:'fr-arhar', cropId:'c-arhar', nitrogenPerAcre:10, phosphorusPerAcre:20, potassiumPerAcre:10, sulphurPerAcre:5, applicationStage:'basal', source:'ICAR/IIPR 2023', version:'2023' },
    { id:'fr-moong', cropId:'c-moong', nitrogenPerAcre:8, phosphorusPerAcre:16, potassiumPerAcre:8, sulphurPerAcre:4, applicationStage:'basal', source:'ICAR/IIPR 2023', version:'2023' },
    { id:'fr-groundnut', cropId:'c-groundnut', nitrogenPerAcre:10, phosphorusPerAcre:20, potassiumPerAcre:20, sulphurPerAcre:16, applicationStage:'basal', source:'ICAR/DGR 2023', version:'2023' },
    { id:'fr-mustard', cropId:'c-mustard', nitrogenPerAcre:40, phosphorusPerAcre:20, potassiumPerAcre:15, sulphurPerAcre:20, applicationStage:'split', source:'ICAR/DRMR 2023', version:'2023' },
    { id:'fr-tomato', cropId:'c-tomato', nitrogenPerAcre:50, phosphorusPerAcre:30, potassiumPerAcre:30, sulphurPerAcre:8, applicationStage:'split', source:'State Agri Dept 2023', version:'2023' },
    { id:'fr-potato', cropId:'c-potato', nitrogenPerAcre:60, phosphorusPerAcre:30, potassiumPerAcre:50, sulphurPerAcre:10, applicationStage:'split', source:'ICAR/CPRI 2023', version:'2023' },
    { id:'fr-cotton', cropId:'c-cotton', nitrogenPerAcre:55, phosphorusPerAcre:25, potassiumPerAcre:25, sulphurPerAcre:10, applicationStage:'split', source:'ICAR/CICR 2023', version:'2023' },
    { id:'fr-soybean', cropId:'c-soybean', nitrogenPerAcre:15, phosphorusPerAcre:25, potassiumPerAcre:15, sulphurPerAcre:8, applicationStage:'basal', source:'ICAR/IISR 2023', version:'2023' },
    { id:'fr-onion', cropId:'c-onion', nitrogenPerAcre:50, phosphorusPerAcre:25, potassiumPerAcre:30, sulphurPerAcre:10, applicationStage:'split', source:'State Agri Dept 2023', version:'2023' },
    { id:'fr-chilli', cropId:'c-chilli', nitrogenPerAcre:40, phosphorusPerAcre:25, potassiumPerAcre:25, sulphurPerAcre:8, applicationStage:'split', source:'State Agri Dept 2023', version:'2023' },
    { id:'fr-turmeric', cropId:'c-turmeric', nitrogenPerAcre:40, phosphorusPerAcre:25, potassiumPerAcre:40, sulphurPerAcre:8, applicationStage:'split', source:'ICAR NRC Spices 2023', version:'2023' },
    { id:'fr-sugarcane', cropId:'c-sugarcane', nitrogenPerAcre:125, phosphorusPerAcre:50, potassiumPerAcre:50, sulphurPerAcre:15, applicationStage:'split', source:'ICAR/SBI 2023', version:'2023' },
    { id:'fr-banana', cropId:'c-banana', nitrogenPerAcre:100, phosphorusPerAcre:40, potassiumPerAcre:150, sulphurPerAcre:15, applicationStage:'split', source:'ICAR NRC Banana 2023', version:'2023' },
    { id:'fr-sunflower', cropId:'c-sunflower', nitrogenPerAcre:40, phosphorusPerAcre:25, potassiumPerAcre:25, sulphurPerAcre:20, applicationStage:'split', source:'ICAR/DMAPR 2023', version:'2023' },
    { id:'fr-ginger', cropId:'c-ginger', nitrogenPerAcre:40, phosphorusPerAcre:25, potassiumPerAcre:40, sulphurPerAcre:8, applicationStage:'split', source:'ICAR NRC Spices 2023', version:'2023' },
    { id:'fr-okra', cropId:'c-okra', nitrogenPerAcre:30, phosphorusPerAcre:20, potassiumPerAcre:20, sulphurPerAcre:5, applicationStage:'split', source:'State Agri Dept 2023', version:'2023' },
    { id:'fr-brinjal', cropId:'c-brinjal', nitrogenPerAcre:35, phosphorusPerAcre:20, potassiumPerAcre:20, sulphurPerAcre:6, applicationStage:'split', source:'State Agri Dept 2023', version:'2023' },
  ]

  console.log(`Seeding ${fertRules.length} fertilizer rules...`)
  for (const rule of fertRules) {
    await prisma.fertilizerRule.upsert({ where: { id: rule.id }, update: {}, create: rule })
  }

  const alertRules = [
    { id:'ar-heavy_rain', type:'heavy_rain', threshold:70, unit:'%', messageEn:'Heavy rainfall expected. Consider postponing fertilizer application.', messageHi:'भारी बारिश की संभावना। खाद डालना कुछ दिन टाल दें।', messageOr:'ଭାରି ବୃଷ୍ଟି ଆଶା। ସାର ପ୍ରୟୋଗ ପ୍ରକ୍ଷେପ କରନ୍ତୁ।' },
    { id:'ar-heat', type:'heat', threshold:38, unit:'°C', messageEn:'Extreme heat alert. Ensure adequate irrigation for crops.', messageHi:'भीषण गर्मी की चेतावनी। फसलों की सिंचाई सुनिश्चित करें।', messageOr:'ଅତ୍ୟଧିକ ଗ୍ରୀଷ୍ମ। ଫସଲ ଜଳ ସେଚ ନିଶ୍ଚିତ କରନ୍ତୁ।' },
    { id:'ar-wind', type:'wind', threshold:30, unit:'km/h', messageEn:'Strong winds forecast. Protect young seedlings and supported crops.', messageHi:'तेज हवाओं की संभावना। नए पौधों को सुरक्षित करें।', messageOr:'ପ୍ରବଳ ପବନ। ଚାରା ଗଛ ରକ୍ଷା କରନ୍ତୁ।' },
    { id:'ar-dry', type:'dry_spell', threshold:10, unit:'%', messageEn:'Dry spell expected. Plan irrigation schedule carefully.', messageHi:'सूखा दौर आने की संभावना। सिंचाई का उचित प्रबंध करें।', messageOr:'ଶୁଷ୍କ ସ୍ଥିତି। ଜଳ ସେଚ ଯୋଜନା ବନାନ୍ତୁ।' },
    { id:'ar-waterlog', type:'waterlogging', threshold:15, unit:'mm', messageEn:'Risk of waterlogging. Ensure proper drainage in fields.', messageHi:'जलभराव का खतरा। खेतों की जल निकासी सुनिश्चित करें।', messageOr:'ଜଳ ଜମିବା ଆଶଙ୍କା। ଜମି ନିଷ୍କାସନ ନିଶ୍ଚିତ କରନ୍ତୁ।' },
  ]
  for (const rule of alertRules) {
    await prisma.alertRule.upsert({ where: { id: rule.id }, update: {}, create: rule })
  }

  console.log('✅ Seeding complete!')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
