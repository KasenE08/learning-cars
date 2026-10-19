// History reports & red flags
export default {
  steps: [
    { tag: 'metaphor', title: 'Résumé vs background check',
      body: [
        'The seller hands you a **résumé**: the story they want you to hear. A history report is a **background check**.',
        'But a background check only finds what was **reported**. A crash paid in cash never shows up. Use both, then trust your inspection.',
      ] },
    { tag: 'how', title: 'Title brands: the permanent record',
      body: [
        'A [[title-brand]] is a label a state stamps on the title. It’s meant to follow the vehicle forever.',
        '[[salvage-title|Salvage]]: declared a total loss, usually by an insurer. [[rebuilt-title|Rebuilt]] (or reconstructed): a salvage vehicle repaired and passed a state inspection. Road-legal, but repair quality varies a lot.',
        '**Flood**: water damage. [[flood-damage]] corrodes wiring and modules and can cause electrical faults months later. **Junk**: parts or scrap only. Many states also brand **lemon-law buybacks**.',
        'Brands differ by state, so crooks re-title cars in looser states: [[title-washing]]. That’s one reason [[nmvtis|NMVTIS]] exists.',
      ] },
    { tag: 'how', title: 'Odometer rollback',
      body: [
        '[[odometer-rollback|Rollback]] is still common: NHTSA estimates **450,000+** vehicles a year are sold with false mileage, costing buyers over **$1 billion**. Digital clusters can be altered too.',
        'Clues: worn pedals, steering wheel or driver’s seat on a “low-mile” car; service or inspection records whose mileage goes **backward**; gaps in the report.',
        'Federal rule: since 2021, mileage must be disclosed when ownership changes for model year **2011 and newer** vehicles, until they’re **20 years old**.',
        'Title notes like “not actual mileage” or “exceeds mechanical limits” mean the number can’t be trusted.',
      ] },
    { tag: 'how', title: 'Recalls: free fixes by VIN',
      body: [
        'A [[safety-recall]] is a maker’s fix for a safety defect, done **free at a dealer**, even if you’re the third owner.',
        'NHTSA’s lookup by VIN shows **open** (unrepaired) safety recalls from the past **15 calendar years**, for major carmakers and motorcycle makers.',
        'It doesn’t list completed recalls or small makers’ campaigns, so a clean result isn’t a full history.',
      ] },
    { tag: 'bronco', title: 'Your Bronco’s recalls',
      body: [
        '2021–24 Bronco Sports had recall **24V-267** (computer software to detect a failing 12 V battery) and **25V-019** (battery replacement for batteries from one supplier).',
        'Put your own VIN into NHTSA’s lookup to see whether yours is still open. It takes a minute and costs nothing.',
      ],
      facts: ['bronco.batteryRecall'] },
    { tag: 'see', title: 'Red-flag checklist', visualFirst: true,
      visual: { type: 'checklist', title: 'Red flags',
        groups: [
          { name: 'Paperwork', items: [
            { check: 'Title in the seller’s name, VIN matches the car', why: 'Otherwise: possible theft, a lien, or a curbstoner.' },
            { check: 'Title brand (salvage, rebuilt, flood, lemon)', why: 'Changes value, insurance and resale. Not always a dealbreaker, but price it in.' },
            { check: 'NMVTIS or history report run on the VIN', why: 'Catches brands, total losses and mileage records from other states.' },
          ] },
          { name: 'The story', items: [
            { check: 'Price far below market', why: 'There’s usually a reason, and it isn’t generosity.' },
            { check: 'Pressure: “cash only, today, no inspection”', why: 'Classic scam pressure. Slow down.' },
            { check: '“Selling it for a friend / relative”', why: 'A common curbstoning line; you can’t verify the car’s history.' },
          ] },
          { name: 'The car', items: [
            { check: 'Musty smell, silt or rust under carpets and seats', why: 'Signs of flood damage, even with a clean title.' },
            { check: 'Wear doesn’t match the mileage', why: 'Possible odometer rollback.' },
            { check: 'Open safety recalls', why: 'Free to fix, but you want to know before you drive it.' },
          ] },
        ] },
      body: [
        'A [[vehicle-history-report]] (Carfax, AutoCheck) adds service and accident records, but only reported ones. “Clean” isn’t proof.',
        '[[curbstoning|Curbstoners]] are unlicensed dealers posing as private sellers, often to unload damaged cars.',
      ] },
    { tag: 'key', title: 'Know what “as is” means',
      body: [
        'US dealers must post an **FTC Buyers Guide** in the window. “[[as-is|As is]]” = no dealer warranty: problems after the sale are yours.',
        'Most private sales are as-is by default. Your protection is the inspection you do **before** paying.',
        'Order of trust: the car itself (PPI) > official records (title, NMVTIS, recalls) > paid history report > the seller’s story.',
      ] },
  ],
  quiz: [
    { type: 'mc', q: 'Salvage vs rebuilt title?', options: ['Same thing', 'Salvage = total loss; rebuilt = repaired and passed state inspection', 'Rebuilt = new engine', 'Salvage = parts car only, rebuilt = stolen-recovered'], answer: 1,
      why: 'Salvage is the total-loss brand. After repair and inspection it becomes rebuilt (names vary by state). Both stay on the record.' },
    { type: 'order', q: 'Order the life of a salvage car.', items: ['Major crash or flood', 'Insurer declares a total loss', 'Salvage title issued', 'Car is repaired', 'Passes state inspection', 'Rebuilt title issued'],
      why: 'Total loss → salvage brand → repair → inspection → rebuilt brand. Skipping states to drop the brand is title washing.' },
    { type: 'mc', q: 'The history report is clean. What next?', options: ['Buy it; it’s proven clean', 'Still get a pre-purchase inspection: reports only know what was reported', 'Ask the seller to swear', 'Skip the test drive'], answer: 1,
      why: 'Cash repairs, unreported crashes and flood cars with washed titles can all look clean. The inspection checks the actual car.' },
  ],
  cards: [
    { id: 'brands', front: 'Common title brands?', back: 'Salvage, rebuilt/reconstructed, flood, junk, lemon buyback. Rules vary by state.' },
    { id: 'wash', front: 'Title washing?', back: 'Re-titling a branded car in a looser state to get a clean title. NMVTIS helps catch it.' },
    { id: 'rollback', front: 'Odometer rollback scale (NHTSA)?', back: '450,000+ vehicles a year, $1 billion+ cost to buyers. Digital clusters too.' },
    { id: 'recall', front: 'NHTSA recall lookup shows?', back: 'Open safety recalls by VIN, past 15 years, major car and bike makers. Repairs are free.' },
    { id: 'asis', front: '“As is” on the FTC Buyers Guide?', back: 'No dealer warranty: problems after the sale are the buyer’s.' },
  ],
};
