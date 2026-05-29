/** Split column labels onto two lines so headers align with chart layout */
export function headerLines(label: string): string[] {
  const known: Record<string, [string, string]> = {
    County: ["County", ""],
    District: ["District", ""],
    "Party Affiliation": ["Party", "Affiliation"],
    "2026 Active Voter Registration": ["2026 Active", "Registration"],
    "2026 Active Voter Reg": ["2026 Active", "Voter Reg"],
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
  };

  const pair = known[label];
  if (pair) {
    return pair[1] ? [pair[0], pair[1]] : [pair[0]];
  }

  return [label];
}

export function isNumericHeader(header: string, colIndex: number): boolean {
  if (colIndex === 0) return false;
  return /%|registration|vote|turnout|early|mail/i.test(header);
}
