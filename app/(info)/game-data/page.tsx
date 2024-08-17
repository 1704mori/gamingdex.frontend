"use client";

export default function DataCreditPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Data and Credits</h2>
      <p className="mb-4">
        We would like to acknowledge and thank the following API for providing
        much of the data used in this application:
      </p>
      <div className="bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">IGDB API</h3>
        <p className="mb-2">
          The Internet Game Database (IGDB) provides a vast amount of
          information about video games, including details about games,
          characters, companies, and more.
        </p>
        <p className="mb-4">
          Visit their website:{" "}
          <a
            href="https://www.igdb.com"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.igdb.com
          </a>
        </p>
        <p>
          API Documentation:{" "}
          <a
            href="https://api-docs.igdb.com"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://api-docs.igdb.com
          </a>
        </p>
      </div>
      <p className="mt-6">
        We are grateful for the comprehensive and up-to-date information
        provided by IGDB, which has been instrumental in creating a rich and
        informative experience for our users.
      </p>
    </div>
  );
}
