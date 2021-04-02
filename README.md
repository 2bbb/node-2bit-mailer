# @2bit/mailer

thin wapper of nodemailer

## How to use

```typescript
import Mailer from '@2bit/mailer';

const mailer = new Mailer({
    user: "you@example.com",
    pass: "SMTP_PASSWORD",
});

mailer.send("TITLE", "THIS\nIS\nBODY", {
    category: "topic", // added alias address like you+topic@example.com
    cc: ["cc@example.com", "other@example.com"],
    bcc: ["bcc@example.com"],
    attachments: [
        {
            path: "/path/to/file",
            name: "filename"
        }
    ]
});

```