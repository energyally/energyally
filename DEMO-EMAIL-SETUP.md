# Activate requester confirmation emails

The website continues posting to the existing Apps Script URL. No endpoint change is needed.

1. Open the Google Apps Script project used for the Leads spreadsheet.
2. Replace its code with `google-apps-script-leads.gs` from this repository and save.
3. Select **Deploy → Manage deployments → Edit** on the existing web app.
4. Select **New version**, then **Deploy**. Keep the existing execution identity and access settings. Authorise mail access if Google prompts.
5. Submit a demo request using your own email address and confirm the Leads row, internal notification and requester confirmation arrive.

GitHub publication alone does not update the Google-hosted script. The confirmation is sent by the authorised Google account, with the sender display name EnergyAlly and replies directed to sales@energyally.in. It does not impersonate a custom-domain From address.

The email includes HTML and plain-text versions. Names and sector values are HTML escaped. If the requester email fails, the saved lead and internal notification remain intact; check Apps Script executions for the logged failure.
