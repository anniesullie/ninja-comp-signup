import Head from "next/head";
import styles from "../styles/Home.module.css";

import { getCompetitionListFromSheets } from "./api/sheets";

export default function Home({ data }) {
  let title = `${process.env.NEXT_PUBLIC_GYM_NAME} away competition sign up`;
  let qualifierLinks = {
    'UNAA': 'https://ninjamasterapp.com/app/leagues/UNAA/seasons/9/qualified_athletes/200',
    'FINA': 'https://fina.ninja/standings-season-v/',
    'WNL': 'https://worldninjaleague.org/tier-1-standings/'
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>{title}</h1>
        {process.env.NEXT_PUBLIC_LINK_URL && (
          <h2 className={styles.description}><a href={process.env.NEXT_PUBLIC_LINK_URL}
                 target="_blank"
                 rel="noreferrer">More information about competitions</a></h2>
        )}
        <div>
        <ul className={styles.grid}>
          {data && data.length  ? (
            data.map((item) => (
              <li key={item} className={styles.card}>
                <span>
                  <h2>
                    {item.date}: {item.league} {item.type != 'open' && item.type} at <a
                      href={`https://www.google.com/maps/search/?api=1&query=${item.gym}, ${item.city}`}
                      target="_blank"
                      rel="noreferrer">{item.gym} in {item.city}</a>
                  </h2>
                  {item.link ? (
                  <span>
                    {item.type != 'open' && (
                      <p>This is a <strong>{item.type}</strong> competition; athletes
                      need to qualify during the regular season to compete. You
                      can check if your child is qualified <a href={qualifierLinks[item.league]}
                         target="_blank"
                         rel="noreferrer">in the {item.league} standings</a>.
                      {item.league != 'UNAA' && (
                        <span>Click on your child&apos; age group. A <strong>Q</strong>
                        will appear next to their name in the standings if they are qualified.</span> 
                      )}</p>
                    )}
                    <p>
                    Please enter your child&apos;s name so we can be sure to have a
                    coach present, and then continue on to register for the
                    competition at the gym&apos;s site.
                    <a className={styles.note}
                       href={item.link}
                       target="_blank"
                       rel="noreferrer">Learn more before registering.</a>
                    </p>
                    <form method="post" action="/api/submit">
                      <input type="text"
                            name="competitorName"
                            placeholder="Your Child's Name"
                            maxLength={70}
                            required></input>
                      {item.league == 'WNL' ? (
                        <select name="competitorDivision" required>
                          <option value="">Age Group</option>
                          <option value="Kids">Kids (8 or younger as of January 1, 2024)</option>
                          <option value="Mature Kids">Mature Kids (10 or younger as of January 1, 2024)</option>
                          <option value="Preteen">Preteen (12 or younger as of January 1, 2024)</option>
                          <option value="Teen">Teen (14 or younger as of January 1, 2024)</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <select name="competitorDivision" required>
                          <option value="">Age Group</option>
                          <option value="7U">7U (7 or younger as of January 1, 2024)</option>
                          <option value="9U">9U (9 or younger as of January 1, 2024)</option>
                          <option value="11U">11U (11 or younger as of January 1, 2024)</option>
                          <option value="13U">13U (13 or younger as of January 1, 2024)</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                      <input type="submit" value="Go to registration site"></input>
                      <input type="hidden" value={item.link} name="registrationLink"></input>
                      <input type="hidden" value={item.date} name="date"></input>
                      <input type="hidden" value={item.league} name="league"></input>
                      <input type="hidden" value={item.gym} name="gym"></input>
                      <input type="text" name="catch_automation" id="catch_automation" defaultValue="" className="honeypot"></input>
                    </form>
                  </span>
                  ) : (
                    <p>Sign up not yet open.</p>
                  )}
                </span>
              </li>
            ))
          ) : (
            <li>Error: do not forget to setup your env variables</li>
          )}
        </ul>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const sheet = await getCompetitionListFromSheets();
  return {
    props: {
      data: sheet.slice(0, sheet.length), // remove sheet header
    },
    revalidate: 1, // In seconds
  };
}
