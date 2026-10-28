/**
 * Script to fetch Rwanda's district-sector data from Open Admin Data API
 * Run with: node scripts/fetch-rwanda-districts.js
 */

const RWANDA_DISTRICTS = [
  // Kigali City
  'gasabo',
  'kicukiro',
  'nyarugenge',
  
  // Eastern Province
  'bugesera',
  'gatsibo',
  'kayonza',
  'kirehe',
  'ngoma',
  'nyagatare',
  'rwamagana',
  
  // Northern Province
  'burera',
  'gakenke',
  'gicumbi',
  'musanze',
  'rulindo',
  
  // Southern Province
  'gisagara',
  'huye',
  'kamonyi',
  'muhanga',
  'nyamagabe',
  'nyanza',
  'nyaruguru',
  'ruhango',
  
  // Western Province
  'karongi',
  'ngororero',
  'nyabihu',
  'nyamasheke',
  'rubavu',
  'rusizi',
  'rutsiro',
];

async function fetchDistrictData() {
  const districtSectors = {};
  
  for (const district of RWANDA_DISTRICTS) {
    try {
      const response = await fetch(`https://openadmindata.org/api/v1/rw/district/${district}.json`);
      const data = await response.json();
      
      if (data.children && data.children.entities) {
        const sectors = data.children.entities.map((entity) => entity.name_en);
        districtSectors[data.entity.name_en] = sectors.sort();
        console.log(`✓ ${data.entity.name_en}: ${sectors.length} sectors`);
      }
    } catch (error) {
      console.error(`✗ Error fetching ${district}:`, error.message);
    }
  }
  
  console.log('\nTotal districts:', Object.keys(districtSectors).length);
  console.log('Total sectors:', Object.values(districtSectors).reduce((sum, sectors) => sum + sectors.length, 0));
  
  // Generate TypeScript file
  const tsContent = `/**
 * Rwanda Administrative Divisions
 * Source: Open Admin Data (https://openadmindata.org/rw)
 * License: CC BY 4.0
 * Last Updated: ${new Date().toISOString().split('T')[0]}
 * 
 * Data Structure:
 * - 5 Provinces
 * - 30 Districts
 * 416 Sectors
 */

export interface DistrictSectorData {
  [district: string]: string[];
}

export const RWANDA_DISTRICTS = ${JSON.stringify(RWANDA_DISTRICTS.map(d => d.charAt(0).toUpperCase() + d.slice(1)), null, 2)};

export const RWANDA_DISTRICT_SECTORS: DistrictSectorData = ${JSON.stringify(districtSectors, null, 2)};

/**
 * Get sectors for a specific district
 * @param district - The district name (case-insensitive)
 * @returns Array of sector names, or empty array if district not found
 */
export function getSectorsByDistrict(district: string): string[] {
  if (!district) return [];
  
  const normalizedDistrict = Object.keys(RWANDA_DISTRICT_SECTORS).find(
    (d) => d.toLowerCase() === district.toLowerCase()
  );
  
  return normalizedDistrict ? RWANDA_DISTRICT_SECTORS[normalizedDistrict] : [];
}

/**
 * Check if a sector belongs to a district
 * @param district - The district name (case-insensitive)
 * @param sector - The sector name (case-insensitive)
 * @returns true if sector belongs to district
 */
export function isSectorInDistrict(district: string, sector: string): boolean {
  const sectors = getSectorsByDistrict(district);
  return sectors.some((s) => s.toLowerCase() === sector.toLowerCase());
}
`;

  console.log('\nWriting to frontend/src/data/rwandaAdministrativeDivisions.ts...');
  // Write file would go here
  console.log(tsContent);
}

fetchDistrictData().catch(console.error);
