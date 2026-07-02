export default function SettingsPage() {
  return (
    <article className="settings-options">
      {/* <ThemeModeComponent /> */}

      <div className="">
        <div className="m-3">
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Extra tools</strong>
            </div>
            <div className="toast-body">
              <ul>
                <li>option</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card bug-card mx-2">
          <div className="card-body">
            <h5 className="card-title">Report a Bug or Suggest an Improvement</h5>

            <p className="card-text">
              Found a bug or have a suggestion to make our app even better? Feel free to send an email to:
            </p>

            <a href="mailto:app.development759@gmail.com" className="card-link">
              app.development759@gmail.com
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
