import { addCompetitorToSheet } from "./sheets";

export default async function handler(req, res) {
  const data = req.body;
  if (data.catch_automation || !data.competitorName || !data.competitorDivision ||
      data.competitorName.search(/(www\.|http\:|https\:)/) != -1 ||
      data.competitorDivision.search(/(www\.|http\:|https\:)/) != -1) {
    throw('Potential bot');
  }
  await addCompetitorToSheet(
    data.competitorName,
    data.competitorDivision,
    data.date,
    data.league,
    data.gym);
  console.log(302, data.registrationLink);
  res.redirect(302, data.registrationLink);
}
