export default [
    {
        name: 'json',
        async execute(message:any,args:any,client:any) {
            if(!args[0]){
                return message.reply("You need to supply a link")
            }
         try {
            client.fetch(args[0]).then(response => response.json()).then((json:any) => {
                message.reply("```json\n" + JSON.stringify(json) + '```')
                            })
         } catch (err) {
             message.reply("Error: " + err.message)
         }
            
        }
    }
]