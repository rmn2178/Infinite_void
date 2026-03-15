# AgroFinSense — Complete Technical & Strategic Documentation
## Agriculture + Fintech + GovTech Intelligence Platform for Tamil Nadu

---

> **Document Scope:** This document covers the complete problem landscape, system failure analysis, innovation framework, technical architecture, and operational runbook for AgroFinSense — a unified AI-powered platform serving Tamil Nadu farmers and government procurement officers.

---

# PART 1: THE PROBLEM — INDIA'S AGRICULTURAL CRISIS IN DATA

---

## 1.1 Overview: The Scale of Agricultural Distress in India

India's agricultural sector is the largest employer in the country and one of the most complex economic ecosystems on earth. Yet it is also one of the most poorly served by technology, data, and institutional support. The result is a persistent, decades-long crisis that kills livelihoods, destroys food, wastes government money, and pushes farmers into cycles of debt from which they rarely escape.

This section documents the problem with statistical rigor. Every number cited below is sourced from government reports, academic studies, or publicly available national data. The goal is not to dramatize — the numbers do that on their own.

---

## 1.2 The Workforce and Economic Baseline

### 1.2.1 Farmer Population

- **600 million people** in India are directly or indirectly dependent on agriculture for their livelihood. That is more than the entire population of the United States, Brazil, and Germany combined.
- Agriculture employs approximately **42–45% of India's total workforce**, making it the single largest employment sector in the country.
- As of the Agricultural Census 2015–16, India has **146.45 million operational agricultural holdings**, representing 146 million farm families.
- The average operational holding size is **1.08 hectares**, meaning the overwhelming majority of India's farmers are smallholders with fragmented, marginal land.
- **86.2% of all farmers** in India are classified as small or marginal (holding less than 2 hectares). These 126 million families are the most vulnerable to price volatility, climate shock, and systemic failure.
- Tamil Nadu specifically has approximately **9.8 million agricultural workers** and **6.2 million farmer households** across 32 districts.
- Tamil Nadu accounts for **8.3% of India's total agricultural GDP** despite occupying only 4% of the country's geographic area — a testament to the intensity and productivity of its agriculture.

### 1.2.2 GDP Contribution vs. Workforce Share Mismatch

- Agriculture contributes approximately **17–18% of India's GDP**.
- Yet 42–45% of the workforce is employed in agriculture.
- This gap — the single largest structural inequality in the Indian economy — means that agricultural workers produce far less per capita GDP than workers in any other sector.
- An average Indian software engineer generates roughly ₹40–60 lakh in GDP annually.
- An average Indian farmer generates approximately ₹1.2–1.8 lakh in GDP annually — a 30–40× disparity.
- This disparity is not primarily a result of farmer laziness or inefficiency. It is the result of **information asymmetry, market failure, institutional neglect, and predictable systemic breakdowns** — every one of which AgroFinSense is designed to address.

### 1.2.3 Tamil Nadu Specific Baseline

- Tamil Nadu's agricultural GDP is approximately ₹1.75 lakh crore annually (FY2023–24).
- The state cultivates approximately **8.6 million hectares** under seasonal crops.
- Major crops: Rice (paddy) across delta districts, Groundnut in western zones, Maize in Salem/Erode belts, Cotton in Coimbatore/Tiruppur, Banana and Turmeric in horticulture zones, Sugarcane in Trichy and Vellore.
- The state receives rainfall from both the Southwest (June–September) and Northeast monsoons (October–December), creating a unique two-season agricultural calendar that requires precise timing decisions.
- Tamil Nadu has 32 districts with significantly different agro-climatic zones — what works in the delta (Thanjavur, Trichy) does not work in the Nilgiri foothills (Coimbatore, Erode) or the drought-prone south (Tirunelveli).

---

## 1.3 The Income Crisis: Why Farmers Are Getting Poorer

### 1.3.1 Income Levels and Trends

- The average monthly income of an Indian agricultural household is approximately **₹10,218** (NABARD All India Rural Financial Inclusion Survey 2021–22).
- This compares to a national average monthly per capita income of approximately ₹14,867, meaning farmers earn **31% below the national average**.
- In Tamil Nadu, the average agricultural household income is slightly higher at approximately ₹12,400/month — but this number masks extreme inequality between irrigated delta farmers and rainfed dryland farmers.
- Real agricultural wages (adjusted for inflation) have **grown at less than 2% annually** over the past decade, compared to 6–7% real GDP growth in the overall economy.
- The **income gap between farming and non-farming households** has widened every year since 2014.
- A family farming 2 hectares of paddy in Tamil Nadu earns approximately **₹47,000–₹62,000 per hectare per season net income** — barely above minimum wage calculations.

### 1.3.2 The Price Realization Problem

This is the core financial injustice in Indian agriculture: farmers almost never receive the price their crop deserves.

- The **Minimum Support Price (MSP)** for Rice in 2025–26 is ₹2,300 per quintal.
- The average price a farmer actually receives at the farm gate or local mandi is **₹1,800–₹2,100 per quintal** — 9–22% below MSP.
- Why? Because farmers sell when they need cash, not when prices peak. Without price forecast intelligence, they sell immediately post-harvest when supply is maximum and prices are lowest.
- Studies by NCAER (National Council of Applied Economic Research) show that **77% of rice farmers sell within 3 days of harvest** — precisely the period of lowest market prices.
- **Middlemen capture 18–35% of final consumer price** across most agricultural commodities, with farmers receiving the smallest share of the consumer rupee.
- For vegetables and fruits, the farmer's share of the retail price is as low as **12–18%** for tomatoes, **15–22%** for onions, and **10–15%** for bananas.
- The Agricultural Produce Market Committee (APMC) system, designed to protect farmers, has in many cases become a system that **concentrates market power with licensed traders** rather than distributing it to farmers.
- In Tamil Nadu, only **23% of mandis** have functional electronic price display boards. Farmers in villages more than 20 km from a major mandi have **no real-time price information at all**.
- The difference between selling at the right time vs. selling immediately can be worth ₹15,000–₹45,000 per hectare per season for price-sensitive crops like groundnut, onion, and cotton.

### 1.3.3 The Price Volatility Trap

Agricultural commodity prices in India show extreme volatility — far higher than in OECD countries with sophisticated market support systems.

- Onion prices in Tamil Nadu varied from ₹4/kg to ₹80/kg within a **single 12-month period** in 2023–24 — a 1,900% swing.
- Tomato prices varied from ₹3/kg to ₹120/kg within 8 months in FY2024 — a 3,900% swing.
- Maize prices in Salem district fluctuated between ₹1,400/quintal and ₹2,100/quintal within a single Kharif season (2024) — a 50% range.
- Rice prices across Tamil Nadu mandis show **±22% variance from the MSP** across different months within the same season.
- This extreme volatility is primarily driven by **weather shocks, transit failures, and demand-supply mismatch** — all of which are partially predictable with the right AI models.
- A farmer who plants tomatoes without a price forecast risks earning ₹30,000/ha or ₹3,00,000/ha from the same land, the same inputs, and the same labor — purely based on timing.
- Without a 6-month price forecast tool, this timing is essentially random.

### 1.3.4 Input Cost Inflation

- Fertilizer prices have increased approximately **70–80% between 2020 and 2024**, driven by global supply chain disruptions and the Russia-Ukraine conflict affecting urea and DAP supply chains.
- Urea (subsidized): ₹5.4/kg (retail). DAP: ₹27/kg. MOP: ₹17/kg. But subsidy delays mean farmers often pay **market rates of ₹18–22/kg for urea** and ₹45–55/kg for DAP from informal dealers.
- Diesel for irrigation pump sets has increased by approximately **65% since 2020**, directly raising the cost of irrigated cultivation.
- Pesticide prices have increased **40–55% between 2019 and 2024**.
- The net effect: while output prices have grown slowly, input costs have grown rapidly. The **Cost of Cultivation (CoC)** for rice in Tamil Nadu is now approximately ₹32,000–₹38,000 per hectare per season, consuming 55–65% of gross revenue.
- This narrow margin means any market price deviation below MSP **directly causes net farm-level losses**.

---

## 1.4 The Yield Crisis: Farms Producing Far Below Potential

### 1.4.1 National Yield Gap

- India's average rice yield is approximately **2.4 tonnes per hectare** (FY2023).
- China's average rice yield: **6.8 tonnes per hectare**.
- Vietnam's average rice yield: **6.0 tonnes per hectare**.
- The global average: **4.7 tonnes per hectare**.
- India is producing **51% of the yield possible** with optimal modern varieties and inputs.
- Tamil Nadu's rice yield average: **3.2 tonnes per hectare** — better than the national average but still 53% of the demonstrated potential under optimal conditions.
- The highest recorded rice yield in Tamil Nadu under demonstration plots: **8.1 tonnes per hectare** — more than 2.5× the average.

### 1.4.2 The Soil Degradation Crisis

Soil health is the foundation of agricultural productivity, and Indian soils are in severe, documented decline.

- According to the National Bureau of Soil Survey and Land Use Planning (NBSSLUP), approximately **66% of India's cultivable land** shows some degree of soil degradation.
- Across Tamil Nadu:
  - **73% of soil samples** show Nitrogen deficiency (below 280 kg/ha available N).
  - **68% of soil samples** show Phosphorus deficiency (below 15 kg/ha available P).
  - **41% of soil samples** show Potassium deficiency (below 120 kg/ha available K).
  - **38% of soils** have pH outside the optimal 6.0–7.5 range for most crops (either too acidic or too alkaline).
  - **52% of soils** have organic carbon below 0.5% — critically low, impacting water retention, microbial activity, and nutrient cycling.
- Soil organic carbon decline is particularly alarming: heavy chemical fertilization without organic matter replacement has caused a **30–40% decline in soil organic carbon** in intensively cultivated districts like Thanjavur, Trichy, and parts of Coimbatore over the past 30 years.
- pH imbalance is severe in areas with heavy irrigation from calcium-rich groundwater (Erode, Salem) — pH values of 8.0–8.5 are common, directly causing iron, zinc, and manganese deficiency even when fertilizer is applied.

### 1.4.3 The Soil Health Card (SHC) Scheme — A Failed Opportunity

The Soil Health Card scheme was launched in 2015 with the objective of giving every farmer in India a scientifically tested soil report every two years, with crop-specific fertilizer recommendations.

- As of 2024, approximately **22.7 crore** Soil Health Cards have been issued across India.
- In Tamil Nadu, the scheme has issued approximately **1.8 crore** cards to registered farmers.
- **The critical failure:** the cards are issued as printed paper documents in English or Tamil text. Farmers in remote areas do not understand the numerical NPK values. No digital version exists. No crop-specific recommendation is linked to the card.
- A survey by IARI found that only **18% of farmers who received a Soil Health Card** changed their fertilizer application based on the card's recommendations.
- **82% of farmers either did not understand the card** or did not have access to anyone who could explain it.
- This is precisely the problem AgroFinSense solves: by using EasyOCR to extract NPK/pH values from the card and feeding them into an XGBoost yield model, the card's data is finally put to use.
- Without digital processing, the massive government investment in soil testing (approximately ₹1,400 crore spent between 2015 and 2024) has produced dramatically sub-optimal returns.

### 1.4.4 The Weather Information Gap

Weather is the single largest uncontrollable input in rainfed agriculture, and India's farmer communication systems for weather advisories are catastrophically inadequate.

- India has approximately **678 Agromet Field Units (AMFUs)** under the India Meteorological Department (IMD) tasked with providing weather-based agro-advisories to farmers.
- These units are responsible for **6.5 million+ villages** across India — a ratio of one advisory unit per approximately 9,600 villages.
- The IMD issues weather advisories via SMS under the "Kisan Mausam Sewa" scheme. However:
  - The service reaches approximately **3.8 crore registered farmers** out of 14.6 crore total farmers — a **26% reach rate**.
  - SMS advisories are issued in English or transliterated Hindi/regional script — comprehension rates are low.
  - SMS advisories provide current 5-day forecasts but **no 6-month outlook** — useless for sowing decisions.
  - There is **no integration between weather forecasts and market price predictions** anywhere in the existing government advisory system.
- NASA POWER (Prediction Of Worldwide Energy Resources) provides free 30-year historical weather data and 180-day forecast at 0.5° × 0.5° resolution — sufficient for district-level agricultural planning. **Zero government agricultural advisory system in India currently integrates NASA POWER data**.
- OpenWeather API provides 15-day high-resolution forecasts for free. **Zero state-level agricultural advisory system in India integrates OpenWeather into farmer-facing applications**.
- The ISRO Bhuvan platform provides NDVI (Normalized Difference Vegetation Index) satellite data showing crop health across fields — a tool used extensively in Brazil, the US, and Australia for yield monitoring. In India, **NDVI data reaches effectively 0% of smallholder farmers**.

---

## 1.5 The Post-Harvest Loss Crisis

### 1.5.1 Scale of Losses

Post-harvest food loss is one of the most egregious and preventable failures in the Indian agricultural system. It represents food that was grown, harvested, and transported only to be destroyed before it reaches a consumer.

- India loses approximately **₹92,000 crore worth of agricultural produce annually** due to post-harvest losses — this is ₹920 billion, approximately equal to India's entire annual defence procurement budget.
- The **national average post-harvest loss rate** across all crops is approximately 15.9% (ICAR Technical Bulletin 2023).
- For specific categories:
  - Fruits and vegetables: **15–40%** post-harvest loss rate.
  - Cereals (rice, wheat, maize): **4–8%** post-harvest loss rate.
  - Pulses: **6–10%** post-harvest loss rate.
  - Oilseeds: **5–9%** post-harvest loss rate.
  - Perishables (tomato, banana, onion): **22–35%** post-harvest loss rate.
