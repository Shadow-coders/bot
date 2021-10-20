import { GuildMember, Shadow, MessageAttachment } from "../../client";
import { Captcha } from 'captcha-canvas'
export default [{
    type: 'event',
    name: 'guildMemberAdd',
    async execute(member: GuildMember, client:Shadow): Promise<any> {
        const data = await client.db.get("verify_" + member.guild.id)
        if(!(data)) return;
        if(!data.memberRole) return;
        const captcha = new Captcha(); //create a captcha canvas of 100x300.
        captcha.async = true //Sync
        captcha.addDecoy(); //Add decoy text on captcha canvas.
        captcha.drawTrace(); //draw trace lines on captcha canvas.
        captcha.drawCaptcha(); //draw captcha text on captcha canvas
        const files:Array<MessageAttachment> = [new MessageAttachment(await captcha.png, "captcha.png")]
  const msg = await member.send({
        content: `Hi Do this captcha you have 3 tries and 15 seconds to do it`, 
        files,
    })
    const end = async (reason:any):Promise<any> => {
        
await member.send("You have falid to be verified \n so you have been kicked from " + member.guild.name + `\n\n also for reason of ${reason.message}\n`);
member.kick("Falid to verify")
return false;
    }
    let count = 0
    const filter = async (message:any) => {
if(message.author.id !== member.id) return false;
if(count > 3) return false;
if(message.content === captcha.text) return true;
message.reply("Wrong Awnser! " + count)
count++
if(count > 3) return await end({ message: 'To many tries'})
return false;
    }
    
  try { 
    const collector = await msg.channel.awaitMessages({ filter, max: 1, time: 15 * 1000, errors: ["Time up"]})
    if(collector.size === 0) return end({ message: "Timed Out"})
    if(collector) {
        member.roles.add(data.memberRole)
        msg.reply("You have been verified")
    }
  } catch (e) {
      end(e)
  }
    }
}]