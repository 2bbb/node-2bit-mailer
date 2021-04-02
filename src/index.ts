import nodemailer = require('nodemailer');
import Mail = require('nodemailer/lib/mailer');

export type MailAddress = `${string}@${string}.${string}`;
// export type MailAddress = string;

export type Setting = {
    user: MailAddress;
    pass: string;
    smtp?: string;
    port?: number;
};

export type Options = {
    category?: string;
    from_name?: string
    to?: MailAddress | MailAddress[];
    cc?: MailAddress | MailAddress[];
    bcc?: MailAddress | MailAddress[];
    attachments?: Mail.AttachmentLike[];
};

export default class Mailer {
    private transporter: Mail;

    address: MailAddress;
    constructor(setting: Setting) {
        this.address = setting.user;
        this.transporter = nodemailer.createTransport({
            host: setting.smtp || 'smtp.gmail.com',
            port: setting.port || 465,
            secure: true, // SSL
            auth: {
                user: this.address,
                pass: setting.pass,
            },
        });
    }
    
    async send(subject: string, text: string, options: Options = {}): Promise<any> {
        const address = this.address;
        const from_to_with_category = options.category
            ? address.replace("@", `+${options.category}@`)
            : address;
        const from_to = options.from_name
            ? `"${options.from_name}" ${from_to_with_category}`
            : from_to_with_category;

        const to = options.to ? [] : [from_to];
        const cc = [];
        const bcc = options.to ? [from_to] : [];

        if(options.to) {
            if(typeof options.to == 'string') {
                to.push(options.to);
            } else {
                to.push(... options.to);
            }
        }

        if(options.cc) {
            if(typeof options.cc == 'string') {
                cc.push(options.cc);
            } else {
                cc.push(... options.cc);
            }
        }

        if(options.bcc) {
            if(typeof options.bcc == 'string') {
                bcc.push(options.bcc);
            } else {
                bcc.push(... options.bcc);
            }
        }

        const message = {
            from: from_to,
            to: to.join(","),
            cc: cc.join(","),
            bcc: bcc.join(","),
            subject: subject,
            text: text,
            attachments: options.attachments
        };
        
        return await this.transporter.sendMail(message);
    }
    
    static create(setting: Setting): Mailer {
        return new Mailer(setting);
    }
};
