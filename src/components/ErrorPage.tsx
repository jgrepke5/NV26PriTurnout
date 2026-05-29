import { Masthead } from "./Masthead";

export function ErrorPage({ message }: { message: string }) {
  return (
    <>
      <Masthead />
      <main className="container">
        <div className="error-box">
          <h2>Unable to load turnout data</h2>
          <p>{message}</p>
          <p>
            Confirm the Google Sheet is shared as{" "}
            <strong>Anyone with the link can view</strong>, then try again.
          </p>
        </div>
      </main>
    </>
  );
}