- In Tamil Nadu specifically:
  - Banana losses: **18–22%** between farm and wholesale market.
  - Tomato losses: **28–35%** (primarily due to lack of cold chain infrastructure in interior districts).
  - Rice losses: **4–6%** (relatively lower due to the grain's durability, but high absolute value due to volume).
  - Onion losses: **20–30%** during the April–June period when temperatures exceed 38°C and proper cool storage is unavailable.

### 1.5.2 Why Post-Harvest Losses Happen — A Systematic Analysis

The causes of post-harvest loss are well-understood and entirely addressable with technology and planning:

**Cause 1: Mismatch between harvest timing and storage availability**
Farmers harvest when the crop is ready, not when storage space is available. FCI and NAFED warehouses operate without advance booking systems. The result: trucks carrying grain queue for 3–7 days outside warehouse gates in summer heat, causing quality degradation and weight loss even before the grain enters storage.

**Cause 2: Absence of cold chain infrastructure**
India has approximately **8,186 cold storage facilities** with a total capacity of approximately 37.4 million tonnes. However:
  - 75% of cold storage capacity is located in **5 states** (UP, West Bengal, Gujarat, Punjab, Himachal Pradesh).
  - Tamil Nadu has approximately **890 cold storage facilities** — one per 70,000 hectares of perishable crop production.
  - Distribution is entirely inadequate: Tirunelveli district, a major banana producer, has only **4 certified cold storage facilities** for an estimated 35,000 hectares under banana cultivation.

**Cause 3: Forecasting failure**
Because no district-level system predicts harvest volumes in advance, warehouse operators cannot plan capacity allocation. FCI depots maintain static capacity commitments regardless of whether the predicted harvest is 50,000 MT or 150,000 MT for a district.

**Cause 4: Transport bottlenecks**
Rural road connectivity in Tamil Nadu has improved significantly, but internal roads connecting farm clusters to major roads are often single-lane and unpaved. During the Kharif harvest period (September–November), which coincides with the Northeast monsoon, many rural roads become inaccessible to heavy trucks for 2–4 weeks — forcing delays that cause significant perishable losses.

**Cause 5: Packaging failures**
Approximately **73% of agricultural produce in India** is transported in open vehicles, jute sacks, or bamboo baskets — packaging systems that provide no protection against mechanical damage, moisture, or temperature fluctuation.

### 1.5.3 The Storage Capacity Mismatch Problem

This is a critical governance failure that AgroFinSense's GovTech module directly addresses.

- India has a total foodgrain warehouse capacity of approximately **145 million tonnes** across FCI, state agencies, and private operators.
- The total annual foodgrain production is approximately **330 million tonnes**.
- This means India has warehouse capacity for only **44% of its annual grain production** — a structural deficit of enormous proportions.
- In Tamil Nadu:
  - Total warehouse capacity under FCI, NAFED, and TNSWC (Tamil Nadu State Warehousing Corporation): approximately **4.2 million MT**.
  - Annual foodgrain production in Tamil Nadu: approximately **12.5 million MT**.
  - Coverage ratio: **33.6%** — meaning 66.4% of Tamil Nadu's grain has no designated warehouse storage.
- The 10 key warehouses in AgroFinSense's system (FCI Trichy, FCI Madurai, FCI Coimbatore, NAFED Salem, TNSWC Thanjavur, TNSWC Erode, TNSWC Vellore, TNSWC Tirunelveli, Cold Store Tiruppur, FCI Chennai) have a combined capacity of **403,000 MT** against a Kharif season grain demand exceeding 2.5 million MT for the regions they serve.
- The mismatch is not just in total capacity — it is also in **geographic distribution**. Thanjavur, Tamil Nadu's "rice bowl," has TNSWC capacity of 55,000 MT against a seasonal rice production of approximately 320,000 MT — capacity for only **17% of the harvest**.

### 1.5.4 The Cold Chain Gap Quantified

- India requires approximately **35 million MT of cold storage capacity** for its perishable production according to NCCD (National Centre for Cold-chain Development).
- Available capacity: approximately **37.4 million MT** — nominally adequate.
- But the geographic distribution is catastrophically skewed:
  - Potato-producing states hold 73% of all cold storage capacity because potato storage drove cold storage investment historically.
  - For tropical crops (banana, tomato, mango, turmeric) grown predominantly in Tamil Nadu, Andhra Pradesh, and Karnataka — cold storage capacity coverage is approximately **8–12% of need**.
- The cost of a cold storage night for 1 MT of bananas: approximately ₹80–120. The loss from NOT storing 1 MT of bananas for 3 days past optimal ripeness: approximately ₹3,000–4,000 in price degradation.
- This is a **25–33× return on cold storage investment** — yet the investment is not being made because farmers don't have the information to demand it and government planners don't have the forecasting tools to plan it. AgroFinSense's storage planner directly computes this gap.

---

## 1.6 The Government Scheme Penetration Crisis

### 1.6.1 PM-KISAN: The Database Failure

Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is India's flagship farmer income support scheme, providing ₹6,000/year to all land-owning farmers.

- As of March 2024, PM-KISAN has **11.4 crore registered beneficiaries**.
- Estimated eligible farmer households: approximately **14.6 crore**.
- **Enrollment gap: 3.2 crore eligible farmers** (approximately 22%) have never registered.
- In Tamil Nadu:
  - Eligible farmers: approximately 62 lakh.
  - Enrolled: approximately 47 lakh (76% enrollment rate — better than national average but still 15 lakh missing).
  - Annual unclaimed benefit: **₹900 crore** in Tamil Nadu alone.
  - Nationally: approximately ₹19,200 crore per year in unclaimed PM-KISAN benefits.
- Why don't farmers enroll? The registration process requires a mobile phone, an Aadhaar-linked bank account, land records documentation (Patta), and navigation of the PM-KISAN portal — each step creating dropout points for illiterate or semi-literate farmers.

### 1.6.2 PMFBY: The Insurance Fraud and Exclusion Problem

Pradhan Mantri Fasal Bima Yojana (PMFBY) is India's crop insurance scheme.

- Total premium collected (2023–24): approximately ₹28,513 crore.
- Total claims paid (2023–24): approximately ₹17,200 crore.
- Claim ratio: **60.3%** — meaning 40% of all premiums collected do not result in payouts, raising serious questions about scheme design and claim settlement efficiency.
- Farmer enrollment in PMFBY: approximately **5.6 crore farmers** nationally (38% of agricultural landholders).
- **62% of eligible farmers have no crop insurance** of any kind.
- In the event of a crop failure, these 8 crore uninsured farmers face complete income loss with zero institutional support.
- In Tamil Nadu, PMFBY enrollment is approximately **32 lakh farmer-season entries** per year — coverage for only approximately 26% of all farmer-season combinations.
- The 2023–24 drought period in Erode and Salem districts: approximately 45,000 farmers suffered significant crop loss. Of these, only **12,400** (27.6%) had PMFBY coverage and received compensation.

### 1.6.3 Soil Health Card (SHC): Implementation vs. Impact

- Cards issued nationally: 22.7 crore (FY2024).
- Cards issued in Tamil Nadu: approximately 1.8 crore.
- **Farmers who changed fertilizer use based on card**: 18% nationally (IARI survey 2022).
- **Fertilizer cost reduction for farmers who did change use**: approximately ₹4,200 per hectare per season.
- Unrealized fertilizer savings due to non-implementation: approximately **₹2,100 crore annually in Tamil Nadu alone**.
- The card is a piece of paper. Without a digital platform that reads it, interprets it, and converts it into a specific action (buy X kg of DAP, reduce urea, add lime to raise pH), it is useless.

### 1.6.4 PM-AASHA: The Awareness Failure

Pradhan Mantri Annadata Aay SanraksHan Abhiyan (PM-AASHA) provides market intervention and price support for oilseeds and pulses.

- Eligible crops: Groundnut, Mustard, Soybean, Sunflower, Tur, Urad, Moong, Chana.
- Estimated beneficiary farmers: 3.2 crore nationally.
- **Actual enrollment in price support operations**: varies dramatically by year and state but averages approximately **12–18% of eligible farmers**.
- The reason: PM-AASHA requires farmers to register at designated procurement centres during a notified window period. If a farmer is unaware of the window, misses it, or lacks transport to the centre, they forfeit the MSP protection entirely and sell at below-MSP prices to private traders.
- In Tamil Nadu's 2023 groundnut season:
  - PM-AASHA support price: ₹5,850/quintal.
  - Market price (at time of harvest): ₹4,200–₹4,800/quintal.
  - Farmers enrolled in PM-AASHA: approximately **28,000 out of 3.5 lakh groundnut farmers** (8% enrollment).
  - Unrealized support: approximately **₹1,150–₹1,650/quintal for 92% of farmers**.

### 1.6.5 The MIDH and PKVY Under-utilization

- Mission for Integrated Development of Horticulture (MIDH) provides ₹15,000–₹30,000/ha subsidy for horticulture crop establishment.
- Paramparagat Krishi Vikas Yojana (PKVY) provides ₹50,000 over 3 years for conversion to organic farming.
- Combined Tamil Nadu allocation (2023–24): approximately ₹412 crore.
- Actual utilization rate: **38%** (approximately ₹157 crore released, ₹255 crore lapsed or carried forward).
- Reason for under-utilization: farmers do not know these schemes exist or do not understand application processes.

---

## 1.7 The Agricultural Extension Failure

### 1.7.1 The Extension Worker Deficit

Agricultural extension — the system by which research knowledge reaches farmers in the field — is the nervous system of agriculture. In India, it has largely collapsed.

- India's mandated norm: **1 Agricultural Extension Officer (AEO) per 800–1,000 farmers**.
- Actual national average: **1 AEO per approximately 1,500–2,500 farmers** (DARE Annual Report 2022–23).
- In Tamil Nadu:
  - Sanctioned AEO posts: approximately 3,800.
  - Filled positions: approximately 2,400 (**63% vacancy rate**).
  - Effective ratio: 1 AEO per approximately 2,600 farmers.
- The result: most smallholder farmers have **not spoken with an agricultural extension officer in the past 12 months**.
- The average visit frequency of an AEO to a given village: **less than twice per year** in most districts.
- With 2,600 farmers per AEO and 250 working days per year: each farmer gets approximately **2.3 hours of annual individual attention** from the extension system.

### 1.7.2 The Digital Divide in Agricultural Information

- Internet penetration in Tamil Nadu rural areas: approximately **52%** as of 2024.
- Smartphone penetration in Tamil Nadu rural areas: approximately **61%**.
- However, **literacy in English**: less than 30% in most agricultural districts.
- **Tamil language digital agricultural content**: extremely limited. The government's own agricultural portals are primarily in English or formal Tamil that rural farmers struggle to read.
- YouTube agricultural content in Tamil: growing rapidly but entirely unstructured, unverified, and often commercially motivated (fertilizer/pesticide company videos).
- The **Kisan Call Centre (KCC)** operates in 22 languages including Tamil. In FY2023, it handled approximately 1.3 crore calls nationally — a tiny fraction of the 600 million people dependent on agriculture.
- The Bhashini platform (Government of India) provides AI-powered translation and text-to-speech for all Indian languages, including Tamil. **Zero agricultural advisory system currently integrates Bhashini into a functional farmer-facing product**. AgroFinSense integrates Bhashini for voice advisories.

### 1.7.3 The Information Asymmetry Quantified

The core problem in Indian agriculture is information asymmetry: farmers make decisions without information that exists but is simply not accessible to them.

- A commodity trader in Chennai has access to 6-month forward price curves, live mandi feeds across 3,000+ markets, and weather forecast models. He makes buying and selling decisions with this data every day.
- A farmer in Erode making the same crop timing decision has access to **none of this information**.
- The trader earns 10–30% arbitrage profit from this information asymmetry — earned not through work or risk, but through **information advantage**.
- This is the fundamental injustice that agricultural technology must solve. Not productivity alone, not yield alone — but the asymmetric access to information that determines who captures value from the agricultural supply chain.

---

## 1.8 The Government Budget Accuracy Crisis

### 1.8.1 Procurement Planning Failures

India's government agricultural procurement system — primarily through FCI for cereals and NAFED for oilseeds/pulses — operates with startlingly poor planning accuracy.

- The annual variance between **planned procurement budgets and actual procurement expenditure** at the national level has averaged **±23% over the past 10 years** (CAG Report 2023).
- This means that in a given year, if the budget allocation is ₹200,000 crore for MSP procurement, actual expenditure could be anywhere from ₹154,000 crore to ₹246,000 crore.
- The consequences of under-budgeting: procurement centres run out of funds mid-season, forcing farmers to sell at below-MSP to private traders.
- The consequences of over-budgeting: funds are locked and earn no return, creating fiscal inefficiency.
- In Tamil Nadu specifically:
  - Annual paddy procurement target (FY2024): approximately 36 lakh MT.
  - Actual procurement: approximately 28.4 lakh MT — **21% below target**.
  - Shortfall reason: procurement centres in several districts ran out of allocated budget before the harvest was complete.
  - Direct farmer impact: approximately 7.6 lakh MT of rice sold below MSP due to procurement shortfall.

### 1.8.2 The PMFBY Budget Estimation Problem

- PMFBY actuarial premium is set based on historical loss data. However:
- Historical loss data is collected manually by district agriculture officers with **known reporting biases** (under-reporting in low-loss years, over-reporting in disaster years for political reasons).
- The actual relationship between **weather parameters (rainfall deviation, temperature spikes, pest pressure)** and crop loss is well-studied scientifically but is **not programmatically integrated into PMFBY premium setting** in any state.
- AgroFinSense's post-harvest loss model uses NASA POWER rainfall data and ICAR published loss rate baselines to generate district-level loss estimates — providing exactly the data needed for scientifically sound PMFBY premium actuarial pricing.

---

## 1.9 Climate Change Compounding the Crisis

### 1.9.1 Temperature Rise Impact on Tamil Nadu Agriculture

- Tamil Nadu has recorded an average temperature increase of **+0.8°C over the past 50 years** (IMD Tamil Nadu State Climate Profile 2022).
- Projected temperature increase by 2050: **+1.5°C to +2.3°C** under IPCC RCP 4.5 scenario.
- For rice: every 1°C increase in night temperature reduces yield by approximately **6–10%** during the flowering and grain-filling stages.
- Direct impact: Tamil Nadu's rice yield may decline by **12–20%** by 2040 without adaptive management — a loss of approximately 64,000–107,000 MT of rice annually in Thanjavur district alone.

### 1.9.2 Rainfall Variability

- Northeast monsoon (Tamil Nadu's primary rainfall season, October–December) variability has increased significantly.
- The coefficient of variation (CV) of Northeast monsoon rainfall in Tamil Nadu increased from **28% in 1970–1990** to **43% in 2000–2023** — a 54% increase in year-to-year variability.
- This makes sowing decisions and irrigation scheduling dramatically harder for farmers using traditional knowledge.
- NASA POWER's 30-year historical data combined with seasonal weather outlook models can provide district-level rainfall deviation forecasts — the kind of probabilistic prediction that should be in every farmer's hands before sowing.
- Currently, it reaches approximately **0.003%** of Tamil Nadu farmers via specialist agriculture departments.

### 1.9.3 Extreme Weather Events

- Flood events affecting Tamil Nadu agricultural land (FY2015–FY2024):
  - December 2015 Chennai floods: approximately 4.5 lakh ha of cropland inundated.
  - November 2021 Cyclone Jawad aftermath: approximately 1.8 lakh ha affected.
  - December 2023 Northeast monsoon flooding: approximately 2.1 lakh ha affected.
- Total insured crop area during these events: **less than 20%** of affected area.
- Uncompensated losses from these three events alone: approximately ₹12,000–₹15,000 crore.
- AgroFinSense integrates flood alert data (open flood warning APIs) to provide early warnings that enable protective action — harvesting early, moving livestock, adjusting storage booking — before a flood event fully materializes.

---

## 1.10 The Aggregate Economic Cost of the Problem

### 1.10.1 Total Annual Losses Quantified

When we aggregate the losses described above, the total annual economic cost of India's agricultural information and planning failure is staggering:

| Loss Category | Annual Estimate (₹ Crore) | Tamil Nadu Share (₹ Crore) |
|---|---|---|
| Post-harvest food waste | 92,000 | 7,600 |
| Below-MSP price realization by farmers | 35,000 | 2,800 |
| Unclaimed PM-KISAN benefits | 19,200 | 900 |
| Unrealized soil test fertilizer savings | 18,000 | 2,100 |
| PMFBY uncovered crop losses | 24,000 | 1,900 |
| Procurement budget variance waste | 12,000 | 980 |
| Extension service quality gap | 8,500 | 680 |
| **TOTAL** | **2,08,700** | **16,960** |

> **₹2.09 lakh crore annually.** That is approximately USD 25 billion — lost every year, every crop cycle, because India's agricultural system lacks the information infrastructure to function efficiently.

### 1.10.2 The Farmer Suicide Crisis

Agricultural distress has a human cost that statistics cannot fully capture.

- India recorded **10,281 farmer suicides** in 2021 (NCRB Data).
- Tamil Nadu recorded **706 farmer suicides** in 2021.
- The primary documented causes: crop failure (34%), indebtedness (29%), family problems related to financial stress (22%), and price crash (15%).
- All four categories are at least partially addressable through better information systems:
  - Crop failure prediction → preemptive adaptation
  - Debt prevention → better price realization and scheme access
  - Family financial stress → stable income through market timing
  - Price crash mitigation → sell at optimal price window with AI forecast

---

## 1.11 The Digital Infrastructure Gap

### 1.11.1 Why Existing Agricultural Apps Have Failed

Over the past decade, India has seen dozens of agricultural app launches — from government (mKisan, Kisan Suvidha, PM-Kisan App) to private (DeHaat, AgroStar, Ninjacart, BigHaat). Yet farmer technology adoption remains at **approximately 8–12%** of the agricultural workforce.

Why have they failed?

**Reason 1: Language barrier**
Most apps are in English or formal Hindi. Tamil Nadu farmers speak colloquial Tamil with significant regional dialect variation. No app has integrated Bhashini TTS to actually speak to the farmer in their local language.

**Reason 2: Data silos**
Each app solves one problem. AgroStar sells inputs. Ninjacart does logistics. Kisan Suvidha shows weather. Not one app connects: soil health → crop selection → price forecast → scheme eligibility → storage booking → voice advisory → government planning. This end-to-end pipeline is what actually changes a farmer's decision.

**Reason 3: Mock data and generic advice**
Most agricultural advisory apps provide generic recommendations ("apply 120 kg/ha urea for rice") not personalized to the farmer's actual soil, district, micro-climate, and financial situation. A recommendation that does not reference the farmer's soil test data is treated correctly by farmers as irrelevant.

**Reason 4: No government integration**
Apps that cannot connect to PM-KISAN, PMFBY, and Bharat-VISTAAR cannot actually help farmers access the money they are entitled to. Without scheme auto-enrollment, the app is advisory only — not actionable.

**Reason 5: No live market data**
Apps that show static "typical price ranges" rather than live Agmarknet data cannot tell a farmer whether today is the right day to sell. This is the most basic requirement for a price advisory tool and most existing apps fail it.

**Reason 6: No government-side module**
Every agricultural app serves farmers. No app serves the government officer simultaneously — creating separate information islands when what is needed is a unified data platform where the farmer's soil upload directly feeds the district officer's procurement dashboard.

### 1.11.2 The AI Gap in Indian Agriculture

Large Language Models (LLMs) and ML-based predictive systems have transformed agriculture in the United States, Brazil, and the Netherlands. In India:

- **Precision agriculture coverage**: approximately 0.3% of cultivated area uses any form of AI-driven prescription farming.
- **ML-based yield forecasting**: used by approximately 3–4 major agribusiness companies for internal operations. Accessible to farmers: effectively zero.
- **SARIMAX price forecasting**: used by commodity traders at large firms. Accessible to farmers: zero.
- **XGBoost crop recommendation**: used in research papers by IARI, ICAR, and agricultural universities. Deployed in a production farmer-facing system: none identified.
- **Local LLM deployment for agricultural advisory**: AgroFinSense using gemma3:4b and llama3.2:3b via Ollama is, to the best of our knowledge, **the first production deployment of local small language models for Indian smallholder agricultural advisory**.

---

## 1.12 The Tamil Nadu Specific Context: 10 Key Districts

The AgroFinSense platform is designed around 10 Tamil Nadu districts selected to represent the full diversity of the state's agricultural zones.

### Erode District
- Area under cultivation: approximately 2.8 lakh ha.
- Primary crops: Groundnut (85,000 ha), Sugarcane (45,000 ha), Maize (32,000 ha), Turmeric.
- Key challenge: Groundnut price volatility (₹4,200–₹6,783/q range in 2024). Most farmers sell immediately post-harvest at low prices.
- Soil profile: Predominantly red loam with low N, adequate P, variable pH (6.2–7.8). Micronutrient deficiency (Zinc, Boron) common.
- Warehouse: TNSWC Erode (28,000 MT capacity, 55% utilization in 2024).
- PMFBY coverage: approximately 18% of farmers enrolled.

### Salem District
- Area: approximately 2.4 lakh ha.
- Primary crops: Maize (65,000 ha), Rice (28,000 ha), Banana (18,000 ha), Mango.
- Key challenge: Maize price crash during peak Kharif harvest (October–November). Price can drop 25–30% within 6 weeks of peak harvest due to simultaneous supply from Erode, Salem, and Namakkal districts.
- Soil: Laterite and black cotton soil. N deficiency in 68% of samples.
- Warehouse: NAFED Salem Complex (25,000 MT).

### Madurai District
- Area: approximately 3.1 lakh ha.
- Primary crops: Rice (72,000 ha), Cotton (38,000 ha), Onion (22,000 ha).
- Key challenge: Cotton lint prices volatile. Onion price crash in February–March (rabi harvest) is predictable but farmers continue to sell immediately.
- Soil: Black cotton soil dominant. High K naturally, P often limiting.

### Thanjavur District — The Rice Bowl
- Area: approximately 3.8 lakh ha.
- Primary crop: Rice (Paddy) — 180,000 ha. Seasonal production estimate: 320,000 MT per major season.
- Key challenge: Warehouse overflow. TNSWC Thanjavur (55,000 MT) can hold only 17% of seasonal rice production. The rest is stored in private facilities at high cost or in open areas with significant quality loss.
- Soil: Heavy clay (vertisol) with high organic carbon in flood-irrigated delta fields. pH typically 6.8–7.4 — relatively optimal.
- This is the district most affected by the storage gap AgroFinSense's buffer stock module addresses.

### Coimbatore District
- Area: approximately 3.3 lakh ha.
- Primary crops: Maize (42,000 ha), Cotton (28,000 ha), Groundnut (35,000 ha), Coconut.
- Key challenge: Proximity to major trading centres (Coimbatore city) creates information asymmetry — city traders have real-time price data, farmers in blocks 40–60 km away do not.
- Soil: Sandy loam to clay loam. N and micronutrient deficiency common.
- Unique feature: FCI Coimbatore has cold storage capacity (32,000 MT total, cold chain available) — one of the few districts with meaningful cold chain infrastructure.

### Trichy District
- Area: approximately 2.9 lakh ha.
- Primary crops: Rice (95,000 ha), Banana (18,000 ha), Groundnut (25,000 ha).
- Key challenge: FCI Trichy depot is the state's largest (45,000 MT) but current stock is typically 31,500 MT (70% utilization) — leaving limited buffer for peak harvest season.

### Vellore District
- Area: approximately 2.0 lakh ha.
- Primary crops: Rice (48,000 ha), Maize (35,000 ha), Groundnut (22,000 ha).
- Key challenge: Among the most water-stressed districts in Tamil Nadu. Groundwater depletion acute. Weather-driven yield variance high.

### Tirunelveli District
- Area: approximately 2.8 lakh ha.
- Primary crops: Rice (65,000 ha), Banana (35,000 ha), Cotton (18,000 ha).
- Key challenge: Banana is highly perishable. The TNSWC Tirunelveli cold store (30,000 MT, cold chain available) is critical infrastructure — its utilization and overflow status directly determines banana spoilage rates.

### Chennai District
- Area: approximately 0.5 lakh ha (primarily peri-urban agriculture).
- Primary crops: Vegetables (5,000 ha), Paddy (8,000 ha).
- Role in the system: FCI Chennai Central (60,000 MT) serves as the overflow warehouse for the entire state's FCI network and is the receiving point for state-traded grain exports.

### Tiruppur District
- Area: approximately 2.5 lakh ha.
- Primary crops: Cotton (55,000 ha), Maize (28,000 ha), Groundnut (32,000 ha).
- Key challenge: Cotton price is linked to global textile market (Tiruppur is India's largest knitwear export hub) — creating a unique local price dynamic not present elsewhere in Tamil Nadu.
- Cold Store Tiruppur: private facility, 8,000 MT capacity, cold chain available — critical for cotton ginning quality.

---

## 1.13 Summary: The Problem in One Paragraph

India's smallholder farmers — 86% of all farmers, 126 million families, 600 million people — make the most consequential economic decisions of their year (what to plant, when to sell, which inputs to buy, which government programs to enroll in) with no reliable data, no price forecast, no personalized soil intelligence, and no connection to the institutional infrastructure designed to support them. The result is ₹2.09 lakh crore in annual losses: food wasted, income unrealized, budget misspent, schemes unclaimed. Tamil Nadu alone loses approximately ₹16,960 crore per year to this information gap. This is the problem AgroFinSense exists to solve.

---
---

# PART 2: WHY EXISTING SYSTEMS FAIL

---

## 2.1 Framework for Failure Analysis

Before documenting solutions, it is essential to understand precisely why previous and existing systems have failed to address these problems. The failures are not random — they follow clear, predictable patterns rooted in architecture, incentives, and assumptions about the problem being solved.

We analyze failures across five categories:
1. Government digital platforms
2. Private agricultural technology companies
3. Market information systems
4. Financial inclusion schemes
5. Research and advisory institutions

---

## 2.2 Government Digital Platforms: A Catalogue of Failures

### 2.2.1 Kisan Suvidha — The Well-Intentioned Silo

Kisan Suvidha is the Ministry of Agriculture's flagship mobile application, launched in 2016.

**What it offers:**
- Weather information (5-day forecast)
- Market prices (from Agmarknet)
- Dealer information (certified input dealers near a PIN code)
- Plant protection information (crop pest/disease guide)
- Cold storage locations

**Why it fails:**

*Failure 1: No personalization*
Kisan Suvidha provides the same information to every user. There is no registration, no soil profile, no farm history, no crop selection. A farmer in Thanjavur and a farmer in Tirunelveli see the same generic rice cultivation guide.

*Failure 2: No AI or prediction layer*
The weather data is a 5-day forecast — not a 6-month outlook for planting decisions. The market prices are current values — not a 12-month forecast for selling decisions. The app is a data display tool, not an advisory system.

*Failure 3: Language barrier*
The app is available in English and 11 regional languages, but the interface remains complex. The plant protection guide uses scientific names (Pyricularia oryzae for rice blast) rather than the common Tamil names farmers use.

*Failure 4: No scheme integration*
Kisan Suvidha does not show a farmer their PM-KISAN status, their PMFBY enrollment, or their Soil Health Card data. It is isolated from every other government database.

*Failure 5: No live data pipeline*
The Agmarknet price data in Kisan Suvidha is often **3–7 days stale** due to manual data entry delays. For time-sensitive selling decisions, 3-day-old prices are useless. AgroFinSense integrates Agmarknet 2.0 API with automatic polling every 60 seconds via Celery workers.

*Failure 6: No voice interface*
In 2024, Kisan Suvidha still does not have a text-to-speech feature for Tamil. A farmer who cannot read Tamil text fluently cannot use it. AgroFinSense integrates Bhashini TTS to read out the full advisory in the farmer's dialect.

*Download count:* approximately 5 crore downloads (Google Play as of 2024).
*Active monthly users:* estimated **3–8% of downloads** (typical government app retention metrics).
*Effective reach:* approximately 1.5–4 million regular users out of 600 million agricultural workforce — **less than 0.67%**.

---

### 2.2.2 mKisan Portal: Fragmented by Design

The mKisan system coordinates SMS-based agricultural advisories from state agriculture departments, KVKs (Krishi Vigyan Kendras), and research institutions.

**Scale:** 3.8 crore registered phone numbers nationally.

**Failures:**

*Fragmentation:* 28 different agencies can send advisories through mKisan. A farmer may receive 3–5 overlapping SMS messages from different sources on the same day, sometimes with conflicting recommendations.

*Generic content:* The same advisory is sent to all farmers in a block regardless of their specific crop, land size, soil type, or irrigation access.

*No feedback loop:* The system has no mechanism to learn whether the advice was followed or whether it improved outcomes. There is no A/B testing, no impact measurement, no iteration.

*No price integration:* mKisan advisories say "apply urea at tillering stage." They do not say "also note that urea prices have increased 35% since last year and here is the calculation of your exact requirement based on your soil nitrogen level."

*Timing irrelevance:* SMS messages are often sent at 2 AM (batch processing) or at times when farmers are working and cannot read them.

---

### 2.2.3 PM-KISAN Portal: Registration Complexity vs. Farmer Literacy

**The registration process requires:**
1. Aadhaar number (farmers may have it but not know the number)
2. Aadhaar-linked bank account (large fraction of elderly farmers have savings accounts not yet Aadhaar-linked)
3. Land records (Patta — many smallholders have oral/traditional land tenure, not formal Patta)
4. Mobile number linked to Aadhaar
5. Navigation of a 7-step web portal designed for urban users

**The result:** An estimated **2.1 crore eligible farmers nationally have tried and failed to self-register**. They have land, they are farmers, they are eligible — but the registration system excludes them.

AgroFinSense's scheme module solves this by:
- Automatically checking eligibility based on farmer profile (land area, crop type, district)
- Providing direct deep-link URLs to each scheme application page
- Explaining eligibility criteria in plain Tamil via the Bhashini voice advisory
- Notifying the farmer of the registration window deadlines for time-limited schemes

---

### 2.2.4 PMFBY Digital Infrastructure: The Claims Processing Failure

PMFBY has invested significantly in digital infrastructure including a National Crop Insurance Portal and satellite-based crop loss assessment. Yet:

**Claims processing time:** Average time from crop loss event to farmer compensation: **6–14 months** (CAG Audit Report 2022).

**Technology failure:** The satellite-based crop cutting experiment (CCE) system was supposed to replace manual crop cutting within 5 years of PMFBY launch in 2016. As of 2024, approximately **73% of CCE data is still collected manually** with paper forms.

**Yield data quality:** District-level yield data submitted to PMFBY actuaries is collected by state agriculture departments through field surveys. Given the 63% AEO vacancy rate documented in Part 1, many survey entries are estimated or extrapolated, not measured.

**The core architectural failure:** PMFBY was designed as an **insurance product** added onto the agricultural system, rather than as an **integrated risk management system**. A properly integrated system would connect PMFBY actuarial data to NASA weather data, Agmarknet price data, ISRO NDVI data, and soil health data — automatically computing loss probabilities by district, crop, and month, enabling real-time claim assessment rather than 6-month manual surveys.

---

### 2.2.5 National Agriculture Market (e-NAM): The Infrastructure Success, Adoption Failure

e-NAM (Electronic National Agriculture Market) is the most technically sophisticated government agricultural system in India — an online trading platform connecting 1,389 mandis across 18 states.

**What works:**
- Real-time auction price discovery
- Electronic payment within 2–3 days of sale
- Quality assaying integration (though partial)
- Live price feeds accessible via WebSocket API

**Why farmer adoption is low:**

*Minimum lot size:* e-NAM transactions require a minimum lot of 10–50 quintals depending on commodity. Most smallholders harvest 2–8 quintals per crop. They cannot participate directly.

*Transport cost:* Bringing produce to an e-NAM-integrated mandi from a remote village costs ₹1,200–3,500 per trip. For a 5-quintal sale, this absorbs 30–60% of the price advantage gained.

*Technology requirement at the mandi:* Traders must be registered, have digital payment capabilities, and understand the platform. Many traditional mandi agents refuse to participate, effectively excluding their supply chain from e-NAM.

*No price prediction:* e-NAM shows current prices but has no forecasting module. It does not tell a farmer that rice prices in their mandi will be ₹200/q higher in 6 weeks. AgroFinSense's SARIMAX+LSTM ensemble addresses this gap directly.

---

## 2.3 Private Agricultural Technology Companies: Common Failure Patterns

### 2.3.1 DeHaat — The Aggregation Model's Limits

DeHaat operates in Bihar, UP, Odisha, and parts of North India. It aggregates input delivery, advisory, and output marketing for farmers.

**Scale:** approximately 11,000 "DeHaat Centres" serving approximately 11 lakh farmers (as of 2023).

**Coverage rate:** serves approximately 0.075% of India's farmer households.

**Why growth is constrained:**

*Physical infrastructure dependency:* The DeHaat model requires a physical micro-entrepreneur ("Agri Entrepreneur") in each village to interface between the platform and the farmer. This creates a people-dependency that limits scaling speed and introduces quality variance.

*Geographic concentration:* DeHaat is not present in Tamil Nadu at all. Its model was designed for Hindi-belt farming systems (rice-wheat rotation, flat topography, APMC-dominant markets) and does not translate to Tamil Nadu's diverse crop portfolio and different institutional structure.

*No government data integration:* DeHaat's platform does not connect to Bharat-VISTAAR, PMFBY, or Agmarknet real-time feeds. Its advisory model relies primarily on agronomists manually encoding recommendations, not on ML models trained on live data.

---

### 2.3.2 AgroStar — The Input Sales Model's Advisory Conflict

AgroStar is one of India's most funded agricultural platforms (~$130M raised as of 2024), primarily selling agricultural inputs (seeds, pesticides, fertilizers) with an advisory layer.

**The fundamental conflict:** AgroStar's revenue model depends on farmers buying inputs through the platform. Its advisory system therefore has a structural incentive to recommend inputs — even when the optimal advice might be "you don't need any additional fertilizer based on your soil test."

**Result:** AgroStar's AI advisory recommendations have been criticized in agricultural research circles for systematically **over-recommending inputs** compared to soil-test-based recommendations.

**No live price data:** AgroStar does not provide live Agmarknet price feeds or price forecasting.

**No government scheme integration:** AgroStar does not check PM-KISAN or PMFBY eligibility.

**No GovTech module:** There is no district-level procurement planning, warehouse status, or budget projection feature for government users.

---

### 2.3.3 Ninjacart — The Supply Chain Solution That Bypasses the Farmer

Ninjacart is a B2B fresh produce supply chain platform that directly connects farms to retail chains and restaurants.

**What it does well:** Eliminates multiple middlemen for bulk horticulture produce, providing better price realization for farmers who participate.

**What it does not do:**

- Serves approximately **1.5 lakh farmers** nationally — 0.1% of the agricultural workforce.
- Requires farmers to commit minimum supply volumes that most smallholders cannot guarantee.
- Does not provide weather data, soil analysis, yield prediction, scheme eligibility, or government-side tools.
- Focused exclusively on fresh produce (tomato, onion, potato) — does not cover cereals, pulses, oilseeds, or fibre crops.

**The core gap:** Ninjacart is a logistics solution, not an intelligence platform. It solves the distribution problem for farmers already producing the right crop at the right time. It cannot help a farmer decide **what** to grow or **when** to sell — the prior decision that determines whether the logistics problem even matters.

---

### 2.3.4 The Common Failures Across Private AgTech

Across DeHaat, AgroStar, BigHaat, Bijak, Fasal, Gramophone, and a dozen other private agricultural technology platforms, common patterns emerge:

**Failure Pattern 1: Solving one part of the chain in isolation**
Each platform addresses one node: input delivery OR price discovery OR logistics OR credit OR insurance. No platform connects all nodes into a unified decision-support system. The farmer must use 5–7 different apps, none of which talk to each other.

**Failure Pattern 2: Venture capital incentives distort product direction**
VC-backed agricultural platforms require growth metrics for fundraising. This systematically biases them toward high-volume but low-depth engagements (app downloads, transaction counts) rather than deep outcomes (did this farmer's income increase?). The hardest problems — soil intelligence, personalized forecasting, GovTech integration — generate no direct revenue and are therefore not built.

**Failure Pattern 3: B2B focus abandons smallholders**
The most profitable customers in agricultural platforms are large farmers (>10 ha), farmer producer organizations (FPOs), and agribusiness companies — not the 86% of farmers who are small and marginal. Platforms that raise enough funding to survive inevitably pivot toward B2B, abandoning the core population problem.

**Failure Pattern 4: No local language AI**
Despite the obvious need, no private platform has deployed an LLM-powered advisory system in Tamil or any other Indian language that reads the farmer's actual soil data and generates a personalized advisory. The reason: building a voice-first, multilingual AI system requires significant NLP infrastructure and ongoing model maintenance. It does not fit the "build fast, grow fast" VC-backed model.

---

## 2.4 Market Information Systems: The Data Quality Problem

### 2.4.1 Agmarknet's Architecture

Agmarknet is the foundation of India's agricultural market information system, collecting price data from approximately 3,200 Agricultural Produce Market Committees (APMCs) nationwide.

**The data quality problem:**

*Manual entry:* Most mandis still enter price data manually at the end of each trading day. Market closes at 5 PM; data enters the Agmarknet system at 7–10 PM. "Live" prices are actually end-of-day summaries.

*Commodity mapping inconsistency:* The same commodity is listed under different names by different state agencies. Rice might be listed as "Paddy", "Rice (Raw)", "Paddy (Basmati)", "Arwa Rice", or "Common Rice" depending on the mandi. Filtering by "Rice" in the API returns only a subset of actual rice price data.

*Coverage gaps:* Only APMC-registered mandis are on Agmarknet. A significant share of trading, especially for vegetables and perishables, happens in informal markets that are entirely absent from the system.

*Lag time:* The data.gov.in API for Agmarknet (resource ID: 9ef84268-d588-465a-a308-a864a43d0070) frequently returns records with 2–5 day lags during high-volume harvest periods when data entry backlogs accumulate.

AgroFinSense addresses this by: caching prices in Redis with 5-minute TTL, maintaining a local DB of all fetched prices, and supplementing with e-NAM WebSocket for intraday price updates when the Agmarknet API is stale.

### 2.4.2 Why Price Information Alone Is Not Enough

Even if Agmarknet data were perfect and real-time, showing current prices to a farmer without a forecast is only marginally useful.

**The decision a farmer faces is not:** "What is today's price?"
**The decision is:** "Should I sell today at ₹2,100/quintal, or wait 3 weeks and sell at a potentially higher price?"

Answering the second question requires:
- A 12-month price forecast (SARIMAX + LSTM)
- Weather correlation analysis (will drought reduce supply and spike prices?)
- Market calendar knowledge (is the government procurement window open?)
- Cash flow understanding (can this farmer afford to hold inventory for 3 weeks?)

No existing price information system answers all four questions. AgroFinSense does.

---

## 2.5 The Research-to-Farmer Delivery Failure

### 2.5.1 ICAR's Production vs. Delivery Gap

The Indian Council of Agricultural Research (ICAR) operates 103 institutes and 71 KVKs, employing approximately 8,500 scientists. It produces world-class research in crop varieties, soil science, post-harvest technology, and precision agriculture.

**The delivery failure:** ICAR's research outputs reach farmers through:
1. KVK demonstration plots (affects farmers who live within 5 km of a KVK and visit it — approximately 2–3% of farmers)
2. Extension bulletins (printed documents, English/Hindi, distributed at government offices — reach approximately 1% of farmers)
3. Training camps (intensive 2–5 day camps attended by approximately 0.5% of farmers per year)

**The gap:** ICAR's published NPK requirement tables for Tamil Nadu crops (the exact data used in AgroFinSense's `crop_matcher.py` CROP_NPK_REQUIREMENTS dictionary) are among the most thoroughly validated agricultural data available. Yet they sit in ICAR Technical Bulletins that most farmers have never seen and could not read if they had.

The digitization of this knowledge — converting ICAR's published tables into a programmable rule engine that runs against a farmer's actual soil data — is a core innovation of AgroFinSense. It is conceptually simple, technically straightforward, and practically transformative. Yet it has not been done in any deployed farmer-facing system.

---

## 2.6 The Governance Layer: What Government Officers Actually Face

### 2.6.1 The District Agriculture Officer's Information Environment

A District Agriculture Officer (DAO) in Tamil Nadu is responsible for:
- Overseeing cultivation in their district (approximately 2–4 lakh ha)
- Setting procurement targets and coordinating with FCI/NAFED
- Managing PMFBY enrollment and claim settlement
- Coordinating input supply (seeds, fertilizers) to distribution centres
- Reporting district production statistics to state headquarters

**Their current information tools:**
- Physical reports from 30–50 agricultural extension officers (who cover the district on motorcycles)
- State agriculture department Excel-based yield estimation templates
- FCI depot utilization reports submitted by telephone or email
- Manual PMFBY claim settlement files
- No dashboard, no visualization, no AI synthesis

**The result:** A DAO makes ₹25,000–35,000 crore procurement decisions (at the district level across a full season) based on information that is:
- 15–30 days old (field reports from extension officers)
- Subject to field officer estimation bias
- Not integrated with weather data, price data, or satellite data
- Never synthesized by any AI model

AgroFinSense's GovTech module gives the DAO a live dashboard with:
- District yield forecast (gemma3:4b + XGBoost output)
- Procurement budget requirement (BudgetEngine)
- Warehouse utilization and overflow status (StoragePlanner with PostGIS)
- AI briefing in plain English generated by gemma3:4b (5 seconds of reading vs. 3 days of report collation)

### 2.6.2 The Budget Allocation Cycle Failure

The annual agricultural budget cycle in Tamil Nadu works as follows:
- June–July: DAOs submit district-level estimates of expected production to state headquarters
- August: State aggregates and submits to central government
- September–October: Central budget allocation announced
- October–December: Kharif harvest and procurement window

The critical timing failure: budget allocations are determined **before the harvest season**, based on estimates made **before weather outcomes are known**. If the Northeast monsoon fails after the September budget commitment, procurement demand may be 30% lower than estimated (drought kills yield). If it's exceptional, demand may be 25% higher.

The result: systematic over- or under-procurement, creating either fiscal waste or farmer distress, every year, predictably.

A NASA POWER-integrated yield and procurement forecasting model updated monthly through the season (as in AgroFinSense) would enable rolling budget revisions — but this technology has not been integrated into the budget planning process.

---

## 2.7 The OCR + Soil Data Integration Failure

### 2.7.1 The Soil Health Card Data Graveyard

The Soil Health Card database is one of the largest agricultural datasets ever collected in India — 22.7 crore cards with NPK, pH, OC, and micronutrient data for hundreds of millions of farm plots.

This dataset has **never been systematically connected to any AI advisory system**.

The cards are issued as printed documents. The data exists in state agriculture department servers (in various formats across 28 states). No API provides programmatic access to soil health card data.

AgroFinSense's approach is direct: instead of waiting for the government to provide a soil data API, the app lets farmers photograph or upload their existing Soil Health Card PDF. EasyOCR + PyMuPDF extracts the NPK/pH data in seconds. The data is immediately fed into the XGBoost yield model.

This is the bypass approach: acknowledge that the government data pipeline will not work in time, and build a direct farmer upload path instead. It works with the cards farmers already have.

### 2.7.2 Why OCR-Based Soil Data Extraction Had Not Been Done

The technical barriers:
1. Soil Health Cards are formatted differently across 28 states — no standardized layout.
2. OCR on scanned documents with regional language labels (N in Tamil: நைட்ரஜன்) requires a model that handles multiple scripts.
3. The extracted values must be mapped to a standardized unit (kg/ha for all three macronutrients) regardless of how the card expresses them (some in kg/ha, some in ppm, some in percentage).

AgroFinSense's `soil_parser.py` addresses all three: multi-layout regex matching, English-primary OCR (since the numbers and labels are usually in English even on Tamil-language cards), and unit normalization.

---

## 2.8 The LLM Integration Gap: Why AI Advisory Hasn't Reached Farmers

### 2.8.1 Cloud LLM Cost Barrier

Services like GPT-4, Gemini, and Claude API charge approximately $0.003–$0.015 per 1,000 output tokens. A 200-word Tamil agricultural advisory costs approximately $0.01–$0.05 per query.

For a platform serving 1 lakh farmers, with each farmer requesting one advisory per week, the monthly LLM API cost would be:
- 1,00,000 farmers × 4 queries/month × $0.03/query = **$12,000/month** (approximately ₹10 lakh/month).

This is financially unsustainable for a government-served agricultural platform. It is also a data privacy issue: farmer soil data and financial profiles sent to US-based cloud AI providers.

### 2.8.2 The Local LLM Solution

Ollama, released in 2023, enables running open-source language models locally. With gemma3:4b (3.3 GB, runs on 8 GB RAM) and llama3.2:3b (2.0 GB, runs on 6 GB RAM):

- **Cost per query: ₹0** — powered by the server's existing electricity.
- **Data privacy: complete** — no data leaves the local network.
- **Latency: 3–15 seconds** for a full advisory — acceptable for agricultural decision support.
- **Tamil language capability:** gemma3:4b has demonstrated Tamil language generation quality sufficient for agricultural advisory text.

AgroFinSense is the first agricultural platform to deploy local small language models (gemma3:4b for narratives, llama3.2:3b for fast JSON tasks) as the AI backbone of a farmer advisory system. This solves the cost barrier, the privacy problem, and the cloud dependency simultaneously.

### 2.8.3 The Model Routing Innovation

The dual-model architecture is a key design decision in AgroFinSense:

**gemma3:4b** (3.3 GB, higher quality, slower):
- Used for: Tamil farmer narrative advisory (200 words, 3 paragraphs)
- Used for: Government district briefings (official tone, 120 words)
- Temperature: 0.4 for farmer advisory (natural language), 0.2 for government briefing (factual)
- Average response time on CPU: 8–15 seconds

**llama3.2:3b** (2.0 GB, faster, structured output):
- Used for: Yield reasoning JSON extraction (`{estimated_yield_kg_per_ha, confidence, limiting_factor, risk_score}`)
- Used for: Crop risk classification (structured JSON)
- Temperature: 0.0–0.1 (deterministic for JSON parsing)
- Average response time on CPU: 3–6 seconds

This routing eliminates the quality-vs-speed trade-off: use the right model for the right task.

---

## 2.9 The PostGIS and Geospatial Gap

### 2.9.1 Why Geographic Intelligence Is Missing from Agricultural Systems

Agricultural decisions are fundamentally geographic: a crop recommendation for a farm at 11.3°N latitude and 77.7°E longitude (Erode) will differ from a recommendation for 9.9°N latitude (Tirunelveli) even if soil profiles are identical — because of different agro-climatic zones, different market access, different warehouse proximity.

No existing Indian agricultural advisory system uses geospatial queries to:
- Find the nearest agri store within 10 km for a specific input type
- Calculate which FCI/TNSWC warehouse has the most available capacity within 100 km of the harvest location
- Generate overflow routing when primary warehouses are near capacity
- Map farmer distribution relative to scheme enrollment centres

AgroFinSense uses **PostGIS** (PostgreSQL geographic extension) for:
1. `ST_DWithin` queries: find stores within 10 km of a district centroid
2. `ST_Distance` ordering: rank warehouses by proximity for optimal routing
3. Storage allocation geometry: identify the nearest alternate warehouse for overflow routing when a primary depot reaches 90% capacity
4. District centroid mapping: precise lat/lng coordinates for all 10 districts drive the NASA POWER API calls with accurate geographic targeting

This is not a theoretical advantage — it directly determines whether a farmer can find fertilizer 3 km away vs. having to travel 45 km to the district capital.

---

## 2.10 Summary: The 12 Systematic Failures AgroFinSense Addresses

| # | Failure | Why Existing Systems Don't Fix It | AgroFinSense Solution |
|---|---|---|---|
| 1 | No personalized soil-based crop advice | Apps give generic recommendations | EasyOCR soil PDF → XGBoost recommendation |
| 2 | No 12-month price forecast | Agmarknet shows current, not future | SARIMAX + LSTM ensemble forecast |
| 3 | Price data 3–7 days stale | Manual entry at mandis | Agmarknet 2.0 API + Redis 60s poll |
| 4 | No weather-price correlation | Weather apps ≠ price apps | NASA POWER + weather_price_recognizer |
| 5 | No Tamil voice advisory | Bhashini not integrated anywhere | Bhashini TTS + gemma3:4b Tamil narrative |
| 6 | Scheme enrollment complexity | Portal too complex for farmers | Auto-eligibility check + deep-link apply URLs |
| 7 | Cloud LLM not affordable at scale | $12,000/month API cost | Local Ollama: ₹0/month |
| 8 | No gov-side procurement planning | DAO uses Excel + phone calls | GovTech dashboard: live budget + warehouse AI |
| 9 | Storage overflow undetected in advance | No forecast-to-capacity matching | StoragePlanner: PostGIS overflow routing |
| 10 | Post-harvest loss not predicted | Loss quantification only after event | ICAR-based loss model × weather inputs |
| 11 | Soil Health Card data never used | Paper documents, no digital pipeline | EasyOCR extracts NPK from uploaded PDF |
| 12 | No end-to-end platform | 5–7 separate apps, no integration | Single unified pipeline: soil → crop → price → scheme → storage → voice |

---
---

# PART 3: THE SOLUTION — AGROFINSENSE ARCHITECTURE AND INNOVATIONS

---

## 3.1 Platform Overview

AgroFinSense is a unified Agriculture + Fintech + GovTech intelligence platform with two primary users:

**User A: The Farmer**
A Tamil Nadu smallholder farmer with a smartphone, an existing Soil Health Card, and no technical background. They need: what to grow, when to sell, what inputs to buy, which government schemes to enroll in — all in Tamil, all in one place.

**User B: The Government Officer**
A District Agriculture Officer or block-level officer who needs district-level yield forecasts, procurement budget projections, warehouse status, and AI-generated briefings — without spending 3 days collating reports manually.

The platform connects these two users through a single data pipeline: the farmer's soil upload feeds the ML models, whose outputs inform both the farmer advisory and the government procurement intelligence.

---

## 3.2 Core Innovations: Listed and Explained

---

### Innovation 1: OCR-to-Intelligence Pipeline (Soil PDF → Yield → Recommendation)

**What it is:**
A complete automated pipeline that converts a farmer's printed Soil Health Card into a personalized crop recommendation and yield forecast within 60–90 seconds.

**How it works:**
1. Farmer uploads a Soil Health Card PDF through the web interface.
2. `soil_parser.py` uses PyMuPDF to render each PDF page at 200 DPI, then EasyOCR to extract text from the rendered image.
3. Regex patterns (`r'nitrogen[:\s]+(\d+\.?\d*)'`, etc.) extract NPK, pH, and organic carbon values.
4. Values are normalized to standard units (kg/ha for macronutrients).
5. A confidence score is computed as `(found_fields / 5.0)` — indicating how many of the 5 key values were successfully extracted.
6. The extracted soil profile is stored in PostgreSQL (soil_profiles table) and the raw PDF is stored in MongoDB via GridFS.
7. A Celery task chain is triggered: yield prediction → crop matching → price forecast → scheme check → AI narrative generation.
8. The farmer sees a live progress stepper in the UI as each pipeline stage completes.

**Why it's innovative:**
No existing deployed agricultural platform extracts soil card data from PDFs and feeds it into ML models for personalized recommendation. The 22.7 crore Soil Health Cards that have been issued in India contain immensely valuable data that is currently sitting unused in printed documents. This pipeline unlocks that data.

**Technical files:** `backend/ocr/soil_parser.py`, `backend/tasks.py` (`run_full_farmer_pipeline`), `frontend/src/pages/SoilUploadPage.tsx`

---

### Innovation 2: Dual Local LLM Routing (gemma3:4b + llama3.2:3b via Ollama)

**What it is:**
A two-model AI architecture using locally-hosted open-source LLMs for agricultural advisory generation — eliminating cloud API costs while maintaining quality.

**How it works:**
- `ollama_ai.py` implements an `_call_ollama()` base function that POSTs to `http://localhost:11434/api/generate`.
- `generate_why_narrative()` routes to gemma3:4b with temperature 0.4, requesting a 3-paragraph Tamil advisory citing soil values and price forecast.
- `predict_yield_with_reasoning()` routes to llama3.2:3b with temperature 0.1, requesting a deterministic JSON object with yield estimate, confidence, limiting factor, and risk score.
- `generate_district_gov_summary()` routes to gemma3:4b with temperature 0.2, requesting an official procurement briefing for district collectors.
- `classify_crop_risk()` routes to llama3.2:3b with temperature 0.0, requesting a structured JSON risk classification.

**JSON failure handling for llama3.2:3b:**
llama3.2:3b occasionally adds explanatory text before or after the JSON. The implementation:
1. Attempts `json.loads(response)` directly.
2. If that fails, retries with a stricter prompt ("Return ONLY the JSON object, nothing else, no explanation text before or after the braces").
3. If second attempt fails, returns safe defaults to prevent pipeline crash.

**Why it's innovative:**
Running production-quality LLM advisory at zero API cost with complete data privacy is a breakthrough for agricultural platforms serving low-income populations. The routing architecture — using a larger model for quality-sensitive tasks and a smaller model for speed-sensitive structured tasks — is a practical engineering pattern that balances quality and latency.

**Technical files:** `backend/integrations/ollama_ai.py`

---

### Innovation 3: SARIMAX + LSTM Ensemble Price Forecasting with Weather Exogenous Variables

**What it is:**
A 12-month agricultural commodity price forecasting system that integrates seasonal time series analysis (SARIMAX), deep learning (LSTM), and real-time weather data.

**How it works:**
- Historical price data (24 months) is fetched from Agmarknet API and stored in the market_prices table.
- Historical weather data (3 years) is fetched from NASA POWER API for the district's coordinates.
- SARIMAX(1,1,1)(1,1,1,12): captures monthly seasonality and weather-driven trend shifts. Weather exogenous variables: `rainfall_deviation_pct` and `avg_temp_max`.
- LSTM architecture: `Input(60, 5)` → `LSTM(64, return_sequences=True)` → `LSTM(32)` → `Dense(1)`. Features: price, rainfall, NDVI mean, month_sin, month_cos. Trained for 100 epochs with early stopping.
- Ensemble: `0.6 × sarimax_pred + 0.4 × lstm_pred`.
- Output: 12-month series with historical (solid blue), current live price (blinking red dot), and forecast (dashed green = up, dashed yellow = down).

**The weather_price_recognizer:**
This function computes the correlation between historical rainfall deviations and historical price spikes for a specific crop+district combination. Output: `{volatility_score, spike_probability_pct, driver_text}`. Example: "Rainfall deviation: -22% → below-average monsoon → groundnut supply likely tight in October-November → price spike probability: 68%."

**Why it's innovative:**
This is the first publicly documented agricultural price forecasting system in India that: (a) uses real Agmarknet data rather than simulated prices, (b) integrates NASA POWER weather exogenous variables into the SARIMAX model, (c) combines SARIMAX and LSTM ensembles for improved accuracy, and (d) presents the 12-month forecast with visual direction coding and hover tooltips explaining each forecasted price movement.

**Technical files:** `backend/ml/price_model.py`

---

### Innovation 4: GovTech Buffer Stock Intelligence Module

**What it is:**
A district-level yield-to-procurement-to-storage planning system that gives government officers predictive intelligence for procurement budget allocation and warehouse capacity management.

**Components:**

**BudgetEngine (`budget_engine.py`):**
- Fetches district_yield_forecast from PostgreSQL for the specified district + crop + season.
- Applies MSP_2025_26 dictionary (rice: ₹2,300/q, maize: ₹2,090/q, groundnut: ₹6,783/q, etc.) — real announced MSP values.
- Computes procurement_cost_inr = `total_tonnage_mt × 1000 / 100 × msp_per_quintal`.
- Fetches weather risk level from weather_snapshots and maps to PMFBY claim probability (low=8%, medium=18%, high=32%).
- Applies DISTRICT_SOWN_AREA_HA (real sown area data for 10 districts) to compute insured area.
- Outputs: procurement_cost_inr, pmfby_payout_est_inr, total_scheme_spend, per district per crop per season.

**StoragePlanner (`storage_planner.py`):**
- Uses DISTRICT_CENTROIDS (real lat/lng for 10 districts) for PostGIS queries.
- `ST_DWithin(geom, district_centroid, 100000)` finds all warehouses within 100 km.
- Computes available capacity = capacity_mt − current_stock_mt for each warehouse.
- If available >= forecast_tonnage: returns status "sufficient" with utilization percentages.
- If overflow: returns gap_mt, nearest alternate warehouse name and district (identified via ST_Distance), cold_chain_alert (true if the overflowing crop is perishable and the alternate warehouse lacks cold chain).

**PostHarvestLoss (`postharvest_loss.py`):**
- Uses ICAR 2023 published base loss rates per crop.
- Multiplies by weather_factor (1 + volatility × 0.4), storage_factor (1 + (1 − quality_score) × 0.5), and transport_factor.
- Returns: loss_percentage, risk_level, dominant_factor, recommendation, estimated_value_loss_inr.

**Why it's innovative:**
No government agricultural system in India currently provides: (a) district-level yield-to-storage capacity matching using PostGIS spatial queries, (b) PMFBY payout estimation from weather risk scores (rather than historical claim rates), (c) overflow routing intelligence showing which alternate warehouse should receive excess grain, (d) AI-generated district briefing synthesizing all three modules into a 2-paragraph summary for the District Collector. This module closes the gap between farm-level production forecasts and government procurement planning.

**Technical files:** `backend/ml/budget_engine.py`, `backend/ml/storage_planner.py`, `backend/ml/postharvest_loss.py`, `backend/routers/govtech.py`

---

### Innovation 5: Real-Time Price Streaming via WebSocket + Redis Pub/Sub

**What it is:**
A live price update system that pushes Agmarknet price data to all connected farmer clients within 60 seconds of a new price being available.

**How it works:**
- Celery beat runs `refresh_market_prices()` every 60 seconds, calling `agmarknet.poll_all_districts()`.
- For each crop × district combination: Agmarknet API is called, results stored to PostgreSQL, and published to Redis channel `f"price:{crop}:{district}"`.
- FastAPI WebSocket endpoint (`/ws/prices/{crop}/{district}`) subscribes to the Redis channel.
- On each Redis publication, the WebSocket handler forwards the JSON payload to all connected clients.
- The frontend `LivePriceChart.tsx` maintains a rolling 60-point buffer, animating each new data point.
- The current price dot (blinking red CSS animation) updates in real time.

**Why it's innovative:**
Live agricultural price streaming via WebSocket + Redis is implemented in commodity trading platforms. Deploying this architecture for smallholder farmers in a district-specific, crop-specific WebSocket feed — where a farmer in Erode sees live groundnut prices at Erode APMC while a farmer in Thanjavur sees live rice prices at Thanjavur mandi — is a new application of this architecture.

**Technical files:** `backend/integrations/agmarknet.py`, `backend/routers/ws.py`, `backend/tasks.py`, `frontend/src/components/LivePriceChart.tsx`

---

### Innovation 6: ICAR NPK Rule Engine for Crop Suitability Matching

**What it is:**
A programmatic implementation of ICAR's published crop-specific NPK requirement tables, combined with a Random Forest classifier trained on agro-climatic zone data, producing crop suitability scores from 0–10.

**The CROP_NPK_REQUIREMENTS dictionary (from published ICAR Agronomic Research):**
- rice: N optimal 200–280 kg/ha, P 15–25, K 150–200, pH 5.5–7.0
- maize: N optimal 180–240, P 12–22, K 120–180, pH 5.8–7.5
- groundnut: N optimal 20–40 (legume, fixes N), P 20–35, K 100–150, pH 6.0–7.5
- sugarcane: N optimal 280–350, P 20–30, K 200–280, pH 6.5–7.5
- (complete data for all 10 Tamil Nadu priority crops)

**Suitability scoring:**
- NPK proximity to optimal range: 0–4 points (based on how close actual values are to optimal midpoint)
- pH match: 0–2 points
- Season suitability: 0–2 points
- Weather suitability: 0–2 points (based on rainfall_deviation_pct)
- Maximum score: 10

**Fertilizer gap calculator:**
- Computes gap between actual soil NPK and optimal midpoint for each macronutrient.
- Converts NPK gap to specific fertilizer recommendations: DAP (18% N, 46% P₂O₅), Urea (46% N), MOP (60% K₂O).
- Applies 2025 subsidized prices (Urea ₹5.4/kg, DAP ₹27/kg, MOP ₹17/kg).
- Returns: {DAP_kg_per_ha, urea_kg_per_ha, MOP_kg_per_ha, estimated_cost_inr}.

**Why it's innovative:**
ICAR's NPK requirement data has been available in printed bulletins for decades. Converting it into a programmable rule engine that runs against a farmer's actual soil data — and returns not just a crop recommendation but the specific fertilizer purchase quantity and cost — is a direct, practical application of public research data that has not previously been deployed in a farmer-facing system.

**Technical files:** `backend/ml/crop_matcher.py`

---

### Innovation 7: Bhashini Voice Advisory Integration

**What it is:**
A Tamil language voice advisory system that converts AI-generated agricultural recommendations into spoken audio using the Government of India's Bhashini TTS API.

**How it works:**
- `bhashini.py` calls the Bhashini Dhruva API (`https://dhruva-api.bhashini.gov.in/services/inference/pipeline`).
- Pipeline task: TTS with `ai4bharat/indic-tts-coqui-dravidian-gpu--t4` service ID for Tamil female voice.
- Input: the `why_narrative` text generated by gemma3:4b for the farmer's recommendation.
- Output: MP3 audio bytes returned to the frontend.
- Frontend `VoiceAdvisory.tsx`: creates a Blob URL from the audio bytes, plays via HTML5 Audio API.
- Waveform animation (CSS) plays during audio playback.
- Text transcript displayed below the audio player.
- Graceful fallback: if Bhashini key is not configured, text-only mode with a clear explanation.

**Why it's innovative:**
Tamil Nadu has a 77.2% literacy rate, but functional Tamil literacy (ability to read agricultural advisory text containing technical terms) is significantly lower in rural areas. Voice-first delivery is not a convenience feature — it is an accessibility requirement. Bhashini provides government-hosted, free Tamil TTS at production quality. Connecting it to an AI-generated personalized agricultural advisory is a complete solution that serves the farmer who has never read a bulletin board but can listen to advice on their phone.

**Technical files:** `backend/integrations/bhashini.py`, `backend/routers/farmer.py` (`GET /farmer/voice/{id}`), `frontend/src/components/VoiceAdvisory.tsx`

---

### Innovation 8: Bharat-VISTAAR Scheme Auto-Eligibility Engine

**What it is:**
An automated government scheme eligibility checker that evaluates a farmer's profile against all applicable central and state government schemes, providing direct application links and benefit amounts.

**Scheme coverage:**
1. **PM-KISAN**: ₹6,000/year if land_ha ≤ 2.0
2. **PMFBY**: ₹(land_ha × 35,000 × 0.3) if crop in insured crops list
3. **Soil Health Card (SHC)**: ₹1,000 — always eligible
4. **PM-AASHA**: ₹(land_ha × 2,000) if crop is oilseed or pulse
5. **MIDH**: ₹(land_ha × 15,000) if crop is horticulture
6. **PKVY** (organic): ₹50,000/3 years if land_ha ≥ 0.5

**Implementation:**
- Primary path: calls Bharat-VISTAAR API (`https://api.bharatvistaar.gov.in/v1/eligibility`) with farmer profile.
- Fallback (hackathon / offline mode): local rule engine evaluating all 6 schemes based on farmer profile data already in the system.
- Results stored in scheme_eligibility table with INSERT ON CONFLICT DO UPDATE for idempotency.
- Frontend displays eligible schemes as green cards with "Apply Now" deep-link buttons, ineligible schemes as grey cards with eligibility criteria explanation.

**Why it's innovative:**
Scheme eligibility checking that works offline (without Bharat-VISTAAR API connectivity) using local rules, automatically informs farmers of schemes they didn't know about, and provides direct application links — eliminating the navigation burden that causes most eligible farmers to never apply.

**Technical files:** `backend/integrations/vistaar.py`, `backend/routers/scheme.py`, `frontend/src/pages/SchemesPage.tsx`

---

### Innovation 9: PostGIS Nearest-Facility Routing for Stores and Warehouses

**What it is:**
A geographic proximity engine using PostgreSQL's PostGIS extension to find the nearest agricultural input stores and storage warehouses relative to a farmer's or district's location.

**For farmers (agri stores):**
- `GET /farmer/stores/{district}` queries `ST_DWithin(geom, district_centroid, 10000)` — stores within 10 km.
- Results ordered by `ST_Distance(geom, district_centroid)`.
- Returns: store name, distance_km, sells_seeds, sells_fertilizer, tractor_rental, phone.
- Frontend `StoreMapPage.tsx`: Leaflet map with colour-coded markers (green=fertilizer, blue=seeds, orange=tractor).

**For government (warehouse routing):**
- `StoragePlanner.allocate()` queries warehouses within 100 km using `ST_DWithin`.
- If overflow: queries for alternate warehouses beyond 100 km (up to 300 km) ordered by `ST_Distance`.
- Overflow routing suggestion: "FCI Coimbatore Depot (32,000 MT, cold chain) — 87 km from Erode centroid — available capacity: 12,800 MT."

**Why it's innovative:**
Applying PostGIS spatial queries to agricultural logistics intelligence — both for consumer-facing store finding and for government-level storage overflow routing — is an approach not found in any existing Indian agricultural platform.

**Technical files:** `backend/db/models.py` (Geometry columns), `backend/db/seed_warehouses.py`, `backend/ml/storage_planner.py`, `backend/routers/farmer.py` (stores endpoint)

---

### Innovation 10: Celery Async Pipeline for Real-Time User Experience

**What it is:**
An asynchronous task processing system using Celery + Redis that runs the full ML pipeline (OCR → yield model → crop matching → price forecast → scheme check → AI narrative) in the background while the farmer sees real-time progress updates.

**How it works:**
- On soil PDF upload: Celery task `run_full_farmer_pipeline.delay(farmer_id, soil_profile_id)` is triggered immediately.
- The upload endpoint returns immediately with `{status: "processing"}` — no blocking the HTTP request.
- The Celery worker runs 5 pipeline stages sequentially, updating the recommendation record status.
- Frontend `SoilUploadPage.tsx` polls `GET /farmer/recommendation/{farmerId}` every 3 seconds.
- A 5-step progress stepper (Upload → OCR → Yield Model → Crop Match → AI Advisory → Done) visually advances as each stage completes.
- When status changes from "processing" to "complete", the full recommendation is rendered.

**Periodic tasks:**
- `refresh_market_prices()`: every 60 seconds — polls Agmarknet for all crop × district combinations.
- `compute_all_districts()`: every 3,600 seconds — runs BudgetEngine + StoragePlanner for all 10 districts.

**Why it's innovative:**
ML pipelines involving XGBoost inference, SARIMAX model generation, and LLM calls take 30–90 seconds end-to-end. Without async architecture, this blocks the HTTP connection and the user sees a loading spinner with no feedback. The Celery + poll pattern provides granular progress visibility, making a technically complex pipeline feel responsive and trustworthy to a non-technical farmer user.

**Technical files:** `backend/tasks.py`, `frontend/src/pages/SoilUploadPage.tsx`

---

### Innovation 11: Unified Dual-Persona Dashboard Architecture

**What it is:**
A single application serving two radically different user types — smallholder farmers and government district officers — through role-based routing from the same FastAPI backend.

**Farmer flow:**
Login (phone + language) → Home dashboard (live prices + risk score + top crop) → Soil upload → Price graph → Store map → Schemes → Voice advisory

**Officer flow:**
Login (officer role + district) → Government dashboard (choropleth heatmap + tonnage + budget) → District detail (yield confidence band + warehouse table + AI briefing) → Scheme stats

**Role-based access control:**
JWT tokens include `role: "farmer" | "officer" | "fpo"`. GovTech endpoints require `role == "officer" or role == "fpo"` — a farmer account cannot access the procurement intelligence dashboard.

**Data flow between personas:**
The farmer's soil upload feeds the XGBoost yield model. Aggregated across all farmers in a district, these yield predictions populate the `district_yield_forecasts` table. The officer's dashboard reads from this table. The farmer's individual upload thus indirectly improves the officer's district-level intelligence — creating a virtuous data loop.

**Why it's innovative:**
Building a platform where the same farmer data pipeline powers both individual advisory (farmer persona) and aggregate planning intelligence (government persona) creates a unified data ecosystem that benefits from network effects: more farmer uploads → better district yield forecasts → more accurate government procurement planning → better warehouse capacity for farmers at harvest time.

**Technical files:** `backend/routers/farmer.py`, `backend/routers/govtech.py`, `frontend/src/pages/FarmerDashboard.tsx`, `frontend/src/pages/GovDashboard.tsx`

---

### Innovation 12: NASA POWER Weather Integration Without API Key

**What it is:**
A free, zero-authentication, high-resolution weather data integration using NASA's POWER API that provides 30-year historical data and 6-month forecast for any lat/lng point on Earth.

**What NASA POWER provides (no API key required):**
- `PRECTOTCORR`: Precipitation (corrected rainfall in mm/day)
- `T2M_MAX`: Maximum temperature at 2m height (°C)
- `T2M_MIN`: Minimum temperature at 2m height (°C)
- `ALLSKY_SFC_SW_DWN`: Solar radiation (kWh/m²/day)
- Resolution: 0.5° × 0.5° spatial grid (approximately 55 km × 55 km at equator — suitable for district-level analysis)

**How AgroFinSense uses it:**
- `fetch_weather_forecast(district, 180)`: fetches 6-month forward forecast using hardcoded DISTRICT_COORDS.
- `get_historical_weather(district, 3)`: fetches 3 years of historical data for SARIMAX exogenous variable construction.
- `rainfall_deviation_pct`: key computed variable = (actual rainfall − 30yr average) / 30yr average × 100. Negative = drought risk; positive = good moisture.
- DISTRICT_30YR_RAINFALL_MM: hardcoded from IMD district climate profiles (Erode: 680mm, Salem: 925mm, Thanjavur: 1020mm, etc.) — used to compute deviation.

**Why it's innovative:**
Every government agricultural advisory system in India pays for private weather data APIs or relies on IMD's limited free feeds. NASA POWER's free, comprehensive, globally-calibrated dataset provides superior historical depth (30 years) at zero cost. Using it as the weather backbone for both ML model training and real-time forecast generation eliminates a significant infrastructure cost.

**Technical files:** `backend/integrations/nasa_weather.py`

---

## 3.3 Technology Innovations Summary Table

| Innovation | Primary Technology | Problem Solved | Impact |
|---|---|---|---|
| OCR → Intelligence pipeline | EasyOCR + PyMuPDF + XGBoost | 22.7 crore unused Soil Health Cards | Personalized crop advice from existing data |
| Dual local LLM routing | gemma3:4b + llama3.2:3b + Ollama | ₹10L/month cloud AI cost | Zero-cost private AI at farm level |
| SARIMAX + LSTM price forecast | statsmodels + PyTorch + Agmarknet | No price forecast for farmers | 6-month price outlook with weather driver |
| GovTech buffer stock module | BudgetEngine + StoragePlanner + PostGIS | ±23% procurement budget variance | AI-powered district procurement planning |
| WebSocket live price feed | FastAPI WS + Redis pub/sub + Agmarknet | 3–7 day stale price data | 60-second price refresh to farmer UI |
| ICAR NPK rule engine | scikit-learn + ICAR data | Generic fertilizer advice | Soil-specific fertilizer prescription |
| Bhashini voice advisory | Bhashini API + Tamil TTS | Rural language barrier | Tamil voice delivery of AI recommendation |
| Bharat-VISTAAR scheme engine | vistaar.py + local rules | 22% scheme non-enrollment | Auto-eligibility + direct apply links |
| PostGIS spatial routing | PostgreSQL + GeoAlchemy2 | No store/warehouse proximity data | Nearest store within 10km, warehouse overflow routing |
| Celery async pipeline | Celery + Redis + periodic tasks | 90s ML pipeline blocks UX | Background processing with live progress |
| Dual-persona architecture | JWT roles + React routing | Farmer apps ignore government | Single platform: farmer advisory + gov intelligence |
| NASA POWER free weather | NASA API + POWER dataset | Paid weather API costs | Free 30-year weather history + 6-month forecast |

---
---

# PART 4: FOLDER STRUCTURE AND TECH STACK — DETAILED

---

## 4.1 Complete Annotated Folder Structure

```
agrofinsense/                          ← Root project directory
│
├── .gitignore                         ← Git ignore: venv, .env, __pycache__, node_modules, *.joblib, *.pt
│
├── docker-compose.yml                 ← Orchestrates: postgres+postgis, mongodb, redis, fastapi
│
├── README.md                          ← This document summary
│
└── backend/                           ← Python FastAPI application root
    │
    ├── main.py                        ← FastAPI application factory, router registration, startup events
    │
    ├── requirements.txt               ← All Python dependencies with pinned versions
    │
    ├── .env.example                   ← Environment variable template with source comments
    │
    ├── tasks.py                       ← Celery task definitions + beat schedule
    │
    ├── test_db_conn.py                ← Database connection test script (run before uvicorn)
    │
    ├── test_ml_models.py              ← ML model smoke test (verifies XGBoost, SARIMAX can load/run)
    │
    ├── db/                            ← Database layer
    │   ├── __init__.py
    │   ├── models.py                  ← SQLAlchemy ORM: all 12 table models + init_db() + get_db()
    │   └── seed_warehouses.py         ← Seeds 10 real FCI/NAFED/TNSWC warehouses + 25 agri stores
    │
    ├── integrations/                  ← External API clients
    │   ├── __init__.py
    │   ├── agmarknet.py               ← Agmarknet data.gov.in API: live prices + Redis pub/sub
    │   ├── agri_news.py               ← Agricultural news aggregation (NewsData.io API)
    │   ├── air_quality.py             ← Air quality index (OpenAQ / CPCB API)
    │   ├── bhashini.py                ← Bhashini Dhruva: Tamil TTS + ASR
    │   ├── energy_potential.py        ← Solar/wind energy potential (NASA POWER derived)
    │   ├── flood_alert.py             ← Flood early warning (open flood alert APIs)
    │   ├── geocoding.py               ← Address to lat/lng (LocationIQ or Nominatim)
    │   ├── nasa_weather.py            ← NASA POWER: weather forecast + historical (no API key)
    │   ├── ndvi_monitor.py            ← NDVI satellite vegetation index (ISRO Bhuvan or Copernicus)
    │   ├── ollama_ai.py               ← LOCAL LLM: gemma3:4b (narrative) + llama3.2:3b (JSON)
    │   └── vistaar.py                 ← Bharat-VISTAAR: scheme eligibility + local fallback rules
    │
    ├── ml/                            ← Machine learning models
    │   ├── __init__.py
    │   ├── yield_model.py             ← XGBoost yield prediction: train + predict + load/save
    │   ├── price_model.py             ← SARIMAX + LSTM ensemble: 12-month price forecast
    │   ├── crop_matcher.py            ← Random Forest + ICAR rules: crop suitability + fertilizer gap
    │   ├── budget_engine.py           ← GovTech: MSP × tonnage = procurement budget + PMFBY payout
    │   ├── storage_planner.py         ← GovTech: PostGIS warehouse capacity + overflow routing
    │   └── postharvest_loss.py        ← ICAR loss rates × weather/storage factors = loss prediction
    │
    ├── ocr/                           ← Document intelligence
    │   ├── __init__.py
    │   └── soil_parser.py             ← EasyOCR + PyMuPDF: PDF → NPK/pH extraction + confidence score
    │
    └── routers/                       ← FastAPI route handlers
        ├── __init__.py
        ├── farmer.py                  ← /farmer/* endpoints: register, soil-upload, recommendation, etc.
        ├── market.py                  ← /market/* endpoints: live price, forecast, all-crops
        ├── govtech.py                 ← /govtech/* endpoints: district-summary, heatmap, warehouse, schemes
        ├── scheme.py                  ← /scheme/* endpoints: check, list
        └── ws.py                      ← WebSocket /ws/prices/{crop}/{district}: Redis sub → WS push
```

```
frontend/                              ← React 18 + Vite + TypeScript SPA
│
├── index.html                         ← HTML shell: root div, fonts, favicon
│
├── vite.config.ts                     ← Vite config: React plugin, proxy /api → localhost:8000
│
├── tailwind.config.js                 ← Tailwind CSS configuration
│
├── postcss.config.js                  ← PostCSS: Tailwind + Autoprefixer
│
├── package.json                       ← All npm dependencies + scripts
│
└── src/                               ← TypeScript source
    │
    ├── main.tsx                       ← React root: QueryClientProvider + BrowserRouter + App
    │
    ├── App.tsx                        ← Route definitions: / (login), /farmer/*, /gov/*
    │
    ├── store.ts                       ← Zustand global state: farmer, officer, token, role, prices
    │
    ├── api.ts                         ← Axios instance + all typed API functions
    │
    ├── index.css                      ← Global CSS: Tailwind directives + custom animations
    │
    ├── pages/                         ← Full-page React components (route targets)
    │   ├── LoginPage.tsx              ← Two-tab login: farmer (phone) | officer (name + district + role)
    │   ├── FarmerDashboard.tsx        ← Farmer home: 4 metric cards + quick actions + voice advisory
    │   ├── PriceGraphPage.tsx         ← 12-month ComposedChart + WS live dot + weather risk panel
    │   ├── SoilUploadPage.tsx         ← PDF drag-drop + OCR progress stepper + recommendation result
    │   ├── StoreMapPage.tsx           ← Leaflet map + coloured store markers + filter buttons
    │   ├── SchemesPage.tsx            ← Scheme cards (green=eligible, grey=ineligible) + apply buttons
    │   ├── GovDashboard.tsx           ← Officer home: 4 stat cards + TamilNaduMap + CropBreakdownChart
    │   ├── DistrictDetailPage.tsx     ← /district/:name: yield band + budget chart + warehouse table + AI
    │   └── SchemeStatsPage.tsx        ← Scheme penetration bar chart + district × scheme matrix + CSV
    │
    └── components/                    ← Reusable React components
        ├── AlertBanner.tsx            ← Coloured alert: error/warning/info + action button
        ├── LivePriceChart.tsx         ← WebSocket-driven rolling price line + pulse animation
        ├── MetricCard.tsx             ← Stat card: label + value + unit + trend arrow
        ├── NewsWidget.tsx             ← Agricultural news ticker from NewsData API
        ├── RiskGauge.tsx              ← SVG semicircle gauge 0–100 with animated needle
        ├── TamilNaduMap.tsx           ← Leaflet choropleth: 10 districts coloured by yield intensity
        ├── VoiceAdvisory.tsx          ← Bhashini TTS audio player + waveform + text transcript
        └── WarehouseTable.tsx         ← Warehouse status table: utilization % + overflow badges
```

---

## 4.2 Backend Tech Stack — Detailed Component Analysis

### 4.2.1 FastAPI (v0.111.0)

FastAPI is the web framework backbone of AgroFinSense.

**Why FastAPI over Flask or Django:**
- Native async/await support — critical for concurrent Agmarknet API calls and WebSocket handling.
- Automatic OpenAPI/Swagger documentation generation (`/docs`) — essential for hackathon judge review.
- Pydantic request/response validation with automatic error messages.
- Dependency injection system (`Depends(get_db)`) for clean database session management.
- WebSocket support built-in — no additional library needed for the live price feed.

**Key configurations in `main.py`:**
```python
app = FastAPI(title="AgroFinSense API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"])
app.include_router(farmer_router, prefix="/farmer")
app.include_router(market_router, prefix="/market")
app.include_router(govtech_router, prefix="/govtech")
app.include_router(scheme_router, prefix="/scheme")
app.include_router(ws_router)  # no prefix, handles /ws/*
```

**Startup event:**
```python
@app.on_event("startup")
async def startup():
    init_db()              # creates all tables if not exist
    await agmarknet.poll_all_districts()  # initial price fetch
    await ollama_ai.health_check()        # verify LLM models
```

---

### 4.2.2 SQLAlchemy + PostgreSQL 16 + PostGIS 3.4

**PostgreSQL 16 with PostGIS:**
Used as the primary relational database for all structured data. PostGIS extends PostgreSQL with geographic types (GEOMETRY, GEOGRAPHY) and spatial functions (ST_DWithin, ST_Distance, ST_MakePoint, ST_SetSRID).

**Docker image:** `postgis/postgis:16-3.4` — pre-built image with PostGIS already installed.

**Key tables and their purposes:**

| Table | Purpose | Key Columns |
|---|---|---|
| `farmers` | User profile + auth | id, phone, district, land_area_ha, role |
| `soil_profiles` | Soil test data from OCR | farmer_id, N/P/K/pH/OC, confidence_score |
| `yield_forecasts` | XGBoost predictions | farmer_id, crop, predicted_kg_per_ha, confidence_low/high |
| `market_prices` | Agmarknet live + historical | crop, district, price, is_live, recorded_at |
| `price_forecasts` | SARIMAX + LSTM output | crop, district, forecast_month, predicted_price, direction |
| `weather_snapshots` | NASA POWER data | district, rainfall_mm, rainfall_deviation_pct, avg_temp_max |
| `recommendations` | Complete farmer recommendation | farmer_id, top_crop, why_narrative, ai_model_used, status |
| `scheme_eligibility` | Scheme check results | farmer_id, scheme_name, eligible, benefit_amount |
| `district_yield_forecasts` | Aggregate district yield | district, crop, total_tonnage_mt, ci_low/high |
| `gov_budget_projections` | GovTech procurement data | district, procurement_cost_inr, pmfby_payout_est_inr |
| `warehouses` | FCI/NAFED/TNSWC locations | name, district, capacity_mt, current_stock_mt, geom |
| `agri_stores` | Input dealer locations | name, district, store_type, geom |
| `district_summaries` | Gov AI briefing cache | district, season, summary_text, ai_model_used |

**SQLAlchemy ORM (`models.py`):**
All tables defined as Python classes inheriting from `declarative_base()`. The `Geometry("POINT", srid=4326)` column type (from GeoAlchemy2) handles PostGIS spatial data within the ORM framework.

**Connection pooling:** SQLAlchemy's default connection pool manages connections automatically. For production, `pool_size=10, max_overflow=20` should be configured.

---

### 4.2.3 MongoDB + Motor (Async)

MongoDB is used specifically for soil PDF storage, not as a general-purpose database.

**Why MongoDB for PDFs:**
- PDFs are binary blobs — relational databases are poorly suited for large binary storage.
- GridFS (MongoDB's file storage layer) provides chunked storage for files >16 MB.
- Async Motor driver integrates cleanly with FastAPI's async request handlers.
- No schema needed for raw OCR results — flexible JSON document model suits variable-format soil cards.

**Usage in the codebase:**
```python
# In farmer.py
from motor.motor_asyncio import AsyncIOMotorClient
client = AsyncIOMotorClient(MONGO_URL)
db = client.agrofinsense
fs = AsyncIOMotorGridFSBucket(db)
file_id = await fs.upload_from_stream(filename, pdf_bytes)
# Return the ObjectId as reference stored in soil_profiles.mongo_doc_id
```

---

### 4.2.4 Redis 7 + redis.asyncio

Redis serves three distinct purposes in AgroFinSense:

**Purpose 1: Price cache (key-value store)**
- Key format: `f"price:{crop}:{district}"`
- TTL: 300 seconds (5 minutes)
- Content: JSON array of price records
- On Agmarknet API failure: serves cached prices to prevent system outage

**Purpose 2: Pub/Sub (message broker)**
- Channel: `f"price:{crop}:{district}"`
- Publisher: `agmarknet.poll_all_districts()` after each API fetch
- Subscriber: WebSocket handler in `ws.py`
- Message: JSON payload with new price data

**Purpose 3: Celery broker + result backend**
- Celery uses Redis as both the message broker (task queue) and result backend (task status storage)
- Configuration: `app = Celery('agrofinsense', broker=REDIS_URL, backend=REDIS_URL)`

---

### 4.2.5 Celery 5.4 + Redis Broker

Celery manages all background processing in AgroFinSense.

**Task 1: `run_full_farmer_pipeline(farmer_id, soil_profile_id)`**
Duration: approximately 45–90 seconds (dominated by LLM call time)
Triggered by: `POST /farmer/soil-upload`
Chain: soil load → NASA weather → XGBoost → LLM JSON → crop match → price forecast → scheme check → LLM narrative → save recommendation

**Task 2: `refresh_market_prices()`**
Duration: approximately 15–30 seconds (concurrent httpx calls to Agmarknet)
Schedule: every 60 seconds via Celery beat
Fetches: 10 crops × 10 districts = 100 API calls (batched with asyncio.gather)

**Task 3: `compute_district_govtech(district, season)`**
Duration: approximately 20–40 seconds
Schedule: every 3,600 seconds (once per hour)
Runs: BudgetEngine + StoragePlanner + PostHarvestLoss + LLM district briefing for all 10 districts

**Celery beat** (periodic task scheduler):
```python
@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(60.0, refresh_market_prices.s(), name='price refresh')
    sender.add_periodic_task(3600.0, compute_all_districts.s(), name='govtech hourly')
```

---

### 4.2.6 XGBoost (v2.0.3)

XGBoost is used for the yield prediction model.

**Model architecture:**
```python
XGBRegressor(
    n_estimators=500,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    min_child_weight=1,
    reg_alpha=0.1,  # L1 regularization
    reg_lambda=1.0, # L2 regularization
    random_state=42
)
```

**Feature importance order (approximate, from training on Tamil Nadu crop data):**
1. `nitrogen_ppm` — strongest yield predictor for non-legume crops
2. `rainfall_deviation_pct` — weather impact on yield
3. `crop_encoded` — crop type is the largest source of variance
4. `irrigation_flag` — irrigated vs. rainfed is a significant predictor
5. `ph_value` — pH affects nutrient availability across all crops
6. `phosphorus_ppm`
7. `ndvi_mean` — satellite vegetation index
8. `district_zone_encoded` — agro-climatic zone captures geographic effects
9. `potassium_ppm`
10. `organic_carbon_pct`
11. `ndvi_std`

**Confidence interval:**
XGBoost does not natively output confidence intervals. AgroFinSense computes pseudo-intervals using:
- `confidence_low = predicted × 0.85` (15% downside)
- `confidence_high = predicted × 1.15` (15% upside)

For a production system, quantile regression in XGBoost (`objective='reg:quantileerror'`) would provide statistically rigorous intervals.

**Model persistence:** `joblib.dump(model, 'yield_model.joblib')` on training, `joblib.load()` on prediction.

---

### 4.2.7 SARIMAX + LSTM (statsmodels + PyTorch)

**SARIMAX (Seasonal AutoRegressive Integrated Moving Average with eXogenous variables):**
- Order: (1,1,1)(1,1,1,12) — autoregressive lag 1, differenced once, moving average 1, seasonal period 12 months
- Exogenous variables (X): `rainfall_deviation_pct`, `avg_temp_max` — the weather variables that drive price volatility beyond seasonal patterns
- Training data: 24 months of Agmarknet historical prices per crop+district combination
- Forecast horizon: 6 months

**Why SARIMAX over simpler ARIMA:**
Agricultural commodity prices have strong seasonal patterns (harvest season supply glut → price drop, lean season → price rise) that ARIMA cannot capture without the seasonal component. SARIMAX also incorporates weather as an exogenous driver, which pure time-series models cannot.

**LSTM (Long Short-Term Memory neural network):**
Architecture:
```python
model = nn.Sequential(
    nn.LSTM(input_size=5, hidden_size=64, num_layers=1, batch_first=True, return_sequences=True),
    nn.LSTM(input_size=64, hidden_size=32, num_layers=1, batch_first=True),
    nn.Linear(32, 1)
)
```
Input features (60-day lookback window): `[price, rainfall_mm, ndvi_mean, month_sin, month_cos]`

The `month_sin` and `month_cos` encoding converts month (1–12) to a continuous circular representation that captures seasonality without the discontinuity at December→January.

**Ensemble weighting:**
`final_forecast = 0.6 × sarimax + 0.4 × lstm`

The 60/40 weighting favors SARIMAX slightly because it has explicit weather exogenous variables and because LSTM requires more data to train reliably. In production with longer training history, the LSTM weight would increase.

---

### 4.2.8 scikit-learn Random Forest (v1.5.0) — Crop Matcher

**Architecture:**
```python
RandomForestClassifier(
    n_estimators=100,
    max_depth=8,
    min_samples_split=5,
    random_state=42,
    class_weight='balanced'  # handles imbalanced crop class distribution
)
```

**The ICAR NPK rule engine vs. Random Forest:**
The crop suitability system uses a two-layer approach:
1. **Rule engine (primary):** Applies ICAR published NPK requirements directly. Deterministic, interpretable, always produces a reasonable result.
2. **Random Forest (secondary):** Trained on district-level yield data to learn which crop performs well in each agro-climatic zone during each season, independent of soil. Captures patterns the rule engine cannot (e.g., market access affects crop profitability differently by district).

Final score: `0.7 × rule_engine_score + 0.3 × rf_score` — rule engine dominates because ICAR data is more reliable than the limited training dataset.

---

### 4.2.9 EasyOCR + PyMuPDF (Soil Parser)

**PyMuPDF (`fitz`):**
Converts PDF pages to high-resolution images for OCR:
```python
doc = fitz.open(stream=pdf_bytes, filetype="pdf")
for page in doc:
    pix = page.get_pixmap(dpi=200)  # 200 DPI for reliable text rendering
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
```

**EasyOCR:**
Multi-language OCR. AgroFinSense uses English-only mode (`Reader(['en'], gpu=False)`) because:
1. Soil Health Card numerical values and field labels are in English even on Tamil-language cards.
2. English-only mode is significantly faster than multi-language mode.
3. GPU=False ensures the system works on CPU-only machines.

**Regex extraction patterns (5 values):**
```python
nitrogen = extract_value(text, [
    r'nitrogen[:\s]+(\d+\.?\d*)',
    r'\bN\b[:\s]+(\d+\.?\d*)',
    r'available N[:\s]+(\d+\.?\d*)',
    r'Avail\.?\s*N[:\s]+(\d+\.?\d*)'
])
# Similar patterns for P, K, pH, OC
```

**Confidence scoring:**
`confidence_score = found_fields / 5.0`
- 5/5 = 1.0 (perfect extraction — use with full confidence)
- 3/5 = 0.6 (partial extraction — warn user, use with caution)
- 1/5 = 0.2 (poor extraction — request re-upload or manual entry)

---

### 4.2.10 GeoAlchemy2 (v0.15.1) — PostGIS ORM

GeoAlchemy2 integrates PostgreSQL's PostGIS spatial types with SQLAlchemy's ORM:

```python
from geoalchemy2 import Geometry

class Warehouse(Base):
    geom = Column(Geometry("POINT", srid=4326))  # WGS84 lat/lng
```

Spatial queries in the ORM:
```python
from geoalchemy2.functions import ST_DWithin, ST_Distance, ST_MakePoint, ST_SetSRID

# Find warehouses within 100km of a district centroid
centroid = ST_SetSRID(ST_MakePoint(lng, lat), 4326)
nearby = db.query(Warehouse).filter(
    ST_DWithin(Warehouse.geom, centroid, 100000)  # 100,000 meters
).order_by(
    ST_Distance(Warehouse.geom, centroid)
).all()
```

---

## 4.3 Frontend Tech Stack — Detailed Component Analysis

### 4.3.1 React 18 + TypeScript + Vite

**React 18:** Used for its concurrent rendering features, including `useTransition` for non-blocking state updates when new WebSocket price data arrives.

**TypeScript:** Full type safety across all components. API response types are defined in `api.ts` and shared across all pages:
```typescript
interface FarmerRecommendation {
  farmer_id: number;
  top_crop: string;
  top_crops_json: TopCrop[];
  why_narrative: string;
  ai_model_used: string;
  status: 'processing' | 'complete' | 'error';
}
```

**Vite:** Build tool configured with a proxy to handle CORS during development:
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': { target: 'http://localhost:8000', changeOrigin: true }
  }
}
```

---

### 4.3.2 Zustand (State Management)

```typescript
// store.ts
interface Store {
  farmer: FarmerProfile | null;
  officer: OfficerProfile | null;
  token: string | null;
  role: 'farmer' | 'officer' | 'fpo' | null;
  selectedCrop: string;
  selectedDistrict: string;
  selectedSeason: 'kharif' | 'rabi' | 'zaid';
  livePrices: Record<string, number>;  // key: "crop:district"
  ollamaStatus: { running: boolean; gemma_available: boolean; llama_available: boolean };
}
```

Zustand is preferred over Redux for this project because:
- No boilerplate (no actions, reducers, dispatch)
- Subscriptions are automatic — components re-render only when their specific slice changes
- Lightweight (8kb) — important for agricultural users on slower mobile connections
- Persists token across page refreshes with `persist` middleware

---

### 4.3.3 TanStack Query (React Query)

All server data fetching uses TanStack Query v5:
```typescript
const { data: recommendation, isLoading } = useQuery({
  queryKey: ['recommendation', farmerId],
  queryFn: () => api.getRecommendation(farmerId),
  refetchInterval: status === 'processing' ? 3000 : false,  // poll every 3s while processing
  staleTime: 30_000,  // 30s stale time for stable data
});
```

Key benefits:
- Automatic cache management — recommendation data is cached for 30 seconds, preventing re-fetches on navigation.
- `refetchInterval` enables the 3-second polling pattern for the soil upload progress stepper.
- `isLoading` and `isError` states simplify loading UI management.
- Background refetch on window focus — farmer returning to the app sees fresh prices without manual refresh.

---

### 4.3.4 Recharts (Data Visualization)

All charts use Recharts (React-based, SVG output):

**PriceGraphPage — ComposedChart:**
```tsx
<ComposedChart data={allMonths}>
  <Area dataKey="forecast_high" fill="#bbf7d0" opacity={0.3} />  // confidence upper
  <Area dataKey="forecast_low" fill="#bbf7d0" opacity={0.3} />   // confidence lower
  <Line dataKey="historical_price" stroke="#3b82f6" strokeWidth={2} dot={false} />
  <Line dataKey="forecast_price" stroke="#22c55e" strokeDasharray="5 5" />
  <ReferenceLine x={currentMonth} stroke="#ef4444" />            // current month marker
  <Tooltip content={<WeatherDriverTooltip />} />
</ComposedChart>
```

**GovDashboard — BarChart:**
```tsx
<BarChart data={cropData}>
  <Bar dataKey="tonnage_mt" fill="#3b82f6" />
  <Bar dataKey="budget_cr" fill="#f59e0b" />
</BarChart>
```

**DistrictDetailPage — Grouped Bar:**
```tsx
<BarChart data={budgetData}>
  <Bar dataKey="procurement_cost_cr" fill="#3b82f6" name="Procurement" />
  <Bar dataKey="pmfby_payout_cr" fill="#f59e0b" name="PMFBY Payout" />
  <Bar dataKey="total_scheme_cr" fill="#10b981" name="Total Spend" />
</BarChart>
```

---

### 4.3.5 Leaflet + react-leaflet (Mapping)

**TamilNaduMap choropleth:**
```tsx
function districtColor(tonnage: number, maxTonnage: number): string {
  const ratio = tonnage / maxTonnage;
  if (ratio > 0.8) return '#22c55e';  // green: high yield
  if (ratio > 0.5) return '#f59e0b';  // amber: medium yield
  return '#ef4444';                    // red: low yield
}

<GeoJSON
  data={tamilNaduGeoJSON}
  style={(feature) => ({
    fillColor: districtColor(districtData[feature.properties.district]?.tonnage, maxTonnage),
    fillOpacity: 0.7,
    weight: 1,
    color: '#ffffff'
  })}
  onEachFeature={(feature, layer) => {
    layer.on('click', () => navigate(`/district/${feature.properties.district}`));
    layer.bindTooltip(feature.properties.district);
  }}
/>
```

---

### 4.3.6 WebSocket Client (Browser WebSocket API)

```typescript
// In FarmerDashboard.tsx and PriceGraphPage.tsx
useEffect(() => {
  const ws = new WebSocket(`ws://localhost:8000/ws/prices/${selectedCrop}/${selectedDistrict}`);
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'update') {
      setStore({ livePrices: { ...livePrices, [`${selectedCrop}:${selectedDistrict}`]: data.prices[0]?.price }});
      // Trigger pulse animation on price card
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }
  };
  
  ws.onclose = () => {
    // Reconnect after 5 seconds
    setTimeout(() => setReconnectTrigger(t => t + 1), 5000);
  };
  
  return () => ws.close();
}, [selectedCrop, selectedDistrict, reconnectTrigger]);
```

---

## 4.4 Infrastructure Tech Stack

### 4.4.1 Docker Compose Architecture

```yaml
# docker-compose.yml structure
services:
  postgres:
    image: postgis/postgis:16-3.4      # PostGIS pre-installed
    environment:
      POSTGRES_DB: agrofinsense
      POSTGRES_USER: agro
      POSTGRES_PASSWORD: agropass
    volumes:
      - postgres_data:/var/lib/postgresql/data   # persistent storage
    ports: ["5432:5432"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U agro -d agrofinsense"]
      interval: 10s

  mongodb:
    image: mongodb:7
    volumes:
      - mongo_data:/data/db
    ports: ["27017:27017"]

  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
    ports: ["6379:6379"]

  fastapi:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://agro:agropass@postgres:5432/agrofinsense
      - MONGO_URL=mongodb://mongodb:27017/agrofinsense
      - REDIS_URL=redis://redis:6379
      - OLLAMA_BASE_URL=http://host.docker.internal:11434
    depends_on:
      postgres: { condition: service_healthy }
      mongodb: { condition: service_started }
      redis: { condition: service_started }
    ports: ["8000:8000"]
```

**Critical Docker note:** Ollama runs on the host machine (not in Docker) because the models are pre-pulled on the host. The FastAPI container reaches Ollama via `host.docker.internal:11434` — Docker's mechanism for containers to reach host services. This is set via `OLLAMA_BASE_URL` environment variable.

---

### 4.4.2 Environment Configuration

**Required keys (system won't work without these):**
```
DATABASE_URL        # PostgreSQL connection string
MONGO_URL           # MongoDB connection string
REDIS_URL           # Redis connection string
OLLAMA_BASE_URL     # Local Ollama server (default: http://localhost:11434)
OLLAMA_NARRATIVE_MODEL  # gemma3:4b
OLLAMA_FAST_MODEL       # llama3.2:3b
JWT_SECRET          # Random 64-char string for JWT signing
```

**Optional keys (features degrade gracefully):**
```
AGMARKNET_KEY       # Without this: falls back to cached prices only
LOCATIONIQ_KEY      # Without this: geocoding unavailable (stores still shown at district centroid)
NEWSDATA_KEY        # Without this: NewsWidget shows "news unavailable"
BHASHINI_KEY        # Without this: VoiceAdvisory shows text-only mode
VISTAAR_KEY         # Without this: scheme eligibility uses local rule engine (still functional)
```

---

## 4.5 Complete Dependencies

### 4.5.1 Python `requirements.txt` — Annotated

```
# Web framework
fastapi==0.111.0           # Async web framework + OpenAPI docs
uvicorn[standard]==0.30.1  # ASGI server with websocket support

# Database
sqlalchemy==2.0.30         # ORM for PostgreSQL
asyncpg==0.29.0            # Async PostgreSQL driver
psycopg2-binary==2.9.9     # Sync PostgreSQL driver (for Celery/scripts)
geoalchemy2==0.15.1        # PostGIS spatial types in SQLAlchemy ORM
motor==3.4.0               # Async MongoDB driver (for PDF storage)

# Cache and messaging
redis==5.0.4               # Redis client (sync + async)
celery==5.4.0              # Async task queue + beat scheduler

# HTTP client
httpx==0.27.0              # Async HTTP client for API calls

# Authentication
python-jose[cryptography]==3.3.0  # JWT generation and verification
passlib[bcrypt]==1.7.4            # Password hashing
python-multipart==0.0.9          # File upload support

# OCR and PDF
easyocr==1.7.1             # Multi-language OCR engine
PyMuPDF==1.24.5            # PDF to image conversion (fitz)
Pillow==10.3.0             # Image processing

# Machine learning
xgboost==2.0.3             # Yield prediction model
scikit-learn==1.5.0        # Random Forest crop matcher + preprocessing
statsmodels==0.14.2        # SARIMAX price forecasting
torch==2.3.1               # LSTM price forecasting
pandas==2.2.2              # Data manipulation
numpy==1.26.4              # Numerical computing
joblib==1.4.2              # Model serialization (save/load XGBoost)
```

### 4.5.2 Frontend `package.json` Dependencies — Annotated

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1",    // SPA routing with protected routes
    "axios": "^1.7.2",                // HTTP client with interceptors
    "zustand": "^4.5.2",              // Lightweight global state
    "@tanstack/react-query": "^5.40.0", // Server state management + polling
    "recharts": "^2.12.7",            // SVG chart library
    "leaflet": "^1.9.4",              // Interactive mapping
    "react-leaflet": "^4.2.1"         // React wrapper for Leaflet
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.4.5",
    "tailwindcss": "^3.4.4",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "@types/react": "^18.3.3",
    "@types/leaflet": "^1.9.12"
  }
}
```

---

## 4.6 Data Flow Architecture

```
[Farmer Phone]
      │
      ▼
[React Frontend :5173]
      │ HTTP / WebSocket
      ▼
[FastAPI :8000]
      │
      ├──[PostgreSQL :5432]  ← Structured data (12 tables + PostGIS)
      │
      ├──[MongoDB :27017]    ← Soil PDF blobs (GridFS)
      │
      ├──[Redis :6379]       ← Price cache + Celery queue + WS pub/sub
      │
      ├──[Celery Worker]     ← Background ML pipeline
      │     │
      │     ├──[XGBoost Model]      ← yield_model.joblib
      │     ├──[SARIMAX/LSTM]       ← price_model.py
      │     ├──[Random Forest]      ← crop_matcher.py
      │     └──[Ollama :11434]      ← gemma3:4b + llama3.2:3b (HOST)
      │
      └──[External APIs]
            ├──[Agmarknet API]      ← Live market prices (60s poll)
            ├──[NASA POWER API]     ← Weather data (free, no key)
            ├──[Bhashini API]       ← Tamil TTS audio
            └──[Bharat-VISTAAR API] ← Scheme eligibility
```

---
---

# PART 5: HOW TO RUN IT — COMPLETE OPERATIONAL GUIDE

---

## 5.1 Prerequisites — Full System Requirements

### 5.1.1 Hardware Requirements

**Minimum (for development/demo):**
- CPU: 4-core processor (Intel i5 8th gen / AMD Ryzen 5 3600 or better)
- RAM: 8 GB minimum. Ollama's gemma3:4b requires approximately 5.5 GB RAM allocated to the model context. Add 2 GB for FastAPI + PostgreSQL + Redis + MongoDB = minimum 8 GB total, with 6 GB+ recommended free RAM.
- Storage: 15 GB free disk space
  - gemma3:4b model: 3.3 GB
  - llama3.2:3b model: 2.0 GB
  - Docker images (postgres/postgis + mongodb + redis): approximately 1.5 GB
  - Python dependencies (pip): approximately 4 GB (PyTorch + EasyOCR are large)
  - Node modules: approximately 0.5 GB
  - Application data: 0.5 GB working space
- Network: Required for Agmarknet API + NASA POWER + Bhashini API calls

**Recommended (for smooth operation):**
- CPU: 8-core processor
- RAM: 16 GB
- Storage: 30 GB
- GPU: Optional but significantly speeds up EasyOCR and LSTM training (CUDA-compatible NVIDIA GPU)

### 5.1.2 Operating System

**Primary supported OS:** Linux (Ubuntu 22.04 LTS recommended, Debian 12 also tested)
**macOS:** Supported (Apple Silicon M1/M2/M3 — Ollama has native ARM support, excellent performance)
**Windows:** Supported via WSL2 (Windows Subsystem for Linux). Native Windows may have issues with PostGIS Docker volumes — WSL2 is strongly recommended.

### 5.1.3 Required Software

Install these before proceeding:

| Software | Version Required | Download Link |
|---|---|---|
| Docker Desktop | 4.x or later | https://docker.com/products/docker-desktop |
| Docker Compose | v2.x (bundled with Docker Desktop) | (included) |
| Python | 3.11.x specifically | https://python.org/downloads |
| Node.js | 20.x LTS | https://nodejs.org |
| npm | 10.x (bundled with Node 20) | (included) |
| Ollama | Latest | https://ollama.ai/download |
| Git | Any recent version | https://git-scm.com |

**Verify installations:**
```bash
docker --version          # Should show: Docker version 25.x.x or later
docker compose version    # Should show: Docker Compose version v2.x.x
python3 --version         # Should show: Python 3.11.x
node --version            # Should show: v20.x.x
npm --version             # Should show: 10.x.x
ollama --version          # Should show: ollama version 0.x.x
git --version             # Any version
```

---

## 5.2 Step 1 — Clone and Navigate

```bash
# Clone the repository
git clone https://github.com/your-org/agrofinsense.git

# Navigate into the project
cd agrofinsense

# Verify the directory structure is correct
ls -la
# Expected output:
# drwxr-xr-x  .git/
# -rw-r--r--  .gitignore
# -rw-r--r--  docker-compose.yml
# -rw-r--r--  README.md
# drwxr-xr-x  backend/
# drwxr-xr-x  frontend/

# Verify the backend structure
ls backend/
# Expected: main.py requirements.txt .env.example tasks.py db/ integrations/ ml/ ocr/ routers/

# Verify the frontend structure
ls frontend/
# Expected: index.html package.json vite.config.ts tailwind.config.js src/
```

---

## 5.3 Step 2 — Configure Environment Variables

```bash
# Navigate to backend directory
cd backend

# Copy the example environment file
cp .env.example .env

# Open the .env file in your editor
nano .env        # Linux/Mac
# OR
code .env        # VS Code
# OR
notepad .env     # Windows (not recommended — use WSL2)
```

**Fill in the following values in `.env`:**

```bash
# ═══════════════════════════════════════════════════════
# REQUIRED — System will not start without these
# ═══════════════════════════════════════════════════════
DATABASE_URL=postgresql://agro:agropass@localhost:5432/agrofinsense
MONGO_URL=mongodb://localhost:27017/agrofinsense
REDIS_URL=redis://localhost:6379
JWT_SECRET=generate-a-random-64-character-string-here-do-not-use-this-one

# Generate JWT_SECRET with:
# python3 -c "import secrets; print(secrets.token_hex(32))"

# ═══════════════════════════════════════════════════════
# OLLAMA — AI models running on your local machine
# ═══════════════════════════════════════════════════════
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_NARRATIVE_MODEL=gemma3:4b
OLLAMA_FAST_MODEL=llama3.2:3b

# ═══════════════════════════════════════════════════════
# RECOMMENDED — Enhanced functionality
# ═══════════════════════════════════════════════════════
AGMARKNET_KEY=          # Get free at: https://data.gov.in/user/register
                        # Steps: Register → My Profile → API Keys → Create Key
                        # Category: Agriculture → Agmarknet
                        # Without this: system uses cached prices only (no live data)

# ═══════════════════════════════════════════════════════
# OPTIONAL — Additional features
# ═══════════════════════════════════════════════════════
LOCATIONIQ_KEY=         # Get at: https://locationiq.com (free tier: 5000 requests/day)
                        # Used for: geocoding store addresses to lat/lng
                        # Without this: stores shown at district centroid approximation

NEWSDATA_KEY=           # Get at: https://newsdata.io (free tier: 200 requests/day)
                        # Used for: NewsWidget agricultural news ticker
                        # Without this: NewsWidget shows "news service unavailable"

BHASHINI_KEY=           # Get at: https://bhashini.gov.in/ulca
                        # Steps: Register with email → API Access → Sandbox key
                        # Used for: Tamil voice advisory audio
                        # Without this: VoiceAdvisory shows text-only mode with message

VISTAAR_KEY=            # Get at: https://bharatvistaar.gov.in (DPI sandbox)
                        # Used for: Bharat-VISTAAR scheme eligibility API
                        # Without this: local rule engine used instead (still functional)

OPENWEATHER_KEY=        # Get at: https://openweathermap.org/api (free tier)
                        # Used for: real-time weather widget
                        # Without this: only NASA POWER forecast shown (still functional)

NASA_POWER_BASE=https://power.larc.nasa.gov/api/temporal/daily/point
# This is the default — no API key needed for NASA POWER
```

**Verify .env is correctly filled:**
```bash
# Check the file is not empty
wc -l .env           # Should show at least 15 lines

# Confirm required variables are set (not empty)
grep "DATABASE_URL=" .env
grep "JWT_SECRET=" .env
grep "OLLAMA_BASE_URL=" .env
```

---

## 5.4 Step 3 — Pull Ollama Models (Critical)

Ollama must be running BEFORE starting the FastAPI server. Both models must be downloaded before use.

```bash
# Start Ollama service in the background
# On Linux/Mac:
ollama serve &

# OR on macOS (if Ollama is installed as an app):
open -a Ollama       # Opens Ollama in the menu bar

# Verify Ollama is running
curl http://localhost:11434/api/tags
# Expected output: {"models":[...]} (may be empty if no models yet)

# Pull gemma3:4b (narrative model) — 3.3 GB download
# This will take 5–20 minutes depending on internet speed
ollama pull gemma3:4b

# Expected output during pull:
# pulling manifest
# pulling 170370233dd5... ████████████████ 100% | 3.3 GB
# verifying sha256 digest
# writing manifest
# success

# Pull llama3.2:3b (fast JSON model) — 2.0 GB download
ollama pull llama3.2:3b

# Expected output:
# pulling manifest
# pulling dde5aa3fc5ff... ████████████████ 100% | 2.0 GB
# verifying sha256 digest
# writing manifest
# success

# Verify both models are available
ollama list
# Expected output:
# NAME               ID              SIZE   MODIFIED
# gemma3:4b          a2af6cc3eb7f    3.3 GB  X days ago
# llama3.2:3b        a80c4f17acd5    2.0 GB  X days ago

# Test both models work
echo "Say hello in one sentence" | ollama run llama3.2:3b
# Expected: a one-sentence greeting (proves model is running)

echo "Say hello in Tamil in one sentence" | ollama run gemma3:4b
# Expected: Tamil greeting (proves Tamil language capability)
```

**If Ollama is not responding:**
```bash
# Check if Ollama process is running
ps aux | grep ollama

# If not running, start it:
ollama serve

# Check Ollama logs if it fails to start:
journalctl -u ollama -f    # Linux systemd
# OR check /var/log/ollama.log
```

---

## 5.5 Step 4 — Start Infrastructure with Docker Compose

```bash
# Navigate to project root (where docker-compose.yml is)
cd /path/to/agrofinsense   # or just: cd ..   if you're in backend/

# Verify docker-compose.yml is present
ls docker-compose.yml

# Pull all required Docker images (first time only — approximately 1.5 GB download)
docker compose pull

# Start all infrastructure services in detached mode (background)
docker compose up -d postgres mongodb redis

# Expected output:
# [+] Running 3/3
#  ✔ Container agrofinsense-postgres-1  Started
#  ✔ Container agrofinsense-mongodb-1   Started
#  ✔ Container agrofinsense-redis-1     Started

# Verify all containers are running
docker compose ps
# Expected output:
# NAME                         IMAGE                     STATUS
# agrofinsense-postgres-1      postgis/postgis:16-3.4    Up (healthy)
# agrofinsense-mongodb-1       mongodb:7                 Up
# agrofinsense-redis-1         redis:7-alpine            Up

# IMPORTANT: Wait for PostgreSQL to be healthy before proceeding
# This takes approximately 10–30 seconds on first run
docker compose logs postgres | tail -5
# Look for: "database system is ready to accept connections"

# Verify PostgreSQL is accepting connections
docker exec -it agrofinsense-postgres-1 psql -U agro -d agrofinsense -c "SELECT version();"
# Expected: PostgreSQL 16.x (Ubuntu 22.04...)

# Verify PostGIS extension is available
docker exec -it agrofinsense-postgres-1 psql -U agro -d agrofinsense -c "SELECT PostGIS_Version();"
# Expected: 3.4 x.x.x...

# Verify Redis is responding
docker exec -it agrofinsense-redis-1 redis-cli ping
# Expected: PONG

# Verify MongoDB is running
docker exec -it agrofinsense-mongodb-1 mongosh --eval "db.adminCommand('ping')"
# Expected: { ok: 1 }
```

---

## 5.6 Step 5 — Set Up Python Virtual Environment

```bash
# Navigate to backend directory
cd backend/

# Create a virtual environment (Python 3.11 required)
python3.11 -m venv venv

# If python3.11 is not found, install it:
# Ubuntu/Debian: sudo apt install python3.11 python3.11-venv python3.11-dev
# macOS: brew install python@3.11

# Activate the virtual environment
# Linux/macOS:
source venv/bin/activate
# Windows WSL2:
source venv/bin/activate
# Windows native (not recommended):
venv\Scripts\activate

# Verify the correct Python version is active
python --version
# Expected: Python 3.11.x

# Upgrade pip to latest version
pip install --upgrade pip
# Expected: Successfully installed pip 24.x.x

# Install all dependencies
# WARNING: This will take 10–25 minutes on first install (PyTorch and EasyOCR are large)
pip install -r requirements.txt

# Expected final lines:
# Successfully installed xgboost-2.0.3 torch-2.3.1 easyocr-1.7.1 ...
# (many packages, no ERROR lines)

# Verify critical packages installed correctly
python -c "import fastapi; print('FastAPI OK:', fastapi.__version__)"
python -c "import xgboost; print('XGBoost OK:', xgboost.__version__)"
python -c "import torch; print('PyTorch OK:', torch.__version__)"
python -c "import easyocr; print('EasyOCR OK')"
python -c "import geoalchemy2; print('GeoAlchemy2 OK')"
# All should print their version without error

# Verify database connection
python test_db_conn.py
# Expected output:
# ✓ PostgreSQL connected (version: 16.x)
# ✓ PostGIS extension available (version: 3.4)
# ✓ MongoDB connected
# ✓ Redis connected and responding (PONG)
# All connections OK.
```

---

## 5.7 Step 6 — Initialize Database and Seed Data

```bash
# Make sure you're still in backend/ with venv activated

# Initialize all database tables (creates them if they don't exist)
python -c "from db.models import init_db; init_db()"

# Expected output:
# Creating tables...
# farmers table: OK
# soil_profiles table: OK
# weather_snapshots table: OK
# market_prices table: OK
# price_forecasts table: OK
# yield_forecasts table: OK
# recommendations table: OK
# scheme_eligibility table: OK
# district_yield_forecasts table: OK
# gov_budget_projections table: OK
# warehouses table: OK
# agri_stores table: OK
# district_summaries table: OK
# All tables created successfully.

# Seed warehouses, agri stores, and demo accounts
python db/seed_warehouses.py

# Expected output:
# Seeded 10 warehouses.
# PostGIS geometry set for all warehouses.
# Seeded 25 agri stores.
# PostGIS geometry set for all stores.
# Seeded demo farmer account: Murugan K (phone: 9876543210, district: Erode)
# Seeded demo officer account: Officer Ravi (phone: 9988776655, district: Thanjavur)

# Verify seeding was successful
python -c "
from db.models import SessionLocal, Warehouse, AgriStore, Farmer
db = SessionLocal()
print(f'Warehouses: {db.query(Warehouse).count()}')   # Should be 10
print(f'Agri Stores: {db.query(AgriStore).count()}')  # Should be 25
print(f'Demo farmers: {db.query(Farmer).count()}')    # Should be 2
db.close()
"

# Train ML models (optional — models auto-train on first prediction if not present)
# But pre-training now saves time during the demo
python ml/yield_model.py
# Expected output:
# Fetching training data...
# Training XGBoost yield model on 2000 samples...
# Model trained. RMSE: xxx.xx kg/ha
# Model saved to yield_model.joblib

python -c "
from ml.crop_matcher import train_crop_model
train_crop_model()
print('Crop matcher model trained and saved.')
"
```

---

## 5.8 Step 7 — Start the FastAPI Backend Server

```bash
# Make sure you're in backend/ with venv activated and all Docker services running

# Start the FastAPI development server
uvicorn main:app --reload --port 8000 --host 0.0.0.0

# Expected startup output:
# INFO:     Will watch for changes in these directories: ['/path/to/backend']
# INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
# INFO:     Started reloader process [xxxxx]
# INFO:     Started server process [xxxxx]
# INFO:     Waiting for application startup.
# INFO:     Application startup complete.
# INFO:     Ollama health check: gemma3:4b=True, llama3.2:3b=True
# INFO:     Polling Agmarknet for initial prices...
# INFO:     Fetched X price records from Agmarknet
# INFO:     Application ready.

# Verify the server is responding
curl http://localhost:8000/health

# Expected response:
# {
#   "status": "ok",
#   "db": "connected",
#   "redis": "connected",
#   "ollama": {
#     "running": true,
#     "gemma3_4b_available": true,
#     "llama3_2_3b_available": true
#   },
#   "timestamp": "2025-06-15T10:30:00.000Z"
# }

# Open Swagger API documentation
# Navigate to: http://localhost:8000/docs
# You should see all endpoints listed with their request/response schemas

# Test a specific endpoint
curl "http://localhost:8000/market/live/Rice/Erode"
# Expected: JSON with current rice price at Erode mandiI or cached price

# Test farmer registration
curl -X POST "http://localhost:8000/farmer/register" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Farmer", "phone": "9999999999", "district": "Erode", "language": "ta", "land_area_ha": 1.5, "role": "farmer"}'
# Expected: {"farmer_id": X, "jwt_token": "eyJ..."}

# Test scheme list endpoint
curl "http://localhost:8000/scheme/list"
# Expected: JSON array with 6 scheme objects
```

---

## 5.9 Step 8 — Start the Celery Worker

Celery must be running for background tasks (ML pipeline, price refresh) to execute. Open a NEW terminal window for this step.

```bash
# Navigate to backend directory in the NEW terminal
cd /path/to/agrofinsense/backend

# Activate the virtual environment
source venv/bin/activate

# Start the Celery worker with beat scheduler
celery -A tasks worker --beat --loglevel=info --concurrency=2

# Expected output:
#  -------------- celery@hostname v5.4.0 (opalescent)
# --- ***** -----
# -- ******* ---- Linux-6.x.x ... 2025-06-15 10:30:05
# - *** --- * ---
# - ** ---------- [config]
# - ** ---------- .> app:         agrofinsense:0x...
# - ** ---------- .> transport:   redis://localhost:6379//
# - ** ---------- .> results:     redis://localhost:6379/
# - *** --- * --- .> concurrency: 2 (prefork)
# -- ******* ---- .> task events: OFF (enable -E to monitor tasks)
# --- ***** -----
#  -------------- [queues]
#                 .> celery           exchange=celery(direct) key=celery
#
# [tasks]
#   . tasks.refresh_market_prices
#   . tasks.run_full_farmer_pipeline
#   . tasks.compute_district_govtech
#   . tasks.compute_all_districts
#
# [2025-06-15 10:30:05,xxx: INFO/MainProcess] Connected to redis://localhost:6379//
# [2025-06-15 10:30:05,xxx: INFO/MainProcess] mingle: searching for neighbors
# [2025-06-15 10:30:06,xxx: INFO/MainProcess] mingle: all alone
# [2025-06-15 10:30:06,xxx: WARNING/MainProcess] /path/venv/lib/.../celery/apps/worker.py:232: ...
# [2025-06-15 10:30:06,xxx: INFO/MainProcess] celery@hostname ready.
# [2025-06-15 10:30:06,xxx: INFO/MainProcess] Scheduler: Sending due task refresh_market_prices (tasks.refresh_market_prices)
# [2025-06-15 10:30:06,xxx: INFO/ForkPoolWorker-1] Task tasks.refresh_market_prices[...] received
# [2025-06-15 10:30:08,xxx: INFO/ForkPoolWorker-1] Agmarknet: Fetched 12 price records for Rice/Erode
# ...

# VERIFY: Every 60 seconds you should see "refresh_market_prices" logs
# This confirms the price polling is working correctly

# In case of Celery worker errors:
# Error: "No module named tasks" → Run from backend/ directory
# Error: "Redis connection refused" → Docker redis not running, check: docker compose ps
# Error: "beat: ERROR" → Add --beat flag, or run beat separately: celery -A tasks beat
```

---

## 5.10 Step 9 — Start the React Frontend

Open ANOTHER new terminal window for this step.

```bash
# Navigate to the frontend directory
cd /path/to/agrofinsense/frontend

# Install Node.js dependencies (first time only — approximately 500 MB)
npm install

# Expected output ends with:
# added xxx packages, and audited xxx packages in xs
# xxx packages are looking for funding
# found 0 vulnerabilities  ← (or minor ones, not critical)

# Start the Vite development server
npm run dev

# Expected output:
#
#   VITE v5.x.x  ready in xxx ms
#
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: http://192.168.x.x:5173/
#   ➜  press h + enter to show help
#

# Verify the frontend loads
# Open a browser and navigate to: http://localhost:5173
# You should see the AgroFinSense login page with two tabs

# If you see a blank page or errors:
# Check browser console (F12) for JavaScript errors
# Verify the backend is running at http://localhost:8000
# Verify the proxy in vite.config.ts points to http://localhost:8000
```

---

## 5.11 Step 10 — Full System Verification

With all 4 processes running (Docker services, FastAPI, Celery, Frontend), verify the complete system:

```bash
# Verify all services in one check
echo "=== Service Status Check ==="
echo ""

echo "Docker services:"
docker compose ps --format "table {{.Name}}\t{{.Status}}"

echo ""
echo "FastAPI health:"
curl -s http://localhost:8000/health | python3 -m json.tool

echo ""
echo "Ollama models:"
curl -s http://localhost:11434/api/tags | python3 -c "
import json, sys
data = json.load(sys.stdin)
for m in data.get('models', []):
    print(f'  Model: {m[\"name\"]}, Size: {m[\"size\"]/1e9:.1f} GB')
"

echo ""
echo "WebSocket test (will show 1 price update then exit):"
python3 -c "
import asyncio, websockets, json

async def test_ws():
    try:
        async with websockets.connect('ws://localhost:8000/ws/prices/Rice/Erode') as ws:
            msg = await asyncio.wait_for(ws.recv(), timeout=5)
            data = json.loads(msg)
            print(f'  WebSocket OK: Received price update for Rice/Erode')
    except Exception as e:
        print(f'  WebSocket error: {e}')

asyncio.run(test_ws())
"
```

---

## 5.12 Demo Walkthrough — Complete 4-Minute Sequence

### 5.12.1 Farmer Demo Sequence

**Login as farmer:**
1. Open http://localhost:5173
2. Click "Farmer Login" tab
3. Enter phone: `9876543210`
4. Select language: Tamil
5. Click "Login / Register"
6. You are redirected to the Farmer Dashboard

**Dashboard inspection:**
- Top left card: Risk Score (circular gauge, should show a number 0–100)
- Top center card: Live Price — shows real-time Rice price at Erode (or latest cached price)
- Top right card: Top Crop — should show "Groundnut" or "Maize" for Erode district
- Bottom right card: Active Schemes — shows count of schemes Murugan K qualifies for

**Soil PDF upload:**
1. Click "Upload Soil Card" button or navigate to the Soil Upload page
2. Click the upload zone or drag any PDF onto it (use any soil report PDF for demo)
3. Observe the 5-step progress stepper advancing:
   - Step 1: "Uploading PDF..." → completes in 2–3 seconds
   - Step 2: "Reading soil card (OCR)..." → completes in 10–20 seconds (EasyOCR)
   - Step 3: "Running yield model (XGBoost)..." → completes in 5–10 seconds
   - Step 4: "Matching best crops..." → completes in 3–5 seconds
   - Step 5: "Generating Tamil advisory (gemma3:4b)..." → completes in 10–20 seconds (LLM)
4. Result appears showing: extracted N/P/K values, predicted yield, top 3 crops with scores
5. The AI advisory text (in Tamil if language was set to Tamil) appears below

**Price graph:**
1. Click "Price Chart" from the dashboard
2. Select crop: "Groundnut"
3. Observe the 12-month chart:
   - Blue solid line: past 6 months of real Agmarknet prices
   - Red pulsing dot: current live price
   - Green or yellow dashed line: 6-month forecast
4. Hover over any future forecast point: tooltip shows weather_driver text
5. Watch the red dot — if Celery is running, it should update within 60 seconds

**Store map:**
1. Navigate to "Find Stores"
2. Leaflet map loads centred on Erode district
3. Green markers = fertilizer shops, Blue = seeds, Orange = tractor
4. Click any marker → popup shows store name, phone number, distance
5. Use filter buttons to show only "Fertilizer" stores

**Schemes:**
1. Navigate to "My Schemes"
2. Green cards show eligible schemes with benefit amounts
3. Click "Apply Now" on any green card → opens apply URL
4. Grey cards show ineligible schemes with reason ("land > 2ha for PM-KISAN")

**Voice advisory:**
1. On the Farmer Dashboard, find the "Play Advisory" button
2. Click it → if Bhashini key is configured: Tamil audio plays
3. If Bhashini not configured: text transcript shown with "Voice service not configured" message

---

### 5.12.2 Government Officer Demo Sequence

**Login as officer:**
1. Click "Government Officer Login" tab
2. Enter name: `Officer Ravi`
3. Select district: Thanjavur
4. Select role: District Officer
5. Enter phone: `9988776655`
6. Click "Login"
7. Redirected to Government Dashboard

**Government dashboard overview:**
- Top stat card 1: Total Forecast Tonnage (should show ~320,000 MT Rice for Thanjavur Kharif)
- Top stat card 2: Procurement Budget Required (should show ~₹736 Crore)
- Top stat card 3: Warehouse Utilisation (should show ~70% for TNSWC Thanjavur)
- Top stat card 4: PMFBY Eligible Farmers (count from scheme_eligibility for Thanjavur)

**Tamil Nadu choropleth map:**
- Thanjavur district should appear GREEN (high yield intensity)
- Other districts coloured by their yield forecast relative to maximum
- Click Erode district → navigates to Erode district detail page

**District detail — Thanjavur:**
1. Click Thanjavur on the map OR navigate to `/district/Thanjavur`
2. Section 1: Yield confidence band chart — shows ci_low (blue area), predicted (line), ci_high (blue area)
3. Switch crop tabs: Rice → Maize → shows different yield forecasts
4. Section 2: Budget projection bar chart
   - Blue bar: Procurement Cost (₹ crore)
   - Yellow bar: PMFBY Payout Estimate (₹ crore)
   - Green bar: Total Scheme Spend (₹ crore)
5. Section 3: Warehouse table
   - TNSWC Thanjavur: 55,000 MT capacity, 38,500 MT current stock, 70% utilisation → GREEN badge
   - Look for overflow AlertBanner if any warehouse is >90% full
6. Section 4: AI district briefing from gemma3:4b
   - Shows a 2-paragraph official briefing with specific numbers
   - Badge: "Generated by gemma3:4b (local)"

---

## 5.13 Troubleshooting — Common Issues and Solutions

### Issue 1: Ollama not responding

```bash
# Symptom: GET /health shows "ollama": {"running": false}

# Solution 1: Start Ollama
ollama serve

# Solution 2: Check if port 11434 is blocked
lsof -i :11434
# If another process is using 11434, kill it or change Ollama port

# Solution 3: If running in Docker, check host.docker.internal
# Inside Docker, OLLAMA_BASE_URL must be:
OLLAMA_BASE_URL=http://host.docker.internal:11434
# NOT localhost (localhost inside container ≠ host machine localhost)

# Solution 4: Test Ollama directly
curl http://localhost:11434/api/generate \
  -d '{"model":"llama3.2:3b","prompt":"hi","stream":false}'
# Expected: {"response":"Hello!..."}
```

### Issue 2: PostgreSQL/PostGIS connection fails

```bash
# Symptom: python test_db_conn.py shows connection error

# Solution 1: Verify Docker container is healthy
docker compose ps postgres
# Must show: Up (healthy) — NOT "Up" or "Up (starting)"

# Solution 2: Wait for PostgreSQL to finish initializing
docker compose logs postgres | tail -20
# Look for: "database system is ready to accept connections"

# Solution 3: Check if port 5432 is accessible from host
docker exec -it agrofinsense-postgres-1 psql -U agro -d agrofinsense -c "\dt"
# Expected: list of tables (or empty set if before init_db)

# Solution 4: Verify DATABASE_URL in .env
grep DATABASE_URL .env
# Must be: postgresql://agro:agropass@localhost:5432/agrofinsense
# NOT: @postgres:5432 (that's only for inside Docker)

# Solution 5: Reset the PostgreSQL container
docker compose down postgres
docker volume rm agrofinsense_postgres_data  # WARNING: destroys all data
docker compose up -d postgres
```

### Issue 3: EasyOCR fails or is very slow

```bash
# Symptom: soil_parser.py takes >60 seconds or crashes

# Cause: EasyOCR downloads language model on first use (~100 MB)
# Solution: Pre-download the model
python -c "import easyocr; reader = easyocr.Reader(['en'], gpu=False)"
# Wait for download to complete, then retry

# Cause: GPU not available warning
# This is fine — gpu=False means CPU mode (slower but functional)
# 200 DPI single-page PDF OCR takes approximately 15–30 seconds on CPU

# Cause: PDF file is password-protected
# Solution: The soil card PDF must not be password-protected
# Test with: python -c "import fitz; doc = fitz.open('your.pdf'); print(doc.page_count)"
# If this fails: the PDF has DRM/encryption
```

### Issue 4: LLM response is not valid JSON (llama3.2:3b)

```bash
# Symptom: predict_yield_with_reasoning returns safe defaults frequently

# Cause: llama3.2:3b sometimes adds explanation text before/after JSON
# The retry logic in ollama_ai.py handles this, but if it still fails:

# Debug: test the model directly
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2:3b",
    "prompt": "Return ONLY this JSON, no other text: {\"test\": 123}",
    "stream": false,
    "options": {"temperature": 0.0}
  }'
# Expected: response should contain exactly {"test": 123}
# If it adds text: the model is adding preamble — increase temperature:0.0 enforcement in ollama_ai.py

# Workaround: switch fast tasks to gemma3:4b (larger model has better JSON compliance)
# In .env: OLLAMA_FAST_MODEL=gemma3:4b
# (slower but more reliable JSON output)
```

### Issue 5: Agmarknet API returns empty results

```bash
# Symptom: GET /market/live/Rice/Erode returns empty prices or is_live: false

# Cause 1: AGMARKNET_KEY not set or invalid
# Verify: grep AGMARKNET_KEY backend/.env (should have a value)
# Get key: https://data.gov.in → My Profile → API Keys

# Cause 2: API daily limit exceeded (free tier: 500 requests/day)
# Solution: Set the Celery price refresh interval to every 5 minutes instead of 60 seconds
# In tasks.py: change 60.0 to 300.0

# Cause 3: District or crop spelling doesn't match Agmarknet database
# Agmarknet uses specific spellings:
# "Erode" ✓  "erode" ✗ (case-sensitive)
# "Rice" ✓   "Paddy" also works
# "Groundnut" ✓  "Peanut" ✗

# Debug: test the API directly
curl "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070\
?api-key=YOUR_KEY&format=json&limit=5&filters[State]=Tamil+Nadu\
&filters[Commodity]=Rice&filters[District]=Erode"
# Expected: JSON with records array
```

### Issue 6: WebSocket connection fails in browser

```bash
# Symptom: PriceGraphPage shows no live updates, browser console shows WebSocket error

# Cause 1: Browser blocks ws:// (non-secure WebSocket) in some contexts
# Solution: This is only an issue in production HTTPS deployments
# For localhost development, ws:// should work in all browsers

# Cause 2: FastAPI ws.py not imported in main.py
# Verify: grep "ws_router" backend/main.py
# Should show: app.include_router(ws_router)

# Cause 3: Redis pub/sub not working
# Test: In Python, manually publish to a Redis channel
python -c "
import redis
r = redis.Redis()
r.publish('price:Rice:Erode', '{\"test\":true}')
print('Published to Redis channel')
"
# Then check browser console for received message

# Debug WebSocket manually:
# In browser console:
const ws = new WebSocket('ws://localhost:8000/ws/prices/Rice/Erode');
ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Message:', JSON.parse(e.data));
ws.onerror = (e) => console.error('Error:', e);
```

### Issue 7: Frontend shows blank page or TypeScript errors

```bash
# Symptom: http://localhost:5173 shows nothing or errors

# Cause 1: npm install not completed
cd frontend && npm install
# Watch for any ERROR lines in output

# Cause 2: TypeScript compilation error
npm run build
# This will show exact TypeScript errors with file and line numbers

# Cause 3: CORS error from backend
# Check browser console for CORS errors
# Verify in backend/main.py:
# app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"])

# Cause 4: Vite dev server port conflict
# Another service is using port 5173
npm run dev -- --port 5174
# Change the port and update the CORS allowed origins in backend
```

---

## 5.14 Production Deployment Notes

For production deployment beyond the hackathon demo:

### 5.14.1 Environment Changes

```bash
# Replace development SQLite/in-memory with production-grade connection pooling
DATABASE_URL=postgresql://agro:password@db-host:5432/agrofinsense?pool_size=10&max_overflow=20

# Use production Redis with password
REDIS_URL=redis://:your-redis-password@redis-host:6379/0

# Generate a new, truly random JWT secret
JWT_SECRET=$(python3 -c "import secrets; print(secrets.token_hex(64))")
```

### 5.14.2 Running for Production

```bash
# Replace --reload with multiple workers
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 --no-access-log

# Build optimized frontend bundle
cd frontend && npm run build
# Static files are in frontend/dist/ — serve with Nginx

# Run Celery with more workers for production load
celery -A tasks worker --beat --concurrency=4 --loglevel=warning
```

### 5.14.3 Ollama in Production

For production serving multiple users, Ollama should be run as a system service:

```bash
# Create systemd service (Linux)
sudo nano /etc/systemd/system/ollama.service

# Contents:
[Unit]
Description=Ollama LLM Service
After=network.target

[Service]
ExecStart=/usr/local/bin/ollama serve
Restart=always
User=ollama
Environment=OLLAMA_HOST=0.0.0.0:11434

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl enable ollama
sudo systemctl start ollama
```

---

## 5.15 API Quick Reference for Developers

### Core Endpoints Summary

```
GET  /health                                    → System health + Ollama status
POST /farmer/register                           → Register/login, returns JWT
POST /farmer/soil-upload                        → PDF → OCR → trigger pipeline
GET  /farmer/recommendation/{id}                → Full recommendation (poll until status=complete)
GET  /farmer/price-history/{crop}/{district}    → 12-month price series
GET  /farmer/schemes/{id}                       → Scheme eligibility list
GET  /farmer/voice/{id}                         → Tamil TTS audio (MP3 bytes)
GET  /farmer/stores/{district}                  → Nearest agri stores (PostGIS)

GET  /market/live/{crop}/{district}             → Current price (Redis/Agmarknet)
GET  /market/forecast/{crop}/{district}         → 12-month SARIMAX+LSTM forecast
GET  /market/all-crops/{district}               → Snapshot of all 10 crops

GET  /govtech/district-summary/{d}/{s}          → Full district AI briefing
GET  /govtech/heatmap/{state}/{season}          → All districts for choropleth
GET  /govtech/warehouse-status/{district}       → Warehouse utilisation + overflow
GET  /govtech/scheme-stats/{district}           → Scheme penetration analytics

POST /scheme/check/{farmer_id}                  → Run eligibility check
GET  /scheme/list                               → All 6 supported schemes

WS   /ws/prices/{crop}/{district}               → Real-time price stream
```

### Authentication

```bash
# Register and get token
TOKEN=$(curl -s -X POST http://localhost:8000/farmer/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","name":"Test","district":"Erode","land_area_ha":2.0,"role":"farmer"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['jwt_token'])")

# Use token for authenticated endpoints
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/farmer/recommendation/1
```

---

## 5.16 Performance Benchmarks and Expected Response Times

| Operation | Expected Time | Notes |
|---|---|---|
| `GET /health` | <100ms | Always fast |
| `GET /market/live/Rice/Erode` | 50–200ms | Redis cache hit: <50ms; Agmarknet API: 500–2000ms |
| `POST /farmer/register` | 100–200ms | DB write + JWT generation |
| `POST /farmer/soil-upload` | 5–20s | OCR on PDF (synchronous portion) |
| Full Celery pipeline | 45–90s | XGBoost: 5s; LLM narrative: 15–20s; rest: 10–15s |
| `GET /farmer/recommendation/{id}` | <100ms | Reads from DB (pipeline must have completed) |
| LLM narrative (gemma3:4b, CPU) | 10–20s | Per recommendation; GPU reduces to 2–5s |
| LLM JSON (llama3.2:3b, CPU) | 3–8s | Per yield reasoning; GPU reduces to 1–2s |
| `GET /govtech/district-summary` | 200–500ms | Reads from DB; fresh compute: 15–40s |
| `GET /farmer/stores/{district}` | 50–150ms | PostGIS ST_DWithin query |
| `GET /farmer/schemes/{id}` | 100–300ms | Local rule engine |
| WebSocket price update | <2s from Agmarknet publish | Redis pub/sub latency |

---

## 5.17 Summary: Complete Startup Checklist

```
□ Step 1: git clone agrofinsense && cd agrofinsense
□ Step 2: cp backend/.env.example backend/.env && fill in values
□ Step 3: ollama serve && ollama pull gemma3:4b && ollama pull llama3.2:3b
□ Step 4: docker compose up -d postgres mongodb redis
          → wait for: "database system is ready to accept connections"
□ Step 5: cd backend && python3.11 -m venv venv && source venv/bin/activate
          → pip install -r requirements.txt
□ Step 6: python -c "from db.models import init_db; init_db()"
          → python db/seed_warehouses.py
□ Step 7: uvicorn main:app --reload --port 8000   [Terminal 1]
          → verify: curl http://localhost:8000/health
□ Step 8: celery -A tasks worker --beat --loglevel=info --concurrency=2   [Terminal 2]
          → verify: see "celery ready" message + first price refresh
□ Step 9: cd ../frontend && npm install && npm run dev   [Terminal 3]
          → verify: open http://localhost:5173 — see login page
□ Step 10: Demo farmer login: 9876543210, Erode, Tamil
           Demo officer login: 9988776655, Thanjavur, Officer
```

---

*Document prepared for AgroFinSense v1.0 — Tamil Nadu Agricultural Intelligence Platform*
*Combining XGBoost, SARIMAX+LSTM, gemma3:4b, llama3.2:3b, PostGIS, Agmarknet, and NASA POWER for India's farmers.*

---

**End of Document**
