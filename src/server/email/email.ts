import * as nodemailer from "nodemailer";
import Config from "../config";
import {Email} from "./templates/definitions";
import {renderToString} from "react-dom/server";
import * as HtmlToText from "html-to-text";

let transport = nodemailer.createTransport({
    host: Config.SMTP_HOST,
    port: Config.SMTP_PORT,
    auth : {
        user: Config.SMTP_LOGIN,
        pass: Config.SMTP_PASS,
    }
})

export function sendMail(email:string, content:Email) {

    let html = renderToString(content.html);
    let text = HtmlToText.fromString(html);

    return transport.sendMail({
        from: Config.SMTP_FROM,
        to : email,
        subject: content.subject,
        html,
        text,
    })
}
