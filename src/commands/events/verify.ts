import { GuildMember, Shadow, MessageAttachment } from "../../client";
import { Captcha } from 'captcha-canvas'
export default [{
    type: 'event',
    name: 'guildMemberAdd',
    async execute(member: GuildMember, client:Shadow): Promise<any> {
        const captcha = new Captcha(); //create a captcha canvas of 100x300.
        captcha.async = true //Sync
        captcha.addDecoy(); //Add decoy text on captcha canvas.
        captcha.drawTrace(); //draw trace lines on captcha canvas.
        captcha.drawCaptcha(); //draw captcha text on captcha canvas
        const attachments:Array<MessageAttachment> = [new MessageAttachment(await captcha.png, "captcha.png")]
    member.send({
        content: `Hi Do this captcha also code for right now is ${captcha.text}`, 
        attachments: attachments,
    })
    }
}]