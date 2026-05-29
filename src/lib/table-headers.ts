/** Column header text split across up to three lines for narrow columns */
export function headerLines(label: string): string[] {
  const known: Record<string, string[]> = {
    County: ["County"],
    District: ["District"],
    "Party Affiliation": ["Party", "Affiliation"],
    "2026 VR": ["2026", "VR"],
    "Early Voted": ["Early", "Voted"],
    "Mail Voted": ["Mail", "Voted"],
    "Total Votes": ["Total", "Votes"],
    "Votes to Date": ["Votes to", "Date"],
    "% Early Votes": ["% Early", "Votes"],
    "% Mail Votes": ["% Mail", "Votes"],
    "Turnout %": ["Turnout", "%"],
    "2026 Turnout %": ["2026", "Turnout %"],
    "2014 Turnout %": ["2014", "Turnout %"],
    "2022 Turnout %": ["2022", "Turnout %"],
    "% to 2014 Turnout": ["% to 2014", "Turnout"],
    "% to 2022 Turnout": ["% to 2022", "Turnout"],
    "National Average Turnout": ["National Average", "Turnout"],
    "NV Turnout % to Date": ["NV Turnout % to Date"],
    "% to Natl Avg": ["% to Natl", "Avg"],
  };

  const lines = known[label];
  if (lines) return lines;

  return [label];
}

export function isNumericHeader(header: string, colIndex: number): boolean {
  if (colIndex === 0) return false;
  return /%|registration|vote|turnout|early|mail/i.test(header);
}
